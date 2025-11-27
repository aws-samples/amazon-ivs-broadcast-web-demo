import Head from 'next/head';
import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
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
      <div className='flex flex-col items-center justify-center h-screen bg-surface gap-4'>
        <h1 className='text-3xl font-bold mb-8 text-uiText'>
          Amazon IVS Broadcast Demo
        </h1>
        <div className='flex gap-4'>
          <Link href='/broadcast'>
            <Button>Broadcast</Button>
          </Link>
          <Link href='/stream'>
            <Button type='secondary'>Stream</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
