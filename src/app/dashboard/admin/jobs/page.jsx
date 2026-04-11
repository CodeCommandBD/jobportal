
'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Trash2, Check, X, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { TableRowSkeleton } from '@/Components/helpers/SkeletonLoader';
import { toast } from 'react-hot-toast';
import { Button } from '@/Components/ui/button';

const ManageJobs = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-jobs', page],
        queryFn: async () => {
            // Admin can see all jobs, including pending/rejected
            // Note: Our base /jobs API handles role checks and returns { jobs, pagination }
            const { data } = await axiosInstance.get('/jobs', { 
                params: { page, limit: 10 } 
            });
            return data;
        },
    });

    const jobs = data?.jobs || [];
    const pagination = data?.pagination || { totalPages: 1 };

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            await axiosInstance.patch(`/admin/jobs/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Status updated');
        },
    });

    const featureMutation = useMutation({
        mutationFn: async ({ id, isFeatured }) => {
            await axiosInstance.patch(`/admin/jobs/${id}`, { isFeatured });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Featured status updated');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axiosInstance.delete(`/admin/jobs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Job deleted');
        },
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this job?')) {
            deleteMutation.mutate(id);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-full tracking-wider">Approved</span>;
            case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-full tracking-wider">Rejected</span>;
            default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-[10px] font-black uppercase rounded-full tracking-wider">Pending</span>;
        }
    };

    return (
        <div className="space-y-8 p-6">
            <SectionHeading 
                heading="Job Listings" 
                subheading="Review, moderate, and manage all jobs posted on the platform." 
            />
            
            <div className="bg-white dark:bg-gray-900 shadow-xl shadow-purple-500/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Job Details</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Position</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <TableRowSkeleton key={i} />
                                ))
                            ) : (
                                jobs?.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center font-bold text-purple-600 text-lg uppercase shadow-sm border border-purple-100 dark:border-purple-900/20">
                                                    {job.company?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{job.title}</div>
                                                    <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
                                                        <span className="text-gray-600 dark:text-gray-400 font-bold">{job.company}</span> 
                                                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                                        {job.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">{getStatusBadge(job.status)}</td>
                                        <td className="px-8 py-6">
                                            <button 
                                                onClick={() => featureMutation.mutate({ id: job._id, isFeatured: !job.isFeatured })}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider ${
                                                    job.isFeatured 
                                                    ? 'text-yellow-600 bg-yellow-50 border border-yellow-100 shadow-sm' 
                                                    : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 border border-transparent'
                                                }`}
                                            >
                                                <Star size={14} fill={job.isFeatured ? "currentColor" : "none"} />
                                                {job.isFeatured ? 'Featured' : 'Standard'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {job.status === 'pending' && (
                                                    <button 
                                                        onClick={() => statusMutation.mutate({ id: job._id, status: 'approved' })}
                                                        className="p-2.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all border border-transparent hover:border-green-100"
                                                        title="Approve"
                                                    >
                                                        <Check size={20} strokeWidth={3} />
                                                    </button>
                                                )}
                                                
                                                <a href={`/job/${job._id}`} target="_blank" rel="noreferrer" className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all">
                                                    <ExternalLink size={20} />
                                                </a>

                                                <button 
                                                    onClick={() => handleDelete(job._id)}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {jobs?.length === 0 && !isLoading && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="h-16 w-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Trash2 size={24} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No jobs found</h3>
                        <p className="text-gray-500 text-sm">There are no job listings available in this view.</p>
                    </div>
                )}

                {/* Pagination Footer */}
                {!isLoading && pagination.totalPages > 1 && (
                    <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page {page} of {pagination.totalPages}</p>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="h-9 w-9 rounded-lg p-0 border-gray-200 dark:border-gray-700 hover:border-purple-300 text-purple-600"
                            >
                                <ChevronLeft size={18} />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={page === pagination.totalPages}
                                className="h-9 w-9 rounded-lg p-0 border-gray-200 dark:border-gray-700 hover:border-purple-300 text-purple-600"
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
