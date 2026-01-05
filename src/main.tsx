import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);

// Initialize Web Vitals monitoring ONLY in development
if (import.meta.env.DEV) {
  import("./lib/webVitals").then(({ initWebVitals }) => {
    initWebVitals();
  });
}
