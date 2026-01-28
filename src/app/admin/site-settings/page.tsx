'use client'
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import { Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const SiteSettingsPage = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        totalJobsDisplay: 0,
        totalCompaniesDisplay: 0,
        totalCandidatesDisplay: 0,
        useRealStats: true
    });

    const { isLoading } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/site-settings');
            setFormData(data);
            return data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const response = await axiosInstance.put('/admin/site-settings', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site-settings'] });
            toast.success('Settings updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update settings');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="space-y-8">
            <SectionHeading 
                heading="Site Settings" 
                subheading="Manage home page content and statistics" 
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Hero Section */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Hero Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.heroTitle}
                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Subtitle</label>
                            <textarea
                                value={formData.heroSubtitle}
                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Background Image URL</label>
                            <input
                                type="text"
                                value={formData.heroImage}
                                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Statistics Display</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <input
                                type="checkbox"
                                id="useRealStats"
                                checked={formData.useRealStats}
                                onChange={(e) => setFormData({ ...formData, useRealStats: e.target.checked })}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="useRealStats" className="flex items-center gap-2 cursor-pointer">
                                <RefreshCw size={18} />
                                <span className="font-medium">Use Real-Time Database Counts</span>
                            </label>
                        </div>

                        {!formData.useRealStats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Jobs</label>
                                    <input
                                        type="number"
                                        value={formData.totalJobsDisplay}
                                        onChange={(e) => setFormData({ ...formData, totalJobsDisplay: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Companies</label>
                                    <input
                                        type="number"
                                        value={formData.totalCompaniesDisplay}
                                        onChange={(e) => setFormData({ ...formData, totalCompaniesDisplay: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Candidates</label>
                                    <input
                                        type="number"
                                        value={formData.totalCandidatesDisplay}
                                        onChange={(e) => setFormData({ ...formData, totalCandidatesDisplay: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default SiteSettingsPage;
