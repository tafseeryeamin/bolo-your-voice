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
import { Loader2, Plus, Edit, Trash2, Calendar, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface DemoPost {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  youtube_url: string | null;
  is_published: boolean;
  created_at: string;
  user_id: string;
}

interface DemoFormData {
  title: string;
  description: string;
  image_url: string;
  youtube_url: string;
  is_published: boolean;
}

const AdminDemos = () => {
  const [demoPosts, setDemoPosts] = useState<DemoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<DemoPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DemoFormData>({
    title: "",
    description: "",
    image_url: "",
    youtube_url: "",
    is_published: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchDemoPosts();
  }, []);

  const fetchDemoPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemoPosts(data || []);
    } catch (error) {
      console.error('Error fetching demo posts:', error);
      toast({
        title: "Error",
        description: "Failed to load demo posts",
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
      youtube_url: "",
      is_published: false,
    });
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('demo_posts')
          .update({
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            youtube_url: formData.youtube_url || null,
            is_published: formData.is_published,
          })
          .eq('id', editingPost.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Demo post updated successfully",
        });
      } else {
        // Create new post
        const { error } = await supabase
          .from('demo_posts')
          .insert({
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            youtube_url: formData.youtube_url || null,
            is_published: formData.is_published,
            user_id: user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Demo post created successfully",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchDemoPosts();
    } catch (error) {
      console.error('Error saving demo post:', error);
      toast({
        title: "Error",
        description: "Failed to save demo post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post: DemoPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description || "",
      image_url: post.image_url || "",
      youtube_url: post.youtube_url || "",
      is_published: post.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demo post?")) return;

    try {
      const { error } = await supabase
        .from('demo_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Demo post deleted successfully",
      });
      
      fetchDemoPosts();
    } catch (error) {
      console.error('Error deleting demo post:', error);
      toast({
        title: "Error",
        description: "Failed to delete demo post",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (post: DemoPost) => {
    try {
      const { error } = await supabase
        .from('demo_posts')
        .update({ is_published: !post.is_published })
        .eq('id', post.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Demo post ${!post.is_published ? 'published' : 'unpublished'} successfully`,
      });
      
      fetchDemoPosts();
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Demo Management</h1>
            <p className="text-muted-foreground">Create and manage demo posts for the public demos page</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Demo Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Edit Demo Post" : "Create New Demo Post"}
                </DialogTitle>
                <DialogDescription>
                  Add images and YouTube embed links to showcase your demos.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter demo title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter demo description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    type="url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Publish immediately</Label>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingPost ? "Update" : "Create"} Demo Post
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Demo Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                {post.image_url && (
                  <div className="aspect-video bg-muted">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <Badge variant={post.is_published ? "default" : "secondary"} className="shrink-0">
                      {post.is_published ? (
                        <><Eye className="w-3 h-3 mr-1" />Published</>
                      ) : (
                        <><EyeOff className="w-3 h-3 mr-1" />Draft</>
                      )}
                    </Badge>
                  </div>
                  
                  {post.description && (
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={post.is_published ? "secondary" : "default"}
                      size="sm"
                      onClick={() => togglePublishStatus(post)}
                      className="shrink-0"
                    >
                      {post.is_published ? (
                        <><EyeOff className="w-3 h-3" /></>
                      ) : (
                        <><Eye className="w-3 h-3" /></>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {demoPosts.length === 0 && (
          <div className="text-center py-16">
            <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No demo posts yet</h3>
            <p className="text-muted-foreground mb-4">Create your first demo post to get started</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Demo Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDemos;