import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { User, Mic } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Voice options organized by gender and age
const voiceOptions = {
  male: {
    young: [{
      name: "Adrian",
      trait: "American, Young, Retell",
      id: "11labs-Adrian"
    }, {
      name: "Andrew",
      trait: "American, Young, Retell",
      id: "11labs-Andrew"
    }, {
      name: "Billy",
      trait: "American, Young, Retell",
      id: "11labs-Billy"
    }, {
      name: "Bing",
      trait: "American, Young, Retell",
      id: "11labs-Bing"
    }, {
      name: "Brian",
      trait: "American, Young, Retell",
      id: "11labs-Brian"
    }, {
      name: "Ethan",
      trait: "American, Young, Retell",
      id: "11labs-Ethan"
    }, {
      name: "Jason",
      trait: "American, Young, Retell",
      id: "11labs-Jason"
    }, {
      name: "Ryan",
      trait: "American, Young, Retell",
      id: "11labs-Ryan"
    }],
    middle: [{
      name: "Anthony",
      trait: "British, Middle Aged, Retell",
      id: "11labs-Anthony"
    }, {
      name: "Amritanshu (en-IN)",
      trait: "Indian, Middle Aged, Provider",
      id: "11labs-Amritanshu"
    }, {
      name: "Charlie (en-AU)",
      trait: "Australian, Middle Aged, Provider",
      id: "11labs-charlie"
    }, {
      name: "Cimo",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Cimo"
    }, {
      name: "Gilfoy",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Gilfoy"
    }, {
      name: "Joe",
      trait: "American, Middle Aged, Provider",
      id: "11labs-Joe"
    }, {
      name: "John",
      trait: "American, Middle Aged, Retell",
      id: "11labs-John"
    }, {
      name: "Lucas",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Lucas"
    }, {
      name: "Max",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Max"
    }, {
      name: "Noah (en-AU)",
      trait: "Australian, Middle Aged, Provider",
      id: "11labs-Noah"
    }, {
      name: "Samad (en-IN)",
      trait: "Indian, Middle Aged, Provider",
      id: "11labs-Samad"
    }, {
      name: "Santiago (es-ES)",
      trait: "Spanish, Middle Aged, Provider",
      id: "11labs-Santiago"
    }],
    senior: [{
      name: "James",
      trait: "American, Old, Retell",
      id: "11labs-James"
    }, {
      name: "Paul",
      trait: "American, Old, Retell",
      id: "11labs-Paul"
    }, {
      name: "Steve",
      trait: "American, Old, Retell",
      id: "11labs-Steve"
    }]
  },
  female: {
    young: [{
      name: "Amy (UK)",
      trait: "British, Young, Provider",
      id: "11labs-Amy"
    }, {
      name: "Anna",
      trait: "American, Young, Retell",
      id: "11labs-Anna"
    }, {
      name: "Chloe",
      trait: "American, Young, Retell",
      id: "11labs-Chloe"
    }, {
      name: "Evie",
      trait: "American, Young, Retell",
      id: "11labs-Evie"
    }, {
      name: "Jenny",
      trait: "American, Young, Retell",
      id: "11labs-Jenny"
    }, {
      name: "Lily",
      trait: "American, Young, Retell",
      id: "11labs-Lily"
    }, {
      name: "Marissa",
      trait: "American, Young, Retell",
      id: "11labs-Marissa"
    }, {
      name: "Myra",
      trait: "American, Young, Retell",
      id: "11labs-Myra"
    }, {
      name: "Paola",
      trait: "American, Young, Provider",
      id: "11labs-Paola"
    }, {
      name: "Victoria",
      trait: "American, Young, Retell",
      id: "11labs-victoria"
    }],
    middle: [{
      name: "Carola (de-DE)",
      trait: "German, Middle Aged, Provider",
      id: "11labs-Carola"
    }, {
      name: "Dorothy",
      trait: "British, Young, Provider",
      id: "11labs-Dorothy"
    }, {
      name: "Emily",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Emily"
    }, {
      name: "Grace",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Grace"
    }, {
      name: "Julia",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Julia"
    }, {
      name: "Kate",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Kate"
    }, {
      name: "Kathrine",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Kathrine"
    }, {
      name: "Mia",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Mia"
    }, {
      name: "Monika (en-IN)",
      trait: "Indian, Middle Aged, Provider",
      id: "11labs-Monika"
    }, {
      name: "Nina",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Nina"
    }, {
      name: "Susan",
      trait: "American, Middle Aged, Retell",
      id: "11labs-Susan"
    }],
    senior: [{
      name: "Zuri",
      trait: "American, Old, Retell",
      id: "11labs-Zuri"
    }]
  }
};

