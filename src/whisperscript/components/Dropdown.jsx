import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import React from 'react';

const SelectItem = ({ item, index, total }) => {
  if (item.items) {
    return (
      <>
        <Select.Group>
          <Select.Label className="relative flex h-[23px] cursor-default select-none items-center justify-start pl-1.5 pr-2 text-xs font-semibold tracking-tight text-white/50">
            {item.label}
          </Select.Label>
          {item.items.map((child, childIndex, arr) => (
            <SelectItem item={child} index={childIndex} total={arr.length} key={child.id} />
          ))}
        </Select.Group>
        {index < total - 1 && <Select.Separator className="m-1.5 h-px bg-white/10" />}
      </>
    );
  }

  return (
    <Select.Item
      value={item.id}
      className="relative flex h-[23px] select-none items-center gap-3 rounded-[4px] px-5 text-[13px] font-medium leading-none text-white/80 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-arcgray-600/85 data-[disabled]:text-white/20 data-[highlighted]:text-white/85"
      disabled={item.disabled}
    >
      <Select.ItemIndicator className="absolute left-0 flex w-5 items-center justify-center">
        <Check className="size-3.5" />
      </Select.ItemIndicator>
      <Select.ItemText>{item.label}</Select.ItemText>
      {item.description && <span className="ml-auto text-[11px] text-white/50">{item.description}</span>}
    </Select.Item>
  );
};

export default function Dropdown({
  id,
  items = [],
  defaultValue,
  onValueChange,
  onOpenChange,
  placeholder,
}) {
  return (
    <Select.Root key={defaultValue} defaultValue={defaultValue} onValueChange={onValueChange} onOpenChange={onOpenChange} required>
      <Select.Trigger
        id={id}
        className={clsx(
          'relative inline-flex h-[22px] min-w-[47px] cursor-default items-center justify-center gap-1 overflow-visible text-nowrap rounded-md pl-1 text-[13px] font-medium text-white outline-none data-[placeholder]:text-white/60',
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronsUpDown className="size-3 text-white/80" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-md border border-arcgray-100/[.11] bg-[#1c1c1c]/[.83] font-medium shadow-[0_8px_16px_rgba(0,0,0,0.25)] ring-[0.5px] ring-[#070707] brightness-150 backdrop-blur-lg backdrop-saturate-[2]">
          <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center text-white">
            <ChevronUp className="size-4" />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            {items.map((item, index) => (
              <SelectItem key={item.id} item={item} index={index} total={items.length} />
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center text-white">
            <ChevronDown className="size-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
