
'use client'
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Mail, UserCircle, Ban, CheckCircle } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const ManageUsers = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    interface User {
        _id: string;
        name: string;
        email: string;
        role: string;
        status: string;
        isVerified: boolean;
        createdAt: string;
    }

    const { data: users, isLoading } = useQuery<User[]>({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/users');
            return data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Partial<User> }) => {
            await axiosInstance.patch(`/admin/users/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('User updated successfully');
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    });

    if (isLoading) return <CustomLoader />;

    return (
        <div className="space-y-8">
            <SectionHeading heading="Manage Users" subheading="Manage all registered users and their platform permissions." />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {users?.map((user) => (
                    <div key={user._id} className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border ${user.status === 'banned' ? 'border-red-200 bg-red-50/10' : 'border-gray-100 dark:border-gray-800'} flex items-center justify-between`}>
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${user.status === 'banned' ? 'bg-red-100 text-red-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'} rounded-full flex items-center justify-center`}>
                                <UserCircle size={24} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h4 className="font-bold dark:text-white">{user.name}</h4>
                                    {user.status === 'banned' && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Banned</span>}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                    <Mail size={14} />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3">
                            <div className="flex items-center space-x-2">
                                <select 
                                    className="text-xs font-bold border rounded px-2 py-1 bg-transparent dark:text-white border-gray-200 dark:border-gray-700"
                                    value={user.role}
                                    onChange={(e) => updateMutation.mutate({ id: user._id, data: { role: e.target.value } })}
                                    disabled={currentUserId === user._id}
                                >
                                    <option value="jobseeker">Jobseeker</option>
                                    <option value="employer">Employer</option>
                                    <option value="admin">Admin</option>
                                </select>
                                
                                {currentUserId !== user._id && (
                                    <div className="flex items-center space-x-2">
                                        {user.role === 'employer' && (
                                            <button 
                                                onClick={() => updateMutation.mutate({ id: user._id, data: { isVerified: !user.isVerified } })}
                                                className={`p-1.5 rounded-lg transition-all ${user.isVerified ? 'text-blue-500 bg-blue-50' : 'text-gray-400 bg-gray-100 hover:bg-blue-50 hover:text-blue-500'}`}
                                                title={user.isVerified ? 'Unverify Employer' : 'Verify Employer'}
                                            >
                                                <CheckCircle size={16} fill={user.isVerified ? "currentColor" : "none"} className={user.isVerified ? "text-white" : ""} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => updateMutation.mutate({ id: user._id, data: { status: user.status === 'banned' ? 'active' : 'banned' } })}
                                            className={`p-1.5 rounded-lg transition-all ${user.status === 'banned' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}
                                            title={user.status === 'banned' ? 'Unban' : 'Ban'}
                                        >
                                            {user.status === 'banned' ? <CheckCircle size={16} /> : <Ban size={16} />}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;
