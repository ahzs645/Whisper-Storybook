import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@wd/components/ui/card';
import { ScrollArea } from '@wd/components/ui/scroll-area';
import { Badge } from '@wd/components/ui/badge';
import { Users, Mic, Clock } from 'lucide-react';
import { SegmentAudioNote } from './SegmentAudioNote';

const speakerPalettes = [
  { border: 'border-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
  { border: 'border-green-500', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' },
  { border: 'border-purple-500', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  { border: 'border-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' },
  { border: 'border-pink-500', text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/30' },
  { border: 'border-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' },
];

const getSpeakerPalette = (speakerId) => {
  if (!speakerId) return speakerPalettes[0];
  const hash = speakerId.split('').reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc;
  }, 0);
  return speakerPalettes[Math.abs(hash) % speakerPalettes.length];
};

const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return '0:00';
  const totalSeconds = Math.max(0, Math.round(seconds));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function CompactTranscriptDisplay({
  transcriptionResult,
  isTranscribing = false,
  progress = 0,
  progressMessage = '',
  className = '',
}) {
  const segments = useMemo(() => transcriptionResult?.segments || [], [transcriptionResult?.segments]);
  const segmentsWithNotes = useMemo(
    () => segments.filter((segment) => segment.audioNotes && segment.audioNotes.length > 0),
    [segments],
  );

  return (
    <Card className={`w-full flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="w-5 h-5" />
            Threaded Transcript Notes
            {isTranscribing && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Mic className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {segments.length} segments • {transcriptionResult?.metadata?.duration
              ? formatTime(transcriptionResult.metadata.duration)
              : 'Processing…'}
          </div>
        </div>
        <CardDescription>
          Surface audio callouts inline with the transcript so reviews stay compact and referenceable.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="h-[500px]">
          <ScrollArea className="h-full w-full">
            <div className="px-6 py-4 space-y-4">
              {segmentsWithNotes.length === 0 ? (
                <div className="flex h-[360px] flex-col items-center justify-center text-muted-foreground gap-2">
                  <Clock className="w-8 h-8 opacity-50" />
                  <p>No audio notes captured for this transcript yet.</p>
                  {isTranscribing ? (
                    <p className="text-sm">{progressMessage || `Progress ${progress}%`}</p>
                  ) : (
                    <p className="text-sm">Add callouts during review to populate this view.</p>
                  )}
                </div>
              ) : (
                segmentsWithNotes.map((segment) => {
                  const palette = getSpeakerPalette(segment.speakerId || segment.speaker);
                  const speakerLabel =
                    segment.speakerLabel ||
                    transcriptionResult?.speakerMap?.[segment.speakerId] ||
                    `Speaker ${segment.speaker || '1'}`;
                  return (
                    <div
                      key={segment.id}
                      className="rounded-xl border border-border/70 bg-muted/40 p-4 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border ${palette.border} ${palette.bg} px-3 py-1 text-sm font-medium ${palette.text}`}
                        >
                          <Users className="w-4 h-4" />
                          <span>{speakerLabel}</span>
                        </span>
                        <Badge variant="outline" className="text-xs font-mono">
                          {formatTime(segment.start)}
                          {segment.end && segment.end !== segment.start ? ` → ${formatTime(segment.end)}` : ''}
                        </Badge>
                      </div>

                      <p className="text-sm leading-relaxed text-foreground">{segment.text}</p>

                      <div className="space-y-3">
                        {segment.audioNotes.map((note) => (
                          <SegmentAudioNote
                            key={note.id}
                            note={note}
                            speakerColors={palette}
                            formatTime={formatTime}
                            speakerLabel={speakerLabel}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
