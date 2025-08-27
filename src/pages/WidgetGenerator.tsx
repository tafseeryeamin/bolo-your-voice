import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Eye, Settings, Code, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WidgetGenerator = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    publicKey: '',
    agentId: '',
    agentVersion: '',
    title: 'Chat with us!',
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    widgetType: 'floating',
    position: 'bottom-right',
    customDomain: window.location.origin,
    buttonText: 'Chat with AI',
    welcomeMessage: 'Hi! How can I help you today?',
    offlineMessage: 'We\'re currently offline. Please leave a message!'
  });

  const [preview, setPreview] = useState(false);

  const generateEmbedCode = () => {
    const widgetUrl = `${config.customDomain}/widget.js`;
    
    if (config.widgetType === 'floating') {
      return `<!-- Bolo AI Voice Widget -->
<script
  id="bolo-voice-widget"
  src="${widgetUrl}"
  type="module"
  data-public-key="${config.publicKey}"
  data-agent-id="${config.agentId}"
  ${config.agentVersion ? `data-agent-version="${config.agentVersion}"` : ''}
  data-title="${config.title}"
  ${config.logoUrl ? `data-logo-url="${config.logoUrl}"` : ''}
  data-primary-color="${config.primaryColor}"
  data-secondary-color="${config.secondaryColor}"
  data-position="${config.position}"
  data-button-text="${config.buttonText}"
  data-welcome-message="${config.welcomeMessage}"
  data-offline-message="${config.offlineMessage}"
></script>`;
    } else {
      return `<!-- Bolo AI Voice Widget - Inline -->
<div id="bolo-chat-container"></div>
<script
  id="bolo-voice-widget"
  src="${widgetUrl}"
  type="module"
  data-public-key="${config.publicKey}"
  data-agent-id="${config.agentId}"
  ${config.agentVersion ? `data-agent-version="${config.agentVersion}"` : ''}
  data-title="${config.title}"
  ${config.logoUrl ? `data-logo-url="${config.logoUrl}"` : ''}
  data-primary-color="${config.primaryColor}"
  data-secondary-color="${config.secondaryColor}"
  data-mode="inline"
  data-container="bolo-chat-container"
  data-welcome-message="${config.welcomeMessage}"
  data-offline-message="${config.offlineMessage}"
></script>`;
    }
  };

  const generateWidgetJS = () => {
    return `// Bolo AI Voice Widget - White Label Solution
(function() {
  'use strict';
  
  // Get configuration from script tag
  const script = document.getElementById('bolo-voice-widget');
  const config = {
    publicKey: script.getAttribute('data-public-key'),
    agentId: script.getAttribute('data-agent-id'),
    agentVersion: script.getAttribute('data-agent-version') || 'latest',
    title: script.getAttribute('data-title') || 'Chat with us!',
    logoUrl: script.getAttribute('data-logo-url'),
    primaryColor: script.getAttribute('data-primary-color') || '#3B82F6',
    secondaryColor: script.getAttribute('data-secondary-color') || '#1E40AF',
    position: script.getAttribute('data-position') || 'bottom-right',
    mode: script.getAttribute('data-mode') || 'floating',
    container: script.getAttribute('data-container'),
    buttonText: script.getAttribute('data-button-text') || 'Chat with AI',
    welcomeMessage: script.getAttribute('data-welcome-message') || 'Hi! How can I help you today?',
    offlineMessage: script.getAttribute('data-offline-message') || 'We\\'re currently offline. Please leave a message!'
  };

  // Load Voice SDK dynamically
  function loadVoiceSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://voice-api.example.com/voice-widget.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Create widget styles
  function createStyles() {
    const styles = \`
      .bolo-widget-button {
        position: fixed;
        \${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        \${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, \${config.primaryColor}, \${config.secondaryColor});
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }
      
      .bolo-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      }
      
      .bolo-chat-window {
        position: fixed;
        \${config.position.includes('bottom') ? 'bottom: 90px;' : 'top: 90px;'}
        \${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .bolo-chat-header {
        background: linear-gradient(135deg, \${config.primaryColor}, \${config.secondaryColor});
        color: white;
        padding: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .bolo-chat-content {
        flex: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #666;
      }
      
      .bolo-voice-button {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, \${config.primaryColor}, \${config.secondaryColor});
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;
        margin: 20px 0;
        transition: all 0.3s ease;
      }
      
      .bolo-voice-button:hover {
        transform: scale(1.05);
      }
      
      .bolo-close-button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }
    \`;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Create widget HTML
  function createWidget() {
    if (config.mode === 'inline') {
      const container = document.getElementById(config.container);
      if (container) {
        container.innerHTML = \`
          <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; max-width: 400px;">
            <div class="bolo-chat-header">
              <span>\${config.title}</span>
            </div>
            <div class="bolo-chat-content">
              <div>🎤</div>
              <button class="bolo-voice-button" onclick="startVoiceChat()">🎙️</button>
              <p>\${config.welcomeMessage}</p>
            </div>
          </div>
        \`;
      }
    } else {
      // Floating widget
      const button = document.createElement('button');
      button.className = 'bolo-widget-button';
      button.innerHTML = '🎤';
      button.onclick = toggleChat;
      
      const chatWindow = document.createElement('div');
      chatWindow.className = 'bolo-chat-window';
      chatWindow.id = 'bolo-chat-window';
      chatWindow.innerHTML = \`
        <div class="bolo-chat-header">
          <span>\${config.title}</span>
          <button class="bolo-close-button" onclick="toggleChat()">×</button>
        </div>
        <div class="bolo-chat-content">
          <div style="font-size: 48px; margin-bottom: 16px;">🎤</div>
          <button class="bolo-voice-button" onclick="startVoiceChat()">🎙️</button>
          <p>\${config.welcomeMessage}</p>
          <small style="margin-top: 16px; opacity: 0.7;">Click the microphone to start talking</small>
        </div>
      \`;
      
      document.body.appendChild(button);
      document.body.appendChild(chatWindow);
    }
  }

  // Toggle chat window
  window.toggleChat = function() {
    const chatWindow = document.getElementById('bolo-chat-window');
    if (chatWindow) {
      chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    }
  };

  // Start voice chat using Voice API
  window.startVoiceChat = async function() {
    try {
      // Connect to voice API endpoint
      const response = await fetch(\`\${window.location.origin}/api/voice/connect\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${config.publicKey}\`
        },
        body: JSON.stringify({
          agentId: config.agentId,
          agentVersion: config.agentVersion
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Initialize voice connection
        console.log('Voice chat started successfully');
      } else {
        throw new Error('Failed to connect to voice service');
      }
    } catch (error) {
      console.error('Error starting voice chat:', error);
      alert('Unable to start voice chat. Please try again.');
    }
  };

  // Initialize widget
  function init() {
    createStyles();
    createWidget();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type} code has been copied to your clipboard.`,
    });
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
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Widget Generator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create embeddable AI voice widgets for your customers. White-label solution that serves from your domain.
          </p>
          <Badge variant="secondary" className="text-sm">
            White Label Solution
          </Badge>
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
                      <Label htmlFor="publicKey">Voice API Key</Label>
                      <Input
                        id="publicKey"
                        placeholder="key_xxxxxxxxxxxxxxxxxxxxx"
                        value={config.publicKey}
                        onChange={(e) => setConfig({...config, publicKey: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agentId">Agent ID</Label>
                      <Input
                        id="agentId"
                        placeholder="agent_xxxxxxxxxxxxxxxxxxx"
                        value={config.agentId}
                        onChange={(e) => setConfig({...config, agentId: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agentVersion">Agent Version (Optional)</Label>
                      <Input
                        id="agentVersion"
                        placeholder="Leave empty for latest"
                        value={config.agentVersion}
                        onChange={(e) => setConfig({...config, agentVersion: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Widget Title</Label>
                      <Input
                        id="title"
                        value={config.title}
                        onChange={(e) => setConfig({...config, title: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                      <Input
                        id="logoUrl"
                        placeholder="https://your-domain.com/logo.png"
                        value={config.logoUrl}
                        onChange={(e) => setConfig({...config, logoUrl: e.target.value})}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="styling" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="widgetType">Widget Type</Label>
                      <Select value={config.widgetType} onValueChange={(value) => setConfig({...config, widgetType: value})}>
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
                        <Select value={config.position} onValueChange={(value) => setConfig({...config, position: value})}>
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
                            onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={config.primaryColor}
                            onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
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
                            onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={config.secondaryColor}
                            onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
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
                        onChange={(e) => setConfig({...config, buttonText: e.target.value})}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customDomain">Your Domain</Label>
                      <Input
                        id="customDomain"
                        value={config.customDomain}
                        onChange={(e) => setConfig({...config, customDomain: e.target.value})}
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
                        onChange={(e) => setConfig({...config, welcomeMessage: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offlineMessage">Offline Message</Label>
                      <Textarea
                        id="offlineMessage"
                        value={config.offlineMessage}
                        onChange={(e) => setConfig({...config, offlineMessage: e.target.value})}
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
                <Tabs defaultValue="embed" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="embed">Embed Code</TabsTrigger>
                    <TabsTrigger value="widget">Widget.js</TabsTrigger>
                  </TabsList>

                  <TabsContent value="embed" className="space-y-4">
                    <div className="space-y-2">
                      <Label>HTML Embed Code</Label>
                      <div className="relative">
                        <Textarea
                          value={generateEmbedCode()}
                          readOnly
                          rows={8}
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

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(generateEmbedCode(), "Embed")}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Embed Code
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="widget" className="space-y-4">
                    <div className="space-y-2">
                      <Label>widget.js File Content</Label>
                      <div className="relative">
                        <Textarea
                          value={generateWidgetJS()}
                          readOnly
                          rows={8}
                          className="font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(generateWidgetJS(), "Widget JS")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(generateWidgetJS(), "Widget JS")}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy JS Code
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadFile(generateWidgetJS(), 'widget.js')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download widget.js
                      </Button>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Download the widget.js file and host it on your domain</li>
                        <li>Update the script src in the embed code to point to your hosted file</li>
                        <li>Provide the embed code to your customers</li>
                        <li>Widget will appear with your branding (completely white-labeled)</li>
                      </ol>
                    </div>
                  </TabsContent>
                </Tabs>
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
                      className={`fixed w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg cursor-pointer transition-transform hover:scale-110`}
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