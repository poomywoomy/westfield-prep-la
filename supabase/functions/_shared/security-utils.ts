/**
 * Shared security utilities for edge functions
 */

// Common disposable email domains
const DISPOSABLE_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'maildrop.cc', 'temp-mail.org', 'getnada.com',
  'trashmail.com', 'fakeinbox.com', 'yopmail.com', 'sharklasers.com',
  'mailnesia.com', 'mintemail.com', 'mytrashmail.com', 'mohmal.com',
  'spam4.me', 'tempr.email', 'dispostable.com', 'emailondeck.com'
];

/**
 * Check if email uses a disposable domain
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Validate honeypot field (should be empty)
 * @param honeypotValue The value from the honeypot field
 * @returns true if honeypot is valid (empty), false if spam detected
 */
export function validateHoneypot(honeypotValue: string | undefined | null): boolean {
  // Honeypot should be empty - if it has a value, it's likely a bot
  return !honeypotValue || honeypotValue.trim() === '';
}

/**
 * Check rate limit using Supabase check-rate-limit function
 */
export async function checkRateLimit(
  supabaseUrl: string,
  supabaseServiceKey: string,
  key: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean; error?: string }> {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/check-rate-limit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        key,
        maxAttempts,
        windowMinutes,
      }),
    });

    if (!response.ok) {
      console.error('Rate limit check failed:', await response.text());
      return { allowed: true }; // Fail open - don't block legitimate users
    }

    const data = await response.json();
    return { allowed: data.allowed };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true }; // Fail open
  }
}
