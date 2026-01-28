
'use client'
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Megaphone, Trash2, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { toast } from 'react-hot-toast';

const ManageAnnouncements = () => {
    const queryClient = useQueryClient();
    const [text, setText] = useState('');
    const [type, setType] = useState('info');

    interface Announcement {
        _id: string;
        text: string;
        type: string;
        isActive: boolean;
    }

    const { data: announcements, isLoading } = useQuery<Announcement[]>({
        queryKey: ['admin-announcements'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/announcements');
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newAnno: { text: string; type: string; isActive: boolean }) => {
            await axiosInstance.post('/announcements', newAnno);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
            setText('');
            setType('info');
            toast.success('Announcement published');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/announcements?id=${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
            toast.success('Announcement removed');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        createMutation.mutate({ text, type, isActive: true });
    };

    return (
        <div className="space-y-8">
            <SectionHeading heading="Site Announcements" subheading="Broadcast important messages to all platform visitors." />
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder="Announcement message..." 
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 dark:text-white"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <select 
                        className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 dark:text-white"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="info">Information</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                    </select>
                    <button 
                        type="submit"
                        disabled={createMutation.isPending}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                        <Megaphone size={20} />
                        <span>Publish</span>
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)
                ) : (
                    announcements?.map((anno) => (
                        <div key={anno._id} className={`p-4 rounded-xl border flex items-center justify-between ${
                            anno.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-800' :
                            anno.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                            'bg-blue-50 border-blue-100 text-blue-800'
                        }`}>
                            <div className="flex items-center space-x-3">
                                {anno.type === 'warning' ? <AlertTriangle size={20} /> : 
                                 anno.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                                <p className="font-medium">{anno.text}</p>
                            </div>
                            <button 
                                onClick={() => deleteMutation.mutate(anno._id)}
                                className="p-2 hover:bg-white/50 rounded-lg transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
                {announcements?.length === 0 && !isLoading && (
                    <div className="text-center p-10 text-gray-400">No active announcements.</div>
                )}
            </div>
        </div>
    );
};

export default ManageAnnouncements;
