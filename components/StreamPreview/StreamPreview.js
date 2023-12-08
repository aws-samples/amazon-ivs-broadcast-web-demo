import { useContext, useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import { LocalMediaContext } from '@/providers/LocalMediaContext';
import { UserSettingsContext } from '@/providers/UserSettingsContext';
import clsx from 'clsx';
import { BroadcastLayoutContext } from '@/providers/BroadcastLayoutContext';
import { HandRaisedIcon } from '@heroicons/react/24/outline';

export default function StreamPreview({ previewRef }) {
  const { permissions } = useContext(LocalMediaContext);
  const { screenShareActive, camActive } = useContext(BroadcastLayoutContext);
  const { localVideoMirror } = useContext(UserSettingsContext);

  const [mounted, setMounted] = useState(false);

  const shouldMirrorPreview =
    camActive && !screenShareActive && localVideoMirror && mounted;

  const mirrorClass = clsx('w-full h-full overflow-hidden relative', {
    'transform -scale-x-100': shouldMirrorPreview,
  });

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, [mounted]);

  return (
    <>
      <div className='flex items-center w-full h-full sm:px-4 shrink grow'>
        <div className='w-full h-full flex items-center rounded-md bg-surfaceAlt ring-1 ring-inset ring-black/5 dark-theme:ring-white/5 overflow-hidden'>
          <div className='w-full h-full overflow-hidden relative'>
            <div className={mirrorClass}>
              <canvas
                key='STREAM_PREVIEW_VIDEO'
                id='cam-video-preview'
                className='absolute inset-0 object-contain w-full h-full'
                ref={previewRef}
              ></canvas>
            </div>
            {!permissions && (
              <div className='absolute inset-0 w-full h-full bg-surfaceAlt flex items-center justify-center'>
                <div className='max-w-xs flex flex-col gap-4 items-center justify-center text-center'>
                  <Icon size={'lg'}>
                    <HandRaisedIcon className='w-full text-uiText' />
                  </Icon>
                  <span className='text-uiText/75'>
                    To start streaming, allow access to your camera and
                    microphone
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
