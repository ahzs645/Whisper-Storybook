import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import AnimatedGradientBorderBox from './AnimatedGradientBorderBox';
import FadeSlide from './animations/FadeSlide';

const defaultCopy = (
  <span>
    Enjoy unlimited offline transcription and full access to all editing &amp; export features
    <br />- with no restrictions during your trial.
    <br />
    <br />
    Try it free and cancel anytime.
  </span>
);

const haloStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  zIndex: 0,
  width: '530px',
  height: '200px',
  transform: 'translate(-50%, -50%) rotate(6deg) scale(1.5)',
  borderRadius: '9999px',
  backgroundImage: 'radial-gradient(169.40% 89.55% at 94.76% 6.29%, rgba(0, 0, 0, 0.10) 0%, rgba(173, 187, 255, 0.29) 85%)',
  filter: 'blur(24px)',
  pointerEvents: 'none',
  animationDuration: '6s',
};

export default function TrialModal({
  open,
  onOpenChange,
  onStartTrial,
  onLogin,
  trialDuration = 'undefined',
  title,
  description,
  ctaLabel,
  loginLabel,
}) {
  const sanitizedDuration = trialDuration && trialDuration !== 'undefined' ? trialDuration : null;
  const displayTitle = title ?? (sanitizedDuration ? `Start your Free ${sanitizedDuration} Trial` : 'Start your Free Trial');
  const descriptionContent = description ?? defaultCopy;
  const primaryLabel = ctaLabel ?? 'Start Free Trial Now';
  const secondaryLabel = loginLabel ?? 'Already have an account? Log in';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed size-fit outline-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
          }}
        >
          <div className="relative flex h-fit w-[95vw] max-w-[680px] flex-col items-center overflow-hidden rounded-[18px] border border-darkgray-600/55 bg-black px-8 pb-10 pt-8 font-sans text-sm font-medium shadow-[0_8px_16px_rgba(0,0,0,0.6)] ring-[0.5px] ring-black/100 brightness-110 backdrop-blur-md backdrop-saturate-150">
            <AnimatedGradientBorderBox
              lineColor="#adbbff"
              lineOpacity={75}
              borderColor="transparent"
              className="relative size-full rounded-2xl shadow-[0_12px_48px_8px_rgba(173,187,255,0.125)]"
            >
              <div
                className="absolute left-1/2 top-1/2 z-0 h-[200px] w-[530px] -translate-x-1/2 -translate-y-1/2 rotate-6 scale-150 transform-gpu animate-pulse-80 rounded-full bg-[radial-gradient(169.40%_89.55%_at_94.76%_6.29%,rgba(0,0,0,0.10)_0%,rgba(173,187,255,0.29)_85%)] blur-xl [animation-duration:6s]"
                style={haloStyle}
                aria-hidden
              />

              <div className="absolute inset-0 z-10 border border-[#adbbff]/[.125] shadow-2xl shadow-black/40 ring-[0.5px] ring-black/20 backdrop-blur-md backdrop-brightness-125 [border-radius:inherit] before:opacity-50" />

              <div className="relative z-20 flex h-[280px] w-full flex-col items-center justify-center gap-8 bg-[#adbbff]/[.03] text-center text-3xl text-pretty [border-radius:inherit]">
                <div className="flex flex-col items-center pt-6">
                  <FadeSlide className="flex flex-col items-center">
                    <span className="bg-gradient-to-r from-slate-300/90 via-slate-300 via-55% to-slate-300/65 bg-clip-text text-[31px] font-medium text-transparent [text-shadow:0px_1px_1.5px_rgba(0,0,0,0.08)]">
                      {displayTitle}
                    </span>
                  </FadeSlide>

                  <FadeSlide className="mt-4 flex flex-col items-center">
                    <span className="text-sm text-slate-300/80">{descriptionContent}</span>
                  </FadeSlide>

                  <FadeSlide className="mt-4 flex flex-col items-center">
                    <button
                      className="group relative z-50 flex h-10 w-fit items-center justify-center gap-2.5 text-nowrap rounded-xl border border-[#adbbff]/[.14] bg-[#adbbff] bg-opacity-30 px-8 py-2.5 text-[17px] font-medium text-white shadow-[0_0px_50px_-13px] shadow-black/80 outline-none backdrop-blur-md transition-all duration-300 ease-out [text-shadow:rgb(0,0,0,0.4)_0_0_10px] hover:bg-opacity-40 active:bg-opacity-30"
                      type="button"
                      onClick={() => onStartTrial?.()}
                    >
                      <span className="to-slafrom-slate-200/80 bg-gradient-to-r from-slate-100 via-slate-100 via-60% to-slate-200/80 bg-clip-text font-medium text-transparent [text-shadow:0px_1px_1.5px_rgba(0,0,0,0.1)]">
                        {primaryLabel}
                      </span>
                      <ArrowRight className="size-[15px] stroke-2 transition-transform duration-300 ease-out group-hover:translate-x-2 active:translate-x-1.5" />
                    </button>

                    <button
                      className="relative flex items-center justify-center gap-1.5 text-nowrap px-4 py-2 text-[14px]/9 font-medium text-gray-200 text-opacity-90 decoration-white/45 underline-offset-2 outline-none transition-all duration-300 ease-out [text-shadow:rgb(0,0,0,0.2)_0_0_10px] hover:text-white active:text-white/50"
                      type="button"
                      onClick={() => onLogin?.()}
                    >
                      {secondaryLabel}
                    </button>
                  </FadeSlide>
                </div>
              </div>
            </AnimatedGradientBorderBox>
          </div>

          <VisuallyHidden asChild>
            <Dialog.Title>{displayTitle}</Dialog.Title>
          </VisuallyHidden>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
