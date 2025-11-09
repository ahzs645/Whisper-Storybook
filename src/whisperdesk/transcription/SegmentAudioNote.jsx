import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Button } from '@wd/components/ui/button';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipBack,
  SkipForward,
  Quote,
  Users,
} from 'lucide-react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const deriveAccentTokens = (className = '') => {
  if (className.includes('green')) {
    return { border: 'border-green-500', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' };
  }
  if (className.includes('purple')) {
    return { border: 'border-purple-500', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' };
  }
  if (className.includes('orange')) {
    return { border: 'border-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' };
  }
  if (className.includes('pink')) {
    return { border: 'border-pink-500', text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/30' };
  }
  if (className.includes('cyan')) {
    return { border: 'border-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' };
  }
  return { border: 'border-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' };
};

export function SegmentAudioNote({
  note,
  formatTime,
  speakerColors,
  accentClass,
  speakerLabel,
  autoFocusStart = true,
  className = '',
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(note?.durationSeconds || 0);
  const [currentTime, setCurrentTime] = useState(note?.startTime || 0);

  const safeSpeakerColors = useMemo(() => {
    if (speakerColors) return speakerColors;
    return deriveAccentTokens(accentClass);
  }, [speakerColors, accentClass]);

  // Wire up audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleLoaded = () => {
      const nextDuration =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : note?.durationSeconds || 0;
      setDuration(nextDuration);

      if (autoFocusStart && typeof note?.startTime === 'number') {
        audio.currentTime = clamp(note.startTime, 0, nextDuration || note.startTime || 0);
        setCurrentTime(note.startTime);
      } else {
        setCurrentTime(audio.currentTime || 0);
      }
    };

    const handleTime = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [note?.startTime, note?.durationSeconds, note?.audioSrc, autoFocusStart]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (typeof note?.startTime === 'number' && audio.currentTime < note.startTime) {
      audio.currentTime = note.startTime;
      setCurrentTime(note.startTime);
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('[SegmentAudioNote] Unable to play audio', error);
    }
  };

  const handleSeek = (nextTime) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(nextTime)) return;

    const maxTime = duration || note?.durationSeconds || audio.duration || 0;
    const clamped = clamp(nextTime, 0, maxTime || 0);
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const handleStep = (delta) => {
    handleSeek((audioRef.current?.currentTime || 0) + delta);
  };

  const handleReset = () => {
    const resetPoint = typeof note?.startTime === 'number' ? note.startTime : 0;
    handleSeek(resetPoint);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const sliderMax = useMemo(() => {
    if (duration && duration > 0) return duration;
    if (note?.durationSeconds && note.durationSeconds > 0) return note.durationSeconds;
    return 1;
  }, [duration, note?.durationSeconds]);

  const formattedPlaybackTime = useMemo(
    () => `${formatTime?.(currentTime) || '0:00'} / ${formatTime?.(duration || note?.durationSeconds || 0) || '0:00'}`,
    [currentTime, duration, note?.durationSeconds, formatTime],
  );

  if (!note) return null;

  return (
    <div
      className={`rounded-lg border ${safeSpeakerColors.border} ${safeSpeakerColors.bg} p-4 shadow-sm ${className}`}
      data-callout={note.calloutType || 'quote'}
    >
      <audio ref={audioRef} src={note.audioSrc} preload="metadata" hidden />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full border ${safeSpeakerColors.border} ${safeSpeakerColors.bg} px-3 py-1 text-sm font-medium ${safeSpeakerColors.text}`}
          >
            <Users className="w-4 h-4" />
            <span>{speakerLabel || 'Speaker'}</span>
          </span>
          {typeof note.startTime === 'number' && (
            <span className="text-xs text-muted-foreground font-mono">
              {formatTime?.(note.startTime) || '0:00'} • clip {formatTime?.(duration || note.durationSeconds || 0) || '0:00'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 px-3 ${safeSpeakerColors.text}`}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm font-semibold">{isPlaying ? 'Pause' : 'Play'} note</span>
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleStep(-10)}
              aria-label="Skip backward 10 seconds"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleStep(10)}
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleReset}
              aria-label="Reset playback"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <input
            className="seek-slider w-full accent-blue-500"
            type="range"
            min={0}
            max={sliderMax}
            value={Math.min(currentTime, sliderMax)}
            step="0.1"
            onChange={(event) => handleSeek(parseFloat(event.target.value))}
          />
          <div className="text-xs font-mono text-muted-foreground">{formattedPlaybackTime}</div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Quote className="w-4 h-4" />
          <span className="font-semibold text-foreground">{note.title}</span>
          {note.summary && <span className="text-xs text-muted-foreground">• {note.summary}</span>}
        </div>

        {note.quote && (
          <div className="rounded-md bg-background/60 p-3 text-sm leading-relaxed text-foreground">
            {note.quote}
          </div>
        )}
      </div>
    </div>
  );
}
