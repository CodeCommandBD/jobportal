
'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Mail, UserCircle } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';

const ManageUsers = () => {
    const { data: users, isLoading } = useQuery<any[]>({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/users');
            return data;
        },
    });

    if (isLoading) return <CustomLoader />;

    return (
        <div className="space-y-8">
            <SectionHeading heading="Manage Users" subheading="Manage all registered users and their platform permissions." />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {users?.map((user) => (
                    <div key={user._id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
                                <UserCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold dark:text-white">{user.name}</h4>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                    <Mail size={14} />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase ${
                                user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                                user.role === 'employer' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                                {user.role}
                            </span>
                            <span className="text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;
