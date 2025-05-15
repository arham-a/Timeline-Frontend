import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function Dropdown({ options, value, onChange, disabled, placeholder }: DropdownProps) {
  const selected = options.find(opt => opt.value === value);
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled} as="div">
      <div className="relative">
        <Listbox.Button className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
          <span className={value ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}>
            {selected?.label ?? placeholder ?? 'Select...'}
          </span>
          <ChevronDownIcon className="w-5 h-5 text-[var(--color-text-secondary)]" aria-hidden="true" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-[var(--color-border)] rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
            {options.map(opt => (
              <Listbox.Option key={opt.value} value={opt.value} as={Fragment}>
                {({ active, selected }) => (
                  <li
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                      active ? 'bg-[var(--color-bg-purple-50)]' : ''
                    }`}
                  >
                    <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                      {opt.label}
                    </span>
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
} 