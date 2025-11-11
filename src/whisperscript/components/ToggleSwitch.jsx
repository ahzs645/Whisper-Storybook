import * as Toggle from '@radix-ui/react-toggle';
import clsx from 'clsx';
import React from 'react';

export default function ToggleSwitch({ accentColor = 'rgb(56 189 248 / 0.7)', className, ...props }) {
  return (
    <Toggle.Root
      {...props}
      className={clsx('group/toggle inline-flex touch-none items-center outline-none [-webkit-tap-highlight-color:transparent]', className)}
    >
      <span
        className="h-5 w-9 rounded-full border-2 border-transparent bg-gray-600 shadow ring-offset-2 ring-offset-gray-900 transition duration-200 group-aria-pressed/toggle:bg-[--accent-color]"
        style={{ '--accent-color': accentColor }}
      >
        <span className="block h-4 w-4 origin-right rounded-full bg-white shadow transition-all duration-200 group-active/toggle:w-5 group-aria-pressed/toggle:ml-4 group-aria-pressed/toggle:group-active/toggle:ml-3" />
      </span>
    </Toggle.Root>
  );
}
