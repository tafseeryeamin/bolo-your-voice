-- Add foreign key constraints to establish proper relationships

-- Add foreign key from agents.user_id to profiles.id
ALTER TABLE public.agents 
ADD CONSTRAINT fk_agents_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key from user_roles.user_id to auth.users.id
ALTER TABLE public.user_roles 
ADD CONSTRAINT fk_user_roles_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key from activity_logs.user_id to auth.users.id
ALTER TABLE public.activity_logs 
ADD CONSTRAINT fk_activity_logs_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key from activity_logs.agent_id to agents.id
ALTER TABLE public.activity_logs 
ADD CONSTRAINT fk_activity_logs_agent_id 
FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;