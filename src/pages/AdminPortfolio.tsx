import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Calendar, Eye, EyeOff, Mic, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  agent_id: string | null;
  is_published: boolean;
  created_at: string;
  user_id: string;
}

interface PortfolioFormData {
  title: string;
  description: string;
  image_url: string;
  agent_id: string;
  is_published: boolean;
}

const AdminPortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: "",
    description: "",
    image_url: "",
    agent_id: "",
    is_published: false,
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      agent_id: "",
      is_published: false,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (editingItem) {
        const { error } = await supabase
          .from('demo_posts')
          .update({
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            agent_id: formData.agent_id || null,
            is_published: formData.is_published,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "AI Agent updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('demo_posts')
          .insert({
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            agent_id: formData.agent_id || null,
            is_published: formData.is_published,
            user_id: user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "AI Agent created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPortfolioItems();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save AI Agent",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      agent_id: item.agent_id || "",
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this AI Agent?")) return;

    try {
      const { error } = await supabase
        .from('demo_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI Agent deleted successfully",
      });
      
      fetchPortfolioItems();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to delete AI Agent",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (item: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from('demo_posts')
        .update({ is_published: !item.is_published })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `AI Agent ${!item.is_published ? 'published' : 'unpublished'} successfully`,
      });
      
      fetchPortfolioItems();
    } catch (error) {
      console.error('Error updating publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update publish status",
        variant: "destructive",
      });
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-voice-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-voice-accent/20">
              <Mic className="w-6 h-6 text-voice-accent" />
            </div>
            <h1 className="text-4xl font-bold">Manage AI Agents</h1>
          </div>
          <p className="text-muted-foreground">
            Create and manage voice AI agents with ElevenLabs integration for the public demo page
          </p>
        </div>

        <div className="mb-8">
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-voice-accent hover:bg-voice-accent/90">
                <Plus className="w-4 h-4" />
                Add AI Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit AI Agent" : "Create AI Agent"}
                </DialogTitle>
                <DialogDescription>
                  Add company information and ElevenLabs agent ID for voice conversations
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Company/Agent Name *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter company or agent name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the AI agent"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Logo/Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent_id">ElevenLabs Agent ID *</Label>
                  <Input
                    id="agent_id"
                    value={formData.agent_id}
                    onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                    placeholder="agent_xxxxxxxxxxxxx"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Get your agent ID from your ElevenLabs Conversational AI dashboard
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published" className="cursor-pointer">
                    Publish immediately (visible on demo page)
                  </Label>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={submitting} className="bg-voice-accent hover:bg-voice-accent/90">
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingItem ? "Update Agent" : "Create Agent"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {portfolioItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-voice-accent/20 mb-4">
                <Mic className="w-8 h-8 text-voice-accent" />
              </div>
              <p className="text-muted-foreground mb-4">No AI agents yet</p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                Create your first AI Agent
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
                  {item.image_url && (
                    <div className="aspect-video bg-muted">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant={item.is_published ? "default" : "secondary"} className={item.is_published ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}>
                        {item.is_published ? (
                          <><Eye className="w-3 h-3 mr-1" /> Live</>
                        ) : (
                          <><EyeOff className="w-3 h-3 mr-1" /> Draft</>
                        )}
                      </Badge>
                    </div>
                    {item.description && (
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                    {item.agent_id && (
                      <p className="text-xs text-voice-accent font-mono mt-2 truncate">
                        Agent: {item.agent_id}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublishStatus(item)}
                        className="flex-1"
                      >
                        {item.is_published ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                        {item.is_published ? 'Hide' : 'Publish'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;