
-- Fix search_path on existing function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$function$;
