import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import pluginCypress from 'eslint-plugin-cypress';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...nextVitals,
  pluginCypress.configs.recommended,
  prettier,
  {
    rules: {
      'cypress/no-unnecessary-waiting': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
]);
