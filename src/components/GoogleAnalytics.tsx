import { Head } from "vite-react-ssg";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const GoogleAnalytics = () => {
  const { user } = useAuth();
  const [shouldLoad, setShouldLoad] = useState(false);

  // Only load analytics when user is NOT logged in
  useEffect(() => {
    if (!user) {
      // Defer analytics loading until after page interactive
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setShouldLoad(true), { timeout: 2000 });
      } else {
        setTimeout(() => setShouldLoad(true), 2000);
      }
    }
  }, [user]);

  if (user || !shouldLoad) {
    return null;
  }

  return (
    <Head>
      {/* Google Analytics 4 */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-H0QHBLGNQC"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H0QHBLGNQC', {
            'send_page_view': false
          });
        `}
      </script>
      {/* Microsoft Clarity — disabled until a real project ID is configured */}
    </Head>
  );
};

export default GoogleAnalytics;
