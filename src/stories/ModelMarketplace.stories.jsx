import React, { useEffect } from 'react';
import { ModelMarketplace } from '../whisperdesk/ModelMarketplace';
import { Toaster } from '../mocks/Toaster';

const AVAILABLE_MODELS = [
  {
    id: 'whisper-large',
    name: 'Whisper Large v3',
    description: 'Best all-around accuracy with GPU acceleration support.',
    size: '5.2 GB',
    sizeBytes: 5.2 * 1024 * 1024 * 1024,
    accuracy: 'Outstanding',
    speed: 'Fast',
    recommendedUse: 'Production transcription',
    tags: ['GPU', 'High accuracy', 'Streaming'],
  },
  {
    id: 'whisper-medium',
    name: 'Whisper Medium',
    description: 'Balanced accuracy and resource usage—ideal for most teams.',
    size: '2.9 GB',
    sizeBytes: 2.9 * 1024 * 1024 * 1024,
    accuracy: 'Excellent',
    speed: 'Medium',
    recommendedUse: 'Balanced workloads',
    tags: ['CPU', 'GPU', 'Balanced'],
  },
  {
    id: 'whisper-small',
    name: 'Whisper Small',
    description: 'Optimized for laptops and live preview scenarios.',
    size: '1.2 GB',
    sizeBytes: 1.2 * 1024 * 1024 * 1024,
    accuracy: 'Good',
    speed: 'Very Fast',
    recommendedUse: 'Live previews',
    tags: ['CPU friendly', 'Live'],
  },
  {
    id: 'whisper-tiny',
    name: 'Whisper Tiny',
    description: 'Ultra-light model for prototypes and IoT devices.',
    size: '200 MB',
    sizeBytes: 200 * 1024 * 1024,
    accuracy: 'Basic',
    speed: 'Very Fast',
    recommendedUse: 'Edge devices',
    tags: ['Embedded', 'Prototype'],
  },
];

const INSTALLED_SEED = [
  {
    id: 'whisper-medium',
    name: 'Whisper Medium',
    description: 'Balanced accuracy and resource usage—ideal for most teams.',
    version: '3.1.0',
    installedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

// Set up mock API immediately at module load time
if (typeof window !== 'undefined') {
  if (!window.electronAPI) {
    window.electronAPI = { model: {} };
  }
}

const setupMockElectronApi = () => {
  if (typeof window === 'undefined') return () => {};

  let installed = [...INSTALLED_SEED];
  const availableMap = new Map(AVAILABLE_MODELS.map((model) => [model.id, model]));
  const activeDownloads = new Map();

  const listeners = {
    progress: new Set(),
    complete: new Set(),
    error: new Set(),
    queued: new Set(),
    cancelled: new Set(),
  };

  const register = (type, callback) => {
    listeners[type].add(callback);
    return () => listeners[type].delete(callback);
  };

  const emit = (type, payload) => {
    listeners[type].forEach((callback) => callback(payload));
  };

  const mockModelApi = {
    async getInstalled() {
      return installed;
    },
    async getAvailable() {
      return AVAILABLE_MODELS;
    },
    async getInfo(modelId) {
      return { isInstalled: installed.some((model) => model.id === modelId) };
    },
    async download(modelId) {
      if (activeDownloads.has(modelId)) {
        throw new Error('already being downloaded');
      }

      const model = availableMap.get(modelId);
      if (!model) {
        throw new Error('Model not found');
      }

      emit('queued', {
        modelId,
        totalBytes: model.sizeBytes,
      });

      let progress = 0;
      const totalBytes = model.sizeBytes;
      const interval = setInterval(() => {
        progress = Math.min(progress + 10 + Math.random() * 20, 100);
        emit('progress', {
          modelId,
          progress,
          downloadedBytes: (progress / 100) * totalBytes,
          totalBytes,
          speed: 45 * 1024 * 1024,
        });

        if (progress >= 100) {
          clearInterval(interval);
          activeDownloads.delete(modelId);
          const installedModel = {
            ...model,
            installedAt: new Date().toISOString(),
          };
          installed = [
            installedModel,
            ...installed.filter((item) => item.id !== modelId),
          ];
          emit('complete', {
            modelId,
            installedModel,
          });
        }
      }, 900);

      activeDownloads.set(modelId, interval);
      return { started: true };
    },
    async cancelDownload(modelId) {
      const interval = activeDownloads.get(modelId);
      if (interval) {
        clearInterval(interval);
        activeDownloads.delete(modelId);
        emit('cancelled', { modelId });
      }
    },
    async delete(modelId) {
      installed = installed.filter((model) => model.id !== modelId);
      return { success: true };
    },
    onDownloadProgress(callback) {
      return register('progress', callback);
    },
    onDownloadComplete(callback) {
      return register('complete', callback);
    },
    onDownloadError(callback) {
      return register('error', callback);
    },
    onDownloadQueued(callback) {
      return register('queued', callback);
    },
    onDownloadCancelled(callback) {
      return register('cancelled', callback);
    },
  };

  const previousApi = window.electronAPI;
  window.electronAPI = { model: mockModelApi };

  return () => {
    window.electronAPI = previousApi;
    activeDownloads.forEach(clearInterval);
    Object.values(listeners).forEach((set) => set.clear());
  };
};

const withModelApi = (Story) => {
  useEffect(() => {
    // Set up the full mock API with event handlers
    const cleanup = setupMockElectronApi();
    return cleanup;
  }, []);

  return (
    <>
      <Story />
      <Toaster />
    </>
  );
};

const meta = {
  title: 'WhisperDesk/Models/Marketplace',
  component: ModelMarketplace,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withModelApi],
};

export default meta;

export const Default = {};
