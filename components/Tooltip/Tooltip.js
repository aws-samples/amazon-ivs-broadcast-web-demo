import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export default function Tooltip({
  content,
  vAlign,
  hAlign,
  persist,
  hideAfter,
  children,
}) {
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(null);

  const showTip = () => {
    if (persist) {
      setActive(true);
    } else {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
      }, hideAfter || 4000);
      setTimer(timer);
    }
  };

  const hideTip = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setActive(false);
  };

  const tipClass = twMerge(
    clsx(
      'select-none',
      'bottom-full',
      'absolute',
      'font-medium',
      'text-sm text-uiTextAlt text-center',
      'py-1 px-3',
      'bg-surfaceAlt2/70 dark:bg-surfaceAlt2/90 backdrop-blur-sm',
      'rounded-full',
      'whitespace-nowrap',
      'pointer-events-none',
      'mb-2',
      {
        'top-full': vAlign === 'bottom',
        'left-0': hAlign === 'left',
        'right-0': hAlign === 'right',
        'left-1/2 transform -translate-x-1/2': !hAlign || hAlign === 'center',
      }
    )
  );

  return (
    <div
      className='relative flex'
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onFocus={showTip}
      onBlur={hideTip}
    >
      {children}
      {active && <div className={tipClass}>{content}</div>}
    </div>
  );
}
