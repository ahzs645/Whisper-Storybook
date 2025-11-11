import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import React from 'react';

function ModalContent({
  title,
  overlay = true,
  animationClasses = 'data-[state=closed]:animate-[dialog-overlay-hide_200ms] data-[state=open]:animate-[dialog-overlay-show_200ms]',
  className,
  children,
  ...props
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={clsx('fixed inset-0 bg-black', overlay ? 'bg-opacity-50' : 'bg-opacity-0', animationClasses)}
      />

      <Dialog.Content
        aria-describedby={undefined}
        className={clsx(
          'fixed left-1/2 top-1/2 h-fit max-h-[calc(100vh-16px)] w-fit -translate-x-1/2 -translate-y-1/2 outline-none',
          animationClasses,
          className,
        )}
        {...props}
      >
        <VisuallyHidden asChild>
          <Dialog.Title>{title}</Dialog.Title>
        </VisuallyHidden>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default function Modal({ open, onOpenChange, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      {children}
    </Dialog.Root>
  );
}

Modal.Button = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
