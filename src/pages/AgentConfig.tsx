import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Webhook, Wrench, Mic, Plus, Trash2 } from "lucide-react";
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

interface Tool {
  id: string;
  name: string;
  description: string;
}

const AgentConfig = () => {
  const [selectedVoice, setSelectedVoice] = useState("");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);

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

  const handleSave = () => {
    const config = {
      agentPrompt,
      selectedVoice,
      webhookUrl,
      tools,
    };
    console.log("Agent Configuration:", config);
    // Here you would typically save to your backend
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
          {/* Agent Prompt Section */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <Settings className="w-5 h-5 text-voice-accent mr-2" />
              <CardTitle>Agent Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                  <Label htmlFor="voice">Select Voice</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a voice for your agent" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-card border-border">
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{voice.name}</span>
                            <span className="text-sm text-muted-foreground">{voice.trait}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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