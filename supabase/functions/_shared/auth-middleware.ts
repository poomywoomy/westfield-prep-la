import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

/**
 * Verify that the request has a valid JWT and return the authenticated user
 */
export async function requireAuth(req: Request): Promise<{ user: any; supabase: SupabaseClient }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Authentication required');
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid authentication token');
  }

  return { user, supabase };
}

/**
 * Verify that the authenticated user has admin role
 */
export async function requireAdmin(req: Request): Promise<{ user: any; supabase: SupabaseClient }> {
  const { user, supabase } = await requireAuth(req);
  
  const { data: roleData, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  if (error || !roleData || roleData.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return { user, supabase };
}

/**
 * Get client_id for the authenticated user
 */
export async function getClientId(supabase: SupabaseClient, userId: string): Promise<string> {
  const { data: client, error } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (error || !client) {
    throw new Error('No client profile found');
  }

  return client.id;
}
