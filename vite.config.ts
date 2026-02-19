import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: '/',
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || 'https://uiolzgpqxvswwslkmpip.supabase.co'),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || 'sb_publishable_YwBdOXh2_3imaD8o1wyT3g_U-1I3Isf'),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      port: 3000,
      host: true,
      hmr: { overlay: false }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: false
    }
  };
});