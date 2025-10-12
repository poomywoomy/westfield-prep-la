// Error sanitization utility for security
// Prevents exposure of sensitive internal information to users

const GENERIC_ERROR_MESSAGES: Record<string, string> = {
  'auth': 'Authentication failed. Please check your credentials and try again.',
  'database': 'Unable to process your request. Please try again later.',
  'network': 'Connection error. Please check your internet connection.',
  'permission': 'You do not have permission to perform this action.',
  'validation': 'Invalid input provided. Please check your data.',
  'storage': 'File operation failed. Please try again.',
  'default': 'An unexpected error occurred. Please contact support if this persists.'
};

export const sanitizeError = (
  error: any, 
  category: keyof typeof GENERIC_ERROR_MESSAGES = 'default'
): string => {
  // Log full error for debugging in development only
  if (import.meta.env.DEV) {
    console.error('Detailed error:', error);
  }
  
  // Return generic message to user
  return GENERIC_ERROR_MESSAGES[category];
};
