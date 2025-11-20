import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Magic bytes for image validation
const MAGIC_BYTES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
  'image/gif': [0x47, 0x49, 0x46],
} as const;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB (matches fileValidation.ts)

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file based on:
 * 1. File size
 * 2. Declared MIME type
 * 3. Magic bytes (actual file content)
 * 4. Filename for path traversal
 */
function validateFile(
  fileBuffer: ArrayBuffer, 
  fileName: string, 
  mimeType: string, 
  fileSize: number
): ValidationResult {
  // Check file size
  if (fileSize > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds 20MB limit' };
  }
  
  // Check MIME type
  if (!ALLOWED_TYPES.includes(mimeType as any)) {
    return { 
      valid: false, 
      error: `Invalid file type. Only JPEG, PNG, WEBP, and GIF allowed. Got: ${mimeType}` 
    };
  }
  
  // Check for path traversal in filename
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { valid: false, error: 'Invalid filename: path traversal detected' };
  }
  
  // Validate magic bytes
  const bytes = new Uint8Array(fileBuffer);
  const magicBytes = MAGIC_BYTES[mimeType as keyof typeof MAGIC_BYTES];
  
  if (magicBytes) {
    const matches = magicBytes.every((byte, index) => bytes[index] === byte);
    if (!matches) {
      return { 
        valid: false, 
        error: 'File content does not match declared type (magic bytes mismatch)' 
      };
    }
  }
  
  return { valid: true };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get file metadata
    const fileName = file.name;
    const mimeType = file.type;
    const fileSize = file.size;

    // Read file buffer
    const fileBuffer = await file.arrayBuffer();

    // Validate file
    const validation = validateFile(fileBuffer, fileName, mimeType, fileSize);

    if (!validation.valid) {
      console.warn('File validation failed:', validation.error, {
        fileName,
        mimeType,
        fileSize,
      });
      
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: validation.error 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File validation successful:', {
      fileName,
      mimeType,
      fileSize,
    });

    return new Response(
      JSON.stringify({ 
        valid: true,
        fileName,
        mimeType,
        fileSize 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-file-upload:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
