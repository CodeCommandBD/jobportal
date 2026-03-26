
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { 
    Send, 
    Search, 
    User, 
    MoreVertical, 
    ChevronLeft,
    Inbox
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

const ChatPage = () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [selectedThread, setSelectedThread] = useState(null);
    const [messageText, setMessageText] = useState('');
    const scrollRef = useRef(null);

    // Fetch All Threads
    const { data: threads, isLoading: threadsLoading } = useQuery({
        queryKey: ['chat-threads'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/chat/threads');
            return data;
        },
        refetchInterval: 5000, // Poll every 5s for new messages
    });

    // Fetch Messages for Selected Thread
    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: ['chat-messages', selectedThread?._id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/chat/messages/${selectedThread._id}`);
            return data;
        },
        enabled: !!selectedThread?._id,
        refetchInterval: 3000, // Faster polling for active chat
    });

    // Send Message Mutation
    const sendMessage = useMutation({
        mutationFn: async (text) => {
            await axiosInstance.post('/chat/send', {
                conversationId: selectedThread._id,
                text
            });
        },
        onSuccess: () => {
            setMessageText('');
            queryClient.invalidateQueries({ queryKey: ['chat-messages', selectedThread?._id] });
            queryClient.invalidateQueries({ queryKey: ['chat-threads'] });
        }
    });

    // Auto scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;
        sendMessage.mutate(messageText);
    };

    if (threadsLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[750px]">
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl flex h-full overflow-hidden">
                    
                    {/* Threads List (Sidebar) */}
                    <div className={`w-full lg:w-96 border-r border-gray-50 dark:border-gray-700 flex flex-col ${selectedThread ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="p-8 border-b border-gray-50 dark:border-gray-700">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Messages</h2>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                                    placeholder="Search chats..."
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {threads?.length > 0 ? (
                                threads.map((thread) => (
                                    <div 
                                        key={thread._id}
                                        onClick={() => setSelectedThread(thread)}
                                        className={`p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all ${selectedThread?._id === thread._id ? 'bg-purple-50 dark:bg-purple-900/20 border-r-4 border-purple-600' : ''}`}
                                    >
                                        <div className="h-14 w-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-purple-600 shrink-0">
                                            {thread.otherUser?.name?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm truncate">{thread.otherUser?.name}</h4>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">{format(new Date(thread.lastMessageAt), 'HH:mm')}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">
                                                {thread.lastMessage || 'Start a conversation'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center flex flex-col items-center justify-center h-full opacity-50">
                                    <Inbox size={48} className="mb-4 text-purple-300" />
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">No messages yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 flex flex-col ${!selectedThread ? 'hidden lg:flex' : 'flex'}`}>
                        {selectedThread ? (
                            <>
                                {/* Chat Header */}
                                <div className="px-8 py-5 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" size="sm" className="lg:hidden p-0 h-10 w-10" onClick={() => setSelectedThread(null)}>
                                            <ChevronLeft />
                                        </Button>
                                        <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-purple-600">
                                            {selectedThread.otherUser?.name?.[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm">{selectedThread.otherUser?.name}</h4>
                                            <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Online</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl">
                                        <MoreVertical size={20} className="text-gray-400" />
                                    </Button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 dark:bg-gray-900/10">
                                    {messagesLoading ? (
                                        <div className="flex justify-center py-20"><CustomLoader /></div>
                                    ) : (
                                        messages?.map((msg, i) => {
                                            const isMe = msg.senderId === session?.user?.id;
                                            return (
                                                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[70%] px-6 py-4 rounded-3xl text-sm font-medium shadow-sm ${isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none border border-gray-100 dark:border-gray-600'}`}>
                                                        {msg.text}
                                                        <div className={`text-[9px] mt-1 opacity-50 font-bold uppercase ${isMe ? 'text-right' : 'text-left'}`}>
                                                            {format(new Date(msg.createdAt), 'HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                    <div ref={scrollRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-8 border-t border-gray-50 dark:border-gray-700">
                                    <form onSubmit={handleSend} className="flex gap-4">
                                        <input 
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            className="flex-1 h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                                            placeholder="Type your message..."
                                        />
                                        <Button 
                                            type="submit"
                                            disabled={!messageText.trim() || sendMessage.isLoading}
                                            className="h-14 w-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-500/20"
                                        >
                                            <Send size={20} />
                                        </Button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-30">
                                <Inbox size={80} className="mb-6 text-purple-300" />
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Your Inbox</h3>
                                <p className="text-gray-500 max-w-xs font-bold uppercase text-xs tracking-widest">Select a thread to start chatting with candidates or employers.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
