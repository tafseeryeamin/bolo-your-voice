-- Update the handle_new_user function to properly handle full_name from signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Extract first and last name from full_name if available
  DECLARE
    full_name_value TEXT;
    first_name_value TEXT;
    last_name_value TEXT;
  BEGIN
    -- Get full_name from metadata
    full_name_value := NEW.raw_user_meta_data ->> 'full_name';
    
    -- Split full_name into first_name and last_name
    IF full_name_value IS NOT NULL AND full_name_value != '' THEN
      -- Split on first space
      first_name_value := split_part(full_name_value, ' ', 1);
      last_name_value := CASE 
        WHEN position(' ' in full_name_value) > 0 
        THEN substring(full_name_value from position(' ' in full_name_value) + 1)
        ELSE NULL
      END;
    ELSE
      -- Fallback to individual fields if available
      first_name_value := NEW.raw_user_meta_data ->> 'first_name';
      last_name_value := NEW.raw_user_meta_data ->> 'last_name';
    END IF;
    
    -- Insert profile
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
      NEW.id, 
      NEW.email,
      first_name_value,
      last_name_value
    );
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    -- Special case: assign admin role to specific email
    IF NEW.email = 'tafser.yeamin.tiu@gmail.com' THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'admin');
    END IF;
    
    RETURN NEW;
  END;
END;
$$;

-- Recreate the trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();