import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";
import type { OutputAsset, OutputBundle } from "rollup";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import { BLOG_FAQ_OVERRIDES } from "./src/data/blogFaqOverrides";

const FAQ_SCHEMA_MARKER = "<!-- FAQ_ROUTE_SCHEMAS -->";
const FAQ_SCHEMA_ATTRIBUTE = "data-faq-route-schema";
const STATIC_BLOG_SLUGS = Object.keys(BLOG_FAQ_OVERRIDES);
const blogPathToSlug = (requestPath: string) => {
  const normalized = requestPath.replace(/\/$/, "");
  return STATIC_BLOG_SLUGS.find((slug) => normalized === `/blog/${slug}`);
};
const BLOG_SCHEMA_ATTRIBUTE = "data-blog-faq-schema";

const getBlogFaqSchemaHtml = (slug: string) => {
  const faqs = BLOG_FAQ_OVERRIDES[slug];
  if (!faqs) throw new Error(`Missing FAQ schema override for ${slug}.`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return `    <script type="application/ld+json" ${BLOG_SCHEMA_ATTRIBUTE}="true">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
};

const injectBlogFaqSchema = (html: string, slug: string) => {
  if (html.includes(BLOG_SCHEMA_ATTRIBUTE)) return html;
  return html.replace("</head>", `${getBlogFaqSchemaHtml(slug)}\n  </head>`);
};

const getFaqRouteSchemaHtml = () => {
  const faqPagePath = path.resolve(__dirname, "src/pages/FAQ.tsx");
  const faqPageSource = fs.readFileSync(faqPagePath, "utf8");
  const startNeedle = "  const faqCategories = ";
  const start = faqPageSource.indexOf(startNeedle);
  const end = faqPageSource.indexOf("\n\n  return (", start);

  if (start === -1 || end === -1) {
    throw new Error("Unable to extract FAQ categories for static FAQ schema source.");
  }

  const faqCategoriesSource = faqPageSource
    .slice(start + startNeedle.length, end)
    .trim()
    .replace(/;$/, "");

  const faqCategories = new Function(`return (${faqCategoriesSource});`)() as Array<{
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
      const ctxSlug = blogPathToSlug((ctx.path || "").split("?")[0]);
      if (ctxSlug) {
        return injectBlogFaqSchema(html, ctxSlug);
      }

      if (["/faq", "/faq/", "/faq.html"].includes(ctx.path || "")) {
        return injectFaqRouteSchemas(html);
      }

      return html;
    },
  },
  configureServer(server: ViteDevServer) {
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: (error?: Error) => void) => {
      const requestPath = (req.url || "").split("?")[0];

      const blogSlug = blogPathToSlug(requestPath);
      if (blogSlug) {
        try {
          const blogHtml = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
          const transformedHtml = await server.transformIndexHtml(req.url || `/blog/${blogSlug}`, blogHtml);

          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(transformedHtml);
        } catch (error) {
          next(error as Error);
        }
        return;
      }

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

    const indexAsset = Object.values(bundle).find(
      (asset): asset is OutputAsset => asset.type === "asset" && asset.fileName === "index.html"
    );

    if (indexAsset?.type === "asset") {
      const source = typeof indexAsset.source === "string"
        ? indexAsset.source
        : Buffer.from(indexAsset.source).toString("utf8");

      for (const slug of STATIC_BLOG_SLUGS) {
        this.emitFile({
          type: "asset",
          fileName: `blog/${slug}/index.html`,
          source: injectBlogFaqSchema(source, slug),
        });
      }
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
