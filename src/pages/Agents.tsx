import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Bot, Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";

const Agents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/signin");
        return;
      }

      setUser(user);
      await fetchAgents(user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async (userId: string) => {
    try {
      const { data: agents, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Error",
          description: "Failed to fetch agents.",
          variant: "destructive",
        });
      } else {
        setAgents(agents || []);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Agent deleted successfully.",
      });

      // Refresh agents list
      if (user) {
        await fetchAgents(user.id);
      }
    } catch (error: any) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error",
        description: "Failed to delete agent.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <Bot className="w-8 h-8 mr-3 text-primary" />
              My Agents
            </h1>
            <p className="text-muted-foreground">Manage your voice AI agents.</p>
          </div>
          <Button
            onClick={() => navigate("/create-agent")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Agent
          </Button>
        </div>

        {agents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No agents yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first voice AI agent to get started.
              </p>
              <Button
                onClick={() => navigate("/create-agent")}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Agent
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-primary" />
                    {agent.name}
                  </CardTitle>
                  <CardDescription>
                    {agent.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div>Language: {agent.language}</div>
                    <div>Created: {new Date(agent.created_at).toLocaleDateString()}</div>
                    <div>Updated: {new Date(agent.updated_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/agent-config?id=${agent.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;