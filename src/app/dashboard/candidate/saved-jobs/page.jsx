'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Bookmark, ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { JobSkeleton } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';
import JobCard from '@/Components/Home/Job/JobCard';
import { useAppliedJobs } from '@/hooks/useAppliedJobs';

const SavedJobsPage = () => {
    const { data: appliedJobIds } = useAppliedJobs();

    const { data: savedJobs, isLoading, error } = useQuery({
        queryKey: ['candidate-saved-jobs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/candidate/saved-jobs');
            return data;
        },
    });

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/candidate" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <SectionHeading 
                        heading="Saved Jobs" 
                        subheading="Opportunities you've bookmarked to review or apply for later." 
                    />
                    <Link href="/findjob">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 px-6 shadow-lg shadow-purple-500/20">
                            <Search size={20} className="mr-2" /> Explore More
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <JobSkeleton key={i} />
                        ))
                    ) : error ? (
                        <div className="col-span-full py-10 text-center text-red-500">
                            Failed to load saved jobs. Try again later.
                        </div>
                    ) : savedJobs && savedJobs.length > 0 ? (
                        savedJobs.map((job) => (
                            <JobCard 
                                key={job._id} 
                                item={job} 
                                isApplied={appliedJobIds?.includes(job._id?.toString())} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center">
                            <div className="h-20 w-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                                <Bookmark size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">No saved jobs</h3>
                            <p className="text-gray-500 mb-8 max-w-sm">
                                You haven't bookmarked any jobs yet. Start exploring and save opportunities that catch your eye!
                            </p>
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

export default SavedJobsPage;
