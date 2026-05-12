
CREATE TABLE public.gmail_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  body_html text NOT NULL DEFAULT '',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX gmail_signatures_one_default_per_user
  ON public.gmail_signatures(user_id) WHERE is_default;

ALTER TABLE public.gmail_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own signatures"
  ON public.gmail_signatures
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER gmail_signatures_set_updated_at
  BEFORE UPDATE ON public.gmail_signatures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
