'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import {
    Bell, BellOff, Plus, Trash2, ChevronLeft,
    Briefcase, MapPin, Search, CheckCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { format } from 'date-fns';

const JOB_TYPES = ['Any', 'Full Time', 'Part Time', 'Remote', 'Contract', 'Internship'];

const JobAlertsPage = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ category: '', jobType: 'Any', location: '', keyword: '' });

    // Fetch existing alerts
    const { data: alerts = [], isLoading } = useQuery({
        queryKey: ['job-alerts'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/alerts');
            return data;
        },
    });

    // Fetch categories for dropdown
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/categories');
            return data;
        },
    });

    // Create alert
    const createMutation = useMutation({
        mutationFn: async (alertData) => {
            const { data } = await axiosInstance.post('/alerts', alertData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
            toast.success('Job alert created! You\'ll be notified of matching jobs.');
            setForm({ category: '', jobType: 'Any', location: '', keyword: '' });
            setShowForm(false);
        },
        onError: () => toast.error('Failed to create alert'),
    });

    // Delete alert
    const deleteMutation = useMutation({
        mutationFn: async (alertId) => {
            await axiosInstance.delete(`/alerts?id=${alertId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
            toast.success('Alert removed');
        },
        onError: () => toast.error('Failed to remove alert'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.category && !form.keyword) {
            return toast.error('Please set at least a category or keyword');
        }
        createMutation.mutate(form);
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/candidate" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <SectionHeading
                        heading="Job Alerts"
                        subheading="Get notified by email when new matching jobs are posted."
                    />
                    <Button
                        onClick={() => setShowForm(s => !s)}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 px-6 shadow-lg shadow-purple-500/20 flex items-center gap-2"
                    >
                        <Plus size={18} /> {showForm ? 'Cancel' : 'New Alert'}
                    </Button>
                </div>

                {/* ── Create Alert Form ── */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-500/5 mb-8 space-y-6">
                        <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Bell size={18} className="text-purple-500" /> Create a New Alert
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                    <select
                                        value={form.category}
                                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm appearance-none"
                                    >
                                        <option value="">Any Category</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Job Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Job Type</label>
                                <select
                                    value={form.jobType}
                                    onChange={e => setForm(p => ({ ...p, jobType: e.target.value }))}
                                    className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm appearance-none"
                                >
                                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                    <input
                                        value={form.location}
                                        onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                        placeholder="Dhaka, Remote..."
                                    />
                                </div>
                            </div>

                            {/* Keyword */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Keyword</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                    <input
                                        value={form.keyword}
                                        onChange={e => setForm(p => ({ ...p, keyword: e.target.value }))}
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                        placeholder="React Developer, UI/UX..."
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-500/20"
                        >
                            {createMutation.isPending ? 'Creating...' : <><CheckCircle size={16} className="mr-2" /> Create Alert</>}
                        </Button>
                    </form>
                )}

                {/* ── Alert List ── */}
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                            <BellOff size={40} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No alerts yet</h3>
                            <p className="text-gray-500 text-sm mb-6">Create your first job alert to get email notifications.</p>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-8 h-12 font-black shadow-lg shadow-purple-500/20"
                            >
                                <Plus size={16} className="mr-2" /> Create Alert
                            </Button>
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between gap-4 group hover:border-purple-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-1">
                                            {alert.category && (
                                                <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                                                    {alert.category}
                                                </span>
                                            )}
                                            {alert.jobType && alert.jobType !== 'Any' && (
                                                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                                                    {alert.jobType}
                                                </span>
                                            )}
                                            {alert.location && (
                                                <span className="text-xs font-bold bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">
                                                    📍 {alert.location}
                                                </span>
                                            )}
                                            {alert.keyword && (
                                                <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                                                    🔍 {alert.keyword}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Created {format(new Date(alert.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate(alert._id)}
                                    disabled={deleteMutation.isPending}
                                    className="h-9 w-9 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 p-0 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobAlertsPage;
