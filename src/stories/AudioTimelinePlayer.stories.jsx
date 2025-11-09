import React from 'react';
import { AudioTimelinePlayer } from '../whisperdesk/transcription/AudioTimelinePlayer';

const waverySegments = [
  {
    id: 'segment-intro',
    text: 'You know that feeling, catching the perfect wave, when everything lines up just right?',
    start: 0,
    end: 6.4,
    speaker: 'Narrator',
  },
  {
    id: 'segment-cadence',
    text: "The timing, the motion, the rhythm - it's effortless.",
    start: 6.4,
    end: 11.8,
    speaker: 'Narrator',
  },
  {
    id: 'segment-product',
    text: "That's what Wavery feels like for me.",
    start: 11.8,
    end: 16.1,
    speaker: 'Narrator',
  },
  {
    id: 'segment-archive',
    text: 'I used to spend hours, days even, digging through interviews and audio pulls.',
    start: 16.1,
    end: 24.8,
    speaker: 'Narrator',
  },
  {
    id: 'segment-search',
    text: 'Searching for that one perfect quote...',
    start: 24.8,
    end: 31.2,
    speaker: 'Narrator',
  },
  {
    id: 'segment-payoff',
    text: 'Trying to find the exact story beat to tell the story I wanted to tell.',
    start: 31.2,
    end: 39.6,
    speaker: 'Narrator',
  },
];

const meta = {
  title: 'WhisperDesk/Transcription/AudioTimelinePlayer',
  component: AudioTimelinePlayer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const TransportDemo = (args) => (
  <div className="min-h-screen bg-background p-8 text-foreground">
    <div className="w-full max-w-6xl">
      <AudioTimelinePlayer {...args} />
    </div>
  </div>
);

TransportDemo.args = {
  segments: waverySegments,
  duration: 40,
};
