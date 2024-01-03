import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import clsx from 'clsx';
import Tooltip from '@/components/Tooltip';
import Icon from '@/components/Icon';
import { LockClosedIcon } from '@heroicons/react/20/solid';

export default function Input({
  children,
  onChange,
  defaultValue,
  hint,
  error,
  disabled,
  ...inputProps
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    onChange(e);
    setValue(e.target.value);
  };

  const selectClass = twMerge(
    clsx(
      'relative',
      'w-full',
      'rounded-lg',
      'bg-surfaceAlt/75 hover:bg-surfaceAlt',
      'py-2',
      'pl-3',
      'pr-10',
      'text-left',
      'appearance-none',
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-surfaceAlt2/25',
      'focus-visible:ring-offset-2',
      'ring-offset-surface',
      'sm:text-sm',
      'disabled:opacity-75',
      {
        'bg-destruct/10 ring-2 ring-destruct/10 text-destruct placeholder:text-destruct hover:text-destructAlt hover:ring-destruct/20 hover:bg-destruct/20 focus-visible:text-destructAlt focus-visible:ring-destruct/40 focus-visible:bg-destruct/10':
          error,
      }
    )
  );

  return (
    <div className='relative mt-1'>
      <div className='flex w-full items-center gap-x-1'>
        <input
          onChange={handleChange}
          className={selectClass}
          value={value}
          disabled={disabled || false}
          {...inputProps}
        />
        {disabled && (
          <div className='flex shrink-0 items-center'>
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
      {error ? (
        <span className='text-xs inline-block mt-2 text-destruct/75'>{`${error}`}</span>
      ) : (
        <span className='text-xs inline-block mt-2 text-uiText/50'>{`${hint}`}</span>
      )}
    </div>
  );
}
