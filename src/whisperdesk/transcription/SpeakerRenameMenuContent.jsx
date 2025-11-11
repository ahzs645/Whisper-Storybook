import React from 'react'
import { DropdownMenuContent } from '@wd/components/ui/dropdown-menu'
import { Button } from '@wd/components/ui/button'
import { Input } from '@wd/components/ui/input'
import { Users } from 'lucide-react'

export function SpeakerRenameMenuContent({
  speakerLabel,
  speakerColors = {},
  renameValue = '',
  onInputChange,
  onRename
}) {
  const handleRename = () => {
    if (onRename) {
      onRename()
    }
  }

  const handleInputChange = (event) => {
    if (onInputChange) {
      onInputChange(event.target.value)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleRename()
    }
  }

  const isRenameDisabled = !renameValue.trim()
  const textColor = speakerColors.text || ''

  return (
    <DropdownMenuContent align="start" className="bg-card border-border p-4 min-w-[320px]">
      <div className="text-muted-foreground text-sm mb-4">Change or Rename Speaker...</div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className={`w-4 h-4 ${textColor}`} />
            <span className={textColor}>{speakerLabel}</span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded">current</span>
        </div>

        <div className="flex gap-2">
          <Input
            value={renameValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Rename Speaker..."
            className="bg-background border-border text-foreground text-sm flex-1"
          />
          <Button
            onClick={handleRename}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4"
            disabled={isRenameDisabled}
          >
            Rename
          </Button>
        </div>
      </div>
    </DropdownMenuContent>
  )
}
