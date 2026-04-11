
'use client'

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { 
    Briefcase, 
    Users, 
    Clock, 
    ChevronRight, 
    Plus,
    ExternalLink,
    ArrowRight,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';

const EmployerDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['employer-stats'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/employer/stats');
            return data;
        },
    });

    if (isLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <SectionHeading 
                        heading={`Welcome back, ${stats?.employerName || 'Employer'}`} 
                        subheading="Here's what's happening with your job postings today." 
                    />
                    <Link href="/post-job">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 px-6 shadow-lg shadow-purple-500/20">
                            <Plus size={20} className="mr-2" /> Post a New Job
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { title: "Total Jobs", value: stats?.totalJobs, icon: Briefcase, color: "bg-blue-500" },
                        { title: "Active Jobs", value: stats?.activeJobs, icon: Clock, color: "bg-green-500" },
                        { title: "Total Applicants", value: stats?.totalApplications, icon: Users, color: "bg-purple-500" },
                        { title: "Pending Review", value: stats?.pendingApplications, icon: Clock, color: "bg-yellow-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value || 0}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Applications */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Applications</h3>
                            <Link href="/dashboard/employer/applicants" className="text-sm font-bold text-purple-600 hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {stats?.recentApplications?.length > 0 ? (
                                stats.recentApplications.map((app) => (
                                    <div key={app._id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 uppercase">
                                                {app.userId?.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{app.userId?.name}</h4>
                                                <p className="text-xs text-gray-400">Applied for: <span className="font-bold text-purple-600">{app.jobId?.title}</span></p>
                                            </div>
                                        </div>
                                        <Link href={`/dashboard/employer/applicants/${app.jobId?._id}`}>
                                            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600">
                                                Review <ChevronRight size={16} className="ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-gray-400 italic">No recent applications found.</div>
                            )}
                        </div>
                    </div>

                    {/* Quick Links / Tips */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Briefcase size={100} />
                            </div>
                            <div className="h-14 w-14 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <Briefcase size={24} />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">My Jobs</h4>
                            <p className="text-gray-500 text-sm mb-6">
                                View all your posted jobs, track applicant pipelines, and request features.
                            </p>
                            <Link href="/dashboard/employer/jobs">
                                <Button variant="outline" className="w-full justify-between h-12 rounded-xl group-hover:border-purple-300 group-hover:text-purple-600">
                                    Manage Postings
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <TrendingUp size={100} />
                            </div>
                            <div className="h-14 w-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">Analytics</h4>
                            <p className="text-gray-500 text-sm mb-6">
                                See how your job postings are performing and viewer demographics.
                            </p>
                            <Link href="#">
                                <Button variant="outline" className="w-full justify-between h-12 rounded-xl group-hover:border-green-300 group-hover:text-green-600">
                                    View Insights <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-purple-500/20">
                            <h4 className="text-lg font-bold mb-2">Build your Brand</h4>
                            <p className="text-purple-100 text-sm mb-6 leading-relaxed">
                                Complete your company profile to attract 2x more qualified candidates.
                            </p>
                            <Link href="/dashboard/employer/company-profile">
                                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 rounded-2xl font-bold py-6">
                                    Edit Company Profile
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-yellow-500" /> Hiring Tips
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    "Be specific in job descriptions",
                                    "Respond to applicants within 48h",
                                    "Highlight your company culture"
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
