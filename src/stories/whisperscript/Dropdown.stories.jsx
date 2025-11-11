import React from 'react';
import Dropdown from '../../whisperscript/components/Dropdown';

const meta = {
  title: 'Whisper Script/Components/Form Controls/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onValueChange: { action: 'value changed' },
    onOpenChange: { action: 'open changed' },
  },
};

export default meta;

const sampleItems = [
  { id: 'option1', label: 'Option 1' },
  { id: 'option2', label: 'Option 2' },
  { id: 'option3', label: 'Option 3' },
];

const itemsWithDescriptions = [
  { id: 'small', label: 'Small', description: 'Tiny model, fastest' },
  { id: 'medium', label: 'Medium', description: 'Balanced speed and accuracy' },
  { id: 'large', label: 'Large', description: 'Best accuracy, slower' },
];

export const Default = {
  args: {
    items: sampleItems,
    defaultValue: 'option1',
    placeholder: 'Select an option',
  },
};

export const WithDescriptions = {
  args: {
    items: itemsWithDescriptions,
    defaultValue: 'medium',
    placeholder: 'Choose size',
  },
};

export const DisabledOption = {
  args: {
    items: [
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
      { id: 'gamma', label: 'Gamma', disabled: true },
    ],
    defaultValue: 'alpha',
    placeholder: 'Pick option',
  },
};

export const Grouped = {
  args: {
    items: [
      {
        id: 'model-small',
        label: 'Lightweight',
        items: [
          { id: 'tiny', label: 'Tiny' },
          { id: 'small', label: 'Small' },
        ],
      },
      {
        id: 'model-large',
        label: 'Advanced',
        items: [
          { id: 'medium', label: 'Medium' },
          { id: 'large', label: 'Large' },
        ],
      },
    ],
    placeholder: 'Select model',
  },
};
