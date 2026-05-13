import { s as supabase } from "../main.mjs";
async function resignPhotoUrl(urlOrPath) {
  if (urlOrPath.startsWith("http") && !urlOrPath.includes("/storage/v1/object/sign/")) {
    return urlOrPath;
  }
  let storagePath = urlOrPath;
  if (urlOrPath.includes("/storage/v1/object/sign/")) {
    try {
      const urlObj = new URL(urlOrPath);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/sign\/qc-images\/(.+)/);
      if (pathMatch && pathMatch[1]) {
        storagePath = pathMatch[1];
      }
    } catch (e) {
      console.error("Failed to parse photo URL:", e);
      return urlOrPath;
    }
  }
  try {
    const { data, error } = await supabase.storage.from("qc-images").createSignedUrl(storagePath, 3600);
    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error("Failed to resign photo URL:", error);
    return urlOrPath;
  }
}
async function resignPhotoUrls(urlsOrPaths) {
  return Promise.all(urlsOrPaths.map(resignPhotoUrl));
}
export {
  resignPhotoUrls as r
};
