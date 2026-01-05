-- Create supported languages table
CREATE TABLE public.supported_languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  flag_emoji TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.supported_languages ENABLE ROW LEVEL SECURITY;

-- Everyone can read supported languages
CREATE POLICY "Anyone can read supported languages"
ON public.supported_languages
FOR SELECT
TO public
USING (true);

-- Only admins can manage languages
CREATE POLICY "Admins can manage languages"
ON public.supported_languages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Pre-populate with English and Thai
INSERT INTO public.supported_languages (code, name, native_name, flag_emoji) VALUES
  ('en', 'English', 'English', '🇺🇸'),
  ('th', 'Thai', 'ไทย', '🇹🇭');

-- Create translations cache table
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  target_language TEXT NOT NULL REFERENCES public.supported_languages(code),
  translated_text TEXT NOT NULL,
  is_reviewed BOOLEAN DEFAULT false,
  manually_edited BOOLEAN DEFAULT false,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_hash, target_language)
);

-- Create index for fast lookups
CREATE INDEX idx_translations_lookup ON public.translations(source_hash, target_language);
CREATE INDEX idx_translations_language ON public.translations(target_language);
CREATE INDEX idx_translations_reviewed ON public.translations(is_reviewed);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Everyone can read translations (for displaying content)
CREATE POLICY "Anyone can read translations"
ON public.translations
FOR SELECT
TO public
USING (true);

-- Only admins can insert/update/delete translations
CREATE POLICY "Admins can manage translations"
ON public.translations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow edge functions to insert translations (service role)
CREATE POLICY "Service role can manage translations"
ON public.translations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();