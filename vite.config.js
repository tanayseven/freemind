import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
import { sveltePreprocess } from 'svelte-preprocess'


// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $lib: `${path.resolve(__dirname, 'src')}/lib`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    deps: {
      inline: ['@testing-library/svelte']
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
