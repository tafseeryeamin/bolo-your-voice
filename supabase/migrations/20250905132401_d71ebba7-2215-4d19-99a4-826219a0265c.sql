-- Add user_id column to notifications table to enable user-specific access
ALTER TABLE public.notifications ADD COLUMN user_id uuid;

-- Create index for better performance on user_id lookups
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Update RLS policy to allow users to view their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Allow users to update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));