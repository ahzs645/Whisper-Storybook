import React, { useState } from 'react';
import FeedbackModal, { FeedbackButton } from '../../whisperscript/components/FeedbackModal';

const meta = {
  title: 'Whisper Script/Components/Feedback/FeedbackModal',
  component: FeedbackModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    open: true,
    appName: 'WhisperScript',
  },
};

const FeedbackModalWithButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <FeedbackButton onClick={() => setOpen(true)} />
      <FeedbackModal open={open} onOpenChange={setOpen} appName="WhisperScript" />
    </div>
  );
};

export const WithButton = {
  render: () => <FeedbackModalWithButton />,
};

export const ButtonOnly = {
  render: () => (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <FeedbackButton onClick={() => console.log('Feedback clicked')} />
    </div>
  ),
};
