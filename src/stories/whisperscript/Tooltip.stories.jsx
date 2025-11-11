import React from 'react';
import Tooltip from '../../whisperscript/components/Tooltip';

const withPadding = storyFn => (
  <div className="p-20">
    {storyFn()}
  </div>
);

const meta = {
  title: 'Whisper Script/Components/Overlays/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [withPadding],
};

export default meta;

export const Default = {
  args: {
    label: 'This is a tooltip',
    children: (
      <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="button">
        Hover me
      </button>
    ),
  },
};

export const WithAccelerator = {
  args: {
    label: 'Save file',
    accelerator: <span className="ml-2 text-xs text-gray-400">⌘S</span>,
    children: (
      <button className="rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600" type="button">
        Hover for shortcut
      </button>
    ),
  },
};

export const CustomAlign = {
  args: {
    label: 'Aligned tooltip',
    side: 'right',
    align: 'start',
    children: (
      <button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-500" type="button">
        Hover me
      </button>
    ),
  },
};
