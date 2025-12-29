import { Helmet } from "react-helmet";
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
    <Helmet>
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
      {/* Microsoft Clarity */}
      <script>
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
