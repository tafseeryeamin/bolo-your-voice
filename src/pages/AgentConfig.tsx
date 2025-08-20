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
import AgentTester from "@/components/AgentTester";

// Voice data with all available voices
const voices = [
  { name: "Adrian", trait: "American, Young, Retell", id: "11labs-Adrian" },
  { name: "Amritanshu (en-IN)", trait: "Indian, Middle Aged, Provider", id: "11labs-Amritanshu" },
  { name: "Amy (UK)", trait: "British, Young, Provider", id: "11labs-Amy" },
  { name: "Andrew", trait: "American, Young, Retell", id: "11labs-Andrew" },
  { name: "Anna", trait: "American, Young, Retell", id: "11labs-Anna" },
  { name: "Anthony", trait: "British, Middle Aged, Retell", id: "11labs-Anthony" },
  { name: "Billy", trait: "American, Young, Retell", id: "11labs-Billy" },
  { name: "Bing", trait: "American, Young, Retell", id: "11labs-Bing" },
  { name: "Brian", trait: "American, Young, Retell", id: "11labs-Brian" },
  { name: "Carola (de-DE)", trait: "German, Middle Aged, Provider", id: "11labs-Carola" },
  { name: "Charlie (en-AU)", trait: "Australian, Middle Aged, Provider", id: "11labs-charlie" },
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

const AgentConfig = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [existingAgentId, setExistingAgentId] = useState<string | null>(null);
  
  // Essential fields only
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("11labs-Amritanshu");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [responsiveness, setResponsiveness] = useState([1]);
  const [enableBackchannel, setEnableBackchannel] = useState(true);
  const [backchannelFrequency, setBackchannelFrequency] = useState([0.9]);
  const [retellAgentId, setRetellAgentId] = useState<string | null>(null);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  useEffect(() => {
    console.log("AgentConfig component mounted");
    
    // Check if we have an existing agent ID from URL params
    const agentId = searchParams.get('agent_id');
    const agentName = searchParams.get('agent_name');
    
    if (agentId) {
      setExistingAgentId(agentId);
      console.log("Found existing agent ID:", agentId);
      
      if (agentName) {
        setAgentName(decodeURIComponent(agentName));
      }
    }
  }, [searchParams]);


  const createRetellAgent = async () => {
    setIsCreatingAgent(true);
    try {
      console.log('Creating Retell agent...');
      
      // Call Supabase edge function to create Retell agent
      const { data, error } = await supabase.functions.invoke('create-retell-agent', {
        body: {
          agent_name: agentName,
          version: 0,
          response_engine: {
            type: "retell-llm",
            llm_id: "your_llm_id" // This would come from your LLM configuration
          },
          voice_id: selectedVoice,
          voice_model: "eleven_turbo_v2", 
          language: "en-US",
          responsiveness: responsiveness[0],
          enable_backchannel: enableBackchannel,
          backchannel_frequency: backchannelFrequency[0],
          system_prompt: agentPrompt
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setRetellAgentId(data.agent_id);
        toast({
          title: "Success",
          description: "Retell agent created successfully!",
        });
      } else {
        throw new Error(data.error || 'Failed to create Retell agent');
      }

    } catch (error) {
      console.error("Error creating Retell agent:", error);
      toast({
        title: "Error",
        description: `Failed to create Retell agent: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving agent configuration...");
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to save agents",
          variant: "destructive",
        });
        return;
      }

      // First create the Retell agent
      await createRetellAgent();

      const agentData = {
        name: agentName,
        user_id: user.id,
          voice_id: selectedVoice,
        language: 'en-US', 
        description: agentPrompt,
        prompt: agentPrompt,
        begin_message: null,
        response_engine: JSON.stringify({
          type: "retell-llm",
          version: 0,
          voice_model: "eleven_turbo_v2",
          responsiveness: responsiveness[0],
          enable_backchannel: enableBackchannel,
          backchannel_frequency: backchannelFrequency[0]
        }),
        llm_websocket_url: null
      };

      // Save to Supabase database
      let result;
      if (existingAgentId) {
        // Update existing agent
        result = await supabase
          .from('agents')
          .update(agentData)
          .eq('id', existingAgentId)
          .eq('user_id', user.id)
          .select();
      } else {
        // Create new agent
        result = await supabase
          .from('agents')
          .insert(agentData)
          .select();
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Log activity
      await supabase
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          agent_id: result.data[0].id,
          action: existingAgentId ? 'agent_updated' : 'agent_created',
          details: { agent_name: agentName }
        }]);

      toast({
        title: "Success",
        description: existingAgentId ? "Agent updated successfully!" : "Agent created successfully!",
      });

      // Don't redirect immediately, let user test the agent
      
    } catch (error) {
      console.error("Error saving agent configuration:", error);
      toast({
        title: "Error",
        description: `Failed to save configuration: ${error.message}`,
        variant: "destructive",
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

          {/* Voice & Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Mic className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Voice & Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Voice Selection</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a voice for your agent" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-card border-border z-50">
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{voice.name}</span>
                            <span className="text-xs text-muted-foreground">{voice.trait}</span>
                            <span className="text-xs text-muted-foreground font-mono">{voice.id}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Voice Model</Label>
                    <p className="text-sm text-muted-foreground">eleven_turbo_v2</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <p className="text-sm text-muted-foreground">en-US</p>
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
                    <Slider
                      value={responsiveness}
                      onValueChange={setResponsiveness}
                      min={0}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
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
                    <Switch
                      id="backchannel"
                      checked={enableBackchannel}
                      onCheckedChange={setEnableBackchannel}
                    />
                  </div>
                  
                  {enableBackchannel && (
                    <div>
                      <Label>Backchannel Frequency</Label>
                      <div className="mt-2">
                        <Slider
                          value={backchannelFrequency}
                          onValueChange={setBackchannelFrequency}
                          min={0}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>Low (0)</span>
                          <span className="font-medium">{backchannelFrequency[0]}</span>
                          <span>High (2)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Agent Component */}
          {retellAgentId && (
            <AgentTester 
              agentId={retellAgentId} 
              agentName={agentName}
            />
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button 
              onClick={handleSave} 
              disabled={isCreatingAgent}
              className="bg-voice-accent hover:bg-voice-muted text-primary-foreground"
            >
              {isCreatingAgent ? "Creating Agent..." : existingAgentId ? "Update Configuration" : "Save Configuration"}
            </Button>
            {retellAgentId && (
              <Button 
                onClick={() => navigate("/agents")}
                variant="outline"
              >
                Go to My Agents
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfig;