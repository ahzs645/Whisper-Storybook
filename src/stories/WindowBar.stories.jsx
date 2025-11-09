import React, { useEffect, useLayoutEffect } from 'react';
import { UnifiedWindowControls } from '@wd/components/UnifiedWindowControls';
import CustomMicIcon from '@wd/components/icons/CustomMicIcon';
import { Video, Loader2, Check, Mic } from 'lucide-react';

const PLATFORM_LABELS = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

const STATUS_PRESETS = {
  recording: {
    label: 'Recording · 04:12',
    icon: Video,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },
  transcribing: {
    label: 'Transcribing…',
    icon: Loader2,
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    iconClassName: 'animate-spin',
  },
  complete: {
    label: '✓ Complete',
    icon: Check,
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  file: {
    label: 'UX feedback call.wav',
    icon: Mic,
    className: 'bg-primary/10 text-primary',
  },
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const setupMockWindowApi = (platform, initialMaximized = false) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const previousApi = window.electronAPI;
  const listeners = {
    maximize: new Set(),
    unmaximize: new Set(),
  };
  let isMaximized = initialMaximized;

  const emit = (type) => {
    listeners[type].forEach((callback) => callback?.());
  };

  const register = (type, callback) => {
    listeners[type].add(callback);
    return () => listeners[type].delete(callback);
  };

  const mockWindowApi = {
    async getPlatform() {
      return { platform };
    },
    async isMaximized() {
      return isMaximized;
    },
    minimize() {
      console.info(`[WindowBarMock/${platform}] minimize`);
    },
    maximize() {
      isMaximized = !isMaximized;
      emit(isMaximized ? 'maximize' : 'unmaximize');
    },
    close() {
      console.info(`[WindowBarMock/${platform}] close`);
    },
    onMaximize(callback) {
      return register('maximize', callback);
    },
    onUnmaximize(callback) {
      return register('unmaximize', callback);
    },
  };

  window.electronAPI = {
    ...(previousApi || {}),
    window: mockWindowApi,
  };

  return () => {
    listeners.maximize.clear();
    listeners.unmaximize.clear();
    if (previousApi) {
      window.electronAPI = previousApi;
    } else {
      delete window.electronAPI;
    }
  };
};

let previewStylesInjected = false;
const ensurePreviewStyles = () => {
  if (previewStylesInjected || typeof document === 'undefined') {
    return;
  }
  const style = document.createElement('style');
  style.id = 'window-bar-preview-styles';
  style.textContent = `
    .window-bar-storybook .unified-header {
      position: relative !important;
      inset: 0 !important;
      border-radius: 24px 24px 0 0;
    }
    .window-bar-storybook .unified-header-content {
      max-width: none;
    }
    .window-bar-storybook .preview-body {
      backdrop-filter: blur(18px) saturate(140%);
    }
  `;
  document.head.appendChild(style);
  previewStylesInjected = true;
};

const StatusBadge = ({ type }) => {
  const preset = typeof type === 'string' ? STATUS_PRESETS[type] : type;
  if (!preset) return null;
  const Icon = preset.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium shadow-sm ${preset.className}`}>
      {Icon && <Icon className={`w-3 h-3 ${preset.iconClassName || ''}`} />}
      {preset.label}
    </span>
  );
};

const PreviewTabs = () => {
  const items = ['Transcribe', 'Analytics', 'Models', 'History', 'Settings'];
  return (
    <div className="flex flex-wrap gap-2 text-xs font-semibold">
      {items.map((label, index) => (
        <div
          key={label}
          className={`rounded-full border px-3 py-1 ${
            index === 0
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border/60 text-muted-foreground'
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

const WindowBarPreview = ({
  platform,
  title,
  subtitle,
  initialMaximized = false,
  status,
}) => {
  useIsomorphicLayoutEffect(() => {
    return setupMockWindowApi(platform, initialMaximized);
  }, [platform, initialMaximized]);

  useEffect(() => {
    ensurePreviewStyles();
  }, []);

  const label = PLATFORM_LABELS[platform] || platform;
  const isMac = platform === 'darwin';

  return (
    <div className={`window-bar-storybook platform-${platform}`}>
      <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/95 shadow-2xl ring-1 ring-background/40">
        <header className="unified-header">
          <div className="unified-header-content">
            {isMac && (
              <div className="header-section header-left">
                <UnifiedWindowControls />
              </div>
            )}

            <div className={`header-section header-center ${isMac ? 'macos-center' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="frosted-glass rounded-xl p-2 shadow-lg">
                  <CustomMicIcon className="h-7 w-7 text-primary" />
                </div>
                <div className="leading-tight">
                  <p className="text-base font-semibold tracking-tight">{title}</p>
                  <span className="text-[11px] text-muted-foreground">by first form</span>
                </div>
              </div>
            </div>

            <div className="header-section header-right">
              <div className="flex items-center gap-3">
                {status && <StatusBadge type={status} />}
                {!isMac && <UnifiedWindowControls />}
              </div>
            </div>
          </div>
        </header>

        <div className="preview-body border-t border-border/70 bg-muted/40 px-6 py-5 text-sm text-muted-foreground">
          <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-wide">
            <span>{label} chrome</span>
            <span>Window manager mock</span>
          </div>
          <PreviewTabs />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground/90">
            {subtitle || `Replicates the ${label} draggable region, frosted logo block, and window chrome layout exactly as implemented in the desktop app.`}
          </p>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'WhisperDesk/WindowManager/WindowBar',
  component: UnifiedWindowControls,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

const Template = (args) => <WindowBarPreview {...args} />;

export const Windows = Template.bind({});
Windows.args = {
  platform: 'win32',
  title: 'WhisperDesk Enhanced',
  subtitle: 'Windows/Linux builds keep the chrome on the right while the center stack pins the frosted mic emblem.',
  status: 'recording',
};

export const MacOS = Template.bind({});
MacOS.args = {
  platform: 'darwin',
  title: 'WhisperDesk Beta',
  subtitle: 'Traffic lights sit on the left while the center title and badges align just like the production build.',
  status: 'file',
};

export const Linux = Template.bind({});
Linux.args = {
  platform: 'linux',
  title: 'WhisperDesk • Flatpak',
  subtitle: 'Linux mirrors the Windows alignment for parity but still shares the same frosted mic tile.',
  status: 'transcribing',
  initialMaximized: true,
};

const StatusShowcase = () => (
  <div className="space-y-3">
    {Object.entries(STATUS_PRESETS).map(([key]) => (
      <StatusBadge key={key} type={key} />
    ))}
  </div>
);

export const StatusIndicators = {
  render: () => (
    <div className="max-w-sm rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg">
      <p className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">Window bar statuses</p>
      <StatusShowcase />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
