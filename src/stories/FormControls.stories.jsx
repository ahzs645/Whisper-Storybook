import React, { useState } from 'react';
import { Input } from '@wd/components/ui/input';
import { Textarea } from '@wd/components/ui/textarea';
import { Label } from '@wd/components/ui/label';
import { Switch } from '@wd/components/ui/switch';
import { Button } from '@wd/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@wd/components/ui/select';
import { Slider } from '@wd/components/ui/slider';
import { Badge } from '@wd/components/ui/badge';

const meta = {
  title: 'WhisperDesk/Forms/Controls',
};

export default meta;

export const CapturePreferences = {
  render: () => {
    const [autoStart, setAutoStart] = useState(true);
    const [levels, setLevels] = useState([68]);

    return (
      <div className="grid gap-8 rounded-2xl border border-border/70 bg-card/60 p-8 shadow-xl lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Capture profile</h3>
            <p className="text-sm text-muted-foreground">
              Route devices, audio focus, and fallback behavior for the desktop client.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="session-name">Session name</Label>
            <Input id="session-name" placeholder="Customer feedback call" defaultValue="Growth review" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="summary">Live summary blurb</Label>
            <Textarea
              id="summary"
              rows={4}
              placeholder="Add context that the diarization model can seed before the meeting begins."
              defaultValue="Focus on timeline blockers and pricing feedback for the new collaboration tier."
            />
          </div>

          <div className="space-y-3">
            <Label>Sampling preset</Label>
            <Select defaultValue="studio">
              <SelectTrigger>
                <SelectValue placeholder="Choose preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio">Studio · 48 kHz</SelectItem>
                <SelectItem value="field">Field · 44.1 kHz</SelectItem>
                <SelectItem value="voice">Voice isolation · 32 kHz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Input gain</Label>
            <Slider
              value={levels}
              max={100}
              step={1}
              onValueChange={setLevels}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground">Current level: <span className="font-semibold">{levels[0]}%</span></p>
          </div>
        </div>

        <div className="space-y-8 rounded-xl border border-border/60 bg-background/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto start capture</p>
              <p className="text-xs text-muted-foreground">Begin listening as soon as the window gains focus.</p>
            </div>
            <Switch checked={autoStart} onCheckedChange={setAutoStart} />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">Notifications</p>
            <div className="flex flex-wrap gap-2">
              {['Recording', 'Diarization', 'Uploads'].map((label) => (
                <Badge key={label} variant="outline">
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input id="webhook" placeholder="https://hooks.zapier.com/..." />
            <p className="text-xs text-muted-foreground">
              Payload contains transcription chunks, speaker markers, and metadata.
            </p>
          </div>

          <Button className="w-full">Save capture preset</Button>
        </div>
      </div>
    );
  },
};
