
'use client'
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Trash2, AlertCircle } from 'lucide-react';
import { IJob } from '@/models/Job';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { TableRowSkeleton } from '@/Components/helpers/SkeletonLoader';

const ManageJobs = () => {
    const queryClient = useQueryClient();

    const { data: jobs, isLoading } = useQuery<IJob[]>({
        queryKey: ['admin-jobs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/jobs');
            return data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/admin/jobs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this job?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeading heading="Manage Jobs" subheading="Review and remove job listings from the platform." />
            
            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Job Title</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Location</th>
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
                                <tr key={job._id?.toString()} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                    <td className="px-6 py-4 font-medium dark:text-white">{job.title}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{job.category}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{job.location}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(job._id?.toString() || "")}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
