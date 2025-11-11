import React from 'react';
import { FileText, FileVolume, Mic } from 'lucide-react';
import ActionCard, { ActionCardsContainer } from '../../whisperscript/components/ActionCard';

const meta = {
  title: 'Whisper Script/Components/Cards/ActionCard',
  component: ActionCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

export const NewTranscript = {
  args: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-file-volume size-full fill-zinc-200/5 stroke-[1.2] text-white group-disabled:text-zinc-100/30"
        aria-hidden="true"
      >
        <path d="M11 11a5 5 0 0 1 0 6"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M4 6.765V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-.93-.23"></path>
        <path d="M7 10.51a.5.5 0 0 0-.826-.38l-1.893 1.628A1 1 0 0 1 3.63 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1.129a1 1 0 0 1 .652.242l1.893 1.63a.5.5 0 0 0 .826-.38z"></path>
      </svg>
    ),
    title: 'New Transcript',
    description: 'Select audio files to transcribe',
  },
};

export const OpenProject = {
  args: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-file-text size-full fill-zinc-200/5 stroke-[1.2] text-white group-disabled:text-zinc-100/30"
        aria-hidden="true"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M10 9H8"></path>
        <path d="M16 13H8"></path>
        <path d="M16 17H8"></path>
      </svg>
    ),
    title: 'Open Project',
    description: 'Select transcript files to open',
  },
};

export const RecordAudio = {
  args: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-mic size-full fill-zinc-200/5 stroke-[1.2] text-white group-disabled:text-zinc-100/30"
        aria-hidden="true"
      >
        <path d="M12 19v3"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <rect x="9" y="2" width="6" height="13" rx="3"></rect>
      </svg>
    ),
    title: 'Record Audio',
    description: 'Record App & Mic Audio',
    badge: 'Beta',
  },
};

export const AllCards = {
  render: () => (
    <div className="relative h-[200px] w-[800px] bg-black">
      <ActionCardsContainer>
        <ActionCard
          icon={<FileVolume className="size-full fill-zinc-200/5 stroke-[1.2] text-white group-disabled:text-zinc-100/30" />}
          title="New Transcript"
          description="Select audio files to transcribe"
        />
        <ActionCard
          icon={<FileText className="size-full fill-zinc-200/5 stroke-[1.2] text-white group-disabled:text-zinc-100/30" />}
          title="Open Project"
          description="Select transcript files to open"
        />
        <ActionCard
          icon={<Mic className="size-full fill-zinc-200/5 stroke-[1.2] text-white group-disabled:text-zinc-100/30" />}
          title="Record Audio"
          description="Record App & Mic Audio"
          badge="Beta"
        />
      </ActionCardsContainer>
    </div>
  ),
};

export const Disabled = {
  args: {
    icon: <FileVolume className="size-full fill-zinc-200/5 stroke-[1.2] text-white group-disabled:text-zinc-100/30" />,
    title: 'New Transcript',
    description: 'Select audio files to transcribe',
    disabled: true,
  },
};
