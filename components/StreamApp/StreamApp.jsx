import React from 'react';
import Player from '@/components/Player';

// TODO: Add your Playback URL
const PLAYBACK_URL =
    '';

export default function StreamApp() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-surface text-uiText'>
            <div className='w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg'>
                <Player playbackUrl={PLAYBACK_URL} />
            </div>
            <p className='mt-4 text-sm text-gray-500'>
                Playing from: {PLAYBACK_URL}
            </p>
        </div>
    );
}
