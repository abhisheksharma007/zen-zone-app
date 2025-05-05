import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Set NODE_ENV based on mode
  process.env.NODE_ENV = mode;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    build: {
      // Production build optimizations
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production' && env.VITE_LOG_LEVEL === 'error', // Only remove console.logs in production if log level is error
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-icons', '@radix-ui/react-slot'],
          },
        },
      },
      // Enable source maps in production for better error tracking
      sourcemap: mode === 'production' && env.VITE_ENABLE_ERROR_TRACKING === 'true',
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __ENABLE_ANALYTICS__: env.VITE_ENABLE_ANALYTICS === 'true',
      __ENABLE_ERROR_TRACKING__: env.VITE_ENABLE_ERROR_TRACKING === 'true',
      // Email Configuration
      __EMAIL_FROM__: JSON.stringify(env.VITE_EMAIL_FROM),
      __SMTP_HOST__: JSON.stringify(env.VITE_ZOHO_MAIL_HOST),
      __SMTP_PORT__: JSON.stringify(env.VITE_ZOHO_MAIL_PORT),
      __SMTP_USER__: JSON.stringify(env.VITE_ZOHO_MAIL_USER),
      __SMTP_PASS__: JSON.stringify(env.VITE_ZOHO_MAIL_PASS),
    },
  };
});
