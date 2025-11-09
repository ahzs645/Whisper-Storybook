import React, { useEffect } from 'react';
import '../src/index.css';
import '@wd/App.css';
import { AppStateProvider, InitializationProvider } from '../src/mocks/App';

const withAppShell = (Story, context) => {
  const theme = context.globals.theme || 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <InitializationProvider>
      <AppStateProvider initialTheme={theme}>
        <div className="min-h-screen bg-background text-foreground p-6 font-sans">
          <Story />
        </div>
      </AppStateProvider>
    </InitializationProvider>
  );
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [withAppShell],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for WhisperDesk surfaces',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: 'var(--background)' },
        { name: 'surface', value: 'var(--card)' },
      ],
    },
  },
};

export default preview;
