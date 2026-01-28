
'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Megaphone, X } from 'lucide-react';

const AnnouncementBanner = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: announcements = [] } = useQuery<any[]>({
        queryKey: ['announcements'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/announcements');
            return data;
        },
        refetchInterval: 30000, // Check every 30 seconds
    });

    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible || announcements.length === 0) return null;

    const latest = announcements[0];

    const bgColor = latest.type === 'warning' ? 'bg-orange-500' : 
                    latest.type === 'success' ? 'bg-green-600' : 'bg-purple-600';

    return (
        <div className={`${bgColor} text-white py-2 px-4 flex items-center justify-between relative z-[100]`}>
            <div className="flex items-center justify-center flex-1 space-x-2 text-sm font-medium">
                <Megaphone size={16} className="animate-bounce" />
                <span>{latest.text}</span>
            </div>
            <button onClick={() => setIsVisible(false)} className="hover:bg-black/10 p-1 rounded transition-all">
                <X size={16} />
            </button>
        </div>
    );
};

export default AnnouncementBanner;
