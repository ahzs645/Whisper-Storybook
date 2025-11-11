import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

const categories = ['Bug Report', 'Feature Request', 'General Feedback', 'Question', 'Other'];

export default function FeedbackModal({ open, onOpenChange, appName = 'undefined' }) {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    console.log({ email, category, message });
    // Reset form
    setEmail("");
    setCategory("");
    setMessage("");
    onOpenChange?.(false);
  };

  const handleReset = () => {
    setEmail("");
    setCategory("");
    setMessage("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed size-fit outline-none"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
          }}
        >
          <div
            className="flex origin-center flex-col rounded-xl border border-white/10 bg-arcgray-600 p-1 shadow-[0_8px_16px_rgba(0,0,0,0.55)] ring-[0.5px] ring-black/30 backdrop-blur-lg"
            style={{ opacity: 1, transform: "scale(1)" }}
          >
            <div className="rounded-lg border border-white/10 bg-arcgray-900">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="relative flex flex-col justify-between gap-[10px] p-3">
                  <div className="inline-flex justify-between">
                    <p className="text-gray-100">Send Feedback</p>
                    <div className="inline-flex items-center gap-x-[5px]">
                      {/* Logo SVG */}
                      <svg className="size-[24px]" viewBox="0 0 731 385" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_i_67_7)">
                          <path d="M468.113 131.468C505.653 99.9942 577.742 116.409 611.9 139.09C537.534 70.1867 439.794 58.6684 344.774 99.4883C270.888 138.069 227.707 216.629 235.567 299.452C242.009 332.214 245.99 350.512 269.582 384.979H459.351C394.609 322.978 389.96 191.413 468.113 131.468Z" fill="url(#paint0_linear_67_7)" fillOpacity="0.7"></path>
                          <path d="M611.9 139.09C547.887 42.7225 468.094 -19.2849 344.774 5.45405C166.412 51.2098 187.479 269.497 49.1885 357.957C24.119 373.993 1.09001 385.561 0.00326382 384.979C-1.08349 384.397 269.582 384.979 269.582 384.979C245.99 350.512 242.009 332.214 235.567 299.452C227.707 216.629 270.888 138.069 344.774 99.4883C439.794 58.6684 537.534 70.1867 611.9 139.09Z" fill="url(#paint1_linear_67_7)"></path>
                          <path d="M731 384.979C639.549 370.472 569.011 353.951 502.033 286.968C479.418 264.351 420.625 180.799 468.113 131.468C389.96 191.413 394.609 322.978 459.351 384.979L731 384.979Z" fill="url(#paint2_linear_67_7)" fillOpacity="0.8"></path>
                        </g>
                        <defs>
                          <filter id="filter0_i_67_7" x="0" y="0" width="731" height="387" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                            <feOffset dy="2"></feOffset>
                            <feGaussianBlur stdDeviation="2.5"></feGaussianBlur>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                            <feBlend mode="hard-light" in2="shape" result="effect1_innerShadow_67_7"></feBlend>
                          </filter>
                          <linearGradient id="paint0_linear_67_7" x1="390.816" y1="287.172" x2="252.035" y2="119.54" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0A79AF"></stop>
                            <stop offset="1" stopColor="#003B53"></stop>
                          </linearGradient>
                          <linearGradient id="paint1_linear_67_7" x1="460.26" y1="14.7184" x2="-0.681183" y2="363.168" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#45C9FF" stopOpacity="0.9"></stop>
                            <stop offset="1" stopColor="#235A6D" stopOpacity="0.83"></stop>
                          </linearGradient>
                          <linearGradient id="paint2_linear_67_7" x1="628.154" y1="359.754" x2="405.166" y2="289.976" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#46A1D7"></stop>
                            <stop offset="1" stopColor="#1E3949"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <p className="mr-1 text-sm font-medium text-gray-300">{appName} Support</p>
                    </div>
                  </div>

                  {/* Email Input */}
                  <input
                    placeholder="-- Please enter your email address --"
                    spellCheck="false"
                    className="inline-flex h-[26px] w-[244px] select-none items-center justify-center gap-1 whitespace-nowrap rounded-md border border-white/[.07] bg-white/[.08] px-3 text-[13px] font-medium tracking-tight text-white outline-none transition-all duration-100 ease-out"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {/* Category Dropdown */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        type="button"
                        className="inline-flex h-[26px] w-fit select-none items-center justify-center gap-1 whitespace-nowrap rounded-md border border-white/[.07] bg-white/[.08] px-3 text-[13px] font-medium tracking-tight text-white outline-none transition-all duration-100 ease-out data-[state=open]:border-white/10 data-[state=open]:bg-white/10"
                      >
                        {category || "-- Please select a category --"}
                        <ChevronsUpDown className="size-3 opacity-80" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="min-w-[220px] rounded-md border border-white/10 bg-arcgray-800 p-1 shadow-lg">
                        {categories.map((cat) => (
                          <DropdownMenu.Item
                            key={cat}
                            className="cursor-pointer rounded px-2 py-1.5 text-sm text-gray-100 outline-none hover:bg-white/10"
                            onSelect={() => setCategory(cat)}
                          >
                            {cat}
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                {/* Divider */}
                <div className="relative mx-2 border-b border-arcgray-700"></div>

                {/* Message Textarea */}
                <textarea
                  name="message"
                  placeholder="Your Feedback..."
                  className="max-h-[50vh] min-h-[200px] min-w-[410px] max-w-full flex-1 resize-none text-pretty bg-arcgray-900 p-3 text-[14px] text-gray-100 outline-none transition duration-200 ease-out [field-sizing:content] [scroll-padding-block:12px] selection:bg-[#41B7E8]/40"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* Footer */}
                <div className="relative flex h-12 items-center px-2.5">
                  <svg className="absolute inset-x-0 -top-px px-[6px] text-arcgray-600" width="100%" height="2" viewBox="0 0 100 2" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 1H100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke"></path>
                  </svg>

                  {/* Corner decorations */}
                  <div className="absolute left-0 top-0 -translate-x-[1px] -translate-y-1/2 text-arcgray-600">
                    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_2029_22)">
                        <path d="M0 2C0.656613 2 1.30679 2.10346 1.91341 2.30448C2.52005 2.5055 3.07124 2.80014 3.53554 3.17157C3.99982 3.54301 4.36812 3.98396 4.6194 4.46927C4.87067 4.95457 5 5.47471 5 6C5 6.52529 4.87067 7.04543 4.6194 7.53073C4.36812 8.01604 3.99982 8.45699 3.53554 8.82843C3.07124 9.19986 2.52005 9.4945 1.91341 9.69552C1.30679 9.89654 0.656613 10 0 10V6V2Z" fill="currentColor"></path>
                        <path d="M1 12V10C2.06087 10 3.07828 9.57857 3.82843 8.82843C4.57857 8.07828 5 7.06087 5 6C5 4.93913 4.57857 3.92172 3.82843 3.17157C3.07828 2.42143 2.06087 2 1 2V0" stroke="rgb(255,255,255,0.01)" strokeWidth="1" strokeLinejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_2029_22">
                          <rect width="6" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-[1px] rotate-180 text-arcgray-600">
                    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_2029_22)">
                        <path d="M0 2C0.656613 2 1.30679 2.10346 1.91341 2.30448C2.52005 2.5055 3.07124 2.80014 3.53554 3.17157C3.99982 3.54301 4.36812 3.98396 4.6194 4.46927C4.87067 4.95457 5 5.47471 5 6C5 6.52529 4.87067 7.04543 4.6194 7.53073C4.36812 8.01604 3.99982 8.45699 3.53554 8.82843C3.07124 9.19986 2.52005 9.4945 1.91341 9.69552C1.30679 9.89654 0.656613 10 0 10V6V2Z" fill="currentColor"></path>
                        <path d="M1 12V10C2.06087 10 3.07828 9.57857 3.82843 8.82843C4.57857 8.07828 5 7.06087 5 6C5 4.93913 4.57857 3.92172 3.82843 3.17157C3.07828 2.42143 2.06087 2 1 2V0" stroke="rgb(255,255,255,0.01)" strokeWidth="1" strokeLinejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_2029_22">
                          <rect width="6" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <div className="relative flex flex-1 items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onOpenChange?.(false)}
                      className="inline-flex h-[26px] select-none items-center justify-center rounded-md border border-none px-2.5 text-xs font-medium text-white outline-none transition-all duration-100 ease-out hover:active:opacity-75"
                    >
                      Cancel
                    </button>
                    <div className="inline-flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex h-[26px] select-none items-center justify-center rounded-md border border-white/5 bg-white/[.08] px-2.5 text-xs font-medium text-white outline-none transition-all duration-100 ease-out hover:active:opacity-75"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        className="relative inline-flex h-[26px] w-[116px] cursor-pointer select-none items-center justify-center overflow-hidden text-nowrap rounded-md border border-[#41B7E8]/15 bg-[#41B7E8]/45 px-3 text-xs font-medium text-white outline-none transition-all duration-100 ease-out hover:active:opacity-75 disabled:pointer-events-none"
                      >
                        <span style={{ opacity: 1 }}>Send Feedback</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <VisuallyHidden asChild>
            <Dialog.Title></Dialog.Title>
          </VisuallyHidden>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function FeedbackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-6 w-fit cursor-default select-none items-center justify-center rounded-md bg-darkgray-950 px-2.5 py-1 outline-none ring-2 ring-black/15 transition-all duration-100 ease-out hover:active:brightness-75 disabled:pointer-events-none"
    >
      <p className="truncate text-xs text-gray-200">Feedback</p>
    </button>
  );
}
