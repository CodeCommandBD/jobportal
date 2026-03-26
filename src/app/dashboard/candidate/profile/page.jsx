
'use client'

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { 
    User, 
    Mail, 
    MapPin, 
    Briefcase, 
    Save, 
    CloudUpload,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';

const ProfilePage = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        location: '',
        bio: '',
        skills: '',
    });

    const { data: user, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/candidate/profile');
            return data;
        },
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                title: user.title || '',
                location: user.location || '',
                bio: user.bio || '',
                skills: user.skills?.join(', ') || '',
            });
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: async (updatedData) => {
            const dataToSubmit = {
                ...updatedData,
                skills: updatedData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
            };
            return await axiosInstance.patch('/candidate/profile', dataToSubmit);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast.success('Profile updated successfully');
        },
        onError: () => {
            toast.error('Failed to update profile');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/candidate" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <SectionHeading 
                    heading="Manage Profile" 
                    subheading="Update your professional details to stand out to employers." 
                />

                <form onSubmit={handleSubmit} className="mt-10 space-y-8 bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-purple-500/5 transition-all">
                    
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Professional Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                                    placeholder="e.g. Dhaka, Bangladesh / Remote"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email (Read-only)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input 
                                    value={user?.email}
                                    disabled
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-100 dark:bg-gray-700 border-none cursor-not-allowed text-gray-400 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Professional Bio</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 font-bold transition-all resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Skills (Comma separated)</label>
                        <input 
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                            placeholder="e.g. JavaScript, React, Next.js, Node.js"
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-end">
                        <Button 
                            type="submit"
                            disabled={mutation.isLoading}
                            className="bg-purple-600 hover:bg-purple-700 text-white h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 transition-all flex items-center gap-2"
                        >
                            {mutation.isLoading ? 'Saving...' : <><Save size={20} /> Update Profile</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
