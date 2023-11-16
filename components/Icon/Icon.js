import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export default function Icon({ type, size, children, ...additonalProps }) {
  const iconClass = twMerge(
    clsx(
      'inline-flex',
      'items-center',
      'justify-center',
      'fill-current',
      'w-6',
      'h-6',
      {
        'text-uiText': type === 'base',
        'text-uiTextAlt': type === 'inverted',
        'text-positive': type === 'success',
        'text-destruct': type === 'error',
        'text-warn': type === 'warn',
        'w-4 h-4': size === 'sm',
        'w-8 h-8': size === 'md',
        'w-12 h-12': size === 'lg',
        'w-24 h-24': size === 'xl',
      }
    )
  );

  return (
    <span className={iconClass} {...additonalProps}>
      {children}
    </span>
  );
}
