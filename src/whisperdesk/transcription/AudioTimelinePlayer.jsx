import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@wd/components/ui/button';
import { Slider } from '@wd/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, MoreHorizontal } from 'lucide-react';

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const formatTimestamp = (seconds, withTenths = true) => {
  if (!Number.isFinite(seconds)) {
    return withTenths ? '00:00.0' : '00:00';
  }

  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds - mins * 60;

  if (!withTenths) {
    return `${String(mins).padStart(2, '0')}:${Math.floor(secs).toString().padStart(2, '0')}`;
  }

  return `${String(mins).padStart(2, '0')}:${secs.toFixed(1).padStart(4, '0')}`;
};

const hashSeed = (input = '') => {
  const str = String(input);
  let hash = 0;
  for (let index = 0; index < str.length; index += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
};

const mulberry32 = (seed) => {
  let value = seed || 1;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const buildWaveform = (seed, length = 900) => {
  const random = mulberry32(hashSeed(seed));
  return Array.from({ length }, () => 0.3 + random() * 0.6);
};

const sliceSamples = (samples, start = 0, end = samples.length) => {
  const safeStart = clamp(Math.floor(start), 0, samples.length - 2);
  const safeEnd = clamp(Math.ceil(end), safeStart + 2, samples.length);
  return samples.slice(safeStart, safeEnd);
};

const buildWavePath = (samples = []) => {
  if (!samples.length) return '';
  const step = 100 / (samples.length - 1);
  const upper = samples
    .map((sample, index) => {
      const x = (index * step).toFixed(3);
      const y = (50 - sample * 45).toFixed(3);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
  const lower = [...samples]
    .reverse()
    .map((sample, revIndex) => {
      const index = samples.length - 1 - revIndex;
      const x = (index * step).toFixed(3);
      const y = (50 + sample * 45).toFixed(3);
      return `L${x},${y}`;
    })
    .join(' ');
  return `${upper} ${lower} Z`;
};

const SegmentWaveform = ({ samples, isActive }) => {
  const path = useMemo(() => buildWavePath(samples), [samples]);
  if (!path) {
    return <div className="h-16 w-full rounded-md bg-slate-700/60" aria-hidden="true" />;
  }

  return (
    <div className="relative flex h-20 w-full items-center justify-center">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <path
          d={path}
          fill={isActive ? 'rgba(255,255,255,0.12)' : 'rgba(148,163,184,0.15)'}
          stroke={isActive ? 'rgba(255,255,255,0.9)' : 'rgba(148,163,184,0.55)'}
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const SegmentPane = ({ segment, samples, durationPercent, isActive, formatTime }) => {
  const startTime = Number.isFinite(segment.start) ? segment.start : 0;
  const endTime = Number.isFinite(segment.end) ? segment.end : startTime;

  return (
    <div
      className={`flex flex-col border-l border-slate-700/80 px-4 py-3 ${
        isActive ? 'bg-slate-800/80' : 'bg-transparent'
      }`}
      style={{
        flexBasis: `${Math.max(durationPercent * 100, 14)}%`,
        flexGrow: Math.max(durationPercent * 100, 1),
      }}
    >
      <p className="line-clamp-3 text-sm font-medium text-slate-50 leading-snug">{segment.text}</p>
      <SegmentWaveform samples={samples} isActive={isActive} />
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-slate-400">
        {formatTime(startTime)} → {formatTime(endTime)}
      </p>
    </div>
  );
};

export function AudioTimelinePlayer({
  segments = [],
  duration: durationProp,
  initialTime = 0,
  defaultSpeed = 1,
  label = 'Session playback',
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(
    PLAYBACK_SPEEDS.includes(defaultSpeed) ? defaultSpeed : 1,
  );
  const [currentTime, setCurrentTime] = useState(Math.max(0, initialTime));

  const normalizedSegments = useMemo(() => {
    if (!Array.isArray(segments) || !segments.length) return [];
    return [...segments]
      .map((segment, index) => {
        const id = segment.id || `segment-${index}`;
        const start = Number.isFinite(segment.start) ? segment.start : index * 4;
        const end = Number.isFinite(segment.end) ? segment.end : start + 3.5;
        return { ...segment, id, start, end };
      })
      .sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
  }, [segments]);

  const derivedDuration = useMemo(() => {
    if (Number.isFinite(durationProp) && durationProp > 0) return durationProp;
    if (!normalizedSegments.length) return 0;
    return normalizedSegments.reduce((max, segment) => Math.max(max, segment.end ?? 0), 0);
  }, [durationProp, normalizedSegments]);

  const safeDuration = derivedDuration || 1;

  useEffect(() => {
    setCurrentTime((value) => clamp(value, 0, safeDuration));
  }, [safeDuration]);

  const timelineSamples = useMemo(() => {
    const seed = normalizedSegments.map((segment) => segment.id).join('-') || 'timeline-default';
    return buildWaveform(seed, 900);
  }, [normalizedSegments]);

  const segmentsWithSamples = useMemo(() => {
    if (!normalizedSegments.length) return [];

    return normalizedSegments.map((segment, index) => {
      const start = Number.isFinite(segment.start) ? segment.start : index * 4;
      const end = Number.isFinite(segment.end) ? segment.end : start + 3.5;
      const duration = Math.max(0.01, end - start);
      const durationPercent = safeDuration > 0 ? duration / safeDuration : 1 / normalizedSegments.length;

      const startIndex = (start / safeDuration) * timelineSamples.length;
      const endIndex = (end / safeDuration) * timelineSamples.length;
      const samples = sliceSamples(timelineSamples, startIndex, endIndex);

      return {
        segment: { ...segment, start, end },
        samples,
        durationPercent,
      };
    });
  }, [normalizedSegments, safeDuration, timelineSamples]);

  const activeSegmentId = useMemo(() => {
    if (!segmentsWithSamples.length) return null;
    const lastIndex = segmentsWithSamples.length - 1;
    const active = segmentsWithSamples.find(({ segment }, index) => {
      const start = segment.start ?? 0;
      const end = segment.end ?? start;
      if (index === lastIndex) return currentTime >= start;
      return currentTime >= start && currentTime < end;
    });
    return active?.segment.id ?? null;
  }, [segmentsWithSamples, currentTime]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    let animationFrame;
    let lastTimestamp = performance.now();

    const tick = (now) => {
      const deltaSeconds = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSeconds * playbackSpeed;
        if (next >= safeDuration) {
          setIsPlaying(false);
          return safeDuration;
        }
        return next;
      });

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, playbackSpeed, safeDuration]);

  const progressPercent = Math.min(100, (currentTime / safeDuration) * 100);

  const handlePlayToggle = useCallback(() => {
    if (currentTime >= safeDuration) {
      setCurrentTime(0);
    }
    setIsPlaying((value) => !value);
  }, [currentTime, safeDuration]);

  const handleSliderChange = useCallback(
    (values) => {
      const [next] = values;
      const safeValue = clamp(next ?? 0, 0, safeDuration);
      setCurrentTime(safeValue);
      setIsPlaying(false);
    },
    [safeDuration],
  );

  const cycleSpeed = useCallback(() => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextSpeed = PLAYBACK_SPEEDS[(currentIndex + 1) % PLAYBACK_SPEEDS.length];
    setPlaybackSpeed(nextSpeed);
  }, [playbackSpeed]);

  return (
    <div
      className={`w-full rounded-xl border border-slate-900 bg-[#0c0f17] text-slate-50 shadow-[0_25px_80px_rgba(0,0,0,0.65)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-3">
          <span>{formatTimestamp(currentTime)}</span>
          <span className="text-slate-600">/ {formatTimestamp(derivedDuration)}</span>
          <button
            type="button"
            onClick={handlePlayToggle}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1 font-sans text-xs uppercase tracking-wide text-slate-200 hover:bg-slate-800"
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={cycleSpeed}
            className="rounded-md border border-slate-700 px-2 py-1 font-semibold text-slate-200 hover:bg-slate-800"
          >
            {playbackSpeed.toFixed(2)}x
          </button>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <button
            type="button"
            onClick={() => setIsMuted((value) => !value)}
            className="rounded-md border border-slate-800 p-1 hover:border-slate-600 hover:text-slate-100"
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-800 p-1 hover:border-slate-600 hover:text-slate-100"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        {segmentsWithSamples.length > 0 ? (
          <div className="flex overflow-hidden rounded-lg border border-slate-800 bg-[#111827]">
            {segmentsWithSamples.map(({ segment, samples, durationPercent }) => (
              <SegmentPane
                key={segment.id}
                segment={segment}
                samples={samples}
                durationPercent={durationPercent}
                isActive={segment.id === activeSegmentId}
                formatTime={(value) => formatTimestamp(value, true)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-400">
            Upload audio to generate waveform tiles.
          </div>
        )}

        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={safeDuration}
            step={0.1}
            onValueChange={handleSliderChange}
            className="[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-slate-700 [&_[data-slot=slider-range]]:bg-slate-300 [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-white"
            aria-label="Playback position"
          />
          <div className="relative h-1 w-full rounded-full bg-slate-800">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-slate-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
