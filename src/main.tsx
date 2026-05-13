import "./ssr-polyfills";
import { ViteReactSSG } from "vite-react-ssg";
import routes from "./routes";
import "./index.css";

export const createRoot = ViteReactSSG({ routes });

// Initialize Web Vitals monitoring ONLY in development (browser only)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  import("./lib/webVitals").then(({ initWebVitals }) => {
    initWebVitals();
  });
}
