import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Initialize Web Vitals monitoring ONLY in development
if (import.meta.env.DEV) {
  import("./lib/webVitals").then(({ initWebVitals }) => {
    initWebVitals();
  });
}
