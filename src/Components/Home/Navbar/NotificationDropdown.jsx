'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Bell, CheckCircle, Info, XCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const queryClient = useQueryClient();

    const { data: notifications = [] } = useQuery({
        queryKey: ['user-notifications'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/user/notifications');
            return data;
        },
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const markReadMutation = useMutation({
        mutationFn: async (idList) => {
            await axiosInstance.patch('/user/notifications', { notificationIds: idList });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
        }
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = () => {
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
        if (unreadIds.length > 0) {
            markReadMutation.mutate(unreadIds);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markReadMutation.mutate([notification._id]);
        }
        setIsOpen(false);
    };

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <CheckCircle size={16} className="text-green-500" />;
            case 'error': return <XCircle size={16} className="text-red-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllRead}
                                className="text-xs font-semibold text-purple-600 hover:text-purple-800 dark:hover:text-purple-400"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/50">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <Link 
                                    href={notif.link || '#'} 
                                    key={notif._id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${!notif.isRead ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}
                                >
                                    <div className="mt-0.5 shrink-0 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {notif.title}
                                        </p>
                                        <p className={`text-xs mt-0.5 line-clamp-2 ${!notif.isRead ? 'text-gray-700 dark:text-gray-400 font-medium' : 'text-gray-500 dark:text-gray-500'}`}>
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1.5 font-medium uppercase tracking-wider">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="w-2 h-2 bg-purple-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)] mt-2" />
                                    )}
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-gray-50/30 dark:bg-gray-800/30">
                                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
