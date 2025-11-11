import React, { useState } from 'react';
import Modal from '../../whisperscript/components/Modal';

const meta = {
  title: 'Whisper Script/Components/Overlays/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

const DefaultModalExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Button asChild>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Open Modal</button>
      </Modal.Button>
      <Modal.Content title="Example Modal">
        <div className="rounded-lg bg-gray-900 p-6 text-white shadow-xl">
          <h2 className="mb-4 text-xl font-semibold">Modal Title</h2>
          <p className="mb-4 text-gray-300">This is a modal dialog. Click outside or press ESC to close.</p>
          <Modal.Close asChild>
            <button className="rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">Close</button>
          </Modal.Close>
        </div>
      </Modal.Content>
    </Modal>
  );
};

const NoOverlayExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Button asChild>
        <button className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">Open (No Overlay)</button>
      </Modal.Button>
      <Modal.Content title="No Overlay Modal" overlay={false}>
        <div className="rounded-lg bg-gray-900 p-6 text-white shadow-xl ring-2 ring-white/20">
          <h2 className="mb-4 text-xl font-semibold">No Overlay</h2>
          <p className="mb-4 text-gray-300">This modal has no dark overlay background.</p>
          <Modal.Close asChild>
            <button className="rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">Close</button>
          </Modal.Close>
        </div>
      </Modal.Content>
    </Modal>
  );
};

const LargeContentExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Button asChild>
        <button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">Open Large Modal</button>
      </Modal.Button>
      <Modal.Content title="Large Content Modal">
        <div className="max-w-2xl rounded-lg bg-gray-900 p-6 text-white shadow-xl">
          <h2 className="mb-4 text-2xl font-semibold">Large Content</h2>
          <div className="mb-4 max-h-96 overflow-y-auto text-gray-300">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="mb-2">
                Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
            ))}
          </div>
          <Modal.Close asChild>
            <button className="rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600">Close</button>
          </Modal.Close>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export const Default = {
  render: () => <DefaultModalExample />,
};

export const NoOverlay = {
  render: () => <NoOverlayExample />,
};

export const LargeContent = {
  render: () => <LargeContentExample />,
};
