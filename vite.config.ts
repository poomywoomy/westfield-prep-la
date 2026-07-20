import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";
import type { OutputAsset, OutputBundle } from "rollup";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

const FAQ_SCHEMA_MARKER = "<!-- FAQ_ROUTE_SCHEMAS -->";
const FAQ_SCHEMA_ATTRIBUTE = "data-faq-route-schema";

const getFaqRouteSchemaHtml = () => {
  const faqPagePath = path.resolve(__dirname, "src/pages/FAQ.tsx");
  const faqPageSource = fs.readFileSync(faqPagePath, "utf8");
  const startNeedle = "  const faqCategories = ";
  const start = faqPageSource.indexOf(startNeedle);
  const end = faqPageSource.indexOf("\n\n  return (", start);

  if (start === -1 || end === -1) {
    throw new Error("Unable to extract FAQ categories for static FAQ schema source.");
  }

  const faqCategories = new Function(
    `return (${faqPageSource.slice(start + startNeedle.length, end)});`
  )() as Array<{
    title: string;
    questions: Array<{ question: string; answer: string }>;
  }>;

  return faqCategories
    .map((category) => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        name: `${category.title} FAQs`,
        mainEntity: category.questions.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };

      return `    <script type="application/ld+json" ${FAQ_SCHEMA_ATTRIBUTE}="true">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
    })
    .join("\n");
};

const injectFaqRouteSchemas = (html: string) => {
  if (html.includes(FAQ_SCHEMA_ATTRIBUTE)) return html;

  const schemaHtml = getFaqRouteSchemaHtml();
  if (html.includes(FAQ_SCHEMA_MARKER)) {
    return html.replace(FAQ_SCHEMA_MARKER, schemaHtml);
  }

  return html.replace("</head>", `${schemaHtml}\n  </head>`);
};

const faqStaticSourcePlugin = (): Plugin => ({
  name: "faq-static-source",
  transformIndexHtml: {
    order: "post" as const,
    handler(html: string, ctx: { path?: string }) {
      if (["/faq", "/faq/", "/faq.html"].includes(ctx.path || "")) {
        return injectFaqRouteSchemas(html);
      }

      return html;
    },
  },
  configureServer(server: ViteDevServer) {
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: (error?: Error) => void) => {
      const requestPath = (req.url || "").split("?")[0];

      if (!["/faq", "/faq/"].includes(requestPath)) {
        next();
        return;
      }

      try {
        const faqHtml = fs.readFileSync(path.resolve(__dirname, "faq.html"), "utf8");
        const transformedHtml = await server.transformIndexHtml(req.url || "/faq", faqHtml);

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(transformedHtml);
      } catch (error) {
        next(error as Error);
      }
    });
  },
  generateBundle(_options: unknown, bundle: OutputBundle) {
    const faqAsset = Object.values(bundle).find(
      (asset): asset is OutputAsset => asset.type === "asset" && asset.fileName === "faq.html"
    );

    if (faqAsset?.type === "asset") {
      this.emitFile({
        type: "asset",
        fileName: "faq/index.html",
        source: faqAsset.source,
      });
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    faqStaticSourcePlugin(),
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        faq: path.resolve(__dirname, "faq.html"),
      },
      output: {
        manualChunks: {
          // Core React
          'react-core': ['react', 'react-dom', 'react-router-dom'],

          // UI Components
          'ui-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-select',
            '@radix-ui/react-popover'
          ],

          // Form & Validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // Data Fetching
          'data': ['@tanstack/react-query', '@supabase/supabase-js'],

          // Icons
          'icons': ['lucide-react'],

          // Rich Text & Markdown
          'editor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-color',
            '@tiptap/extension-link'
          ],

          // Charts & Visualization
          'charts': ['recharts'],

          // Date & Time
          'date': ['date-fns', 'date-fns-tz', 'react-day-picker']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: mode === 'development',
    target: 'es2020',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query'
    ]
  }
}));
