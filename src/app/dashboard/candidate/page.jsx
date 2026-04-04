
'use client'

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { 
    Clock, CheckCircle, XCircle, Briefcase,
    MapPin, Calendar, ArrowRight, Search, Bell, Star
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { format } from 'date-fns';

const CandidateApplicationsPage = () => {
    const { data: applications, isLoading } = useQuery({
        queryKey: ['candidate-applications'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/candidate/applications');
            return data;
        },
    });

    const getStatusInfo = (status) => {
        switch (status) {
            case 'hired':        return { label: 'Hired! 🎉',     icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-100' };
            case 'shortlisted':  return { label: 'Shortlisted',   icon: Star,        color: 'text-blue-600 bg-blue-50 border-blue-100' };
            case 'interview':    return { label: 'Interview',      icon: Calendar,    color: 'text-purple-600 bg-purple-50 border-purple-100' };
            case 'rejected':     return { label: 'Not Selected',   icon: XCircle,     color: 'text-red-600 bg-red-50 border-red-100' };
            default:             return { label: 'Pending',        icon: Clock,       color: 'text-yellow-600 bg-yellow-50 border-yellow-100' };
        }
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <SectionHeading 
                        heading="My Job Applications" 
                        subheading="Track the progress of every job you've applied for in real-time." 
                    />
                    <Link href="/findjob">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 px-6 shadow-lg shadow-purple-500/20">
                            <Search size={20} className="mr-2" /> Find More Jobs
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {applications?.length > 0 ? (
                        applications.map((app) => {
                            const status = getStatusInfo(app.status);
                            return (
                                <div key={app._id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                        {/* Company Branding */}
                                        <div className="h-20 w-20 rounded-3xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center font-black text-2xl text-gray-400 uppercase border border-gray-100 dark:border-gray-600 shrink-0">
                                            {app.jobId?.company?.[0] || 'C'}
                                        </div>

                                        {/* Job Details */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-purple-600 transition-colors">
                                                    {app.jobId?.title}
                                                </h3>
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                                                    {status.label}
                                                </div>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 font-bold mb-4 flex items-center gap-3">
                                                <span className="text-purple-600">{app.jobId?.company}</span>
                                                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                                <span className="flex items-center gap-1"><MapPin size={14} /> {app.jobId?.location}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Calendar size={14} /> Applied on {format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                                                <span className="flex items-center gap-1.5"><Briefcase size={14} /> Full Time</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50 dark:border-gray-700">
                                            <Link href={`/job/${app.jobId?._id}`}>
                                                <Button variant="outline" className="h-12 px-6 rounded-2xl border-gray-100 dark:border-gray-700 font-bold hover:border-purple-200 hover:text-purple-600 transition-all">
                                                    View Job Listing
                                                </Button>
                                            </Link>
                                            <Button className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 p-0 hover:bg-purple-600 hover:text-white transition-all">
                                                <ArrowRight size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-24 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center">
                            <div className="h-20 w-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                                <Briefcase size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">No applications yet</h3>
                            <p className="text-gray-500 mb-8 max-w-sm">Your dream career is just an application away. Start exploring top tech roles today.</p>
                            <Link href="/findjob">
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-10 text-lg font-bold shadow-xl shadow-purple-500/20">
                                    Browse Jobs
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateApplicationsPage;
