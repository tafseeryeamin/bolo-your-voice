import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Mic, Settings, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
interface Agent {
  id: string;
  name: string;
  voice: string;
  speaksFirst: string;
  aiFirstMessage?: string;
  createdAt: string;
}
const CreateAgent = () => {
  const [user, setUser] = useState<any>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/sign-in");
    } else {
      setUser(user);
      // Wait for user to be set, then load agents
      await loadAgents(user);
    }
  };

  const loadAgents = async (currentUser = user) => {
    try {
      if (!currentUser) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const { data: agents, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Error",
          description: "Failed to load agents",
          variant: "destructive",
        });
        return;
      }

      // Transform database agents to match the interface
      const transformedAgents = agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        voice: agent.voice_id || 'Unknown',
        speaksFirst: agent.begin_message ? 'ai' : 'human',
        aiFirstMessage: agent.begin_message,
        createdAt: agent.created_at
      }));

      setAgents(transformedAgents);
    } catch (error) {
      console.error("Error loading agents:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateNew = () => {
    navigate("/agent-config");
  };
  const handleEditAgent = (agentId: string) => {
    navigate(`/agent-config?id=${agentId}`);
  };
  const handleDeleteAgent = async (agentId: string) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete agents",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error deleting agent:", error);
        toast({
          title: "Error",
          description: "Failed to delete agent",
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          agent_id: agentId,
          action: 'agent_deleted',
          details: { agent_id: agentId }
        }]);

      setAgents(agents.filter(agent => agent.id !== agentId));
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Agents
              </h1>
              <p className="text-muted-foreground">
                Create and manage your AI voice agents
              </p>
            </div>
            
            <Button onClick={handleCreateNew} className="text-slate-900 text-base bg-gray-50">
              <Plus className="w-4 h-4 mr-2" />
              Create New Agent
            </Button>
          </div>

          {agents.length === 0 ? <Card className="text-center py-12">
              <CardContent>
                <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No agents yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create your first AI voice agent to get started
                </p>
                <Button onClick={handleCreateNew} className="bg-voice-accent hover:bg-voice-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(agent => <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground">
                        {agent.name}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAgent(agent.id)}>
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAgent(agent.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Voice:</span>
                        <Badge variant="secondary" className="ml-2">
                          {agent.voice}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Speaks First:</span>
                        <Badge variant={agent.speaksFirst === "ai" ? "default" : "outline"} className="ml-2">
                          {agent.speaksFirst === "ai" ? "AI" : "Human"}
                        </Badge>
                      </div>
                      
                      {agent.aiFirstMessage && <div>
                          <span className="text-sm text-muted-foreground block mb-1">First Message:</span>
                          <p className="text-sm text-foreground bg-muted p-2 rounded text-ellipsis overflow-hidden">
                            "{agent.aiFirstMessage}"
                          </p>
                        </div>}
                      
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Created: {new Date(agent.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </div>
      </main>
    </div>;
};
export default CreateAgent;