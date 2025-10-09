-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'client');
CREATE TYPE public.channel_type AS ENUM ('amazon', 'walmart', 'shopify', 'ebay', 'other');
CREATE TYPE public.receiving_format AS ENUM ('pallets', 'cartons', 'both');
CREATE TYPE public.billing_frequency AS ENUM ('pay_as_go', 'end_of_month');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  channels channel_type[] NOT NULL DEFAULT '{}',
  estimated_units_per_month INTEGER,
  receiving_format receiving_format,
  extra_prep BOOLEAN DEFAULT false,
  storage BOOLEAN DEFAULT false,
  storage_units_per_month INTEGER,
  billing_frequency billing_frequency DEFAULT 'end_of_month',
  pricing_active BOOLEAN DEFAULT false,
  temp_password TEXT,
  password_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create custom_pricing table
CREATE TABLE public.custom_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  price_per_unit DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, service_name)
);

ALTER TABLE public.custom_pricing ENABLE ROW LEVEL SECURITY;

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  quote_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create billing_charges table
CREATE TABLE public.billing_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  charge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  billing_month DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.billing_charges ENABLE ROW LEVEL SECURITY;

-- Create qc_images table
CREATE TABLE public.qc_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  upload_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days')
);

ALTER TABLE public.qc_images ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for clients
CREATE POLICY "Admins can manage all clients"
  ON public.clients FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their own data"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can update their own profile"
  ON public.clients FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for custom_pricing
CREATE POLICY "Admins can manage all pricing"
  ON public.custom_pricing FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their own pricing"
  ON public.custom_pricing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = custom_pricing.client_id
        AND clients.user_id = auth.uid()
    )
  );

-- RLS Policies for quotes
CREATE POLICY "Admins can manage all quotes"
  ON public.quotes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their own quotes"
  ON public.quotes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = quotes.client_id
        AND clients.user_id = auth.uid()
    )
  );

-- RLS Policies for billing_charges
CREATE POLICY "Admins can manage all billing charges"
  ON public.billing_charges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their own billing charges"
  ON public.billing_charges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = billing_charges.client_id
        AND clients.user_id = auth.uid()
    )
  );

-- RLS Policies for qc_images
CREATE POLICY "Admins can manage all QC images"
  ON public.qc_images FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their own QC images"
  ON public.qc_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = qc_images.client_id
        AND clients.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_pricing_updated_at
  BEFORE UPDATE ON public.custom_pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-delete expired QC images
CREATE OR REPLACE FUNCTION public.delete_expired_qc_images()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.qc_images
  WHERE expires_at < now();
END;
$$;