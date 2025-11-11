import React from 'react';

export function ActionCardsContainer({ children }) {
  return (
    <div className="absolute inset-0 -my-[3px] flex items-center gap-x-3.5 overflow-x-auto px-6 py-[3px] [&::-webkit-scrollbar]:h-0">
      {children}
    </div>
  );
}

export default function ActionCard({
  icon,
  title,
  description,
  badge,
  onClick,
  disabled = false,
  iconBgColor = 'rgba(244, 244, 245, 0.15)',
}) {
  return (
    <button
      type="button"
      className="group relative isolate flex h-[120px] w-[208px] shrink-0 cursor-default flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-zinc-100/10 text-sm font-medium tracking-tight text-zinc-100 outline-none outline-offset-1"
      onClick={onClick}
      disabled={disabled}
      tabIndex={0}
      style={{
        transformOrigin: 'center center',
        outlineColor: 'rgba(0, 0, 0, 0)',
        filter: 'brightness(1)',
      }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-sky-600/60 to-zinc-300/25 group-disabled:from-sky-600/30" />

      <div
        className="absolute left-2 top-2 z-10 size-[32px] rounded-lg border border-transparent bg-zinc-100/15 p-1.5 group-disabled:bg-zinc-100/5"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>

      {badge && (
        <div className="absolute right-2 top-2 inline-flex h-[18px] items-center justify-center rounded-[5px] bg-violet-900/85 px-2.5 text-[10px] text-violet-200 backdrop-blur">
          {badge}
        </div>
      )}

      <div className="z-10 flex flex-col gap-2">
        <p className="text-[15px] text-white [text-shadow:0px_1px_1.5px_rgba(0,0,0,0.05)]">{title}</p>
        <p className="text-[12px] leading-4 text-white/70">{description}</p>
      </div>
    </button>
  );
}
