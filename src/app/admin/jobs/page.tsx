
'use client'
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Trash2, AlertCircle, Check, X, Star } from 'lucide-react';
import { IJob } from '@/models/Job';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { TableRowSkeleton } from '@/Components/helpers/SkeletonLoader';
import { toast } from 'react-hot-toast';

const ManageJobs = () => {
    const queryClient = useQueryClient();

    const { data: jobs, isLoading } = useQuery<IJob[]>({
        queryKey: ['admin-jobs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/jobs');
            return data;
        },
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            await axiosInstance.patch(`/admin/jobs/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Status updated');
        },
    });

    const featureMutation = useMutation({
        mutationFn: async ({ id, isFeatured }: { id: string, isFeatured: boolean }) => {
            await axiosInstance.patch(`/admin/jobs/${id}`, { isFeatured });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Featured status updated');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/admin/jobs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
            toast.success('Job deleted');
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this job?')) {
            deleteMutation.mutate(id);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">Approved</span>;
            case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">Rejected</span>;
            default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-[10px] font-bold rounded-full">Pending</span>;
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeading heading="Manage Jobs" subheading="Review, approve, and remove job listings." />
            
            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Job Title</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Featured</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRowSkeleton key={i} />
                            ))
                        ) : (
                            jobs?.map((job) => (
                                <tr key={job._id?.toString()} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-sm">
                                    <td className="px-6 py-4 font-medium dark:text-white">
                                        <div>{job.title}</div>
                                        <div className="text-[10px] text-gray-400 font-normal">{job.company} • {job.location}</div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => featureMutation.mutate({ id: job._id?.toString() || '', isFeatured: !job.isFeatured })}
                                            className={`p-1.5 rounded-lg transition-all ${job.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500'}`}
                                        >
                                            <Star size={16} fill={job.isFeatured ? "currentColor" : "none"} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center space-x-2">
                                            {job.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => statusMutation.mutate({ id: job._id?.toString() || '', status: 'approved' })}
                                                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => statusMutation.mutate({ id: job._id?.toString() || '', status: 'rejected' })}
                                                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg"
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {job.status === 'approved' && (
                                                <button 
                                                    onClick={() => statusMutation.mutate({ id: job._id?.toString() || '', status: 'rejected' })}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-bold"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                            {job.status === 'rejected' && (
                                                <button 
                                                    onClick={() => statusMutation.mutate({ id: job._id?.toString() || '', status: 'approved' })}
                                                    className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg text-[10px] font-bold"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(job._id?.toString() || "")}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {jobs?.length === 0 && !isLoading && (
                    <div className="p-10 text-center text-gray-500">No jobs found.</div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
