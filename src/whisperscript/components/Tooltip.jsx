import * as RadixTooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import React from 'react';

export default function Tooltip({
  label,
  accelerator,
  side = 'bottom',
  align = 'center',
  delayDuration = 700,
  skipDelayDuration = 1000,
  disableHoverableContent = true,
  className,
  children,
  ...props
}) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} disableHoverableContent={disableHoverableContent}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger
          tabIndex={-1}
          onFocusCapture={event => event.stopPropagation()}
          asChild
        >
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={2}
            collisionPadding={10}
            className={clsx(
              'z-50 max-w-[300px] origin-center overflow-hidden text-wrap break-words rounded-lg border border-[hsl(0_0%_22%)] bg-[#18191B] px-[12px] py-[6px] text-center text-xs font-bold leading-4 tracking-tight text-white/95 shadow-[0_4px_12px_3px_rgb(0,0,0,0.28)] outline outline-[0.5px] -outline-offset-2 outline-black/10 ring-[0.5px] ring-black/25',
              className,
            )}
            {...props}
          >
            {label}
            {accelerator && <span className="ml-1.5 text-[10px] font-semibold text-white/90">{accelerator}</span>}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
