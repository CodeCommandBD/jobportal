
'use client'
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Trash2, Plus, Grid } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { TableRowSkeleton } from '@/Components/helpers/SkeletonLoader';
import { toast } from 'react-hot-toast';

const ManageCategories = () => {
    const queryClient = useQueryClient();
    const [newName, setNewName] = useState('');

    interface Category {
        _id: string;
        name: string;
        count: number;
    }

    const { data: categories, isLoading } = useQuery<Category[]>({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/categories');
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (name: string) => {
            await axiosInstance.post('/categories', { name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            setNewName('');
            toast.success('Category added');
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axiosInstance.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success('Category deleted');
        },
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        createMutation.mutate(newName.trim());
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeading heading="Manage Categories" subheading="Add or remove job categories that appear on the platform." />
            
            <form onSubmit={handleAdd} className="flex gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <input 
                    type="text" 
                    placeholder="New Category Name (e.g. Marketing)" 
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 dark:text-white"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button 
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </form>

            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Category Name</th>
                            <th className="px-6 py-4 font-semibold">Live Jobs</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRowSkeleton key={i} />
                            ))
                        ) : (
                            categories?.map((cat) => (
                                <tr key={cat._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded flex items-center justify-center">
                                            <Grid size={16} />
                                        </div>
                                        <span className="font-medium dark:text-white">{cat.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full font-bold">
                                            {cat.count} Jobs
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(cat._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {categories?.length === 0 && !isLoading && (
                    <div className="p-10 text-center text-gray-500">No categories found. Add one above.</div>
                )}
            </div>
        </div>
    );
};

export default ManageCategories;
