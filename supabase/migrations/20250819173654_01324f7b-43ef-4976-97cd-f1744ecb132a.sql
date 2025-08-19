-- Create agents table for storing user-created agents
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  voice_id TEXT,
  prompt TEXT,
  language TEXT DEFAULT 'en',
  response_engine TEXT,
  llm_websocket_url TEXT,
  begin_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create policies for agents
CREATE POLICY "Users can view their own agents" 
ON public.agents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents" 
ON public.agents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
ON public.agents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
ON public.agents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admin policy to view all agents
CREATE POLICY "Admins can view all agents" 
ON public.agents 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create activity logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for activity logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for activity logs
CREATE POLICY "Users can view their own activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admin policy to view all activity logs
CREATE POLICY "Admins can view all activity logs" 
ON public.activity_logs 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates on agents
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();