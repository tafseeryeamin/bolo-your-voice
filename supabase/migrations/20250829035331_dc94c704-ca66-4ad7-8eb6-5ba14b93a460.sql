-- Create widgets table to store widget configurations
CREATE TABLE public.widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Talk to AI',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#6366F1',
  secondary_color TEXT NOT NULL DEFAULT '#8B5CF6',
  position TEXT NOT NULL DEFAULT 'bottom-right',
  button_text TEXT NOT NULL DEFAULT 'Start a conversation',
  welcome_message TEXT NOT NULL DEFAULT 'Hi! How can I help you today?',
  offline_message TEXT NOT NULL DEFAULT 'We''re currently offline. Please leave a message!',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own widgets" 
ON public.widgets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own widgets" 
ON public.widgets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own widgets" 
ON public.widgets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own widgets" 
ON public.widgets 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all widgets" 
ON public.widgets 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_widgets_updated_at
BEFORE UPDATE ON public.widgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();