import { Mic, Clock, FileAudio, Settings2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@wd/components/ui/card';
import { Badge } from '@wd/components/ui/badge';
import { Button } from '@wd/components/ui/button';
import { Progress } from '@wd/components/ui/progress';

const meta = {
  title: 'WhisperDesk/Surfaces/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const SessionOverview = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-lg border-border/70">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live capture</CardTitle>
            <Badge variant="secondary" className="gap-2 font-medium">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              Recording
            </Badge>
          </div>
          <CardDescription>Low-latency stream captured from Rode NT-USB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-card/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Duration</p>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="size-4 text-muted-foreground" />
                04:12
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Active model</p>
              <div className="text-lg font-semibold">Whisper Medium</div>
              <p className="text-xs text-muted-foreground">GPU accelerated</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Transcription confidence</span>
              <span>82%</span>
            </div>
            <Progress value={82} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex w-full flex-wrap items-center gap-3">
          <Button className="flex-1 min-w-[160px]">
            <Mic className="size-4" />
            End session
          </Button>
          <Button variant="outline" className="flex-1 min-w-[160px]">
            <Settings2 className="size-4" />
            Input routing
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Latest transcription</CardTitle>
          <CardDescription>Snapshots are stored locally and encrypted at rest.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
            <FileAudio className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">UX feedback call</p>
              <p className="text-xs text-muted-foreground">41 min · 526 MB</p>
            </div>
            <Badge variant="outline" className="ml-auto">Clean audio</Badge>
          </div>

          <p className="rounded-lg border border-border/70 bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
            “…and then we validated lighting variations with the new diarization branch. The model kept speaker
            boundaries at ±100 ms which is exactly what we needed for chaptering…”
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="ghost">Open transcript</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
