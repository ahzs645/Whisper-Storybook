import React, { useState } from 'react';
import { Card } from '@wd/components/ui/card';
import { Badge } from '@wd/components/ui/badge';
import { Button } from '@wd/components/ui/button';
import { Progress } from '@wd/components/ui/progress';
import { Download, Trash2, Check, HardDrive, Gauge, X } from 'lucide-react';

// Extract the ModelCard as a standalone component for Storybook
const ModelCard = ({
  model,
  isInstalled = false,
  isDownloading = false,
  downloadProgress = 0,
  downloadSpeed = 0,
  onDownload,
  onDelete,
  onCancelDownload
}) => {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond) => {
    if (!bytesPerSecond) return '';
    return `${formatBytes(bytesPerSecond)}/s`;
  };

  const getSpeedColor = (speed) => {
    if (!speed) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';

    switch (speed.toLowerCase()) {
      case 'very fast':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'fast':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'medium-slow':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'slow':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (!accuracy) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';

    switch (accuracy.toLowerCase()) {
      case 'outstanding':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'excellent':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'very good':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'good':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'basic':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card className="relative overflow-hidden p-3">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{model.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{model.description}</p>
          </div>
          {isInstalled && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
              <Check className="w-3 h-3" />
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {model.speed && (
            <Badge variant="secondary" className={`text-xs py-0 px-1.5 ${getSpeedColor(model.speed)}`}>
              <Gauge className="w-2.5 h-2.5 mr-0.5" />
              {model.speed}
            </Badge>
          )}
          {model.accuracy && (
            <Badge variant="secondary" className={`text-xs py-0 px-1.5 ${getAccuracyColor(model.accuracy)}`}>
              <Check className="w-2.5 h-2.5 mr-0.5" />
              {model.accuracy}
            </Badge>
          )}
          {model.size && (
            <Badge variant="secondary" className="text-xs py-0 px-1.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <HardDrive className="w-2.5 h-2.5 mr-0.5" />
              {model.size}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {isDownloading ? (
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <Progress value={downloadProgress} className="h-1.5" />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {downloadProgress}%
                  </span>
                  {downloadSpeed > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {formatSpeed(downloadSpeed)}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancelDownload}
                className="h-6 w-6"
                aria-label="Cancel download"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : isInstalled ? (
            <div className="flex justify-end w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-6 w-6 text-destructive hover:text-destructive/90"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-end w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="h-6 text-xs px-2"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Sample model data
const SAMPLE_MODELS = {
  large: {
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
  medium: {
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
  small: {
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
  tiny: {
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
};

const meta = {
  title: 'WhisperDesk/Models/ModelCard',
  component: ModelCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isInstalled: {
      control: 'boolean',
      description: 'Whether the model is installed',
    },
    isDownloading: {
      control: 'boolean',
      description: 'Whether the model is currently downloading',
    },
    downloadProgress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Download progress percentage',
    },
    downloadSpeed: {
      control: { type: 'number' },
      description: 'Download speed in bytes per second',
    },
  },
};

export default meta;

// Default state - available for download
export const Available = {
  args: {
    model: SAMPLE_MODELS.large,
    isInstalled: false,
    isDownloading: false,
  },
};

// Installed state
export const Installed = {
  args: {
    model: SAMPLE_MODELS.medium,
    isInstalled: true,
    isDownloading: false,
  },
};

// Downloading state
export const Downloading = {
  args: {
    model: SAMPLE_MODELS.small,
    isInstalled: false,
    isDownloading: true,
    downloadProgress: 45,
    downloadSpeed: 45 * 1024 * 1024, // 45 MB/s
  },
};

// Interactive download simulation
export const InteractiveDownload = {
  render: () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const handleDownload = () => {
      setIsDownloading(true);
      setProgress(0);

      const id = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(id);
            setIsDownloading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      setIntervalId(id);
    };

    const handleCancel = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      setIsDownloading(false);
      setProgress(0);
    };

    return (
      <ModelCard
        model={SAMPLE_MODELS.large}
        isDownloading={isDownloading}
        downloadProgress={progress}
        downloadSpeed={isDownloading ? 45 * 1024 * 1024 : 0}
        onDownload={handleDownload}
        onCancelDownload={handleCancel}
      />
    );
  },
};

// All model variants
export const AllVariants = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <ModelCard model={SAMPLE_MODELS.large} isInstalled={false} isDownloading={false} />
      <ModelCard model={SAMPLE_MODELS.medium} isInstalled={true} isDownloading={false} />
      <ModelCard model={SAMPLE_MODELS.small} isDownloading={true} downloadProgress={65} downloadSpeed={30 * 1024 * 1024} />
      <ModelCard model={SAMPLE_MODELS.tiny} isInstalled={false} isDownloading={false} />
    </div>
  ),
};

export { ModelCard };
