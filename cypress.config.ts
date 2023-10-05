import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3100/sendinn',
    viewportWidth: 2500,
    viewportHeight: 1200,
    chromeWebSecurity: false,
    experimentalStudio: true,
  },
});
