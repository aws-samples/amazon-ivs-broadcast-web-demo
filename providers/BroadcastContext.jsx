import useBroadcastSDK from '@/hooks/useBroadcastSDK';
import { createContext } from 'react';

const BROADCAST_STATUS = {
  LIVE: 'LIVE',
  OFFLINE: 'OFFLINE',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
};

const BroadcastContext = createContext({
  IVSBroadcastClientRef: undefined,
  sdkVersionRef: undefined,
  broadcastClientMounted: undefined,
  broadcastClientRef: undefined,
  broadcastStartTimeRef: undefined,
  isSupported: undefined,
  isLive: undefined,
  streamPending: undefined,
  connectionState: undefined,
  broadcastErrors: undefined,
  toggleStream: undefined,
  stopStream: undefined,
  startStream: undefined,
  createBroadcastClient: undefined,
  destroyBroadcastClient: undefined,
  restartBroadcastClient: undefined,
});

function BroadcastProvider({ children }) {
  const state = useBroadcastSDK();

  return (
    <BroadcastContext.Provider value={state}>
      {children}
    </BroadcastContext.Provider>
  );
}

export default BroadcastProvider;
export { BroadcastContext, BROADCAST_STATUS };
