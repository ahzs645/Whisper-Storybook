import { ArrowRight, Loader2, Mic, Settings } from 'lucide-react';
import { Button } from '@wd/components/ui/button';

const meta = {
  title: 'WhisperDesk/Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
    },
  },
  args: {
    children: 'Primary action',
  },
};

export default meta;

export const Playground = {
  args: {
    variant: 'default',
    size: 'default',
  },
};

export const Variants = {
  render: () => (
    <div className="grid gap-3 w-full max-w-3xl md:grid-cols-3">
      {[
        { variant: 'default', label: 'Primary' },
        { variant: 'secondary', label: 'Secondary' },
        { variant: 'destructive', label: 'Destructive' },
        { variant: 'outline', label: 'Outline' },
        { variant: 'ghost', label: 'Ghost' },
        { variant: 'link', label: 'Link' },
      ].map(({ variant, label }) => (
        <div key={variant} className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Button variant={variant}>
            {label} action
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Compact</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Open settings">
        <Settings className="size-4" />
      </Button>
    </div>
  ),
};

export const WithIcons = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <Button>
        <Mic className="size-4" />
        Start recording
      </Button>
      <Button variant="secondary">
        Continue
        <ArrowRight className="size-4" />
      </Button>
      <Button variant="ghost">
        <Settings className="size-4" />
        Configure inputs
      </Button>
    </div>
  ),
};

export const LoadingState = {
  render: () => (
    <Button disabled className="gap-2">
      <Loader2 className="size-4 animate-spin" />
      Validating microphone…
    </Button>
  ),
};
