import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuth } from '@/providers/AuthContext';
import LocalMediaProvider from '@/providers/LocalMediaContext';
import BroadcastProvider from '@/providers/BroadcastContext';
import UserSettingsProvider from '@/providers/UserSettingsContext';
import ModalProvider from '@/providers/ModalContext';
import BroadcastLayoutProvider from '@/providers/BroadcastLayoutContext';
import BroadcastMixerProvider from '@/providers/BroadcastMixerContext';
import Spinner from '@/components/Spinner';

const BroadcastApp = dynamic(() => import('@/components/BroadcastApp'), {
    ssr: false,
});

export default function Broadcast() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading, isBroadcaster } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }

        // Only broadcasters should access broadcast page
        if (!authLoading && isAuthenticated && !isBroadcaster) {
            router.push('/dashboard');
            return;
        }
    }, [isAuthenticated, authLoading, isBroadcaster, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nyu-neutral-100">
                <Spinner />
            </div>
        );
    }

    if (!isAuthenticated || !isBroadcaster) {
        return null;
    }

    const title = `NYU Sports Live - Broadcast`;
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name='description'
                    content='Broadcast live sports events on NYU Sports Live.'
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
