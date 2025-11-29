import React, { useEffect, useState } from 'react';
import Player from '@/components/Player';

export default function StreamApp() {
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const res = await fetch('/api/getChannels');
                const data = await res.json();
                if (data.success) {
                    setChannels(data.channels);
                    // Optional: Auto-select the first channel
                    // if (data.channels.length > 0) setSelectedChannel(data.channels[0]);
                }
            } catch (err) {
                console.error('Error fetching channels:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, []);

    return (
        <div className='flex flex-col md:flex-row h-screen bg-surface text-uiText'>
            {/* Sidebar Channel List */}
            <div className='w-full md:w-1/4 bg-gray-900 p-4 overflow-y-auto border-r border-gray-700'>
                <h2 className='text-xl font-bold mb-4 text-white'>Live Channels</h2>
                {loading ? (
                    <p className='text-gray-400'>Loading channels...</p>
                ) : channels.length === 0 ? (
                    <p className='text-gray-400'>No active channels found.</p>
                ) : (
                    <div className='space-y-2'>
                        {channels.map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => setSelectedChannel(channel)}
                                className={`w-full text-left p-3 rounded transition-colors ${selectedChannel?.id === channel.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <div className='font-semibold truncate'>
                                    {channel.broadcastName || channel.id}
                                </div>
                                <div className='text-xs text-gray-500 truncate'>
                                    {new Date(channel.createdAt).toLocaleString()}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Player Area */}
            <div className='flex-1 flex flex-col items-center justify-center p-4 bg-black relative'>
                {selectedChannel ? (
                    <div className='w-full h-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl'>
                        <Player playbackUrl={selectedChannel.playbackUrl} />
                    </div>
                ) : (
                    <div className='text-center text-gray-500'>
                        <p className='text-2xl mb-2'>Select a channel to start watching</p>
                        <p className='text-sm'>Choose from the list on the left</p>
                    </div>
                )}

                {selectedChannel && (
                    <div className='absolute bottom-8 left-8 bg-black/50 p-4 rounded text-white backdrop-blur-sm'>
                        <h3 className='font-bold text-lg'>{selectedChannel.broadcastName}</h3>
                        <p className='text-xs text-gray-300'>ID: {selectedChannel.id}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
