import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Download, Eye, Settings, Code, Palette, Save, Check, Trash2, Edit, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Widget {
  id: string;
  user_id: string;
  agent_id: string;
  title: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  position: string;
  button_text: string;
  welcome_message: string;
  offline_message: string;
  public_key: string;
  created_at: string;
  profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

const AdminWidgets = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'generator'>('list');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Widget Generator State
  const [config, setConfig] = useState({
    agentId: '',
    agentVersion: '',
    title: 'Voice Assistant',
    logoUrl: '',
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    widgetType: 'floating',
    position: 'bottom-right',
    customDomain: typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com',
    buttonText: 'Start a conversation',
    welcomeMessage: 'Hi there, How can we help?',
    offlineMessage: 'We\'re currently offline. Please leave a message!'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isWidgetSaved, setIsWidgetSaved] = useState(false);
  const [testCode, setTestCode] = useState('');
  const [showTestPreview, setShowTestPreview] = useState(false);

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      
      // Fetch widgets
      const { data: widgets, error: widgetsError } = await supabase
        .from('widgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (widgetsError) {
        console.error('Error fetching widgets:', widgetsError);
        toast({
          title: "Error",
          description: "Failed to fetch widgets",
          variant: "destructive",
        });
        return;
      }

      // Fetch profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine widgets with profiles
      const widgetsWithProfiles = widgets?.map(widget => ({
        ...widget,
        profiles: profiles?.find(profile => profile.id === widget.user_id) || null
      })) || [];

      setWidgets(widgetsWithProfiles);
    } catch (error) {
      console.error('Error fetching widgets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch widgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyWidgetCode = (widget: Widget) => {
    const embedCode = `<!-- AI Voice Widget -->
<script
  id="bolo-voice-widget"
  src="${config.customDomain}/widget.js"
  data-agent-id="${widget.agent_id}"
  data-title="${widget.title}"
  ${widget.logo_url ? `data-logo-url="${widget.logo_url}"` : ''}
  data-primary-color="${widget.primary_color}"
  data-secondary-color="${widget.secondary_color}"
  data-position="${widget.position}"
  data-button-text="${widget.button_text}"
  data-welcome-message="${widget.welcome_message}"
  data-offline-message="${widget.offline_message}"
></script>`;

    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Widget copied!",
        description: "Widget embed code copied to clipboard.",
        variant: "default"
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please copy manually.",
        variant: "destructive"
      });
    });
  };

  const copyWidgetConfig = (widget: Widget) => {
    const config = JSON.stringify(widget, null, 2);
    navigator.clipboard.writeText(config).then(() => {
      toast({
        title: "Config copied!",
        description: "Widget configuration copied to clipboard.",
        variant: "default"
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please copy manually.",
        variant: "destructive"
      });
    });
  };

  const deleteWidget = async (widgetId: string) => {
    if (!confirm('Are you sure you want to delete this widget?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', widgetId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Widget deleted successfully.",
        variant: "default"
      });

      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast({
        title: "Error",
        description: "Failed to delete widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadWidgetConfig = (widget: Widget) => {
    const configJson = JSON.stringify(widget, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `widget-${widget.title.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Config downloaded!",
      description: "Widget configuration has been downloaded.",
      variant: "default"
    });
  };

  // Widget Generator Functions
  const generateEmbedCode = () => {
    const widgetUrl = `${config.customDomain}/widget.js`;
    return `<!-- AI Voice Widget -->
<script
  id="bolo-voice-widget"
  src="${widgetUrl}"
  data-agent-id="${config.agentId}"
  data-title="${config.title}"
  ${config.logoUrl ? `data-logo-url="${config.logoUrl}"` : ''}
  data-primary-color="${config.primaryColor}"
  data-secondary-color="${config.secondaryColor}"
  data-position="${config.position}"
  data-button-text="${config.buttonText}"
  data-welcome-message="${config.welcomeMessage}"
  data-offline-message="${config.offlineMessage}"
></script>`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: `${type} code has been copied to your clipboard.`,
        variant: "default"
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please copy manually.",
        variant: "destructive"
      });
    });
  };

  const handleDownloadConfig = () => {
    const configJson = JSON.stringify(config, null, 2);
    downloadFile(configJson, 'widget-config.json');
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded!",
      description: `${filename} has been downloaded.`,
      variant: "default"
    });
  };

  const saveWidget = async () => {
    if (!config.agentId.trim()) {
      toast({
        title: "Error",
        description: "Agent ID is required to save the widget",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save widgets",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('widgets')
        .insert({
          user_id: user.id,
          agent_id: config.agentId,
          title: config.title,
          logo_url: config.logoUrl || null,
          primary_color: config.primaryColor,
          secondary_color: config.secondaryColor,
          position: config.position,
          button_text: config.buttonText,
          welcome_message: config.welcomeMessage,
          offline_message: config.offlineMessage,
          public_key: crypto.randomUUID(),
        });

      if (error) throw error;

      setIsWidgetSaved(true);
      toast({
        title: "Success!",
        description: "Widget saved successfully. You can view it in the widgets list.",
        variant: "default"
      });

      // Refresh widgets list
      fetchWidgets();
    } catch (error) {
      console.error('Error saving widget:', error);
      toast({
        title: "Error",
        description: "Failed to save widget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWidget = () => {
    if (!testCode.trim()) {
      toast({
        title: "Error",
        description: "Please paste the embed code to test",
        variant: "destructive",
      });
      return;
    }
    setShowTestPreview(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading widgets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Widget Management</h1>
            <p className="text-muted-foreground">
              Manage voice widgets and generate new ones
            </p>
          </div>
          <Button onClick={() => navigate('/admin')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'generator')}>
          <TabsList>
            <TabsTrigger value="list">Widget List</TabsTrigger>
            <TabsTrigger value="generator">Widget Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Widgets</CardTitle>
                <CardDescription>
                  View and manage all voice widgets created by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {widgets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No widgets found. Create one using the Widget Generator tab.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Agent ID</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {widgets.map((widget) => (
                        <TableRow key={widget.id}>
                          <TableCell className="font-medium">{widget.title}</TableCell>
                          <TableCell>{widget.profiles?.email || 'Unknown'}</TableCell>
                          <TableCell className="font-mono text-sm">{widget.agent_id}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{widget.position}</Badge>
                          </TableCell>
                          <TableCell>{new Date(widget.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyWidgetCode(widget)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadWidgetConfig(widget)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedWidget(widget)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteWidget(widget.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Widget Details Modal */}
            {selectedWidget && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Widget Details: {selectedWidget.title}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedWidget(null)}
                    >
                      Close
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Agent ID</Label>
                      <Input value={selectedWidget.agent_id} readOnly />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input value={selectedWidget.position} readOnly />
                    </div>
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 rounded border" 
                          style={{ backgroundColor: selectedWidget.primary_color }}
                        />
                        <Input value={selectedWidget.primary_color} readOnly />
                      </div>
                    </div>
                    <div>
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 rounded border" 
                          style={{ backgroundColor: selectedWidget.secondary_color }}
                        />
                        <Input value={selectedWidget.secondary_color} readOnly />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Button Text</Label>
                    <Input value={selectedWidget.button_text} readOnly />
                  </div>
                  <div>
                    <Label>Welcome Message</Label>
                    <Textarea value={selectedWidget.welcome_message} readOnly rows={3} />
                  </div>
                  <div>
                    <Label>Offline Message</Label>
                    <Textarea value={selectedWidget.offline_message} readOnly rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => copyWidgetCode(selectedWidget)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Embed Code
                    </Button>
                    <Button variant="outline" onClick={() => copyWidgetConfig(selectedWidget)}>
                      <Code className="w-4 h-4 mr-2" />
                      Copy Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Widget Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your AI voice widget settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="styling">Styling</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="agentId">Agent ID</Label>
                          <Input 
                            id="agentId" 
                            placeholder="agent_xxxxxxxxxxxxxxxxxxx" 
                            value={config.agentId} 
                            onChange={e => setConfig({
                              ...config,
                              agentId: e.target.value
                            })} 
                          />
                          <p className="text-sm text-muted-foreground">
                            Your Retell AI agent ID (API key is configured securely on the server)
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="agentVersion">Agent Version (Optional)</Label>
                          <Input 
                            id="agentVersion" 
                            placeholder="Leave empty for latest" 
                            value={config.agentVersion} 
                            onChange={e => setConfig({
                              ...config,
                              agentVersion: e.target.value
                            })} 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title">Widget Title</Label>
                          <Input 
                            id="title" 
                            value={config.title} 
                            onChange={e => setConfig({
                              ...config,
                              title: e.target.value
                            })} 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="logoFile">Logo Upload</Label>
                          <Input 
                            id="logoFile" 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setLogoFile(file);
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const result = e.target?.result;
                                  if (typeof result === 'string') {
                                    setConfig({
                                      ...config,
                                      logoUrl: result
                                    });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                          <p className="text-sm text-muted-foreground">
                            Upload your brand logo (PNG, JPG, SVG)
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="logoUrl">Or Logo URL</Label>
                          <Input 
                            id="logoUrl" 
                            placeholder="https://your-domain.com/logo.png" 
                            value={config.logoUrl} 
                            onChange={e => setConfig({
                              ...config,
                              logoUrl: e.target.value
                            })} 
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="styling" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="widgetType">Widget Type</Label>
                          <Select value={config.widgetType} onValueChange={value => setConfig({
                            ...config,
                            widgetType: value
                          })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="floating">Floating Button</SelectItem>
                              <SelectItem value="inline">Inline Chat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {config.widgetType === 'floating' && (
                          <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Select value={config.position} onValueChange={value => setConfig({
                              ...config,
                              position: value
                            })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="top-right">Top Right</SelectItem>
                                <SelectItem value="top-left">Top Left</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex gap-2">
                              <Input 
                                id="primaryColor" 
                                type="color" 
                                value={config.primaryColor} 
                                onChange={e => setConfig({
                                  ...config,
                                  primaryColor: e.target.value
                                })} 
                                className="w-16 h-10 p-1" 
                              />
                              <Input 
                                value={config.primaryColor} 
                                onChange={e => setConfig({
                                  ...config,
                                  primaryColor: e.target.value
                                })} 
                                className="flex-1" 
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="secondaryColor">Secondary Color</Label>
                            <div className="flex gap-2">
                              <Input 
                                id="secondaryColor" 
                                type="color" 
                                value={config.secondaryColor} 
                                onChange={e => setConfig({
                                  ...config,
                                  secondaryColor: e.target.value
                                })} 
                                className="w-16 h-10 p-1" 
                              />
                              <Input 
                                value={config.secondaryColor} 
                                onChange={e => setConfig({
                                  ...config,
                                  secondaryColor: e.target.value
                                })} 
                                className="flex-1" 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buttonText">Button Text</Label>
                          <Input 
                            id="buttonText" 
                            value={config.buttonText} 
                            onChange={e => setConfig({
                              ...config,
                              buttonText: e.target.value
                            })} 
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="customDomain">Your Domain</Label>
                          <Input 
                            id="customDomain" 
                            value={config.customDomain} 
                            onChange={e => setConfig({
                              ...config,
                              customDomain: e.target.value
                            })} 
                            placeholder="https://your-domain.com" 
                          />
                          <p className="text-sm text-muted-foreground">
                            The widget will be served from this domain (white-label)
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="welcomeMessage">Welcome Message</Label>
                          <Textarea 
                            id="welcomeMessage" 
                            value={config.welcomeMessage} 
                            onChange={e => setConfig({
                              ...config,
                              welcomeMessage: e.target.value
                            })} 
                            rows={3} 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="offlineMessage">Offline Message</Label>
                          <Textarea 
                            id="offlineMessage" 
                            value={config.offlineMessage} 
                            onChange={e => setConfig({
                              ...config,
                              offlineMessage: e.target.value
                            })} 
                            rows={3} 
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Code Generation Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Generated Code
                    </CardTitle>
                    <CardDescription>
                      Copy and paste this code into your customer's website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>HTML Embed Code</Label>
                        <div className="relative">
                          <Textarea 
                            value={generateEmbedCode()} 
                            readOnly 
                            rows={10} 
                            className="font-mono text-sm" 
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="absolute top-2 right-2" 
                            onClick={() => copyToClipboard(generateEmbedCode(), "Embed")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          onClick={saveWidget}
                          disabled={isSaving || !config.agentId.trim()}
                          className="flex items-center gap-2"
                        >
                          {isSaving ? (
                            <>Loading...</>
                          ) : isWidgetSaved ? (
                            <>
                              <Check className="w-4 h-4" />
                              Saved!
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Widget
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={handleDownloadConfig}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Config
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => copyToClipboard(generateEmbedCode(), "Embed")} 
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Embed Code
                        </Button>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Widget is hosted directly from your domain</li>
                          <li>Copy the embed code and provide it to your customers</li>
                          <li>Customers paste the code on their website</li>
                          <li>Widget appears with your branding and Bolo's design</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Widget Testing Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Test Widget Code
                    </CardTitle>
                    <CardDescription>
                      Paste any widget embed code here to test if it's working
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="testCode">Paste Embed Code</Label>
                        <Textarea 
                          id="testCode"
                          value={testCode}
                          onChange={(e) => setTestCode(e.target.value)}
                          placeholder="Paste your widget embed code here..."
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleTestWidget} className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Test Widget
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setTestCode('');
                            setShowTestPreview(false);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                      
                      {showTestPreview && testCode && (
                        <div className="border rounded-lg p-4 bg-muted">
                          <h4 className="font-semibold mb-2">Test Preview:</h4>
                          <div className="border rounded-lg p-8 bg-background min-h-[200px] relative">
                            <div className="text-center text-muted-foreground mb-4">
                              Testing Widget Code...
                            </div>
                            <div 
                              dangerouslySetInnerHTML={{ __html: testCode }}
                              className="w-full"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            If the widget doesn't appear, check the console for errors or verify the embed code format.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Widget Preview
                    </CardTitle>
                    <CardDescription>
                      See how your widget will look
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-8 bg-gray-50 min-h-[200px] relative">
                      <div className="text-center text-muted-foreground mb-8">
                        Website Content Area
                      </div>
                      
                      {config.widgetType === 'floating' ? (
                        <div 
                          className="absolute w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg cursor-pointer transition-transform hover:scale-110" 
                          style={{
                            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
                            [config.position.includes('bottom') ? 'bottom' : 'top']: '20px',
                            [config.position.includes('right') ? 'right' : 'left']: '20px'
                          }}
                        >
                          🎤
                        </div>
                      ) : (
                        <div className="max-w-sm mx-auto border rounded-lg overflow-hidden bg-white">
                          <div 
                            className="p-4 text-white font-semibold" 
                            style={{
                              background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
                            }}
                          >
                            {config.title}
                          </div>
                          <div className="p-6 text-center">
                            <div className="text-4xl mb-4">🎤</div>
                            <div 
                              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl mb-4 cursor-pointer" 
                              style={{
                                background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
                              }}
                            >
                              🎙️
                            </div>
                            <p className="text-sm text-gray-600">{config.welcomeMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminWidgets;