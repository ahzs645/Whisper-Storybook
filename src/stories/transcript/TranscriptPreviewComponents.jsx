import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  ArrowRight,
  AudioLines,
  ChevronDown,
  Copy,
  Group,
  Search,
  Subtitles,
  Trash2,
  Undo2,
  Redo2,
  UsersRound,
  UserRound,
  Play,
  PictureInPicture2,
  MoreVertical,
  Link2,
  AudioWaveform,
} from "lucide-react";
import { sampleSegments } from "./transcriptSampleData";

const speakerThemes = {
  host: { color: "#EF4444", text: "#ff6666" },
  guest: { color: "#EAB308", text: "#ddb92c" },
  narrator: { color: "#6366F1", text: "#dcd7ff" },
};

const withAlpha = (hex, alpha) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const toolbarButtons = [
  { icon: Undo2, label: "Undo", disabled: true },
  { icon: Redo2, label: "Redo", disabled: true },
  "divider",
  { icon: Trash2, label: "Delete" },
  { icon: Group, label: "Merge" },
  { icon: Copy, label: "Copy" },
  "divider",
  { icon: Subtitles, label: "Captions" },
  { icon: Search, label: "Search" },
];

function ToolbarButton({ icon, label, disabled }) {
  const IconComponent = icon;
  return (
    <button
      type="button"
      className="flex size-[26px] select-none items-center justify-center rounded-md text-gray-100 outline-none transition data-[state=open]:!bg-[rgb(214,214,215,0.1)] disabled:cursor-not-allowed disabled:text-gray-500"
      disabled={disabled}
      aria-label={label}
      data-state="closed"
    >
      <IconComponent className="size-[17px]" strokeWidth={disabled ? 1.5 : 2} />
    </button>
  );
}

export function TranscriptTitleBarPreview() {
  return (
    <div className="relative z-50 flex h-[30px] shrink-0 select-none items-center justify-center border-b border-gray-800/40 px-2 text-gray-300">
      <div className="relative flex flex-1 justify-center overflow-hidden font-semibold">
        <button
          type="button"
          className="group flex cursor-pointer select-none items-center gap-1.5 rounded bg-opacity-0 px-2 py-px text-sm outline-none transition duration-75 ease-out hover:bg-default/60"
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <AudioLines className="size-[15px] shrink-0 stroke-[1.8] text-arcgray-300" />
          <span className="inline-flex items-baseline overflow-hidden text-[13px] font-medium text-white">
            <span className="min-w-0 truncate">Sample Interview</span>
            <span className="shrink-0 lowercase text-white/60">.mp3</span>
          </span>
          <ChevronDown className="size-[13px] text-gray-200" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center px-2">
        <button
          type="button"
          className="inline-flex h-[21px] select-none items-center justify-center gap-1.5 rounded border border-white/5 bg-white/10 pl-2 pr-2.5 text-sm font-medium text-gray-300/95 outline-none transition ease-out hover:border-white/[.09] hover:bg-white/[.175] hover:text-gray-200 active:brightness-[.85]"
        >
          <ArrowRight className="size-[12px] stroke-[3] text-gray-300/90" />
          Export
        </button>
      </div>
    </div>
  );
}

export function TranscriptToolbarPreview() {
  return (
    <div className="relative z-50 h-[40px] w-full shrink-0">
      <div className="absolute inset-0 inline-flex items-center justify-center overflow-hidden bg-darkgray-950 px-2">
        <div className="inline-flex w-full items-center justify-between gap-6">
          <div className="inline-flex items-center gap-[9px] pl-2">
            {toolbarButtons.map((button, index) =>
              button === "divider" ? (
                <div
                  key={`divider-${index}`}
                  role="separator"
                  className="mx-3 h-[14px] w-px shrink-0 bg-gray-700"
                />
              ) : (
                <ToolbarButton
                  key={button.label}
                  icon={button.icon}
                  label={button.label}
                  disabled={button.disabled}
                />
              ),
            )}
          </div>

          <button
            type="button"
            className="group relative flex h-[26px] select-none items-center gap-px overflow-hidden rounded-md border border-violet-400/10 bg-violet-400 bg-opacity-30 text-xs font-semibold text-violet-100/95 outline-none ring ring-black ring-opacity-5 transition ease-out hover:bg-opacity-40 hover:text-violet-50 active:brightness-[.85]"
          >
            <div className="pointer-events-none absolute inset-0 z-0 transform-gpu bg-violet-500/40 opacity-0 transition group-hover:opacity-100" />
            <div className="z-10 flex items-center gap-1.5 px-2.5 py-1">
              <div className="flex size-[14px] shrink-0 items-center justify-center">
                <UsersRound className="size-[12px] stroke-[3]" />
              </div>
              <div className="w-[96px] overflow-hidden [text-shadow:rgb(0,0,0,0.5)_0_0_10px]">
                <p className="truncate">Detect Speakers</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function SpeakerBadge({ segment }) {
  const theme = speakerThemes[segment.speakerTheme];
  const background = withAlpha(theme.color, 0.15);
  const border = withAlpha(theme.color, 0.05);

  return (
    <button
      type="button"
      className="flex h-[26px] w-fit shrink-0 items-center justify-center gap-1 rounded-md border px-2 text-[13px] font-semibold tabular-nums outline-none transition ease-out [text-shadow:rgb(0,0,0,0.2)_0_0_10px] active:brightness-90"
      style={{ backgroundColor: background, borderColor: border, color: theme.text }}
    >
      <UserRound className="size-[15px]" strokeWidth={2.4} />
      <p>{segment.speakerLabel}</p>
    </button>
  );
}

function SegmentCard({
  segment,
  isFirstOfSpeaker,
  showMetrics,
  showTimecode,
  selected,
  onSelect,
}) {
  const metricsVisible = showMetrics && !!segment.metrics;
  const timeVisible = showTimecode;

  return (
    <div className="px-2 py-[0.5px]">
      {(segment.showBadge ?? isFirstOfSpeaker) && (
        <div className="ml-2 my-2">
          <SpeakerBadge segment={segment} />
        </div>
      )}

      <div className="flex w-full gap-x-2 border-white/5 has-[[data-metrics][data-inline]]:border-none" draggable>
        <div
          className={clsx(
            "group relative z-10 flex w-full flex-col rounded-md border border-transparent p-0.5 text-[14px] font-normal outline-none transition hover:bg-darkgray-800/40 hover:shadow",
            selected && "border-sky-300/[.025] bg-sky-300/[.18] hover:shadow-none",
          )}
          data-selected={selected ? "true" : undefined}
          data-inline={segment.layout === "inline" ? "true" : undefined}
          data-metrics={metricsVisible ? "true" : undefined}
          data-timecode={timeVisible ? "true" : undefined}
          role="button"
          tabIndex={0}
          onClick={onSelect}
        >
          <div
            className={clsx(
              "flex w-full flex-col-reverse items-start gap-y-1",
              segment.layout === "inline" && "flex-row items-center gap-x-3",
            )}
          >
            {(timeVisible || metricsVisible) && (
              <div
                className={clsx(
                  "relative flex h-full items-center gap-[5px] pb-[7px] pl-3 text-[10px]/[14px] tabular-nums text-gray-300/40",
                  segment.layout === "inline" && "min-w-[80px] flex-col py-2.5",
                )}
              >
                {timeVisible && (
                  <p
                    className={clsx(
                      "text-[11px] text-sky-300/60",
                      segment.layout === "inline" && "text-[14px] text-sky-300/45",
                      selected && "text-gray-300/80",
                    )}
                  >
                    {segment.timecode}
                  </p>
                )}
                {metricsVisible && segment.metrics && (
                  <>
                    <hr className="hidden h-px w-full border-white/5 group-data-[inline]:hidden" />
                    <div
                      className={clsx(
                        "grid grid-cols-[repeat(8,auto)] items-center gap-x-1 text-gray-300/40",
                        segment.layout === "inline" && "px-1 text-gray-300/50",
                      )}
                    >
                      <MetricValue label="CPS" value={segment.metrics.cps} />
                      <MetricValue label="WPM" value={segment.metrics.wpm} />
                      <MetricValue label="Words" value={segment.metrics.words} />
                      <MetricValue label="Secs" value={segment.metrics.seconds} />
                    </div>
                  </>
                )}
              </div>
            )}

            <div
              className={clsx(
                "size-full whitespace-pre-wrap px-3 py-1.5 leading-[1.4rem] text-gray-300",
                selected && "text-gray-200",
              )}
            >
              {segment.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricValue({ label, value }) {
  return (
    <>
      <span className="text-right text-[10px]">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-gray-400/70">{label}</span>
    </>
  );
}

export function TranscriptSegmentsPreview({
  segments = sampleSegments,
  showMetrics = true,
  showTimecodes = true,
  initialSelectedId,
  selectedId: controlledSelectedId,
  onSelectSegment,
}) {
  const isControlled = controlledSelectedId !== undefined;
  const [internalSelected, setInternalSelected] = useState(
    initialSelectedId ?? segments[0]?.id ?? null,
  );

  const selectedId = isControlled ? controlledSelectedId ?? null : internalSelected;

  useEffect(() => {
    if (isControlled) return;
    setInternalSelected(prev => {
      if (prev && segments.some(segment => segment.id === prev)) {
        return prev;
      }
      return initialSelectedId ?? segments[0]?.id ?? null;
    });
  }, [segments, initialSelectedId, isControlled]);

  return (
    <div className="relative flex size-full justify-center overflow-hidden bg-darkgray-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 [background:linear-gradient(to_top,transparent,rgb(17,17,18,0.75))] [mask-image:linear-gradient(to_bottom,rgb(17,17,18)_25%,transparent)]"
        style={{ height: 20 }}
      />
      <div className="size-full max-w-[800px] overflow-y-auto [scrollbar-color:rgb(64,64,64,0.9)_transparent] [scrollbar-width:thin]">
        <div className="relative size-full py-1" style={{ minHeight: 420 }}>
          {segments.map((segment, index) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              isFirstOfSpeaker={index === 0 || segments[index - 1].speakerLabel !== segment.speakerLabel}
              showMetrics={segment.showMetrics ?? showMetrics}
              showTimecode={segment.showTimecode ?? showTimecodes}
              selected={segment.id === selectedId || (!!segment.selected && !selectedId)}
              onSelect={() => {
                onSelectSegment?.(segment.id);
                if (!isControlled) setInternalSelected(segment.id);
              }}
            />
          ))}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 [background:linear-gradient(to_bottom,transparent,rgb(17,17,18,0.75))] [mask-image:linear-gradient(to_top,rgb(17,17,18)_25%,transparent)]"
        style={{ height: 20 }}
      />
    </div>
  );
}

function SliderPreview() {
  const [value, setValue] = useState(1);
  const min = 0.25;
  const max = 2.5;
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div
      className="flex items-center gap-2.5 whitespace-nowrap tabular-nums text-gray-300/90"
      data-rac=""
      role="group"
      aria-label="Volume Slider"
      data-orientation="horizontal"
    >
      <div className="flex" data-state="closed" tabIndex={-1}>
        <output
          aria-live="off"
          className="min-w-11 text-right"
          data-rac=""
          data-orientation="horizontal"
        >
          {value.toFixed(2)}x
        </output>
      </div>
      <div
        className="relative"
        data-rac=""
        data-orientation="horizontal"
        style={{ position: "relative", touchAction: "none", width: 100 }}
        onDoubleClick={() => setValue(1)}
        onClick={event => event.altKey && setValue(1)}
      >
        <div>
          <div className="absolute top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-darkgray-950" />
          <div
            className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-gray-400/50"
            style={{ width: `${percent}%` }}
          />
          <div
            className="top-1/2 size-[11px] overflow-hidden rounded-full border border-solid border-gray-300/20 bg-gray-400 shadow outline-none transition-all ease-out [transition-duration:50ms] active:border-gray-300/10 active:bg-gray-500"
            data-rac=""
            style={{
              position: "absolute",
              left: `${percent}%`,
              transform: "translate(-50%, -50%)",
              touchAction: "none",
            }}
          >
            <div className="sr-only">
              <input
                type="range"
                min={min}
                max={max}
                step={0.25}
                value={value}
                aria-orientation="horizontal"
                aria-valuetext={value.toString()}
                onChange={event => setValue(parseFloat(event.target.value))}
                onFocus={event => event.target.blur()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlayerMenuPopoverPreview() {
  return (
    <div className="min-w-[180px] max-w-md overflow-hidden rounded-[6px] border border-default/60 bg-[#1c1c1c] p-1 font-medium text-white/80 shadow-[0_8px_16px_rgba(0,0,0,0.25)] ring-[0.5px] ring-[#070707]">
      <button className="group flex h-[24px] w-full select-none items-center rounded-[4px] px-2.5 text-left text-[13px] text-white/70 hover:bg-default/80 hover:text-white/85">
        <Link2 className="mr-2 size-[15px]" />
        Change Linked Media…
      </button>
      <button className="group flex h-[24px] w-full select-none items-center rounded-[4px] px-2.5 text-left text-[13px] text-white/70 hover:bg-default/80 hover:text-white/85">
        <AudioWaveform className="mr-2 size-[15px]" />
        Refresh Audio Waveform
      </button>
    </div>
  );
}

export function TranscriptPlayerHeaderPreview() {
  return (
    <div className="relative z-10 flex shrink-0 flex-col overflow-hidden bg-gradient-to-b from-gray-800 to-gray-800/80 px-2 shadow-md">
      <div className="flex h-[38px] w-full items-center">
        <div className="flex items-center gap-2.5 overflow-hidden px-2">
          <button type="button" className="outline-none">
            <div className="-mx-1.5 flex h-full items-center rounded border border-transparent px-1.5 text-lg tabular-nums transition duration-75 ease-out hover:border-white/[.02] hover:bg-white/5">
              <div className="relative flex items-baseline gap-1.5 text-gray-100">
                00:00:02.2
                <p className="text-xs text-gray-400">/ 00:00:12.0</p>
              </div>
            </div>
          </button>
          <div className="flex h-full items-center">
            <button
              className="group h-full cursor-pointer select-none rounded-md px-2 outline-none transition duration-100"
              aria-label="Play"
            >
              <Play className="size-[17px] fill-gray-400 stroke-gray-400 stroke-[1.5] transition group-hover:fill-gray-100 group-hover:stroke-gray-100" />
            </button>
            <button
              className="group h-full cursor-pointer select-none rounded-md px-2 outline-none transition duration-100"
              aria-label="Open mini player"
            >
              <PictureInPicture2 className="size-[17px] stroke-[1.5] text-violet-400" />
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2.5 px-2 text-xs font-medium">
          <SliderPreview />
          <div className="relative flex items-center">
            <button
              type="button"
              className="flex size-[26px] items-center justify-center rounded-md text-gray-100 outline-none transition hover:bg-white/5"
            >
              <MoreVertical className="size-4 stroke-[1.6]" />
            </button>
            <div className="absolute right-0 top-[110%] hidden md:block">
              <PlayerMenuPopoverPreview />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-5 w-full px-2">
        <div className="group relative flex size-full cursor-pointer select-none items-center pb-2">
          <div className="absolute bottom-[25px] -translate-x-1/2 rounded-md border border-white/10 bg-black px-2 py-[3px] text-center text-xs font-bold text-white opacity-0 shadow-[0_4px_12px_3px_rgb(0,0,0,0.18)] transition group-hover:opacity-100">
            0:08
          </div>
          <span className="relative h-[4px] w-full overflow-hidden rounded bg-darkgray-950/85 shadow transition group-hover:h-[5px]">
            <span className="absolute h-full bg-arcgray-400/70 transition group-hover:h-[5px]" style={{ width: "19%" }} />
          </span>
          <span className="absolute left-[19%] flex h-[6px] w-[2px] -translate-x-1 rounded bg-sky-300 shadow shadow-darkgray-900" />
        </div>
      </div>
    </div>
  );
}

export function TranscriptWaveformPreview({
  segments,
  selectedId,
}) {
  const regions = useMemo(
    () =>
      segments.map(segment => ({
        id: segment.id,
        start: segment.waveStart ?? 0,
        end: segment.waveEnd ?? 0,
        text: segment.text,
      })),
    [segments],
  );

  return (
    <div className="relative flex flex-col overflow-hidden rounded-b-2xl bg-[#18181b]">
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff1 0, #fff1 1px, transparent 1px, transparent 6px)" }} />
        <div className="relative z-10 h-[140px]">
          <div className="absolute inset-y-0 left-0 w-full">
            {regions.map(region => (
              <div
                key={region.id}
                className={clsx(
                  "absolute top-0 h-full rounded-md bg-white/5 transition",
                  region.id === selectedId ? "bg-sky-300/40 shadow-[0_0_12px_rgba(125,211,252,0.45)]" : "bg-white/5",
                )}
                style={{
                  left: `${region.start * 100}%`,
                  width: `${(region.end - region.start) * 100}%`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-xs text-white/70">
                  <span className="line-clamp-2">{region.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="absolute top-0 h-full w-[2px] rounded bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.8)]"
            style={{ left: "19%" }}
          />
        </div>
      </div>
    </div>
  );
}

export function TranscriptWaveformBarePreview({
  segments,
}) {
  const regions = useMemo(
    () =>
      segments.map(segment => ({
        id: segment.id,
        start: segment.waveStart ?? 0,
        end: segment.waveEnd ?? 0,
        text: segment.text,
      })),
    [segments],
  );

  return (
    <div className="relative flex size-full flex-col overflow-hidden rounded-2xl bg-[#141418]">
      <div className="relative h-[160px] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.09) 0,rgba(255,255,255,0.09) 1px,transparent 1px,transparent 6px)" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(180deg,transparent,rgba(0,0,0,0.35))" }} />
        <div className="relative z-10 h-full">
          <div className="absolute inset-y-0 left-0 w-full">
            {regions.map(region => (
              <div
                key={region.id}
                className={clsx(
                  "absolute top-0 flex h-full flex-col justify-center rounded-md border border-white/5 bg-white/8 shadow-[0_0_14px_rgba(0,0,0,0.45)]",
                )}
                style={{ left: `${region.start * 100}%`, width: `${(region.end - region.start) * 100}%` }}
              >
                <div className="px-3 text-center text-[11px] leading-tight text-white/80">
                  {region.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 left-0 w-[20%] bg-sky-300/10" />
        <div className="absolute inset-y-0 left-[20%] w-[2px] -translate-x-1 rounded bg-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
      </div>
    </div>
  );
}

export function TranscriptWaveformComponentPreview({
  segments,
  progress = 0.38,
  height = 150,
  selectedSegmentId,
}) {
  const regions = useMemo(
    () =>
      segments.map(segment => ({
        id: segment.id,
        start: (segment.waveStart ?? 0) * 100,
        end: (segment.waveEnd ?? 0) * 100,
        text: segment.text,
      })),
    [segments],
  );

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-arcgray-900 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
      <div className="relative overflow-hidden" style={{ height }}>
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.04) 0,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px)" }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(180deg,rgba(5,5,5,0.65),transparent,rgba(5,5,5,0.45))" }} />

        <div className="relative z-10 h-full">
          <div
            className="absolute inset-0"
            style={{
              clipPath: `polygon(${progress * 100}% 0%, 100% 0%, 100% 100%, ${progress * 100}% 100%)`,
              backgroundColor: "rgba(12,12,12,0.35)",
              backdropFilter: "blur(2px)",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-stretch justify-between py-2">
            <div className="h-[2px] w-full bg-white/5" />
            <div className="h-[2px] w-full bg-white/5" />
            <div className="h-[2px] w-full bg-white/5" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="w-full">
              {regions.map(region => {
                const width = region.end - region.start;
                const selected = region.id === selectedSegmentId;
                return (
                  <div
                    key={region.id}
                    className={clsx(
                      "absolute top-0 h-full rounded-[2px] border border-white/5 bg-white/8 transition",
                      selected && "bg-sky-300/25 border-sky-200/40",
                    )}
                    style={{ left: `${region.start}%`, width: `${width}%` }}
                  >
                    <div className="absolute inset-y-0 left-0 w-[6px] rounded-l-[2px] border-l-2 border-black/40 bg-black/35" />
                    <div className="absolute inset-y-0 right-0 w-[6px] rounded-r-[2px] border-r-2 border-black/40 bg-black/35" />
                    <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-[11px] leading-tight text-white/75">
                      {region.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="absolute inset-y-0 left-0 bg-sky-300/12"
            style={{ width: `${progress * 100}%` }}
          />
          <div
            className="absolute inset-y-0 w-[1.5px] -translate-x-1 rounded bg-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.7)]"
            style={{ left: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function TranscriptPlayerPreview({
  segments,
  selectedId,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#111]">
      <TranscriptPlayerHeaderPreview />
      <TranscriptWaveformPreview segments={segments} selectedId={selectedId} />
    </div>
  );
}

export function PlayerSettingsPopoverPreview() {
  return (
    <div className="overflow-hidden rounded-[7px] border border-darkgray-100/[.11] bg-darkgray-800/80 text-[13px] font-medium shadow-[0_8px_16px_rgba(0,0,0,0.55)] outline outline-[0.5px] -outline-offset-2 outline-black/10 ring-[0.5px] ring-black/30 backdrop-blur-[10px] backdrop-saturate-[180%] flex min-w-[248px] shrink-0 flex-col p-3 px-4">
      <p className="font-semibold opacity-50">Time Display &amp; Nudge Settings</p>
      <ul className="group mt-2.5 space-y-2.5">
        <li className="flex items-center justify-center">
          <div className="flex w-full rounded-lg border border-darkgray-600/75 bg-black/85 text-gray-100">
            <button className="relative w-full cursor-default select-none rounded-md px-3 py-[3px] text-xs font-semibold text-gray-100">
              <span className="absolute inset-0 rounded-md border border-arcgray-100/5 bg-arcgray-400/55" />
              <span className="relative z-10">Standard</span>
            </button>
            <button className="relative w-full cursor-pointer select-none rounded-md px-3 py-[3px] text-xs font-semibold text-gray-100 hover:text-white">
              SMPTE
            </button>
          </div>
        </li>
        <li className="flex w-full items-center justify-between gap-1.5 px-px text-gray-200/70">
          <label>Frame Rate</label>
          <select className="h-[23px] w-[80px] rounded-[6px] border border-darkgray-600/75 bg-black/85 px-1.5 text-end font-bold tabular-nums text-white focus:outline-none">
            {["60", "59.94", "50", "30", "29.97", "25", "24", "23.976"].map(rate => (
              <option key={rate}>{rate}</option>
            ))}
          </select>
        </li>
        <li className="flex w-full items-center justify-between px-px text-gray-200/70">
          <label>Drop Frame</label>
          <button
            type="button"
            className="inline-flex touch-none scale-[.82] items-center rounded-full bg-gray-600 px-1 py-[3px] text-white"
          >
            Off
          </button>
        </li>
        <li className="flex w-full items-center justify-between px-px text-gray-200/70">
          <label>Start TC</label>
          <input
            className="h-[23px] w-[100px] rounded-[6px] border border-darkgray-600/75 bg-black/85 px-1.5 text-center font-bold tabular-nums text-white outline-none"
            value="0"
            readOnly
          />
        </li>
        <hr className="h-px w-full border-0 bg-white/5" />
        <li className="flex w-full items-center justify-between gap-1.5 px-px text-gray-200/90">
          <label>Nudge Step</label>
          <select className="h-[23px] w-[108px] rounded-[6px] border border-darkgray-600/75 bg-black/85 px-1.5 text-end font-bold tabular-nums text-white focus:outline-none">
            {["10 sec", "5 sec", "1 sec", "500 ms", "100 ms", "50 ms"].map(step => (
              <option key={step}>{step}</option>
            ))}
          </select>
        </li>
      </ul>
    </div>
  );
}

export function TranscriptViewPreview({
  showMetrics,
  showTimecodes,
  segments = sampleSegments,
} = {}) {
  const [selectedId, setSelectedId] = useState(segments[0]?.id ?? null);

  useEffect(() => {
    if (!selectedId || segments.some(segment => segment.id === selectedId)) {
      return;
    }
    setSelectedId(segments[0]?.id ?? null);
  }, [segments, selectedId]);

  const currentSegment = selectedId ? segments.find(seg => seg.id === selectedId) : segments[0];
  const progress = currentSegment ? (currentSegment.waveEnd ?? 0.2) : 0.2;

  return (
    <div className="flex min-h-[600px] flex-col rounded-[18px] border border-darkgray-600/55 bg-black/95 text-gray-100 shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
      <TranscriptTitleBarPreview />
      <div className="w-full px-3 pt-2">
        <TranscriptToolbarPreview />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-3 pb-4">
        <TranscriptSegmentsPreview
          segments={segments}
          showMetrics={showMetrics}
          showTimecodes={showTimecodes}
          selectedId={selectedId}
          onSelectSegment={setSelectedId}
        />
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex-1">
            <TranscriptPlayerPreview segments={segments} selectedId={selectedId} />
            <div className="mt-3">
              <TranscriptWaveformBarePreview segments={segments} />
              <div className="mt-3">
                <TranscriptWaveformComponentPreview
                  segments={segments}
                  progress={progress}
                  selectedSegmentId={selectedId ?? segments[0]?.id}
                  height={170}
                />
              </div>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <PlayerSettingsPopoverPreview />
            <div className="hidden lg:block">
              <PlayerMenuPopoverPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
