'use client'

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import {
    Building2, Globe, FileText, Users, Save,
    ChevronLeft, Layers, CheckCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const INDUSTRIES = [
    'Technology', 'Finance', 'Healthcare', 'E-Commerce', 'Education',
    'Telecom', 'Media', 'Retail', 'Manufacturing', 'Government', 'Other',
];

const CompanyProfilePage = () => {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        companyName: '', companyDescription: '', companyWebsite: '',
        companySize: '', companyIndustry: '', companyLogo: '',
    });

    const { data: profile, isLoading } = useQuery({
        queryKey: ['employer-company-profile'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/employer/profile');
            return data;
        },
    });

    useEffect(() => {
        if (profile) {
            setForm({
                companyName: profile.companyName || '',
                companyDescription: profile.companyDescription || '',
                companyWebsite: profile.companyWebsite || '',
                companySize: profile.companySize || '',
                companyIndustry: profile.companyIndustry || '',
                companyLogo: profile.companyLogo || '',
            });
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: async (data) => axiosInstance.patch('/employer/profile', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employer-company-profile'] });
            toast.success('Company profile updated!');
        },
        onError: () => toast.error('Failed to update'),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/employer" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <SectionHeading
                    heading="Company Profile"
                    subheading="Attract top talent by showcasing your company brand."
                />

                {/* Preview link */}
                {profile?._id && (
                    <Link
                        href={`/company/${profile._id}`}
                        className="inline-flex items-center gap-2 mt-4 mb-8 text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                        <CheckCircle size={14} /> View Public Profile
                    </Link>
                )}

                <form
                    onSubmit={e => { e.preventDefault(); mutation.mutate(form); }}
                    className="space-y-6"
                >
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Building2 size={16} className="text-purple-500" /> Company Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Company Name</label>
                                <input
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                    placeholder="Acme Corp"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                    <Globe size={12} /> Website URL
                                </label>
                                <input
                                    name="companyWebsite"
                                    value={form.companyWebsite}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                    placeholder="https://acme.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                    <Layers size={12} /> Industry
                                </label>
                                <select
                                    name="companyIndustry"
                                    value={form.companyIndustry}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                >
                                    <option value="">Select Industry</option>
                                    {INDUSTRIES.map(ind => (
                                        <option key={ind} value={ind}>{ind}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                    <Users size={12} /> Company Size
                                </label>
                                <select
                                    name="companySize"
                                    value={form.companySize}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                >
                                    <option value="">Select Size</option>
                                    {COMPANY_SIZES.map(size => (
                                        <option key={size} value={size}>{size} employees</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                <FileText size={12} /> Company Logo URL
                            </label>
                            <input
                                name="companyLogo"
                                value={form.companyLogo}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">About the Company</label>
                            <textarea
                                name="companyDescription"
                                value={form.companyDescription}
                                onChange={handleChange}
                                rows={5}
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm resize-none"
                                placeholder="Tell candidates what makes your company a great place to work..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white h-13 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {mutation.isPending ? 'Saving...' : 'Save Company Profile'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyProfilePage;
