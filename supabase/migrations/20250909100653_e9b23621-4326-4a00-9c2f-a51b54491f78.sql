-- Create demo_posts table for storing demo content
CREATE TABLE public.demo_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  youtube_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.demo_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for demo posts
CREATE POLICY "Anyone can view published demo posts" 
ON public.demo_posts 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all demo posts" 
ON public.demo_posts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create demo posts" 
ON public.demo_posts 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update demo posts" 
ON public.demo_posts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete demo posts" 
ON public.demo_posts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_demo_posts_updated_at
BEFORE UPDATE ON public.demo_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();