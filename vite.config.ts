import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
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
  },
  build: {
    rollupOptions: {
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
