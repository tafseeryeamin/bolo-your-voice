import React, { useState } from 'react';
import { Upload, Copy, Check, Save, Sparkles } from 'lucide-react';

const WidgetGenerator = () => {
  const [config, setConfig] = useState({
    publicKey: 'key_e784586ccfd13c1285c857d650ac',
    agentId: 'agent_9624b5655618cedb8031e80ada',
    title: 'Talk to AI',
    logoUrl: '',
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    position: 'bottom-right',
    buttonText: 'Start a conversation',
    welcomeMessage: 'Hi! How can I help you today?',
    offlineMessage: 'We\'re currently offline. Please leave a message!'
  });

  const [activeTab, setActiveTab] = useState('embed');
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [isWidgetSaved, setIsWidgetSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create a temporary URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          logoUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveWidget = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving the widget configuration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Upload the logo file to your server/CDN
      // 2. Save the widget configuration to your database
      // 3. Generate a unique widget ID
      // 4. Return the hosted widget URL
      
      setIsWidgetSaved(true);
      
      // Show success for 3 seconds, then allow re-saving
      setTimeout(() => {
        setIsWidgetSaved(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving widget:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateEmbedCode = () => {
    return `<!-- Bolo AI Voice Widget -->
<script
  id="bolo-voice-widget"
  src="https://preview--bolo-your-voice.lovable.app/widget.js"
  type="module"
  data-public-key="${config.publicKey}"
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

  const copyToClipboard = (text: string, setCopied: (value: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Widget Generator
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Customize your AI voice widget with your branding and generate embeddable code for your website
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Widget Configuration</h2>
            
            <div className="space-y-6">
              {/* API Configuration */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={config.publicKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder="Enter your API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Agent ID
                </label>
                <input
                  type="text"
                  value={config.agentId}
                  onChange={(e) => setConfig(prev => ({ ...prev, agentId: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder="Enter your agent ID"
                />
              </div>

              {/* Widget Appearance */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Widget Title
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder="Widget title"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Logo Upload
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {logoFile && (
                    <span className="text-sm text-purple-200">
                      {logoFile.name}
                    </span>
                  )}
                </div>
                {config.logoUrl && (
                  <div className="mt-2">
                    <img src={config.logoUrl} alt="Logo preview" className="w-12 h-12 object-contain bg-white/10 rounded-lg p-2" />
                  </div>
                )}
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-full h-12 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-full h-12 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Widget Position
                </label>
                <select
                  value={config.position}
                  onChange={(e) => setConfig(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>

              {/* Messages */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Welcome Message
                </label>
                <input
                  type="text"
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder="Welcome message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Offline Message
                </label>
                <input
                  type="text"
                  value={config.offlineMessage}
                  onChange={(e) => setConfig(prev => ({ ...prev, offlineMessage: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder="Offline message"
                />
              </div>

              {/* Save Widget Button */}
              <div className="pt-4 border-t border-white/20">
                <button
                  onClick={handleSaveWidget}
                  disabled={isSaving || isWidgetSaved}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    isWidgetSaved
                      ? 'bg-green-600 text-white'
                      : isSaving
                      ? 'bg-purple-600/50 text-white/70 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 transform'
                  }`}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Saving Widget...
                    </div>
                  ) : isWidgetSaved ? (
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 mr-3" />
                      Widget Saved Successfully!
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-3" />
                      Save & Generate Widget
                    </div>
                  )}
                </button>
                
                {isWidgetSaved && (
                  <p className="text-center text-green-300 text-sm mt-2">
                    ✅ Your widget is ready! Copy the embed code below.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview and Code Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Widget Preview & Code</h2>

            {/* Widget Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
              <div className="relative bg-gray-800 rounded-lg p-8 min-h-[200px] border-2 border-dashed border-gray-600">
                <div className="text-center text-gray-400 mb-4">
                  Widget Preview (Click Save to activate)
                </div>
                
                {/* Simulated floating button */}
                <div 
                  className={`absolute ${config.position.includes('right') ? 'right-4' : 'left-4'} ${config.position.includes('top') ? 'top-4' : 'bottom-4'} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-all hover:scale-110`}
                  style={{ 
                    background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
                    opacity: isWidgetSaved ? 1 : 0.5
                  }}
                >
                  {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Logo" className="w-8 h-8 object-contain filter invert" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/20 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('embed')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'embed'
                      ? 'border-purple-400 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Embed Code
                </button>
              </nav>
            </div>

            {/* Embed Code Tab */}
            {activeTab === 'embed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">HTML Embed Code</h3>
                  <button
                    onClick={() => copyToClipboard(generateEmbedCode(), setCopiedEmbed)}
                    disabled={!isWidgetSaved}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !isWidgetSaved 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : copiedEmbed
                        ? 'bg-green-600 text-white'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {copiedEmbed ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                
                <div className={`bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 border ${!isWidgetSaved ? 'opacity-50' : ''}`}>
                  <pre className="whitespace-pre-wrap break-words">
                    {generateEmbedCode()}
                  </pre>
                </div>
                
                {!isWidgetSaved && (
                  <div className="text-center text-yellow-300 text-sm p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                    ⚠️ Please save your widget configuration first to generate the embed code.
                  </div>
                )}
              </div>
            )}

            {/* Setup Instructions */}
            <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-2">Setup Instructions:</h4>
              <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                <li>Configure your widget settings above</li>
                <li>Click "Save & Generate Widget" to create your widget</li>
                <li>Copy the embed code</li>
                <li>Paste it into your website's HTML</li>
                <li>The voice widget will appear on your site!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetGenerator;