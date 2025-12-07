-- Add admin role for tafser.yeamin.tiu@gmail.com if not already exists
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user_id for this email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'tafser.yeamin.tiu@gmail.com';
  
  -- If user exists, add admin role if not already present
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;