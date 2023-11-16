import { twMerge } from 'tailwind-merge';
import styles from './Input.module.css';
import { useState } from 'react';
import clsx from 'clsx';

export default function Input({
  children,
  onChange,
  defaultValue,
  hint,
  error,
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
      {
        'bg-destruct/10 ring-2 ring-destruct/10 text-destruct placeholder:text-destruct hover:text-destructAlt hover:ring-destruct/20 hover:bg-destruct/20 focus-visible:text-destructAlt focus-visible:ring-destruct/40 focus-visible:bg-destruct/10':
          error,
      }
    )
  );

  return (
    <div className='relative mt-1'>
      <input
        onChange={handleChange}
        className={selectClass}
        value={value}
        {...inputProps}
      />
      {error ? (
        <span className='text-xs inline-block mt-2 text-destruct/75'>{`${error}`}</span>
      ) : (
        <span className='text-xs inline-block mt-2 text-uiText/50'>{`${hint}`}</span>
      )}
    </div>
  );
}
