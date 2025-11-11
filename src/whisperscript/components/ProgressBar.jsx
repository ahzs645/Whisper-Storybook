import * as Progress from '@radix-ui/react-progress';
import clsx from 'clsx';
import React from 'react';

const roundProgress = value => {
  const clamped = Math.max(0, Math.min(value ?? 0, 100));
  return Math.round(clamped * 10) / 10;
};

export default function ProgressBar({
  progress = 0,
  className,
  trackBgColor,
  indicatorBgColor = 'bg-arcgray-100/70',
  animationDuration = 0.28,
} = {}) {
  const rounded = roundProgress(progress);
  const translate = `${rounded - 100}%`;

  return (
    <Progress.Root
      max={100}
      value={rounded}
      className={clsx('relative min-h-px min-w-16 overflow-hidden rounded-full', trackBgColor || 'bg-arcgray-700', className)}
    >
      <Progress.Indicator asChild>
        <div
          style={{
            transform: `translate3d(${translate}, 0, 0)`,
            transition: `transform ${animationDuration}s ease-out`,
            willChange: 'transform',
          }}
          className={clsx('size-full transform-gpu', indicatorBgColor)}
        />
      </Progress.Indicator>
    </Progress.Root>
  );
}