// Language options
const languageOptions = [
  { code: "en-US", name: "English (US)" },
  { code: "en-IN", name: "English (India)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "en-AU", name: "English (Australia)" },
  { code: "en-NZ", name: "English (New Zealand)" },
  { code: "de-DE", name: "German (Germany)" },
  { code: "es-ES", name: "Spanish (Spain)" },
  { code: "es-419", name: "Spanish (Latin America)" },
  { code: "hi-IN", name: "Hindi (India)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "fr-CA", name: "French (Canada)" },
  { code: "ja-JP", name: "Japanese" },
  { code: "pt-PT", name: "Portuguese (Portugal)" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ru-RU", name: "Russian" },
  { code: "it-IT", name: "Italian" },
  { code: "ko-KR", name: "Korean" },
  { code: "nl-NL", name: "Dutch (Netherlands)" },
  { code: "nl-BE", name: "Dutch (Belgium)" },
  { code: "pl-PL", name: "Polish" },
  { code: "tr-TR", name: "Turkish" },
  { code: "th-TH", name: "Thai" },
  { code: "vi-VN", name: "Vietnamese" },
  { code: "ro-RO", name: "Romanian" },
  { code: "bg-BG", name: "Bulgarian" },
  { code: "ca-ES", name: "Catalan" },
  { code: "da-DK", name: "Danish" },
  { code: "fi-FI", name: "Finnish" },
  { code: "el-GR", name: "Greek" },
  { code: "hu-HU", name: "Hungarian" },
  { code: "id-ID", name: "Indonesian" },
  { code: "no-NO", name: "Norwegian" },
  { code: "sk-SK", name: "Slovak" },
  { code: "sv-SE", name: "Swedish" },
  { code: "multi", name: "Multi-language" }
];

// Flatten all voices for backward compatibility
const voices = Object.values(voiceOptions).flatMap(gender => Object.values(gender).flatMap(age => age));
const AgentConfig = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [existingAgentId, setExistingAgentId] = useState<string | null>(null);

  // Essential fields only
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("11labs-Amritanshu");
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("male");
  const [selectedAge, setSelectedAge] = useState<"young" | "middle" | "senior">("middle");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [responsiveness, setResponsiveness] = useState([1]);
  const [enableBackchannel, setEnableBackchannel] = useState(true);
  const [backchannelFrequency, setBackchannelFrequency] = useState([0.9]);
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  useEffect(() => {
    console.log("AgentConfig component mounted");

    // Check if we have an existing agent ID from URL params
    const agentId = searchParams.get('id') || searchParams.get('agent_id');
    const agentName = searchParams.get('agent_name');
    if (agentId) {
      setExistingAgentId(agentId);
      console.log("Found existing agent ID:", agentId);

      // Load existing agent data
      loadAgentData(agentId);
      if (agentName) {
        setAgentName(decodeURIComponent(agentName));
      }
    }
  }, [searchParams]);
  const loadAgentData = async (agentId: string) => {
    try {
      console.log("Loading agent data for ID:", agentId);
      const {
        data: agent,
        error
      } = await supabase.from('agents').select('*').eq('id', agentId).single();
      if (error) {
        console.error("Error loading agent data:", error);
        toast({
          title: "Error",
          description: "Failed to load agent data",
          variant: "destructive"
        });
        return;
      }
      if (agent) {
        console.log("Loaded agent data:", agent);
        setAgentName(agent.name || "");

        // Find voice in categorized structure and set gender/age accordingly
        const voiceId = agent.voice_id || "11labs-Amritanshu";
        setSelectedVoice(voiceId);

        // Find the voice in our categorized structure
        let foundVoice = false;
        for (const [gender, ageGroups] of Object.entries(voiceOptions)) {
          for (const [age, voiceList] of Object.entries(ageGroups)) {
            if (voiceList.find(v => v.id === voiceId)) {
              setSelectedGender(gender as "male" | "female");
              setSelectedAge(age as "young" | "middle" | "senior");
              foundVoice = true;
              break;
            }
          }
          if (foundVoice) break;
        }
        
        // Set language if available
        if (agent.language) {
          setSelectedLanguage(agent.language);
        }
        
        setAgentPrompt(agent.prompt || "");
        setFirstMessage(agent.begin_message || "");

        // Parse response_engine if it exists and contains settings
        if (agent.response_engine) {
          try {
            const responseEngine = JSON.parse(agent.response_engine);
            if (responseEngine.responsiveness !== undefined) {
              setResponsiveness([responseEngine.responsiveness]);
            }
            if (responseEngine.enable_backchannel !== undefined) {
              setEnableBackchannel(responseEngine.enable_backchannel);
            }
            if (responseEngine.backchannel_frequency !== undefined) {
              setBackchannelFrequency([responseEngine.backchannel_frequency]);
            }
            if (responseEngine.knowledge_base) {
              setKnowledgeBase(responseEngine.knowledge_base);
            }
            if (responseEngine.website_link) {
              setWebsiteLink(responseEngine.website_link);
            }
          } catch (parseError) {
            console.log("Could not parse response_engine:", parseError);
          }
        }
      }
    } catch (error) {
      console.error("Error in loadAgentData:", error);
      toast({
        title: "Error",
        description: "Failed to load agent configuration",
        variant: "destructive"
      });
    }
  };
  const handleSave = async () => {
    try {
      console.log("Saving agent configuration...");

      // Get current user
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to save agents",
          variant: "destructive"
        });
        return;
      }
      const agentData = {
        name: agentName,
        user_id: user.id,
        voice_id: selectedVoice,
        language: selectedLanguage,
        description: agentPrompt,
        prompt: agentPrompt,
        begin_message: firstMessage || null,
        response_engine: JSON.stringify({
          type: "retell-llm",
          version: 0,
          voice_model: "eleven_turbo_v2",
          responsiveness: responsiveness[0],
          enable_backchannel: enableBackchannel,
          backchannel_frequency: backchannelFrequency[0],
          knowledge_base: knowledgeBase,
          website_link: websiteLink
        }),
        llm_websocket_url: null
      };
      let result;
      let savedAgent;
      if (existingAgentId) {
        // Update existing agent
        console.log("Updating existing agent:", existingAgentId);
        result = await supabase.from('agents').update(agentData).eq('id', existingAgentId).eq('user_id', user.id).select();
        if (result.error) {
          throw new Error(result.error.message);
        }
        savedAgent = result.data[0];
      } else {
        // Create new agent
        console.log("Creating new agent");
        result = await supabase.from('agents').insert(agentData).select();
        if (result.error) {
          throw new Error(result.error.message);
        }
        savedAgent = result.data[0];
        setExistingAgentId(savedAgent.id);
      }

      // Only create notification if it's a new agent (not an update)
      if (!existingAgentId) {
        // Create notification for admin review
        const {
          data,
          error
        } = await supabase.functions.invoke('create-retell-agent', {
          body: {
            internal_agent_id: savedAgent.id,
            agent_name: agentName,
            system_prompt: agentPrompt,
            first_message: firstMessage,
            voice_id: selectedVoice,
            responsiveness: responsiveness[0],
            enable_backchannel: enableBackchannel,
            backchannel_frequency: backchannelFrequency[0],
            knowledge_base: knowledgeBase,
            website_link: websiteLink,
            voice_preferences: {
              gender: selectedGender,
              age: selectedAge,
              voice_name: voiceOptions[selectedGender][selectedAge].find(v => v.id === selectedVoice)?.name
            }
          }
        });
        if (error) {
          console.error("Error creating Retell agent request:", error);
        }
      }

      // Log activity
      await supabase.from('activity_logs').insert([{
        user_id: user.id,
        agent_id: savedAgent.id,
        action: existingAgentId ? 'agent_updated' : 'agent_created',
        details: {
          agent_name: agentName
        }
      }]);
      toast({
        title: "Success",
        description: existingAgentId ? "Agent updated successfully!" : "Agent created successfully! Admin will review and assign Retell agent ID."
      });
    } catch (error) {
      console.error("Error saving agent configuration:", error);
      toast({
        title: "Error",
        description: `Failed to save configuration: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Agent Configuration</h1>
          <p className="text-muted-foreground">Configure your AI voice agent with essential settings.</p>
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
                  <Input id="agent-name" placeholder="Enter a name for your agent" value={agentName} onChange={e => setAgentName(e.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="prompt">System Prompt</Label>
                  <Textarea id="prompt" placeholder="Type in a universal prompt for your agent, such as its role, conversational style, objective, etc." value={agentPrompt} onChange={e => setAgentPrompt(e.target.value)} className="min-h-32 mt-2" />
                </div>
                <div>
                  <Label htmlFor="first-message">First Message</Label>
                  <Textarea id="first-message" placeholder="Enter the first message the AI will say when the conversation starts (optional)" value={firstMessage} onChange={e => setFirstMessage(e.target.value)} className="min-h-20 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    This message will be spoken first when the agent starts a conversation
                  </p>
                </div>
                <div>
                  <Label htmlFor="knowledge-base">Knowledge Base</Label>
                  <Textarea id="knowledge-base" placeholder="Enter knowledge base content or instructions for the agent" value={knowledgeBase} onChange={e => setKnowledgeBase(e.target.value)} className="min-h-20 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Additional knowledge or context the agent should be aware of
                  </p>
                </div>
                <div>
                  <Label htmlFor="website-link">Website Link</Label>
                  <Input id="website-link" type="url" placeholder="https://example.com" value={websiteLink} onChange={e => setWebsiteLink(e.target.value)} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Website URL that the agent should reference or scrape
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice & Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Mic className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Voice & Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select value={selectedGender} onValueChange={(value: "male" | "female") => {
                    setSelectedGender(value);
                    setSelectedVoice("");
                  }}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Age Group</Label>
                    <Select value={selectedAge} onValueChange={(value: "young" | "middle" | "senior") => {
                    setSelectedAge(value);
                    setSelectedVoice("");
                  }}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="young">Young (18-30)</SelectItem>
                        <SelectItem value="middle">Middle (30-50)</SelectItem>
                        <SelectItem value="senior">Senior (50+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50 max-h-64 overflow-y-auto">
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedGender && selectedAge && (
                  <div>
                    <Label>Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50 max-h-64 overflow-y-auto">
                        {voiceOptions[selectedGender][selectedAge].map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{voice.name}</span>
                              <span className="text-xs text-muted-foreground">{voice.trait}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Voice Model</Label>
                  <p className="text-sm text-muted-foreground">eleven_turbo_v2</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Language</Label>
                  <p className="text-sm text-muted-foreground">{selectedLanguage}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Version</Label>
                  <p className="text-sm text-muted-foreground">0</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Selected Voice ID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedVoice}</p>
                </div>
              </div>

              <div>
                <Label>Responsiveness</Label>
                <div className="mt-2">
                  <Slider value={responsiveness} onValueChange={setResponsiveness} min={0} max={2} step={0.1} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Slow (0)</span>
                    <span className="font-medium">{responsiveness[0]}</span>
                    <span>Fast (2)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="backchannel">Enable Backchannel</Label>
                  <Switch id="backchannel" checked={enableBackchannel} onCheckedChange={setEnableBackchannel} />
                </div>
                
                {enableBackchannel && (
                  <div>
                    <Label>Backchannel Frequency</Label>
                    <div className="mt-2">
                      <Slider value={backchannelFrequency} onValueChange={setBackchannelFrequency} min={0} max={2} step={0.1} className="w-full" />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Low (0)</span>
                        <span className="font-medium">{backchannelFrequency[0]}</span>
                        <span>High (2)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Testing Section */}
          <Card>
            <CardHeader>
              <CardTitle>Test & Deploy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ready to test your agent? Save your configuration first, then test or deploy.
              </p>
              <div className="flex space-x-4">
                <Button onClick={() => navigate(`/test-agent?agent_id=${existingAgentId || 'new'}&agent_name=${encodeURIComponent(agentName)}`)} className="flex-1" disabled={!agentName}>
                  Test Agent
                </Button>
                <Button onClick={() => navigate(`/demo-testing?agent_id=${existingAgentId || 'new'}&agent_name=${encodeURIComponent(agentName)}`)} variant="outline" className="flex-1" disabled={!agentName}>
                  Deploy Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button onClick={handleSave} className="bg-voice-accent hover:bg-voice-muted text-primary-foreground">
              {existingAgentId ? "Update Configuration" : "Save Configuration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfig;