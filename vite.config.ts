import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    // Remove HTTPS to avoid certificate issues
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      // Proxy for static images from backend
      '/images': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
