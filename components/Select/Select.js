import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

export default function Select({
  hint,
  onChange,
  defaultValue,
  options,
  disabled,
  id,
}) {
  const defaultOption = options.find(
    (option) => option.value === defaultValue.toString()
  );
  const [value, setValue] = useState(defaultOption);

  const handleChange = (option) => {
    onChange(option);
    setValue(option);
  };

  return (
    <div>
      <div className='flex w-full items-center gap-x-1'>
        <Listbox
          value={value}
          by='value'
          onChange={handleChange}
          disabled={disabled || false}
        >
          <div className='grow relative mt-1'>
            <Listbox.Button
              className='relative w-full cursor-default rounded-lg bg-surfaceAlt/75 hover:bg-surfaceAlt py-2 pl-3 pr-10 text-left appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-surfaceAlt2/25 focus-visible:ring-offset-2 ring-offset-surface sm:text-sm disabled:opacity-75 disabled:pointer-events-none disabled:ring-0 disabled:cursor-not-allowed'
              id={id}
            >
              <span className='block truncate'>{value && value.label}</span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                {!disabled && (
                  <ChevronUpDownIcon
                    className='h-5 w-5 text-uiText/50'
                    aria-hidden='true'
                  />
                )}
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-surfaceAlt/75 dark-theme:bg-surfaceAlt/90 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm backdrop-blur'>
                {options.map((option, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary/20 text-primary' : 'text-uiText'
                      }`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected && (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-primary'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        {disabled && (
          <div className='flex shrink-0 items-center mt-1'>
            <Tooltip
              hAlign='right'
              content='This setting is locked. Stop streaming to change this setting.'
              persist={true}
            >
              <div
                className='inline-flex rounded-md appearance-none focus-visible:outline-none focus-visible:border-none focus-visible:bg-surfaceAlt focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-uiText/10 hover:cursor-not-allowed hover:outline-none hover:border-none hover:bg-surfaceAlt hover:ring-1 hover:ring-inset hover:ring-uiText/50'
                tabIndex='0'
              >
                <Icon size='md'>
                  <LockClosedIcon className='p-2 text-uiText/50' />
                </Icon>
              </div>
            </Tooltip>
          </div>
        )}
      </div>
      {hint && (
        <span className='text-xs inline-block mt-2 text-uiText/50'>{hint}</span>
      )}
    </div>
  );
}
