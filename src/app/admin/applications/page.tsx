
'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { FileText, User, Briefcase, Calendar, Clock } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { TableRowSkeleton } from '@/Components/helpers/SkeletonLoader';

const AdminApplications = () => {
    const { data: applications, isLoading } = useQuery<any[]>({
        queryKey: ['admin-applications'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/applications');
            return data;
        },
    });

    return (
        <div className="space-y-8">
            <SectionHeading heading="Global Application Review" subheading="Monitor all job applications submitted across the platform." />
            
            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Applicant</th>
                            <th className="px-6 py-4 font-semibold">Job Title</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Applied Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                        ) : (
                            applications?.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p className="font-bold dark:text-white">{app.userName}</p>
                                                <p className="text-xs text-gray-500">{app.userEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                            <Briefcase size={14} className="text-purple-500" />
                                            <span className="font-medium">{app.jobTitle}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                                            app.status === 'accepted' ? 'bg-green-100 text-green-600' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                            app.status === 'interviewing' ? 'bg-purple-100 text-purple-600' :
                                            app.status === 'reviewed' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                            <Clock size={12} />
                                            <span>{new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!isLoading && applications?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-500 italic">No applications found on the platform.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApplications;
