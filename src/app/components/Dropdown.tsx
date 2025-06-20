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
        <Listbox.Button className="w-full bg-black/40 border border-cyan-900/40 rounded-lg px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-300 backdrop-blur transition-colors">
          <span className={value ? 'text-white' : 'text-gray-300'}>
            {selected?.label ?? placeholder ?? 'Select...'}
          </span>
          <ChevronDownIcon className="w-5 h-5 text-cyan-300" aria-hidden="true" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-black/90 border border-cyan-900/40 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none backdrop-blur">
            {options.map(opt => (
              <Listbox.Option key={opt.value} value={opt.value} as={Fragment}>
                {({ active, selected }) => (
                  <li
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-white transition-colors ${
                      active ? 'bg-cyan-900/40' : ''
                    }`}
                  >
                    <span className={`${selected ? 'font-semibold text-cyan-300' : 'font-normal'} block truncate`}>
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