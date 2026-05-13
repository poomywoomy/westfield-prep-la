import { Head } from "vite-react-ssg";
import { useLocation } from "react-router-dom";
import { getCanonicalUrl } from "@/utils/seo";

const normalizePathname = (pathname: string) => {
  if (pathname === "/") return pathname;

  return pathname.replace(/\/+$/, "");
};

const RouteCanonical = () => {
  const { pathname } = useLocation();
  const canonicalUrl = getCanonicalUrl(normalizePathname(pathname));
  return (
    <Head prioritizeSeoTags>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};

export default RouteCanonical;
