import React from 'react';
import { Users, User, ChevronDown } from 'lucide-react';
import { Button } from '@wd/components/ui/button';

// UserLabel component - can be used as a label or button
const UserLabel = ({
  name,
  icon: Icon = Users,
  variant = 'default',
  size = 'default',
  showChevron = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'flex items-center gap-2 transition-opacity';

  const variantClasses = {
    default: 'text-blue-600 dark:text-blue-400 hover:opacity-75',
    ghost: 'text-foreground hover:opacity-75',
    outline: 'border border-border rounded-md px-3 py-1.5 hover:bg-accent',
    subtle: 'text-muted-foreground hover:text-foreground',
  };

  const sizeClasses = {
    sm: 'text-sm',
    default: '',
    lg: 'text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      <Icon className={iconSizeClasses[size]} aria-hidden="true" />
      <span className="font-medium">{name}</span>
      {showChevron && <ChevronDown className={`${iconSizeClasses[size]} opacity-50`} />}
    </>
  );

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  }

  // Otherwise render as span/label
  return (
    <span className={combinedClasses} {...props}>
      {content}
    </span>
  );
};

const meta = {
  title: 'WhisperDesk/Primitives/UserLabel',
  component: UserLabel,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'User name to display',
    },
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'outline', 'subtle'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the label',
    },
    showChevron: {
      control: 'boolean',
      description: 'Show dropdown chevron icon',
    },
  },
  args: {
    name: 'Ava',
    variant: 'default',
    size: 'default',
    showChevron: false,
  },
};

export default meta;

// Default - Interactive button
export const Default = {
  args: {
    name: 'Ava',
    onClick: () => alert('User clicked!'),
  },
};

// With Chevron (Dropdown indicator)
export const WithChevron = {
  args: {
    name: 'Ava',
    showChevron: true,
    onClick: () => alert('Dropdown clicked!'),
  },
};

// Non-interactive label
export const Label = {
  args: {
    name: 'Ava',
    onClick: undefined, // No click handler = renders as span
  },
};

// Different variants
export const Variants = {
  render: () => (
    <div className="flex flex-col gap-4">
      <UserLabel name="Ava" variant="default" onClick={() => {}} />
      <UserLabel name="Ava" variant="ghost" onClick={() => {}} />
      <UserLabel name="Ava" variant="outline" onClick={() => {}} />
      <UserLabel name="Ava" variant="subtle" onClick={() => {}} />
    </div>
  ),
};

// Different sizes
export const Sizes = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <UserLabel name="Ava" size="sm" onClick={() => {}} />
      <UserLabel name="Ava" size="default" onClick={() => {}} />
      <UserLabel name="Ava" size="lg" onClick={() => {}} />
    </div>
  ),
};

// Different icons
export const WithDifferentIcons = {
  render: () => (
    <div className="flex flex-col gap-4">
      <UserLabel name="Ava" icon={Users} onClick={() => {}} />
      <UserLabel name="John" icon={User} onClick={() => {}} />
    </div>
  ),
};

// As part of a header
export const InHeader = {
  render: () => (
    <div className="bg-card border-b p-4 w-full max-w-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <UserLabel name="Ava" showChevron variant="outline" onClick={() => alert('Profile menu')} />
      </div>
    </div>
  ),
};

// Multiple users
export const UserList = {
  render: () => (
    <div className="bg-card border rounded-lg p-4 w-full max-w-md space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Team Members</h3>
      <div className="flex flex-col gap-2">
        {['Ava', 'James', 'Sarah', 'Michael'].map((name) => (
          <UserLabel
            key={name}
            name={name}
            icon={User}
            variant="ghost"
            onClick={() => alert(`Selected ${name}`)}
          />
        ))}
      </div>
    </div>
  ),
};

export { UserLabel };
