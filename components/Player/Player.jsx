import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function Player({ playbackUrl }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // This effect runs when the IVS Player script is loaded
        if (scriptLoaded && window.IVSPlayer && window.IVSPlayer.isPlayerSupported) {
            const { create, isPlayerSupported, PlayerState, PlayerEventType } =
                window.IVSPlayer;

            if (!isPlayerSupported) {
                console.warn('IVS Player is not supported in this browser');
                return;
            }

            // Clean up existing player first
            if (playerRef.current) {
                playerRef.current.delete();
                playerRef.current = null;
            }

            const player = create();
            playerRef.current = player;
            player.attachHTMLVideoElement(videoRef.current);

            player.addEventListener(PlayerState.PLAYING, () => {
                console.log('Player State - PLAYING');
            });
            player.addEventListener(PlayerState.ENDED, () => {
                console.log('Player State - ENDED');
            });
            player.addEventListener(PlayerState.READY, () => {
                console.log('Player State - READY');
            });
            player.addEventListener(PlayerEventType.ERROR, (err) => {
                console.warn('Player Event - ERROR:', err);
            });

            if (playbackUrl) {
                console.log('Loading playback URL:', playbackUrl);
                player.load(playbackUrl);
                player.play();
            }

            return () => {
                if (playerRef.current) {
                    playerRef.current.delete();
                    playerRef.current = null;
                }
            };
        }
    }, [playbackUrl, scriptLoaded]);

    return (
        <div className='relative w-full h-full bg-black'>
            <Script
                src='https://player.live-video.net/1.24.0/amazon-ivs-player.min.js'
                strategy='afterInteractive'
                onLoad={() => {
                    setScriptLoaded(true);
                }}
            />
            <video
                ref={videoRef}
                className='w-full h-full object-contain'
                playsInline
                controls
                autoPlay
            />
        </div>
    );
}
