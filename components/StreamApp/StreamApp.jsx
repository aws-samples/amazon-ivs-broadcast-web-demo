import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Player from '@/components/Player';
import Button from '@/components/Button';

export default function StreamApp() {
    const router = useRouter();
    const { id } = router.query;
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liveScore, setLiveScore] = useState({
        homeTeam: 'NYU',
        awayTeam: 'Opponent',
        homeScore: 0,
        awayScore: 0,
        period: 'Q1',
        time: '10:00'
    });

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const res = await fetch('/api/getChannels');
                const data = await res.json();
                if (data.success) {
                    setChannels(data.channels);
                    
                    // If an ID is provided in the query, select that channel
                    if (id && data.channels.length > 0) {
                        const channel = data.channels.find(c => c.id === id);
                        if (channel) {
                            setSelectedChannel(channel);
                        } else if (data.channels.length > 0) {
                            // If channel not found, select first one
                            setSelectedChannel(data.channels[0]);
                        }
                    } else if (data.channels.length > 0) {
                        // Auto-select the first channel if no ID specified
                        setSelectedChannel(data.channels[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching channels:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, [id]);

    if (!selectedChannel) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-nyu-neutral-100'>
                <div className='text-center'>
                    <p className='text-2xl mb-2 text-nyu-neutral-800'>No stream available</p>
                    <p className='text-sm text-nyu-neutral-600 mb-4'>The stream you're looking for is not live.</p>
                    <Link href="/dashboard">
                        <Button type="primary">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen bg-nyu-neutral-100'>
            {/* Header with Back Button */}
            <div className='w-full bg-white shadow-sm border-b border-nyu-neutral-300 p-4 z-10'>
                <div className='max-w-7xl mx-auto flex items-center justify-between'>
                    <Link href="/dashboard">
                        <Button type="secondary">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className='text-xl font-bold text-nyu-primary-600'>
                        {selectedChannel.broadcastName || 'Live Stream'}
                    </h1>
                    <div className='w-32' /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Main Content Area */}
            <div className='flex-1 flex overflow-hidden'>
                {/* Left: Video Player and Score */}
                <div className='flex-1 flex flex-col overflow-y-auto'>
                    {/* Video Player */}
                    <div className='w-full bg-black flex items-center justify-center p-4'>
                        <div className='w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl'>
                            <Player playbackUrl={selectedChannel.playbackUrl} />
                        </div>
                    </div>

                    {/* Live Score Section */}
                    <div className='w-full bg-white border-t border-nyu-neutral-300 p-6'>
                        <div className='max-w-5xl mx-auto'>
                            <div className='mb-4'>
                                <h2 className='text-2xl font-bold text-nyu-primary-600 mb-4'>Live Score</h2>
                            </div>
                            <div className='bg-gradient-to-r from-nyu-primary-600 to-nyu-secondary-700 rounded-lg p-6 text-white'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='text-center flex-1'>
                                        <div className='text-2xl font-bold mb-2'>{liveScore.homeTeam}</div>
                                        <div className='text-5xl font-bold'>{liveScore.homeScore}</div>
                                    </div>
                                    <div className='text-center mx-8'>
                                        <div className='text-lg font-semibold mb-2'>{liveScore.period}</div>
                                        <div className='text-xl font-bold'>{liveScore.time}</div>
                                    </div>
                                    <div className='text-center flex-1'>
                                        <div className='text-2xl font-bold mb-2'>{liveScore.awayTeam}</div>
                                        <div className='text-5xl font-bold'>{liveScore.awayScore}</div>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-2'>
                                    <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
                                    <span className='text-sm font-semibold'>LIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Chat Section */}
                <div className='w-80 bg-white border-l border-nyu-neutral-300 flex flex-col'>
                    <div className='p-4 border-b border-nyu-neutral-300'>
                        <h2 className='text-xl font-bold text-nyu-primary-600'>Live Chat</h2>
                        <p className='text-sm text-nyu-neutral-600 mt-1'>Chat feature coming soon</p>
                    </div>
                    <div className='flex-1 flex items-center justify-center p-4'>
                        <div className='text-center text-nyu-neutral-400'>
                            <svg className='w-16 h-16 mx-auto mb-4 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                            </svg>
                            <p className='text-sm'>Chat</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
