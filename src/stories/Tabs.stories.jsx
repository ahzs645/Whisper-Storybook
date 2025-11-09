import { Tabs, TabsContent, TabsList, TabsTrigger } from '@wd/components/ui/tabs';
import { ScrollArea } from '@wd/components/ui/scroll-area';
import { Badge } from '@wd/components/ui/badge';
import { Button } from '@wd/components/ui/button';
import { Separator } from '@wd/components/ui/separator';

const meta = {
  title: 'WhisperDesk/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

const transcripts = [
  {
    id: 'live',
    label: 'Live stream',
    status: 'Recording',
    content: 'Signal locked on loopback device, diarization running on GPU lane 1.',
  },
  {
    id: 'queue',
    label: 'Queue',
    status: '2 pending',
    content: '“Customer_feedback.wav” will kick off once the current run finishes.',
  },
  {
    id: 'history',
    label: 'History',
    status: '72 files',
    content: 'Browse encrypted transcriptions captured in the last 90 days.',
  },
];

export const CaptureWorkspace = {
  render: () => (
    <Tabs defaultValue="live" className="w-full">
      <TabsList className="grid w-full gap-3 rounded-2xl border border-border/70 bg-card/70 p-2 md:grid-cols-3">
        {transcripts.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex flex-col items-start gap-1 rounded-xl border border-transparent px-4 py-3 text-left data-[state=active]:border-border data-[state=active]:bg-background/70"
          >
            <span className="text-sm font-semibold">{tab.label}</span>
            <span className="text-xs text-muted-foreground">{tab.status}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {transcripts.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">{tab.label}</h3>
              <p className="text-sm text-muted-foreground">{tab.content}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{tab.status}</Badge>
              <Button variant="outline">Settings</Button>
              <Button>Open view</Button>
            </div>
          </div>
          <Separator className="my-6" />
          <ScrollArea className="h-48 rounded-xl border border-border/60 bg-background/60 p-4">
            {tab.id === 'live' && (
              <pre className="text-sm text-muted-foreground">
{`[00:04:12] Speaker A · We're testing the new GPU diarization branch.
[00:04:18] Speaker B · Levels look good on my side, minimal overlap detected.
[00:04:27] Speaker A · Perfect — mark this chunk for QA review later today.`}
              </pre>
            )}
            {tab.id === 'queue' && (
              <div className="space-y-3 text-sm">
                <p className="font-medium">Queued files</p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between rounded-lg border border-border/70 bg-card/50 p-3">
                    <span>customer_feedback.wav</span>
                    <Badge>Pending</Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-lg border border-border/70 bg-card/50 p-3">
                    <span>support_training.mp3</span>
                    <Badge variant="outline">Uploading</Badge>
                  </li>
                </ul>
              </div>
            )}
            {tab.id === 'history' && (
              <div className="space-y-3 text-sm">
                <p className="font-medium">Recent captures</p>
                <div className="space-y-2">
                  {['Daily standup', 'Roadmap sync', 'Design critique'].map((session) => (
                    <div key={session} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/40 p-3">
                      <span>{session}</span>
                      <Badge variant="secondary">Ready</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  ),
};
