import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export default function Spacer({ size }) {
  const sizeClass = twMerge(
    clsx('w-full', 'h-0', 'border-b border-border', 'pt-5 mb-5', {
      'pt-1 mb-1': size === 'sm',
      'pt-2 mb-2': size === 'md',
      'pt-4 mb-4': size === 'lg',
      'pt-6 mb-6': size === 'lg',
    })
  );
  return <div className={sizeClass}></div>;
}
