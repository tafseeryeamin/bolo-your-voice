import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Settings, Webhook, Wrench, Mic, Plus, Trash2, Play, User, Volume2, Gauge, Zap, MessageSquare, Clock, Music, Globe, TrendingUp, BarChart3 } from "lucide-react";
import Header from "@/components/Header";

// Voice data with all the voices you specified
const voices = [
  { name: "Adrian", trait: "American, Young, Retell", id: "11labs-Adrian" },
  { name: "Amritanshu (en-IN)", trait: "Indian, Middle Aged, Provider", id: "11labs-Amritanshu" },
  { name: "Amy(UK)", trait: "British, Young, Provider", id: "11labs-Amy" },
  { name: "Andrew", trait: "American, Young, Retell", id: "11labs-Andrew" },
  { name: "Anna", trait: "American, Young, Retell", id: "11labs-Anna" },
  { name: "Anthony", trait: "British, Middle Aged, Retell", id: "11labs-Anthony" },
  { name: "Billy", trait: "American, Young, Retell", id: "11labs-Billy" },
  { name: "Bing", trait: "American, Young, Retell", id: "11labs-Bing" },
  { name: "Brian", trait: "American, Young, Retell", id: "11labs-Brian" },
  { name: "Carola (de-DE)", trait: "German, Middle Aged, Provider", id: "11labs-Carola" },
  { name: "Charlie (en-Au)", trait: "Australian, Middle Aged, Provider", id: "11labs-charlie" },
  { name: "Chloe", trait: "American, Young, Retell", id: "11labs-Chloe" },
  { name: "Cimo", trait: "American, Middle Aged, Retell", id: "11labs-Cimo" },
  { name: "Dorothy", trait: "British, Young, Provider", id: "11labs-Dorothy" },
  { name: "Emily", trait: "American, Middle Aged, Retell", id: "11labs-Emily" },
  { name: "Ethan", trait: "American, Young, Retell", id: "11labs-Ethan" },
  { name: "Evie", trait: "American, Young, Retell", id: "11labs-Evie" },
  { name: "Gilfoy", trait: "American, Middle Aged, Retell", id: "11labs-Gilfoy" },
  { name: "Grace", trait: "American, Middle Aged, Retell", id: "11labs-Grace" },
  { name: "James", trait: "American, Old, Retell", id: "11labs-James" },
  { name: "Jason", trait: "American, Young, Retell", id: "11labs-Jason" },
  { name: "Jenny", trait: "American, Young, Retell", id: "11labs-Jenny" },
  { name: "Joe", trait: "American, Middle Aged, Provider", id: "11labs-Joe" },
  { name: "John", trait: "American, Middle Aged, Retell", id: "11labs-John" },
  { name: "Julia", trait: "American, Middle Aged, Retell", id: "11labs-Julia" },
  { name: "Kate", trait: "American, Middle Aged, Retell", id: "11labs-Kate" },
  { name: "Kathrine", trait: "American, Middle Aged, Retell", id: "11labs-Kathrine" },
  { name: "Lily", trait: "American, Young, Retell", id: "11labs-Lily" },
  { name: "Lucas", trait: "American, Middle Aged, Retell", id: "11labs-Lucas" },
  { name: "Marissa", trait: "American, Young, Retell", id: "11labs-Marissa" },
  { name: "Max", trait: "American, Middle Aged, Retell", id: "11labs-Max" },
  { name: "Mia", trait: "American, Middle Aged, Retell", id: "11labs-Mia" },
  { name: "Monika (en-IN)", trait: "Indian, Middle Aged, Provider", id: "11labs-Monika" },
  { name: "Myra", trait: "American, Young, Retell", id: "11labs-Myra" },
  { name: "Nina", trait: "American, Middle Aged, Retell", id: "11labs-Nina" },
  { name: "Noah (en-AU)", trait: "Australian, Middle Aged, Provider", id: "11labs-Noah" },
  { name: "Paola", trait: "American, Young, Provider", id: "11labs-Paola" },
  { name: "Paul", trait: "American, Old, Retell", id: "11labs-Paul" },
  { name: "Ryan", trait: "American, Young, Retell", id: "11labs-Ryan" },
  { name: "Samad (en-IN)", trait: "Indian, Middle Aged, Provider", id: "11labs-Samad" },
  { name: "Santiago (es-ES)", trait: "Spanish, Middle Aged, Provider", id: "11labs-Santiago" },
  { name: "Steve", trait: "American, Old, Retell", id: "11labs-Steve" },
  { name: "Susan", trait: "American, Middle Aged, Retell", id: "11labs-Susan" },
  { name: "Victoria", trait: "American, Young, Retell", id: "11labs-victoria" },
  { name: "Zuri", trait: "American, Old, Retell", id: "11labs-Zuri" },
];

