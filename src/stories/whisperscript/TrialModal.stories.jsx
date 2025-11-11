import React, { useState } from 'react';
import TrialModal from '../../whisperscript/components/TrialModal';

const meta = {
  title: 'Whisper Script/Components/Overlays/TrialModal',
  component: TrialModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onStartTrial: { action: 'start trial clicked' },
    onLogin: { action: 'login clicked' },
    onOpenChange: { action: 'open changed' },
  },
};

export default meta;

export const Default = {
  args: {
    open: true,
    trialDuration: '7-day',
  },
};

export const ThirtyDayTrial = {
  args: {
    open: true,
    trialDuration: '30-day',
  },
};

export const FourteenDayTrial = {
  args: {
    open: true,
    trialDuration: '14-day',
  },
};

const TrialModalInteractiveStory = args => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/90 p-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-white/20"
      >
        Open Trial Modal
      </button>
      <TrialModal {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const Interactive = {
  render: args => <TrialModalInteractiveStory {...args} />,
  args: {
    trialDuration: '7-day',
  },
};
