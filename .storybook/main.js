
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(dirname, '..');
const nodeModulesDir = path.resolve(workspaceRoot, 'node_modules');
const whisperDeskRoot = path.resolve(workspaceRoot, '../WhisperDesk-1');
const whisperDeskSourceDir = path.resolve(whisperDeskRoot, 'src/renderer/whisperdesk-ui/src');
const whisperDeskSrc = path.resolve(nodeModulesDir, 'whisperdesk-ui/src');
const useSyncExternalStoreShim = path.resolve(workspaceRoot, 'src/shims/useSyncExternalStore.js');

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    config.resolve = config.resolve || {};
    const mockAppPath = path.resolve(workspaceRoot, 'src/mocks/App.jsx');
    const alias = [
      // Mock the App.jsx FIRST before other aliases
      { find: `${whisperDeskSrc}/App.jsx`, replacement: mockAppPath },
      { find: `${whisperDeskSrc}/App`, replacement: mockAppPath },
      { find: '@wd', replacement: whisperDeskSrc },
      { find: '@/', replacement: `${whisperDeskSrc}/` },
      { find: 'use-sync-external-store/shim', replacement: useSyncExternalStoreShim },
      { find: 'use-sync-external-store/shim/index.js', replacement: useSyncExternalStoreShim },
      { find: /^lodash\/(.+)$/, replacement: 'lodash-es/$1' },
      { find: 'lodash', replacement: 'lodash-es' },
    ];

    const existingAlias = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : Object.entries(config.resolve.alias || {}).map(([find, replacement]) => ({ find, replacement }));

    config.resolve.alias = [...existingAlias, ...alias];
    config.resolve.preserveSymlinks = true;
    config.resolve.mainFields = ['module', 'jsnext:main', 'jsnext', 'main'];

    config.server = config.server || {};
    config.server.fs = config.server.fs || {};
    const allow = new Set([
      ...(config.server.fs.allow || []),
      workspaceRoot,
      whisperDeskRoot,
      whisperDeskSourceDir,
    ]);
    config.server.fs.allow = Array.from(allow);

    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'eventemitter3',
      'lodash-es',
    ];
    config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {};
    config.optimizeDeps.esbuildOptions.mainFields = ['module', 'main'];

    return config;
  },
};
export default config;