const ambientSounds = [
  { name: "Coffee Shop", value: "coffee-shop" },
  { name: "Convention Hall", value: "convention-hall" },
  { name: "Summer Outdoor", value: "summer-outdoor" },
  { name: "Mountain Outdoor", value: "mountain-outdoor" },
  { name: "Static Noise", value: "static-noise" },
  { name: "Call Center", value: "call-center" },
  { name: "None", value: "none" },
];

const languages = [
  { name: "English (US)", value: "en-US" },
  { name: "English (UK)", value: "en-GB" },
  { name: "Spanish", value: "es-ES" },
  { name: "French", value: "fr-FR" },
  { name: "German", value: "de-DE" },
  { name: "Italian", value: "it-IT" },
  { name: "Portuguese", value: "pt-PT" },
  { name: "Dutch", value: "nl-NL" },
  { name: "Polish", value: "pl-PL" },
  { name: "Russian", value: "ru-RU" },
  { name: "Japanese", value: "ja-JP" },
  { name: "Korean", value: "ko-KR" },
  { name: "Chinese", value: "zh-CN" },
  { name: "Hindi", value: "hi-IN" },
];

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface PostCallAnalysisData {
  id: string;
  type: string;
  name: string;
  description: string;
}

const AgentConfig = () => {
  // Basic settings
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [fallbackVoiceIds, setFallbackVoiceIds] = useState<string[]>([]);
  const [speaksFirst, setSpeaksFirst] = useState("ai");
  const [aiFirstMessage, setAiFirstMessage] = useState("");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  // Voice settings
  const [voiceTemperature, setVoiceTemperature] = useState([1]);
  const [voiceSpeed, setVoiceSpeed] = useState([1]);
  const [volume, setVolume] = useState([1]);
  const [responsiveness, setResponsiveness] = useState([1]);
  const [interruptionSensitivity, setInterruptionSensitivity] = useState([1]);

  // Backchannel settings
  const [enableBackchannel, setEnableBackchannel] = useState(true);
  const [backchannelFrequency, setBackchannelFrequency] = useState([0.9]);
  const [backchannelWords, setBackchannelWords] = useState("yeah,uh-huh");

  // Reminder settings
  const [reminderTriggerMs, setReminderTriggerMs] = useState(10000);
  const [reminderMaxCount, setReminderMaxCount] = useState(2);

  // Ambient sound settings
  const [ambientSound, setAmbientSound] = useState("coffee-shop");
  const [ambientSoundVolume, setAmbientSoundVolume] = useState([1]);

  // Language and keywords
  const [language, setLanguage] = useState("en-US");
  const [boostedKeywords, setBoostedKeywords] = useState("retell,kroger");

  // Post call analysis
  const [postCallAnalysisData, setPostCallAnalysisData] = useState<PostCallAnalysisData[]>([]);

  const addTool = () => {
    const newTool: Tool = {
      id: Date.now().toString(),
      name: "",
      description: "",
    };
    setTools([...tools, newTool]);
  };

  const removeTool = (id: string) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  const updateTool = (id: string, field: keyof Tool, value: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, [field]: value } : tool
    ));
  };

  const addPostCallAnalysisData = () => {
    const newData: PostCallAnalysisData = {
      id: Date.now().toString(),
      type: "string",
      name: "",
      description: "",
    };
    setPostCallAnalysisData([...postCallAnalysisData, newData]);
  };

  const removePostCallAnalysisData = (id: string) => {
    setPostCallAnalysisData(postCallAnalysisData.filter(data => data.id !== id));
  };

  const updatePostCallAnalysisData = (id: string, field: keyof PostCallAnalysisData, value: string) => {
    setPostCallAnalysisData(postCallAnalysisData.map(data => 
      data.id === id ? { ...data, [field]: value } : data
    ));
  };

  const handleFallbackVoiceChange = (voiceId: string, checked: boolean) => {
    if (checked && fallbackVoiceIds.length < 2) {
      setFallbackVoiceIds([...fallbackVoiceIds, voiceId]);
    } else if (!checked) {
      setFallbackVoiceIds(fallbackVoiceIds.filter(id => id !== voiceId));
    }
  };

  const playVoicePreview = async (voiceId: string) => {
    try {
      setPlayingVoice(voiceId);
      
      // Create a simple voice preview using Speech Synthesis API
      const utterance = new SpeechSynthesisUtterance("Hello, this is a preview of my voice. How can I help you today?");
      
      // Try to match voice characteristics based on the voice data
      const voice = voices.find(v => v.id === voiceId);
      const availableVoices = speechSynthesis.getVoices();
      
      if (voice && availableVoices.length > 0) {
        // Try to find a suitable voice based on traits
        let selectedVoice = availableVoices[0]; // Default
        
        if (voice.trait.includes('British')) {
          selectedVoice = availableVoices.find(v => v.lang.includes('en-GB')) || selectedVoice;
        } else if (voice.trait.includes('Australian')) {
          selectedVoice = availableVoices.find(v => v.lang.includes('en-AU')) || selectedVoice;
        } else if (voice.trait.includes('German')) {
          selectedVoice = availableVoices.find(v => v.lang.includes('de')) || selectedVoice;
        } else if (voice.trait.includes('Spanish')) {
          selectedVoice = availableVoices.find(v => v.lang.includes('es')) || selectedVoice;
        } else if (voice.trait.includes('Indian')) {
          selectedVoice = availableVoices.find(v => v.lang.includes('en-IN')) || selectedVoice;
        }
        
        utterance.voice = selectedVoice;
        utterance.rate = 0.9;
        utterance.pitch = voice.trait.includes('Young') ? 1.1 : voice.trait.includes('Old') ? 0.9 : 1.0;
      }
      
      utterance.onend = () => setPlayingVoice(null);
      utterance.onerror = () => setPlayingVoice(null);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing voice preview:', error);
      setPlayingVoice(null);
    }
  };

  const handleSave = async () => {
    const config = {
      agent_name: agentName,
      agent_prompt: agentPrompt,
      voice_id: selectedVoice,
      fallback_voice_ids: fallbackVoiceIds,
      voice_temperature: voiceTemperature[0],
      voice_speed: voiceSpeed[0],
      volume: volume[0],
      responsiveness: responsiveness[0],
      interruption_sensitivity: interruptionSensitivity[0],
      enable_backchannel: enableBackchannel,
      backchannel_frequency: backchannelFrequency[0],
      backchannel_words: backchannelWords.split(',').map(word => word.trim()),
      reminder_trigger_ms: reminderTriggerMs,
      reminder_max_count: reminderMaxCount,
      ambient_sound: ambientSound,
      ambient_sound_volume: ambientSoundVolume[0],
      language: language,
      webhook_url: webhookUrl,
      boosted_keywords: boostedKeywords.split(',').map(keyword => keyword.trim()),
      post_call_analysis_data: postCallAnalysisData.map(data => ({
        type: data.type,
        name: data.name,
        description: data.description,
      })),
      speaks_first: speaksFirst,
      ai_first_message: aiFirstMessage,
      tools,
    };
    
    try {
      const response = await fetch('https://awake-cockatoo-naturally.ngrok-free.app/webhook/955d68ca-7f0e-46d8-9835-b0bbf8a8b0eb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        console.log("Agent Configuration sent successfully:", config);
        // You could add a toast notification here for success
      } else {
        console.error("Failed to send configuration:", response.statusText);
        // You could add a toast notification here for error
      }
    } catch (error) {
      console.error("Error sending configuration:", error);
      // You could add a toast notification here for error
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Agent Configuration</h1>
          <p className="text-muted-foreground">Configure your AI voice agent settings, tools, and voice selection.</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <User className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input
                    id="agent-name"
                    placeholder="Enter a name for your agent"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="prompt">System Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Type in a universal prompt for your agent, such as its role, conversational style, objective, etc."
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    className="min-h-32 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Selection */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Mic className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Voice Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="voice">Primary Voice</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a voice for your agent" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-card border-border">
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{voice.id}</span>
                              <span className="text-sm text-muted-foreground">{voice.trait}</span>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                playVoicePreview(voice.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 ml-2"
                              disabled={playingVoice === voice.id}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Fallback Voices (Select up to 2)</Label>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-border rounded-lg p-3">
                    {voices.map((voice) => (
                      <div key={voice.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`fallback-${voice.id}`}
                          checked={fallbackVoiceIds.includes(voice.id)}
                          onChange={(e) => handleFallbackVoiceChange(voice.id, e.target.checked)}
                          disabled={!fallbackVoiceIds.includes(voice.id) && fallbackVoiceIds.length >= 2}
                          className="rounded"
                        />
                        <Label htmlFor={`fallback-${voice.id}`} className="text-sm">
                          {voice.id}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedVoice && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Selected:</span>{" "}
                      {voices.find(v => v.id === selectedVoice)?.name} - {voices.find(v => v.id === selectedVoice)?.trait}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Voice Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Volume2 className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Voice Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Voice Temperature: {voiceTemperature[0]}</Label>
                  <Slider
                    value={voiceTemperature}
                    onValueChange={setVoiceTemperature}
                    max={2}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Voice Speed: {voiceSpeed[0]}</Label>
                  <Slider
                    value={voiceSpeed}
                    onValueChange={setVoiceSpeed}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Volume: {volume[0]}</Label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={2}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Responsiveness: {responsiveness[0]}</Label>
                  <Slider
                    value={responsiveness}
                    onValueChange={setResponsiveness}
                    max={2}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Interruption Sensitivity: {interruptionSensitivity[0]}</Label>
                  <Slider
                    value={interruptionSensitivity}
                    onValueChange={setInterruptionSensitivity}
                    max={2}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <MessageSquare className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Conversation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Speaking Order */}
                <div>
                  <Label htmlFor="speaks-first">Who Speaks First</Label>
                  <Select value={speaksFirst} onValueChange={setSpeaksFirst}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select who speaks first" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI Speaks First</SelectItem>
                      <SelectItem value="human">Human Speaks First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* AI First Message */}
                {speaksFirst === "ai" && (
                  <div>
                    <Label htmlFor="ai-first-message">AI First Message</Label>
                    <Textarea
                      id="ai-first-message"
                      placeholder="Enter the first message the AI should say..."
                      value={aiFirstMessage}
                      onChange={(e) => setAiFirstMessage(e.target.value)}
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                )}

                {/* Language */}
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Boosted Keywords */}
                <div>
                  <Label htmlFor="boosted-keywords">Boosted Keywords</Label>
                  <Input
                    id="boosted-keywords"
                    placeholder="Enter keywords separated by commas"
                    value={boostedKeywords}
                    onChange={(e) => setBoostedKeywords(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Keywords that the agent should pay special attention to.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backchannel Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Zap className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Backchannel Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-backchannel"
                    checked={enableBackchannel}
                    onCheckedChange={setEnableBackchannel}
                  />
                  <Label htmlFor="enable-backchannel">Enable Backchannel</Label>
                </div>
                
                {enableBackchannel && (
                  <>
                    <div>
                      <Label>Backchannel Frequency: {backchannelFrequency[0]}</Label>
                      <Slider
                        value={backchannelFrequency}
                        onValueChange={setBackchannelFrequency}
                        max={1}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backchannel-words">Backchannel Words</Label>
                      <Input
                        id="backchannel-words"
                        placeholder="Enter words separated by commas"
                        value={backchannelWords}
                        onChange={(e) => setBackchannelWords(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Words like "yeah", "uh-huh" that show the agent is listening.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reminder Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Clock className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Reminder Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reminder-trigger">Reminder Trigger (ms)</Label>
                  <Input
                    id="reminder-trigger"
                    type="number"
                    value={reminderTriggerMs}
                    onChange={(e) => setReminderTriggerMs(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="reminder-max-count">Max Reminder Count</Label>
                  <Input
                    id="reminder-max-count"
                    type="number"
                    value={reminderMaxCount}
                    onChange={(e) => setReminderMaxCount(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ambient Sound Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Music className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Ambient Sound Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ambient-sound">Background Sound</Label>
                  <Select value={ambientSound} onValueChange={setAmbientSound}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select ambient sound" />
                    </SelectTrigger>
                    <SelectContent>
                      {ambientSounds.map((sound) => (
                        <SelectItem key={sound.value} value={sound.value}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ambient Sound Volume: {ambientSoundVolume[0]}</Label>
                  <Slider
                    value={ambientSoundVolume}
                    onValueChange={setAmbientSoundVolume}
                    max={1}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center">
                <Wrench className="w-5 h-5 text-voice-accent mr-2" />
                <CardTitle>Tools</CardTitle>
              </div>
              <Button onClick={addTool} size="sm" className="h-8">
                <Plus className="w-4 h-4 mr-1" />
                Add Tool
              </Button>
            </CardHeader>
            <CardContent>
              {tools.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tools configured yet. Click "Add Tool" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tools.map((tool, index) => (
                    <div key={tool.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Tool {index + 1}</h4>
                        <Button
                          onClick={() => removeTool(tool.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`tool-name-${tool.id}`}>Tool Name</Label>
                          <Input
                            id={`tool-name-${tool.id}`}
                            placeholder="e.g., search_knowledge"
                            value={tool.name}
                            onChange={(e) => updateTool(tool.id, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`tool-desc-${tool.id}`}>Description</Label>
                          <Input
                            id={`tool-desc-${tool.id}`}
                            placeholder="Brief description of the tool"
                            value={tool.description}
                            onChange={(e) => updateTool(tool.id, 'description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Post Call Analysis */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-voice-accent mr-2" />
                <CardTitle>Post Call Analysis Data</CardTitle>
              </div>
              <Button onClick={addPostCallAnalysisData} size="sm" className="h-8">
                <Plus className="w-4 h-4 mr-1" />
                Add Analysis Field
              </Button>
            </CardHeader>
            <CardContent>
              {postCallAnalysisData.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No analysis fields configured yet. Click "Add Analysis Field" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {postCallAnalysisData.map((data, index) => (
                    <div key={data.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Analysis Field {index + 1}</h4>
                        <Button
                          onClick={() => removePostCallAnalysisData(data.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`analysis-type-${data.id}`}>Type</Label>
                          <Select 
                            value={data.type} 
                            onValueChange={(value) => updatePostCallAnalysisData(data.id, 'type', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`analysis-name-${data.id}`}>Field Name</Label>
                          <Input
                            id={`analysis-name-${data.id}`}
                            placeholder="e.g., customer_name"
                            value={data.name}
                            onChange={(e) => updatePostCallAnalysisData(data.id, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`analysis-desc-${data.id}`}>Description</Label>
                          <Input
                            id={`analysis-desc-${data.id}`}
                            placeholder="Brief description"
                            value={data.description}
                            onChange={(e) => updatePostCallAnalysisData(data.id, 'description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Webhook Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Webhook className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Webhook Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhook">Webhook URL</Label>
                  <Input
                    id="webhook"
                    type="url"
                    placeholder="https://your-webhook-endpoint.com/api/webhooks"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Optional webhook URL to receive agent events and call data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-voice-accent hover:bg-voice-muted text-primary-foreground">
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfig;