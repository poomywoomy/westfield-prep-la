import { Helmet } from "@/lib/helmet-compat";
import { useLocation } from "@/lib/router-compat";
import { getCanonicalUrl } from "@/utils/seo";

const normalizePathname = (pathname: string) => {
  if (pathname === "/") return pathname;

  return pathname.replace(/\/+$/, "");
};

const RouteCanonical = () => {
  const { pathname } = useLocation();
  const canonicalUrl = getCanonicalUrl(normalizePathname(pathname));
  return (
    <Helmet prioritizeSeoTags>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default RouteCanonical;
