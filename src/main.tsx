import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </HelmetProvider>
);

// Initialize Web Vitals monitoring ONLY in development
if (import.meta.env.DEV) {
  import("./lib/webVitals").then(({ initWebVitals }) => {
    initWebVitals();
  });
}
