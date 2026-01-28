'use client'
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    rating: number;
    comment: string;
    isActive: boolean;
    order: number;
}

const TestimonialsPage = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        image: '',
        rating: 5,
        comment: '',
        isActive: true,
        order: 0
    });

    const { data: testimonials, isLoading } = useQuery({
        queryKey: ['admin-testimonials'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/testimonials');
            return data as Testimonial[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            if (editingId) {
                return await axiosInstance.put(`/admin/testimonials/${editingId}`, data);
            }
            return await axiosInstance.post('/admin/testimonials', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            toast.success(editingId ? 'Testimonial updated!' : 'Testimonial created!');
            resetForm();
        },
        onError: () => {
            toast.error('Failed to save testimonial');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await axiosInstance.delete(`/admin/testimonials/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            toast.success('Testimonial deleted!');
        },
        onError: () => {
            toast.error('Failed to delete testimonial');
        }
    });

    const toggleActiveMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            return await axiosInstance.put(`/admin/testimonials/${id}`, { isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
        }
    });

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            company: '',
            image: '',
            rating: 5,
            comment: '',
            isActive: true,
            order: 0
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (testimonial: Testimonial) => {
        setFormData(testimonial);
        setEditingId(testimonial._id);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <SectionHeading 
                    heading="Testimonials" 
                    subheading="Manage user reviews displayed on home page" 
                />
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Add Testimonial
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Testimonial</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Role</label>
                            <input
                                type="text"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Company</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Image URL</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <select
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Comment</label>
                        <textarea
                            required
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {createMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {testimonials?.map((testimonial) => (
                    <div key={testimonial._id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4 flex-1">
                                <img 
                                    src={testimonial.image || '/default-avatar.png'} 
                                    alt={testimonial.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role} at {testimonial.company}</p>
                                    <div className="flex items-center gap-1 my-2">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">{testimonial.comment}</p>
                                    <p className="text-xs text-gray-500 mt-2">Order: {testimonial.order}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleActiveMutation.mutate({ id: testimonial._id, isActive: !testimonial.isActive })}
                                    className={`p-2 rounded-lg ${testimonial.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                                    title={testimonial.isActive ? 'Active' : 'Inactive'}
                                >
                                    {testimonial.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button
                                    onClick={() => handleEdit(testimonial)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(testimonial._id)}
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialsPage;
