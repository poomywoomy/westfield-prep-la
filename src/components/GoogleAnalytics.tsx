import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";

const GoogleAnalytics = () => {
  const { user } = useAuth();

  // Only load Google Analytics when user is NOT logged in
  if (user) {
    return null;
  }

  return (
    <Helmet>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-H0QHBLGNQC"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H0QHBLGNQC');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
