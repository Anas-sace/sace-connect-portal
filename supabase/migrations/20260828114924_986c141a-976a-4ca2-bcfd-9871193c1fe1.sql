CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_type text NOT NULL,
  name text NOT NULL,
  phone_whatsapp text NOT NULL,
  email text NOT NULL,
  college text NOT NULL,
  is_demo boolean NOT NULL DEFAULT false,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX responses_submitted_at_idx ON public.responses (submitted_at DESC);

GRANT INSERT ON public.responses TO anon;
GRANT SELECT, INSERT ON public.responses TO authenticated;
GRANT ALL ON public.responses TO service_role;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a response" ON public.responses FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read responses" ON public.responses FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER responses_updated_at BEFORE UPDATE ON public.responses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.responses (program_type, name, phone_whatsapp, email, college, is_demo) VALUES
  ('Internship Program', 'Rahul Sharma', '+919876543210', 'rahul@example.com', 'ABC College', true),
  ('Immersion Program', 'Priya Patel', '+919876543211', 'priya@example.com', 'XYZ University', true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.responses;