import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger } from '@wd/components/ui/dropdown-menu';
import { Button } from '@wd/components/ui/button';
import { Users } from 'lucide-react';
import { SpeakerRenameMenuContent } from '../../whisperdesk/transcription/SpeakerRenameMenuContent';

const meta = {
  title: 'WhisperDesk/Transcription/Docs/Speaker Rename Menu',
  component: SpeakerRenameMenuContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const InteractivePreview = () => {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState('Ava');

  return (
    <div className="space-y-4 max-w-md">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            {open ? 'Hide Menu' : 'Show Menu'}
          </Button>
        </DropdownMenuTrigger>
        <SpeakerRenameMenuContent
          speakerLabel="Ava"
          speakerColors={{ text: 'text-blue-600 dark:text-blue-400' }}
          renameValue={value}
          onInputChange={setValue}
          onRename={() => setOpen(false)}
        />
      </DropdownMenu>
      <p className="text-xs text-muted-foreground">
        Rename value:
        <span className="font-mono text-foreground ml-1">{value || '(empty)'}</span>
      </p>
    </div>
  );
};

InteractivePreview.parameters = {
  docs: {
    description: {
      story:
        'Preview the dedicated component used to rename speakers within the grouped transcript view. Use the trigger button to show or hide the dropdown and type a new label to simulate the workflow.',
    },
  },
};
