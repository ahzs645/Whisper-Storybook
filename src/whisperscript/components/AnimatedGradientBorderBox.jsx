import clsx from 'clsx';
import React from 'react';

export default function AnimatedGradientBorderBox({
  borderColor = 'rgb(82 82 91 / 0.6)',
  lineColor = '#adbbff',
  lineOpacity = 100,
  className,
  children,
  ...props
}) {
  return (
    <div
      style={{
        '--border-color': borderColor,
        '--line-color': lineColor,
        '--line-opacity': lineOpacity / 100,
      }}
      className={clsx('relative ring-1 ring-black ring-opacity-5', className)}
      {...props}
    >
      <div
        className={clsx(
          'pointer-events-none absolute inset-0 transform-gpu border border-[--border-color] [-webkit-mask-composite:xor] [-webkit-mask:linear-gradient(#fff_0_0)_content-box,_linear-gradient(#fff_0_0)] [border-radius:inherit]',
          '[mask-composite:exclude] [mask-composite:xor] [mask-image:linear-gradient(#fff_0_0)_content-box,_linear-gradient(#fff_0_0)]',
          'before:absolute before:-inset-px before:bg-[conic-gradient(from_0deg,transparent_5%,_var(--line-color)_20%,_transparent_25%)]',
          'before:opacity-[--line-opacity] before:drop-shadow-[0_0_10px_var(--line-color)] before:content-[""]',
        )}
      />
      <div className="contents [border-radius:inherit]">{children}</div>
    </div>
  );
}
