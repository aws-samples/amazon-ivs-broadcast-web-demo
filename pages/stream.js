import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/providers/AuthContext';
import StreamApp from '@/components/StreamApp';
import Spinner from '@/components/Spinner';

export default function Stream() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading, isViewer } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }

        // Only viewers should access stream page
        if (!authLoading && isAuthenticated && !isViewer) {
            router.push('/broadcast');
            return;
        }
    }, [isAuthenticated, authLoading, isViewer, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nyu-neutral-100">
                <Spinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const title = `NYU Sports Live - Stream`;
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name='description'
                    content='Watch live sports events on NYU Sports Live.'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <StreamApp />
        </>
    );
}
