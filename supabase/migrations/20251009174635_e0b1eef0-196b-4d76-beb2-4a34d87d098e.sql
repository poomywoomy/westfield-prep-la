-- Make client_id nullable in quotes table to allow saving quotes without client assignment
ALTER TABLE public.quotes 
ALTER COLUMN client_id DROP NOT NULL;