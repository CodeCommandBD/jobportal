'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Star, CheckCircle, XCircle, Clock, ChevronLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { JobSkeleton } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';
import toast from 'react-hot-toast';

const AdminApprovalsPage = () => {
    const queryClient = useQueryClient();

    const { data: pendingJobs, isLoading } = useQuery({
        queryKey: ['admin-pending-featured-jobs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/jobs/featured');
            return data;
        },
    });

    const approvalMutation = useMutation({
        mutationFn: async ({ jobId, isApproved }) => {
            const { data } = await axiosInstance.patch('/admin/jobs/approve', { jobId, isApproved });
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['admin-pending-featured-jobs'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to process request');
        }
    });

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/admin" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <SectionHeading 
                    heading="Featured Approvals" 
                    subheading="Review and manage employer requests to feature their job postings." 
                />

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <JobSkeleton key={i} />)
                    ) : pendingJobs && pendingJobs.length > 0 ? (
                        pendingJobs.map(job => (
                            <div key={job._id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Star size={100} />
                                </div>
                                <div className="flex gap-4 mb-6 relative">
                                    <div className="h-14 w-14 rounded-2xl bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center font-black text-xl uppercase shrink-0">
                                        {job.employerId?.companyName?.[0] || 'C'}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{job.title}</h4>
                                        <p className="text-sm font-bold text-gray-400">{job.employerId?.companyName}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-8 relative">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Request Details</p>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-600">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                                            <Clock size={16} className="text-gray-400" />
                                            Requested: {new Date(job.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 relative">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12"
                                        onClick={() => approvalMutation.mutate({ jobId: job._id, isApproved: false })}
                                        disabled={approvalMutation.isPending}
                                    >
                                        <XCircle size={18} className="mr-2" /> Reject
                                    </Button>
                                    <Button 
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl h-12 shadow-lg shadow-yellow-500/20"
                                        onClick={() => approvalMutation.mutate({ jobId: job._id, isApproved: true })}
                                        disabled={approvalMutation.isPending}
                                    >
                                        <CheckCircle size={18} className="mr-2" /> Approve
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center">
                            <div className="h-20 w-20 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
                                <Star size={32} className="text-yellow-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">All Caught Up!</h3>
                            <p className="text-gray-500 max-w-sm">
                                There are no pending featured job requests at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminApprovalsPage;
