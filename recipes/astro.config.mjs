import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'http://localhost:4321',
  server: {
    port: 4321,
  },
  integrations: [preact()],
});
