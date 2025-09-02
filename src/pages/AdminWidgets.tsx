import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Eye, Settings, Code, Palette, Save, Check } from "lucide-react";

const WidgetGenerator = () => {
  const [config, setConfig] = useState({
    agentId: '',
    agentVersion: '',
    title: 'Voice Assistant',
    logoUrl: '',
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    widgetType: 'floating',
    position: 'bottom-right',
    customDomain: 'https://your-domain.com',
    buttonText: 'Start a conversation',
    welcomeMessage: 'Hi there, How can we help?',
    offlineMessage: 'We\'re currently offline. Please leave a message!'
  });

  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isWidgetSaved, setIsWidgetSaved] = useState(false);
  const [testCode, setTestCode] = useState('');
  const [showTestPreview, setShowTestPreview] = useState(false);

  // Mock toast function since we don't have useToast
  const toast = ({ title, description, variant }) => {
    alert(`${title}: ${description}`);
  };

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

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: `${type} code has been copied to your clipboard.`
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please copy manually."
      });
    });
  };

  const handleDownloadConfig = () => {
    const configJson = JSON.stringify(config, null, 2);
    downloadFile(configJson, 'widget-config.json');
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], {
      type: 'text/plain'
    });
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
      description: `${filename} has been downloaded.`
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
      // Simulate saving - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsWidgetSaved(true);
      toast({
        title: "Success!",
        description: "Widget saved successfully. You can view it in the Admin Widgets section.",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Widget Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create embeddable AI voice widgets for your customers. White-label solution that serves from your domain.
          </p>
        </div>

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
                      <p className="text-sm text-gray-500">
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
                              setConfig({
                                ...config,
                                logoUrl: e.target?.result
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                      <p className="text-sm text-gray-500">
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
                      <p className="text-sm text-gray-500">
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

                  <div className="p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
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
                    <div className="border rounded-lg p-4 bg-gray-100">
                      <h4 className="font-semibold mb-2">Test Preview:</h4>
                      <div className="border rounded-lg p-8 bg-white min-h-[200px] relative">
                        <div className="text-center text-gray-500 mb-4">
                          Testing Widget Code...
                        </div>
                        <div 
                          dangerouslySetInnerHTML={{ __html: testCode }}
                          className="w-full"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
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
                  <div className="text-center text-gray-500 mb-8">
                    Website Content Area
                  </div>
                  
                  {config.widgetType === 'floating' ? (
                    <div 
                      className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg cursor-pointer transition-transform hover:scale-110`} 
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
      </div>
    </div>
  );
};

export default WidgetGenerator;