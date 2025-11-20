import { supabase } from "@/integrations/supabase/client";

/**
 * Re-signs a photo URL or storage path to generate a fresh signed URL.
 * Handles both legacy signed URLs and storage paths.
 */
export async function resignPhotoUrl(urlOrPath: string): Promise<string> {
  // If it's already an absolute URL that's not from Supabase storage, return as-is
  if (urlOrPath.startsWith('http') && !urlOrPath.includes('/storage/v1/object/sign/')) {
    return urlOrPath;
  }

  let storagePath = urlOrPath;

  // If it's a signed URL, extract the path
  if (urlOrPath.includes('/storage/v1/object/sign/')) {
    try {
      const urlObj = new URL(urlOrPath);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/sign\/qc-images\/(.+)/);
      if (pathMatch && pathMatch[1]) {
        storagePath = pathMatch[1];
      }
    } catch (e) {
      console.error('Failed to parse photo URL:', e);
      return urlOrPath; // Return original if parsing fails
    }
  }

  // Generate a fresh signed URL (5 minutes expiry for better security)
  try {
    const { data, error } = await supabase.storage
      .from('qc-images')
      .createSignedUrl(storagePath, 300); // Reduced from 1 hour to 5 minutes

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Failed to resign photo URL:', error);
    return urlOrPath; // Return original if re-signing fails
  }
}

/**
 * Re-signs an array of photo URLs/paths
 */
export async function resignPhotoUrls(urlsOrPaths: string[]): Promise<string[]> {
  return Promise.all(urlsOrPaths.map(resignPhotoUrl));
}
