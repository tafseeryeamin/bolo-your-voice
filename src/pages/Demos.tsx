import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, Calendar, User } from "lucide-react";
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

const Demos = () => {
  const [demoPosts, setDemoPosts] = useState<DemoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDemoPosts();
  }, []);

  const fetchDemoPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('is_published', true)
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

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Live Demos
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Explore real-world implementations of our AI voice solutions. See how businesses are transforming customer interactions with intelligent voice technology.
          </motion.p>
        </div>
      </section>

      {/* Demo Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {demoPosts.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No demos available yet</h3>
              <p className="text-muted-foreground">Check back soon for exciting demo content!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {demoPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {post.image_url && (
                      <div className="aspect-video bg-muted">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                          {post.description && (
                            <CardDescription className="text-base">
                              {post.description}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          <Play className="w-3 h-3 mr-1" />
                          Demo
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>

                    {post.youtube_url && (
                      <CardContent className="pt-0">
                        <div className="aspect-video rounded-lg overflow-hidden bg-black">
                          <iframe
                            src={getYouTubeEmbedUrl(post.youtube_url)}
                            title={post.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Demos;