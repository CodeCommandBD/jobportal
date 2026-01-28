
'use client'
import React, { useState } from 'react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Search, Send, User, MessageCircle, MoreVertical, Phone, Video } from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

const AdminChat = () => {
    const queryClient = useQueryClient();
    const [selectedSenderId, setSelectedSenderId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const { data: rawMessages = [] } = useQuery({
        queryKey: ['admin-chat-messages'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/chat');
            return data;
        },
        refetchInterval: 3000,
    });

    // Group messages by senderId
    const chatList = React.useMemo(() => {
        const groups: Record<string, any> = {};
        rawMessages.forEach((m: any) => {
            if (m.senderId === 'admin') return; // Skip admin replies in the list
            if (!groups[m.senderId]) {
                groups[m.senderId] = {
                    id: m.senderId,
                    name: m.senderName,
                    lastMessage: m.text,
                    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'online',
                    messages: []
                };
            }
            groups[m.senderId].messages.push(m);
            groups[m.senderId].lastMessage = m.text;
        });
        return Object.values(groups);
    }, [rawMessages]);

    const selectedChat = chatList.find(c => c.id === selectedSenderId);
    
    // Get conversation for selected chat (including admin replies)
    const activeMessages = rawMessages.filter((m: any) => 
        m.senderId === selectedSenderId || 
        (m.senderId === 'admin' && rawMessages.some((prev: any) => prev.senderId === selectedSenderId && new Date(prev.createdAt) < new Date(m.createdAt)))
    ).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            await axiosInstance.post('/chat', { 
                text, 
                senderId: 'admin', 
                senderName: 'DevHire Support' 
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-chat-messages'] });
            setMessage('');
        }
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !selectedSenderId) return;
        mutation.mutate(message);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
            <SectionHeading heading="Live Chat Management" subheading="Respond to user inquiries and provide real-time support." />
            
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Chat List Sidebar */}
                <Card className="w-80 flex flex-col border-gray-100 dark:border-gray-800 shrink-0">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input placeholder="Search chats..." className="pl-10 bg-gray-50 dark:bg-gray-800 border-none" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chatList.map((chat) => (
                            <div 
                                key={chat.id}
                                onClick={() => setSelectedSenderId(chat.id)}
                                className={`p-4 flex items-center space-x-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${selectedSenderId === chat.id ? 'bg-purple-50 dark:bg-purple-900/10 border-r-4 border-purple-600' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                        {chat.name.charAt(0)}
                                    </div>
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                                        <span className="text-[10px] text-gray-400">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <span className="bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Main Chat Area */}
                <Card className="flex-1 flex flex-col border-gray-100 dark:border-gray-800 overflow-hidden">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                        {selectedChat.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{selectedChat.name}</h4>
                                        <p className="text-xs text-green-500">{selectedChat.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Button variant="ghost" size="icon" className="rounded-full"><Phone size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="rounded-full"><Video size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical size={18} /></Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 dark:bg-gray-900/30">
                                {activeMessages.map((msg: any) => (
                                    <div key={msg._id} className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex flex-col space-y-1 max-w-[70%] ${msg.senderId === 'admin' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                                                msg.senderId === 'admin' 
                                                ? 'bg-purple-600 text-white rounded-tr-none' 
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                            }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-gray-400 px-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                <form 
                                    onSubmit={handleSend}
                                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl"
                                >
                                    <Input 
                                        placeholder="Type your reply..." 
                                        className="border-none bg-transparent focus-visible:ring-0"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700 rounded-xl shrink-0" disabled={mutation.isPending}>
                                        <Send size={18} />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Conversation</h3>
                            <p className="max-w-xs">Choose a message from the left to start responding to user inquiries.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminChat;
