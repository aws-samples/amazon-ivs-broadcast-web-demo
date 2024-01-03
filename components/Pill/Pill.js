import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Pill({ type, children }) {
  const pillClass = twMerge(
    clsx(
      'text-xs font-mono px-3 py-1 rounded-full text-uiText ring-1 ring-inset ring-uiText/5 bg-surfaceAlt',
      {
        'bg-primary/10 ring-primary/10 text-primaryAlt': type === 'primary',
        'bg-secondary/10 ring-secondary/20 text-secondary':
          type === 'secondary',
        'bg-destruct/10 ring-destruct/20 text-destruct': type === 'destruct',
        'bg-positive/10 ring-positive/20 text-positive': type === 'positive',
      }
    )
  );

  return <div className={pillClass}>{children}</div>;
}
