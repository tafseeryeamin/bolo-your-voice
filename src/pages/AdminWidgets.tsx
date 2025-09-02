import React, { useState, useEffect } from 'react';
import { Copy, Check, Eye, Trash2, Edit, ExternalLink, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Widget {
  id: string;
  user_id: string;
  agent_id: string;
  public_key: string;
  title: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  position: string;
  button_text: string;
  welcome_message: string;
  offline_message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminWidgets = () => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [testCode, setTestCode] = useState('');
  const [showTestPreview, setShowTestPreview] = useState(false);

  const fetchWidgets = async () => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWidgets(data || []);
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

  useEffect(() => {
    fetchWidgets();
  }, []);

  const generateEmbedCode = (widget: Widget) => {
    return `<!-- Bolo AI Voice Widget -->
<script
  id="bolo-voice-widget"
  src="https://bolovoice.com/widget.js"
  type="module"
  data-public-key="${widget.public_key}"
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
  };

  const copyToClipboard = (text: string, widgetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [widgetId]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [widgetId]: false }));
    }, 2000);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
  };

  const toggleWidgetStatus = async (widget: Widget) => {
    try {
      const { error } = await supabase
        .from('widgets')
        .update({ is_active: !widget.is_active })
        .eq('id', widget.id);

      if (error) throw error;

      setWidgets(prev =>
        prev.map(w =>
          w.id === widget.id ? { ...w, is_active: !widget.is_active } : w
        )
      );

      toast({
        title: "Success",
        description: `Widget ${widget.is_active ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating widget:', error);
      toast({
        title: "Error",
        description: "Failed to update widget status",
        variant: "destructive",
      });
    }
  };

  const deleteWidget = async (widgetId: string) => {
    try {
      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', widgetId);

      if (error) throw error;

      setWidgets(prev => prev.filter(w => w.id !== widgetId));
      toast({
        title: "Success",
        description: "Widget deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast({
        title: "Error",
        description: "Failed to delete widget",
        variant: "destructive",
      });
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
    toast({
      title: "Testing Widget",
      description: "Widget code loaded in test preview below",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading widgets...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Widget Management
        </h1>
        <p className="text-muted-foreground">
          Manage all voice widgets created by users
        </p>
      </div>

      <Tabs defaultValue="widgets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="widgets">My Widgets</TabsTrigger>
          <TabsTrigger value="test">Test Widget</TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="space-y-6">
          <div className="grid gap-6">
            {widgets.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No widgets found</p>
                </CardContent>
              </Card>
            ) : (
          widgets.map((widget) => (
            <Card key={widget.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{widget.title}</CardTitle>
                    <CardDescription>
                      Widget ID: {widget.id}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={widget.is_active ? "default" : "secondary"}>
                        {widget.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        Agent: {widget.agent_id}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWidgetStatus(widget)}
                    >
                      {widget.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Widget</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this widget? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteWidget(widget.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Configuration</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Position:</span> {widget.position}</p>
                      <p><span className="font-medium">Button Text:</span> {widget.button_text}</p>
                      <p><span className="font-medium">Colors:</span> 
                        <span className="ml-2 inline-block w-4 h-4 rounded" style={{ backgroundColor: widget.primary_color }}></span>
                        <span className="ml-1 inline-block w-4 h-4 rounded" style={{ backgroundColor: widget.secondary_color }}></span>
                      </p>
                      <p><span className="font-medium">Created:</span> {new Date(widget.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Messages</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Welcome:</span> {widget.welcome_message}</p>
                      <p><span className="font-medium">Offline:</span> {widget.offline_message}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Embed Code</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateEmbedCode(widget), widget.id)}
                    >
                      {copiedStates[widget.id] ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-words">
                      {generateEmbedCode(widget)}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/widget-generator`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Similar
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://preview--bolo-your-voice.lovable.app/widget.js" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Widget.js
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Widget Tester
              </CardTitle>
              <CardDescription>
                Paste any widget embed code here to test if it's working properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testCode">Paste Widget Embed Code</Label>
                  <Textarea 
                    id="testCode"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    placeholder={`Paste your widget embed code here, for example:

<script
  id="bolo-voice-widget"
  src="https://bolovoice.com/widget.js"
  type="module"
  data-agent-id="your-agent-id"
  data-title="Voice Assistant"
  data-primary-color="#6366F1"
  data-secondary-color="#8B5CF6"
  data-position="bottom-right"
  data-button-text="Start a conversation"
  data-welcome-message="Hi! How can I help you today?"
  data-offline-message="We're currently offline. Please leave a message!"
></script>`}
                    rows={12}
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
                  <Button 
                    variant="outline"
                    onClick={() => setTestCode(widgets.length > 0 ? generateEmbedCode(widgets[0]) : '')}
                    disabled={widgets.length === 0}
                  >
                    Load Sample Code
                  </Button>
                </div>
                
                {showTestPreview && testCode && (
                  <div className="border rounded-lg p-4 bg-muted space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Widget Test Preview</h4>
                      <Badge variant="outline">Testing Mode</Badge>
                    </div>
                    
                    <div className="border rounded-lg p-8 bg-background min-h-[300px] relative">
                      <div className="text-center text-muted-foreground mb-4 text-sm">
                        🌐 Simulated Website Content
                      </div>
                      <div className="absolute inset-4 border-2 border-dashed border-muted-foreground/20 rounded flex items-center justify-center">
                        <span className="text-muted-foreground/50">Website Content Area</span>
                      </div>
                      
                      {/* Widget Test Area */}
                      <div 
                        dangerouslySetInnerHTML={{ __html: testCode }}
                        className="relative z-10"
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Testing Tips:</strong>
                      </p>
                      <ul className="text-muted-foreground space-y-1 ml-4">
                        <li>• If the widget doesn't appear, check the browser console for errors</li>
                        <li>• Verify the widget.js file is accessible from the specified URL</li>
                        <li>• Make sure all required data attributes are present</li>
                        <li>• Test on different devices and browsers for compatibility</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWidgets;