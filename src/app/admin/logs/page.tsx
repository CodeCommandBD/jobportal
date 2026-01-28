
'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { History, Shield, User, Info, Calendar, Clock, Terminal } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { TableRowSkeleton } from '@/Components/helpers/SkeletonLoader';

const AdminLogs = () => {
    const { data: logs, isLoading } = useQuery<any[]>({
        queryKey: ['admin-logs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/logs');
            return data;
        },
    });

    return (
        <div className="space-y-8">
            <SectionHeading heading="Administrative Audit Trail" subheading="Historical record of all sensitive actions performed by site administrators." />
            
            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Administrator</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                            <th className="px-6 py-4 font-semibold">Details</th>
                            <th className="px-6 py-4 font-semibold">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} />)
                        ) : (
                            logs?.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center">
                                                <Shield size={12} />
                                            </div>
                                            <span className="font-medium text-sm dark:text-white">{log.adminName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                                            log.action.includes('Ban') || log.action.includes('Delete') || log.action.includes('Reject') 
                                            ? 'bg-red-50 text-red-600 border border-red-100' : 
                                            log.action.includes('Approve') || log.action.includes('Verify') || log.action.includes('Created')
                                            ? 'bg-green-50 text-green-600 border border-green-100' : 
                                            'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                                            <Terminal size={12} className="text-gray-400" />
                                            <span>{log.details}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                                            <Calendar size={10} />
                                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                            <Clock size={10} />
                                            <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!isLoading && logs?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-500 italic">No activity logs recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLogs;
