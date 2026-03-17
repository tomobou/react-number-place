import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    base: mode === "github" ? '/react-number-place/' : '/', 
  server: {
    open: true,
    host: "127.0.0.1",
    port: 3000, 
  },
  build: {
    outDir: 'build',
  },
  plugins: [react()],
}});
