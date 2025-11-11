import React from 'react';
import ToggleSwitch from '../../whisperscript/components/ToggleSwitch';

const meta = {
  title: 'Whisper Script/Components/Form Controls/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onPressedChange: { action: 'toggled' },
    accentColor: { control: 'color' },
  },
};

export default meta;

export const Default = {
  args: {
    defaultPressed: false,
  },
};

export const Pressed = {
  args: {
    defaultPressed: true,
  },
};

export const CustomAccentColor = {
  args: {
    defaultPressed: true,
    accentColor: 'rgb(255 107 107)',
  },
};

export const GreenAccent = {
  args: {
    defaultPressed: true,
    accentColor: 'rgb(34 197 94)',
  },
};
