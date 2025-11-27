import Head from 'next/head';
import StreamApp from '@/components/StreamApp';

export default function Stream() {
    const title = `Amazon IVS – Web Broadcast Tool - Stream`;
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
            <StreamApp />
        </>
    );
}
