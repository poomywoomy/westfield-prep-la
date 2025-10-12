// File upload validation utility for security
// Prevents malicious file uploads and storage abuse

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validatePricingDocument = (file: File): FileValidationResult => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }
  
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only PDF, DOCX, and XLSX allowed' };
  }
  
  // Check extension
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Invalid file extension' };
  }
  
  // Check for suspicious patterns in filename
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return { valid: false, error: 'Invalid filename' };
  }
  
  return { valid: true };
};

export const validateImageFile = (file: File): FileValidationResult => {
  const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB for images
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image size exceeds 20MB limit' };
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid image type. Only JPEG, PNG, WEBP, and GIF allowed' };
  }
  
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return { valid: false, error: 'Invalid filename' };
  }
  
  return { valid: true };
};
