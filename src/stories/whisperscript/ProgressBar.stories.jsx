import React, { useEffect, useState } from 'react';
import ProgressBar from '../../whisperscript/components/ProgressBar';

const wrapWithBarWidth = storyFn => (
  <div className="h-2 w-64">
    {storyFn()}
  </div>
);

const meta = {
  title: 'Whisper Script/Components/Feedback/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [wrapWithBarWidth],
};

export default meta;

export const Default = {
  args: {
    progress: 50,
    className: 'h-2',
  },
};

export const Empty = {
  args: {
    progress: 0,
    className: 'h-2',
  },
};

export const Complete = {
  args: {
    progress: 100,
    className: 'h-2',
  },
};

export const CustomColors = {
  args: {
    progress: 65,
    trackBgColor: 'bg-gray-800',
    indicatorBgColor: 'bg-green-500',
    className: 'h-2',
  },
};

const AnimatedProgressDemo = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <ProgressBar progress={progress} className="h-2" />;
};

export const Animated = {
  render: () => <AnimatedProgressDemo />,
};

export const SlowAnimation = {
  args: {
    progress: 75,
    animationDuration: 2,
    className: 'h-2',
  },
};

export const FastAnimation = {
  args: {
    progress: 60,
    animationDuration: 0.1,
    className: 'h-2',
  },
};
