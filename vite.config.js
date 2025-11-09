/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const configDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = configDir;
const nodeModulesDir = path.resolve(workspaceRoot, 'node_modules');
const whisperDeskRoot = path.resolve(workspaceRoot, '../WhisperDesk-1');
const whisperDeskSourceDir = path.resolve(whisperDeskRoot, 'src/renderer/whisperdesk-ui/src');
const whisperDeskSrc = path.resolve(nodeModulesDir, 'whisperdesk-ui/src');
const useSyncExternalStoreShim = path.resolve(workspaceRoot, 'src/shims/useSyncExternalStore.js');

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: [
      { find: '@wd', replacement: whisperDeskSrc },
      { find: '@/', replacement: `${whisperDeskSrc}/` },
      { find: 'use-sync-external-store/shim', replacement: useSyncExternalStoreShim },
      { find: 'use-sync-external-store/shim/index.js', replacement: useSyncExternalStoreShim },
      { find: /^lodash\/(.+)$/, replacement: 'lodash-es/$1' },
      { find: 'lodash', replacement: 'lodash-es' },
    ],
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
  },
  server: {
    fs: {
      allow: [workspaceRoot, whisperDeskRoot, whisperDeskSourceDir],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'eventemitter3',
      'lodash-es',
    ],
    esbuildOptions: {
      mainFields: ['module', 'main'],
    },
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        storybookTest({
          configDir: path.join(configDir, '.storybook'),
        }),
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium',
          }],
        },
        setupFiles: ['.storybook/vitest.setup.js'],
      },
    }],
  },
});
