/**
 * Server-side input sanitization to prevent XSS attacks
 * Removes HTML tags and dangerous patterns from user input
 */

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi, // onclick, onerror, etc.
  /javascript:/gi,
  /data:text\/html/gi,
  /<embed\b/gi,
  /<object\b/gi,
];

/**
 * Sanitize a string by removing HTML tags and dangerous patterns
 */
export function sanitizeString(input: string): string {
  if (!input) return input;
  
  let sanitized = input;
  
  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }
  
  // Remove all HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitize an object's string fields recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as any;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : 
        typeof item === 'object' ? sanitizeObject(item) : 
        item
      ) as any;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize quantity inputs
 */
export function sanitizeQuantity(qty: number, fieldName: string = 'quantity'): number {
  if (!Number.isFinite(qty)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  if (!Number.isInteger(qty)) {
    throw new Error(`${fieldName} must be a whole number`);
  }
  
  if (qty < 1) {
    throw new Error(`${fieldName} must be at least 1`);
  }
  
  if (qty > 100000) {
    throw new Error(`${fieldName} cannot exceed 100,000 units`);
  }
  
  return qty;
}
