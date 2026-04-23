/**
 * Image optimization helpers for blog and content images.
 * Rewrites local /blog-images/*.{jpg,png} URLs to their WebP variants
 * and builds responsive srcSet/sizes attributes.
 *
 * Original .jpg/.png files are kept on disk as fallback so older
 * blog posts and external links continue to work.
 */

const BLOG_IMAGE_PATH = "/blog-images/";

const isBlogImage = (url: string): boolean => {
  if (!url) return false;
  // Only treat locally-hosted /blog-images/ assets as optimizable.
  // Remote URLs (e.g. Supabase Storage) don't have pre-generated WebP variants.
  if (/^https?:\/\//i.test(url)) return false;
  return url.includes(BLOG_IMAGE_PATH);
};

const swapExtToWebp = (url: string, suffix = ""): string => {
  return url.replace(/\.(jpe?g|png)(\?.*)?$/i, `${suffix}.webp$2`);
};

/**
 * Returns the optimized (WebP) URL for a given image when we have a
 * local WebP variant available. Falls back to the original URL otherwise.
 */
export const getOptimizedImageUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (!isBlogImage(url)) return url;
  if (/\.webp(\?.*)?$/i.test(url)) return url;
  return swapExtToWebp(url);
};

/**
 * Returns a `srcset` string with 800w + 1600w WebP variants when the URL
 * points at a /blog-images/ asset. Otherwise returns undefined so the
 * caller can omit the attribute.
 */
export const getResponsiveSrcSet = (url?: string | null): string | undefined => {
  if (!url || !isBlogImage(url)) return undefined;
  const small = swapExtToWebp(url, "-800w");
  const large = swapExtToWebp(url);
  return `${small} 800w, ${large} 1600w`;
};

/**
 * Sensible default `sizes` attribute for blog cards in a 3-column grid.
 */
export const getBlogImageSizes = (
  layout: "card" | "featured" | "hero" = "card"
): string => {
  switch (layout) {
    case "hero":
      return "100vw";
    case "featured":
      return "(min-width: 1024px) 1200px, 100vw";
    case "card":
    default:
      return "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
  }
};

/**
 * Build an inline onError handler that falls back from .webp to the
 * original .jpg/.png if the WebP variant is missing on disk.
 */
export const buildWebpFallbackOnError = (
  originalUrl?: string | null
): ((e: React.SyntheticEvent<HTMLImageElement>) => void) | undefined => {
  if (!originalUrl) return undefined;
  return (e) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    img.removeAttribute("srcset");
    img.src = originalUrl;
  };
};
