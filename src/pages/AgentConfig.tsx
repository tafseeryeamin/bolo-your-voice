import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Play, User, Mic } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AgentConfig = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [existingAgentId, setExistingAgentId] = useState<string | null>(null);
  
  // Essential fields only
  const [agentName, setAgentName] = useState("");
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
      // Call webhook to create Retell agent
      const webhookPayload = {
        agent_name: agentName,
        version: 0,
        response_engine: {
          type: "retell-llm",
          llm_id: "your_llm_id" // This would come from your webhook configuration
        },
        voice_id: "11labs-Amritanshu",
        voice_model: "eleven_turbo_v2", 
        language: "en-US",
        responsiveness: responsiveness[0],
        enable_backchannel: enableBackchannel,
        backchannel_frequency: backchannelFrequency[0],
        system_prompt: agentPrompt
      };

      const response = await fetch('YOUR_WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create Retell agent');
      }

      const result = await response.json();
      setRetellAgentId(result.agent_id);

      toast({
        title: "Success",
        description: "Retell agent created successfully!",
      });

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
        voice_id: "11labs-Amritanshu",
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

          {/* Agent Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Mic className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Agent Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Voice</Label>
                    <p className="text-sm text-muted-foreground">11labs-Amritanshu</p>
                  </div>
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
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                <Mic className="w-5 h-5 text-voice-accent mr-2" />
                <CardTitle>Test Your Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <Label className="text-sm font-medium">Agent ID</Label>
                    <p className="text-sm text-muted-foreground font-mono">{retellAgentId}</p>
                  </div>
                  <Button 
                    onClick={() => {
                      // Add test functionality here
                      toast({
                        title: "Test Agent",
                        description: "Testing functionality will be implemented with Retell API integration",
                      });
                    }}
                    className="w-full"
                  >
                    Test Agent Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
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