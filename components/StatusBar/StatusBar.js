import Pill from '../Pill';
import { useContext, useEffect, useState } from 'react';
import { BroadcastContext } from '@/providers/BroadcastContext';

export default function StatusBar() {
  const { isLive, broadcastStartTimeRef } = useContext(BroadcastContext);
  const [timeString, setTimeString] = useState('--:--');

  useEffect(() => {
    if (!window.Worker) return;
    const timerWorker = new Worker(
      new URL('@/workers/Timer.js', import.meta.url)
    );
    if (isLive) {
      timerWorker.postMessage({
        command: 'startTimer',
        options: broadcastStartTimeRef.current || new Date(),
      });
      timerWorker.onmessage = ({ data }) => {
        setTimeString(data);
      };
    }

    return () => {
      timerWorker.postMessage('stopTimer');
      timerWorker.terminate();
    };
  }, [isLive]);

  const statusPill = isLive ? (
    <Pill type='destruct'>LIVE</Pill>
  ) : (
    <Pill>OFFLINE</Pill>
  );

  const timePill = isLive ? <Pill>{timeString}</Pill> : <></>;

  return (
    <div className='w-full h-12 gap-x-2 grow-0 shrink-0 flex justify-center items-center select-none'>
      {statusPill} {timePill}
    </div>
  );
}
