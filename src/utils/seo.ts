export const getCanonicalUrl = (path: string): string => {
  const baseUrl = "https://westfieldprepcenter.com";
  return `${baseUrl}${path}`;
};

export const generateMetaTags = (
  title: string,
  description: string,
  path: string,
  imageUrl?: string
) => {
  const canonicalUrl = getCanonicalUrl(path);
  const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png";

  return {
    title,
    description,
    canonical: canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage: imageUrl || defaultImage,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl || defaultImage
  };
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};
