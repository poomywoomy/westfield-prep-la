import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Current and new password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Password strength validation (server-side enforcement)
    if (newPassword.length < 12) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 12 characters long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(newPassword)) {
      return new Response(
        JSON.stringify({ error: 'Password must contain uppercase, lowercase, number, and special character' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limiting for password changes
    const { data: rateLimitData, error: rateLimitError } = await supabaseAdmin.functions.invoke(
      'check-rate-limit',
      {
        body: {
          key: `password_change_${user.id}`,
          maxAttempts: 3,
          windowMinutes: 60,
        },
      }
    );

    if (rateLimitError || !rateLimitData?.allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many password change attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (verifyError) {
      console.error('Current password verification failed');
      return new Response(
        JSON.stringify({ error: 'Current password is incorrect' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update password using admin client
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update failed:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update password' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Revoke all sessions globally after password change
    const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(
      user.id,
      'global'
    );

    if (signOutError) {
      console.error('Failed to revoke sessions:', signOutError);
      // Log but don't fail - password was changed successfully
    } else {
      console.log(`All sessions revoked for user ${user.id} after password change`);
    }

    // Log password change to audit log
    await supabaseAdmin.from('audit_log').insert({
      user_id: user.id,
      action: 'PASSWORD_CHANGE',
      table_name: 'auth.users',
      new_data: {
        timestamp: new Date().toISOString(),
        ip_hash: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown',
      }
    });

    // Clear password expiration and activate account (for clients with temporary passwords)
    const { error: clearExpiryError } = await supabaseAdmin.from('clients')
      .update({ password_expires_at: null, status: 'active' })
      .eq('user_id', user.id);

    // Don't fail the whole operation if this fails (user might not be a client)
    if (clearExpiryError) {
      console.warn('Could not clear password expiration (user may not be a client):', clearExpiryError.message);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Password updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Password change error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while changing password' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
