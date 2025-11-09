import React, { useState } from 'react';
import { TranscriptDisplay } from '../whisperdesk/transcription/TranscriptDisplay';
import { CompactTranscriptDisplay } from '../whisperdesk/transcription/CompactTranscriptDisplay';

const sampleSegments = [
  {
    id: 'seg-1',
    text: 'Thanks for jumping on so quickly. I want to walk through the GPU diarization patch and make sure QA knows what to watch for.',
    start: 2.4,
    end: 14.2,
    speaker: 'A1',
    speakerId: 'speaker-alpha',
    speakerLabel: 'Ava',
    confidence: 0.97,
    summary: 'Kick-off',
    sentiment: 'positive',
    language: 'en',
    words: [
      { word: 'Thanks', start: 2.4, end: 2.8 },
      { word: 'for', start: 2.8, end: 3.0 },
      { word: 'jumping', start: 3.0, end: 3.4 },
    ],
    audioNotes: [
      {
        id: 'note-ava-sync',
        title: 'will',
        quote:
          "Oh, interesting. It's recording now, but we still need to capture the type of author this is. That'll be useful when we export JSON versions so we can keep the folders clean across issues-especially if we need to re-export to fix something.",
        audioSrc: '/audio/mock-note.wav',
        startTime: 0,
        durationSeconds: 60,
        summary:
          'Ava flags follow-up work on JSON exports, folder naming, and handling reruns in case of bad data.',
        calloutType: 'quote',
      },
    ],
  },
  {
    id: 'seg-2',
    text: 'We cloned the branch this morning and the install script completed in three minutes on the studio Mac.',
    start: 16.5,
    end: 25.1,
    speaker: 'B1',
    speakerId: 'speaker-bravo',
    speakerLabel: 'Noah',
    confidence: 0.94,
    keywords: ['install', 'studio'],
    language: 'en',
  },
  {
    id: 'seg-3',
    text: 'Perfect. Can you add a note to the release page that USB microphones still need to route through the CaptureKit panel?',
    start: 26.2,
    end: 35.9,
    speaker: 'A1',
    speakerId: 'speaker-alpha',
    speakerLabel: 'Ava',
    confidence: 0.9,
    language: 'en',
  },
  {
    id: 'seg-4',
    text: 'Yep, adding that now and I will attach the waveform QA artifacts after this call.',
    start: 37.1,
    end: 42.5,
    speaker: 'B1',
    speakerId: 'speaker-bravo',
    speakerLabel: 'Noah',
    confidence: 0.92,
    language: 'en',
    audioNotes: [
      {
        id: 'note-noah-hand-off',
        title: 'handoff',
        quote:
          'We can keep the existing SharePoint solution but add a submissions list so reruns keep their own folder names. That way we can re-export JSON plus assets whenever something looks wrong and know which version landed most recently.',
        audioSrc: '/audio/mock-note.wav',
        startTime: 42,
        durationSeconds: 75,
        summary: 'Noah outlines how to store reruns safely for QA hand-offs.',
        calloutType: 'action',
      },
    ],
  },
  {
    id: 'seg-5',
    text: 'Next topic is the transcript viewer polish. We want the grouped mode to highlight speaker merges above 30 seconds.',
    start: 44.6,
    end: 55.8,
    speaker: 'C1',
    speakerId: 'speaker-charlie',
    speakerLabel: 'Maya',
    confidence: 0.89,
    language: 'en',
  },
  {
    id: 'seg-6',
    text: 'I can add that threshold as a setting-maybe default to 20 seconds for new users so they see the behavior sooner?',
    start: 57.3,
    end: 66.4,
    speaker: 'B1',
    speakerId: 'speaker-bravo',
    speakerLabel: 'Noah',
    confidence: 0.93,
    language: 'en',
  },
];

const sampleTranscription = {
  id: 'transcription-01',
  language: 'en',
  duration: 420,
  segments: sampleSegments,
  speakerMap: {
    'speaker-alpha': 'Ava',
    'speaker-bravo': 'Noah',
    'speaker-charlie': 'Maya',
  },
  topics: ['Release prep', 'GPU diarization', 'QA'],
};

const streamingTranscription = {
  ...sampleTranscription,
  segments: sampleSegments.slice(0, 4),
};

const meta = {
  title: 'WhisperDesk/Transcription/TranscriptDisplay',
  component: TranscriptDisplay,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

const Template = (args) => {
  const [transcript, setTranscript] = useState(args.transcriptionResult);

  return (
    <TranscriptDisplay
      {...args}
      transcriptionResult={transcript}
      onTranscriptionUpdate={setTranscript}
    />
  );
};

export const CompletedSession = Template.bind({});
CompletedSession.args = {
  transcriptionResult: sampleTranscription,
  settings: { transcriptViewMode: 'grouped' },
  isTranscribing: false,
  progress: 100,
  progressMessage: 'Transcription complete',
  onCopy: () => console.info('Transcript copied (mock)'),
};

const CompactTemplate = (args) => <CompactTranscriptDisplay {...args} />;

export const CompactAudioNotes = CompactTemplate.bind({});
CompactAudioNotes.args = {
  transcriptionResult: sampleTranscription,
  isTranscribing: false,
  progress: 100,
  progressMessage: 'Transcription complete',
};

export const LiveCapture = Template.bind({});
LiveCapture.args = {
  transcriptionResult: streamingTranscription,
  settings: { transcriptViewMode: 'segments' },
  isTranscribing: true,
  progress: 62,
  progressMessage: 'Aligning speaker turns',
  onCopy: () => console.info('Transcript copied (mock)'),
};
