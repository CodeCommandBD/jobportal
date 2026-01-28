
'use client'
import React, { useState } from 'react';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

const ChatWidget = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');

    const { data: messages = [] } = useQuery({
        queryKey: ['chat-messages'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/chat');
            return data;
        },
        enabled: isOpen, // Only fetch when chat is open
        refetchInterval: 3000, // Poll every 3 seconds for new messages
    });

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            await axiosInstance.post('/chat', { text });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
            setInput('');
        }
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        mutation.mutate(input);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-gray-900 w-[350px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-purple-600 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">DevHire Support</h4>
                                <p className="text-xs text-purple-100 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                        {messages.map((msg: any) => {
                            const isAdmin = msg.senderId === 'admin' || msg.senderName === 'DevHire Support';
                            return (
                                <div key={msg._id} className={`flex ${!isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        !isAdmin 
                                        ? 'bg-purple-600 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex space-x-2">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-50 dark:bg-gray-800 border-none focus-visible:ring-1 focus-visible:ring-purple-500"
                        />
                        <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700 shrink-0">
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 ${
                    isOpen ? 'bg-gray-800 rotate-90' : 'bg-purple-600'
                }`}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>
        </div>
    );
};

export default ChatWidget;
