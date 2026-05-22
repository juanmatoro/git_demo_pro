import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://juanmatoro.github.io',
  base: '/git_demo_pro',
  server: {
    port: 4321,
  },
  integrations: [preact()],
});
