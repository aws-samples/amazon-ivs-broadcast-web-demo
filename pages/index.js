import Head from 'next/head';
import dynamic from 'next/dynamic';
import LocalMediaProvider from '@/providers/LocalMediaContext';
import BroadcastProvider from '@/providers/BroadcastContext';
import UserSettingsProvider from '@/providers/UserSettingsContext';
import ModalProvider from '@/providers/ModalContext';
import BroadcastLayoutProvider from '@/providers/BroadcastLayoutContext';
import BroadcastMixerProvider from '@/providers/BroadcastMixerContext';

const BroadcastApp = dynamic(() => import('@/components/BroadcastApp'), {
  ssr: false,
});

export default function Broadcast() {
  const title = `Amazon IVS – Web Broadcast Tool`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name='description'
          content='This tool can be used to stream your webcam or share your screen to an Amazon IVS Channel.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ModalProvider>
        <UserSettingsProvider>
          <LocalMediaProvider>
            <BroadcastProvider>
              <BroadcastMixerProvider>
                <BroadcastLayoutProvider>
                  <BroadcastApp />
                </BroadcastLayoutProvider>
              </BroadcastMixerProvider>
            </BroadcastProvider>
          </LocalMediaProvider>
        </UserSettingsProvider>
      </ModalProvider>
    </>
  );
}
