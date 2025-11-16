-- Add agent_id column to demo_posts table for ElevenLabs integration
ALTER TABLE public.demo_posts 
ADD COLUMN IF NOT EXISTS agent_id text;

-- Update column comments for clarity
COMMENT ON COLUMN public.demo_posts.title IS 'Company name for portfolio';
COMMENT ON COLUMN public.demo_posts.image_url IS 'Company logo URL';
COMMENT ON COLUMN public.demo_posts.agent_id IS 'ElevenLabs agent ID for voice conversations';