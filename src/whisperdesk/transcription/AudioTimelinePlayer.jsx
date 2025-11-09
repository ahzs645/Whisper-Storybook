import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  return withTenths
    ? `${String(mins).padStart(2, '0')}:${secs.toFixed(1).padStart(4, '0')}`
    : `${String(mins).padStart(2, '0')}:${Math.floor(secs).toString().padStart(2, '0')}`;
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

const buildWaveform = (seed, length = 720) => {
  const random = mulberry32(hashSeed(seed));
  return Array.from({ length }, () => 0.35 + random() * 0.55);
};

const buildWavePath = (samples = []) => {
  if (!samples.length) return '';
  const step = 100 / (samples.length - 1);
  const upper = samples
    .map((sample, index) => {
      const x = (index * step).toFixed(3);
      const y = (50 - sample * 40).toFixed(3);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
  const lower = [...samples]
    .reverse()
    .map((sample, revIndex) => {
      const index = samples.length - 1 - revIndex;
      const x = (index * step).toFixed(3);
      const y = (50 + sample * 40).toFixed(3);
      return `L${x},${y}`;
    })
    .join(' ');
  return `${upper} ${lower} Z`;
};

const SegmentWaveform = ({ samples, isActive, theme }) => {
  const path = useMemo(() => buildWavePath(samples), [samples]);
  if (!path) {
    return <div className={`h-12 w-full rounded ${theme === 'light' ? 'bg-slate-200/70' : 'bg-slate-800/70'}`} aria-hidden="true" />;
  }
  const fill = theme === 'light'
    ? isActive ? 'rgba(15,23,42,0.18)' : 'rgba(100,116,139,0.2)'
    : isActive ? 'rgba(255,255,255,0.14)' : 'rgba(148,163,184,0.12)';
  const stroke = theme === 'light'
    ? isActive ? 'rgba(15,23,42,0.8)' : 'rgba(71,85,105,0.8)'
    : isActive ? 'rgba(255,255,255,0.9)' : 'rgba(203,213,225,0.6)';
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-12 w-full"
      aria-hidden="true"
    >
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const SegmentTextColumn = ({ segment, startPercent, endPercent, isActive, formatTime, theme }) => {
  const startTime = Number.isFinite(segment.start) ? segment.start : 0;
  const endTime = Number.isFinite(segment.end) ? segment.end : startTime;
  const widthPercent = Math.max(0, endPercent - startPercent);

  return (
    <div
      className={`relative flex min-w-[140px] flex-1 flex-col justify-between border-l border-white/10 px-4 py-3 first:border-l-0 ${
        isActive
          ? theme === 'light'
            ? 'bg-slate-100/80'
            : 'bg-white/10'
          : 'bg-transparent'
      }`}
      style={{
        flexBasis: `${widthPercent * 100}%`,
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      <div
        className={`rounded-lg border px-3 py-3 ${
          theme === 'light'
            ? isActive
              ? 'border-slate-300 bg-white shadow-sm'
              : 'border-slate-200 bg-white/80'
            : isActive
              ? 'border-white/30 bg-white/5'
              : 'border-white/10 bg-white/5/80'
        }`}
      >
        <p className={`text-sm font-medium leading-snug ${theme === 'light' ? 'text-slate-800' : 'text-slate-50'}`}>
          {segment.text}
        </p>
      </div>
      <div className={`mt-2 text-right font-mono text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
        <span>{formatTime(startTime)}</span>
        <span className={`mx-1 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>→</span>
        <span>{formatTime(endTime)}</span>
      </div>
    </div>
  );
};

const SegmentWaveChunk = ({ startPercent, endPercent, theme, isActive }) => {
  const left = Math.max(0, Math.min(startPercent * 100, 100));
  const width = Math.max(1, Math.min((endPercent - startPercent) * 100, 100 - left));
  const borderColor = theme === 'light' ? 'rgba(148,163,184,0.5)' : 'rgba(255,255,255,0.08)';
  const activeBg = theme === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)';

  return (
    <div
      className="absolute inset-y-0"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        borderLeft: `1px solid ${borderColor}`,
        backgroundColor: isActive ? activeBg : 'transparent',
        pointerEvents: 'none',
      }}
    />
  );
};

export function AudioTimelinePlayer({
  segments = [],
  duration: durationProp,
  initialTime = 0,
  defaultSpeed = 1,
  label = 'Audio player',
  appearance = 'auto',
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(
    PLAYBACK_SPEEDS.includes(defaultSpeed) ? defaultSpeed : 1,
  );
  const [currentTime, setCurrentTime] = useState(Math.max(0, initialTime));

  const normalizedSegments = useMemo(() => {
    if (!Array.isArray(segments) || segments.length === 0) return [];
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
    const seed = normalizedSegments.map((segment) => segment.id).join('-') || 'timeline-fallback';
    return buildWaveform(seed, 720);
  }, [normalizedSegments]);

  const detectDocumentTheme = useCallback(() => {
    if (typeof document === 'undefined') return 'dark';
    const root = document.documentElement;
    if (root.classList.contains('dark')) return 'dark';
    if (root.classList.contains('light')) return 'light';

    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }, []);

  const [theme, setTheme] = useState(() => (appearance === 'auto' ? detectDocumentTheme() : appearance === 'light' ? 'light' : 'dark'));

  useEffect(() => {
    if (appearance !== 'auto') {
      setTheme(appearance === 'light' ? 'light' : 'dark');
      return undefined;
    }

    setTheme(detectDocumentTheme());

    if (typeof MutationObserver === 'undefined') return undefined;

    const root = document.documentElement;
    const observer = new MutationObserver(() => setTheme(detectDocumentTheme()));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [appearance, detectDocumentTheme]);

  const textRowRef = useRef(null);
  const waveRowRef = useRef(null);

  const segmentsWithMeta = useMemo(() => {
    if (!normalizedSegments.length) return [];
    return normalizedSegments.map((segment, index) => {
      const start = Number.isFinite(segment.start) ? segment.start : index * 4;
      const end = Number.isFinite(segment.end) ? segment.end : start + 3.5;
      const duration = Math.max(0.01, end - start);
      const widthPercent = safeDuration > 0 ? duration / safeDuration : 1 / normalizedSegments.length;
      const startIndex = Math.floor((start / safeDuration) * timelineSamples.length);
      const endIndex = Math.max(startIndex + 2, Math.ceil((end / safeDuration) * timelineSamples.length));
      const samples = timelineSamples.slice(startIndex, endIndex);

      const startPercent = safeDuration > 0 ? start / safeDuration : 0;
      const endPercent = safeDuration > 0 ? end / safeDuration : 1;

      return {
        segment: { ...segment, start, end },
        widthPercent,
        startPercent,
        endPercent,
        samples,
      };
    });
  }, [normalizedSegments, safeDuration, timelineSamples]);

  const activeSegmentId = useMemo(() => {
    if (!segmentsWithMeta.length) return null;
    const lastIndex = segmentsWithMeta.length - 1;
    const active = segmentsWithMeta.find(({ segment }, index) => {
      const start = segment.start ?? 0;
      const end = segment.end ?? start;
      if (index === lastIndex) return currentTime >= start;
      return currentTime >= start && currentTime < end;
    });
    return active?.segment.id ?? null;
  }, [segmentsWithMeta, currentTime]);

  const scrollActiveIntoView = useCallback(
    (container) => {
      if (!container || !activeSegmentId) return;
      const activeMeta = segmentsWithMeta.find(({ segment }) => segment.id === activeSegmentId);
      if (!activeMeta) return;

      const target = activeMeta.startPercent * container.scrollWidth;
      container.scrollTo({
        left: target,
        behavior: 'smooth',
      });
    },
    [activeSegmentId, segmentsWithMeta],
  );

  useEffect(() => {
    scrollActiveIntoView(textRowRef.current);
    scrollActiveIntoView(waveRowRef.current);
  }, [scrollActiveIntoView]);

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

  const shellClasses =
    theme === 'light'
      ? 'border-slate-200 bg-white text-slate-900 shadow-[0_20px_80px_rgba(15,23,42,0.12)]'
      : 'border-slate-900 bg-[#090c14] text-slate-50 shadow-[0_25px_80px_rgba(0,0,0,0.65)]';
  const dividerColor = theme === 'light' ? 'border-slate-200/80' : 'border-slate-900/70';
  const timeTextColor = theme === 'light' ? 'text-slate-700' : 'text-slate-300';
  const mutedTextColor = theme === 'light' ? 'text-slate-400' : 'text-slate-600';
  const buttonBorder = theme === 'light' ? 'border-slate-300 text-slate-800 hover:bg-slate-100' : 'border-slate-700 text-slate-100 hover:bg-slate-800';
  const dashedBorder = theme === 'light' ? 'border-slate-300 text-slate-500' : 'border-slate-700 text-slate-400';

  return (
    <div
      className={`w-full rounded-xl border ${shellClasses} ${className}`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b ${dividerColor} px-5 py-3`}>
        <div className="flex flex-wrap items-center gap-4">
          {label && (
            <span className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
              {label}
            </span>
          )}
          <div className={`flex items-center gap-3 text-xs font-mono ${timeTextColor}`}>
            <span>{formatTimestamp(currentTime)}</span>
            <span className={`${mutedTextColor}`}>/ {formatTimestamp(derivedDuration)}</span>
            <button
              type="button"
              onClick={handlePlayToggle}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-[10px] uppercase tracking-wide ${buttonBorder}`}
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={cycleSpeed}
              className={`rounded-md border px-2 py-1 font-semibold ${buttonBorder}`}
            >
              {playbackSpeed.toFixed(2)}x
            </button>
          </div>
        </div>
        <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          <button
            type="button"
            onClick={() => setIsMuted((value) => !value)}
            className={`rounded-md border p-1 ${theme === 'light' ? 'border-slate-300 hover:border-slate-400 hover:text-slate-700' : 'border-slate-800 hover:border-slate-600 hover:text-slate-100'}`}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button
            type="button"
            className={`rounded-md border p-1 ${theme === 'light' ? 'border-slate-300 hover:border-slate-400 hover:text-slate-700' : 'border-slate-800 hover:border-slate-600 hover:text-slate-100'}`}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        {segmentsWithMeta.length > 0 ? (
          <>
            <div
              ref={textRowRef}
              className={`flex rounded-lg border px-3 py-4 overflow-x-auto ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-[#101524]'}`}
              style={{ gap: 0 }}
            >
      {segmentsWithMeta.map(({ segment, startPercent, endPercent }) => (
        <SegmentTextColumn
          key={`${segment.id}-text`}
          segment={segment}
          startPercent={startPercent}
          endPercent={endPercent}
          isActive={segment.id === activeSegmentId}
          theme={theme}
          formatTime={(value) => formatTimestamp(value, true)}
                />
              ))}
            </div>
            <div
              ref={waveRowRef}
              className={`relative h-20 overflow-x-auto rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-900 bg-[#0b101d]'}`}
            >
              <div className="relative h-full min-w-full">
                <div className="absolute inset-0 w-full">
                  <SegmentWaveform samples={timelineSamples} isActive theme={theme} />
                </div>
                {segmentsWithMeta.map(({ segment, startPercent, endPercent }) => (
                  <SegmentWaveChunk
                    key={`${segment.id}-wave`}
                    startPercent={startPercent}
                    endPercent={endPercent}
                    isActive={segment.id === activeSegmentId}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={`rounded-lg border border-dashed px-6 py-12 text-center text-sm ${dashedBorder}`}>
            Upload audio to preview waveform markers.
          </div>
        )}

        <div className="py-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={safeDuration}
            step={0.1}
            onValueChange={handleSliderChange}
            className={
              theme === 'light'
                ? '[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-slate-200 [&_[data-slot=slider-range]]:bg-slate-800 [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-slate-900'
                : '[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-slate-800 [&_[data-slot=slider-range]]:bg-slate-200 [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-white'
            }
            aria-label="Playback position"
          />
        </div>
      </div>
    </div>
  );
}
