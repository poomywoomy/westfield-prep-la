const BLOG_IMAGE_PATH = "/blog-images/";
const isBlogImage = (url) => {
  if (!url) return false;
  if (/^https?:\/\//i.test(url)) return false;
  return url.includes(BLOG_IMAGE_PATH);
};
const swapExtToWebp = (url, suffix = "") => {
  return url.replace(/\.(jpe?g|png)(\?.*)?$/i, `${suffix}.webp$2`);
};
const getOptimizedImageUrl = (url) => {
  if (!url) return void 0;
  if (!isBlogImage(url)) return url;
  if (/\.webp(\?.*)?$/i.test(url)) return url;
  return swapExtToWebp(url);
};
const getResponsiveSrcSet = (url) => {
  if (!url || !isBlogImage(url)) return void 0;
  const small = swapExtToWebp(url, "-800w");
  const large = swapExtToWebp(url);
  return `${small} 800w, ${large} 1600w`;
};
const getBlogImageSizes = (layout = "card") => {
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
const buildWebpFallbackOnError = (originalUrl) => {
  if (!originalUrl) return void 0;
  return (e) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    img.removeAttribute("srcset");
    img.src = originalUrl;
  };
};
export {
  getResponsiveSrcSet as a,
  getBlogImageSizes as b,
  buildWebpFallbackOnError as c,
  getOptimizedImageUrl as g
};
