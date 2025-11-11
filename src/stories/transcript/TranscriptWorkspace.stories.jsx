import React from "react";
import {
  TranscriptSegmentsPreview,
  TranscriptTitleBarPreview,
  TranscriptToolbarPreview,
  TranscriptViewPreview,
  TranscriptPlayerPreview,
  TranscriptWaveformBarePreview,
  TranscriptWaveformComponentPreview,
  PlayerSettingsPopoverPreview,
} from "./TranscriptPreviewComponents";
import { sampleSegments } from "./transcriptSampleData";

const meta = {
  title: "Whisper Script/Transcription/Workspace",
  component: TranscriptViewPreview,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
const transcriptInterfaceSegments = sampleSegments.map((segment, index) => ({
  ...segment,
  layout: index % 2 === 0 ? "stacked" : "inline",
  showMetrics: true,
  showTimecode: true,
}));

export const Overview = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-6">
      <TranscriptViewPreview />
    </div>
  ),
};

export const TranscriptInterface = {
  name: "Transcript Interface",
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] p-6">
      <TranscriptViewPreview
        showMetrics
        showTimecodes
        segments={transcriptInterfaceSegments}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Showcases the entire transcript editing workspace, including mixed inline layouts, segment metrics, waveform scrubber, and settings popovers.",
      },
    },
  },
};

export const ToolbarOnly = {
  render: () => (
    <div className="flex min-h-[180px] flex-col gap-4 bg-darkgray-950 p-6">
      <TranscriptTitleBarPreview />
      <TranscriptToolbarPreview />
    </div>
  ),
};

export const SegmentsWithSpeakers = {
  render: () => (
    <div className="flex min-h-[520px] items-center justify-center bg-darkgray-950 p-4">
      <div className="h-[500px] w-full max-w-[820px] rounded-2xl border border-gray-800/60 bg-black/70 p-2">
        <TranscriptSegmentsPreview />
      </div>
    </div>
  ),
};

export const SegmentsWithoutMetrics = {
  render: () => (
    <div className="flex min-h-[520px] items-center justify-center bg-darkgray-950 p-4">
      <div className="h-[500px] w-full max-w-[820px] rounded-2xl border border-gray-800/60 bg-black/70 p-2">
        <TranscriptSegmentsPreview showMetrics={false} />
      </div>
    </div>
  ),
};

export const InlineMetricsVariant = {
  render: () => {
    const inlineSegments = sampleSegments.map((segment, index) => ({
      ...segment,
      layout: "inline",
      showMetrics: index % 2 === 0,
    }));

    return (
      <div className="flex min-h-[520px] items-center justify-center bg-darkgray-950 p-4">
        <div className="h-[500px] w-full max-w-[820px] rounded-2xl border border-gray-800/60 bg-black/70 p-2">
          <TranscriptSegmentsPreview segments={inlineSegments} />
        </div>
      </div>
    );
  },
};

export const PlayerOnly = {
  render: () => (
    <div className="flex min-h-[520px] flex-col items-center justify-center gap-6 bg-darkgray-950 p-6">
      <div className="w-full max-w-[720px] space-y-4">
        <TranscriptPlayerPreview segments={sampleSegments} selectedId={sampleSegments[0].id} />
        <TranscriptWaveformBarePreview segments={sampleSegments} />
        <TranscriptWaveformComponentPreview
          segments={sampleSegments}
          selectedSegmentId={sampleSegments[2].id}
          progress={sampleSegments[2].waveEnd ?? 0.4}
          height={190}
        />
      </div>
      <div className="space-y-4">
        <PlayerSettingsPopoverPreview />
      </div>
    </div>
  ),
};

export const WaveformOnly = {
  render: () => (
    <div className="flex min-h-[360px] items-center justify-center bg-darkgray-950 p-6">
      <div className="w-full max-w-[760px] space-y-4">
        <TranscriptWaveformBarePreview segments={sampleSegments} />
        <TranscriptWaveformComponentPreview segments={sampleSegments} />
      </div>
    </div>
  ),
};
