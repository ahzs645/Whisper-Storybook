import { CheckCircle2, Upload, Wand2, Waves, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@wd/components/ui/card';
import { Progress } from '@wd/components/ui/progress';
import { Badge } from '@wd/components/ui/badge';

const meta = {
  title: 'WhisperDesk/Feedback/Status',
};

export default meta;

const steps = [
  {
    icon: Upload,
    label: 'Upload',
    description: 'Encrypted chunks streamed to the GPU node.',
    progress: 100,
    status: 'Complete',
  },
  {
    icon: Wand2,
    label: 'Transcribe',
    description: 'Running Whisper Medium w/ VAD boost.',
    progress: 72,
    status: 'In progress',
  },
  {
    icon: Waves,
    label: 'Diarize',
    description: 'Merging speakers with adaptive thresholding.',
    progress: 35,
    status: 'Queued',
  },
  {
    icon: Zap,
    label: 'Summaries',
    description: 'Generating action items + chapter markers.',
    progress: 0,
    status: 'Waiting',
  },
];

export const Pipeline = {
  render: () => (
    <Card className="border-border/70 bg-card/70 shadow-lg">
      <CardHeader>
        <CardTitle>Processing timeline</CardTitle>
        <CardDescription>Every stage exposes granular progress for monitoring and QA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.label} className="grid gap-4 rounded-xl border border-border/60 bg-background/60 p-4 md:grid-cols-[auto,1fr]">
            <div className="flex items-center gap-3">
              <step.icon className="size-10 rounded-full bg-primary/10 p-2 text-primary" />
              <div>
                <p className="font-medium">{index + 1}. {step.label}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                <span>{step.status}</span>
                {step.progress > 0 ? <span>{step.progress}%</span> : <Badge variant="outline">Not started</Badge>}
              </div>
              <Progress value={step.progress} className="h-2" />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-green-500" />
          GPU utilization at 63%
        </div>
      </CardContent>
    </Card>
  ),
};
