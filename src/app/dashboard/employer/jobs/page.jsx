'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import {
  Briefcase,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { format } from 'date-fns';
import { Badge } from '@/Components/ui/badge';

const MyJobsPage = () => {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/employer/jobs');
      return data;
    },
  });

  const featuredMutation = useMutation({
    mutationFn: async (jobId) => {
      await axiosInstance.post('/employer/jobs/feature', { jobId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast.success('Feature request submitted to admin!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    },
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':  return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:         return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={14} className="mr-1" />;
      case 'rejected': return <XCircle size={14} className="mr-1" />;
      case 'pending':  return <Clock size={14} className="mr-1" />;
      default:         return null;
    }
  };

  if (isLoading) return <CustomLoader />;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/employer" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <SectionHeading
            heading="My Job Postings"
            subheading="Manage your published jobs and track applicant pipelines."
          />
          <Link href="/dashboard/employer/post-job">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 px-6 shadow-lg shadow-purple-500/20 flex items-center gap-2">
              <Plus size={18} /> Post a New Job
            </Button>
          </Link>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {!jobs || jobs.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
              <Briefcase size={40} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No jobs posted yet</h3>
              <p className="text-gray-500 text-sm mb-6">Create your first job posting to start attracting top talent.</p>
              <Link href="/dashboard/employer/post-job">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-8 h-12 font-black shadow-lg shadow-purple-500/20">
                  <Plus size={16} className="mr-2" /> Post Job
                </Button>
              </Link>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left: Job Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {job.title}
                    </h3>
                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center ${getStatusStyle(job.status)}`}>
                      {getStatusIcon(job.status)} {job.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 font-bold mb-4">
                    Posted on {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">{job.jobType}</Badge>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100">{job.category}</Badge>
                    {job.urgency === 'Urgent' && (
                      <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-100">Urgent</Badge>
                    )}
                  </div>
                </div>

                {/* Right: Stats & Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 items-start md:items-end justify-between md:justify-center">
                  
                  {/* Applicants stat box */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 rounded-2xl border border-purple-100 dark:border-purple-800 flex flex-col items-center justify-center min-w-[120px]">
                    <span className="text-2xl font-black text-purple-600 mb-1">{job.applicantCount || 0}</span>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                      <Users size={12} /> Applicants
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Link href={`/dashboard/employer/applicants/${job._id}`} className="w-full">
                      <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl font-bold mb-2">
                        View Pipeline <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                    
                    {/* Feature Request */}
                    {job.isFeatured ? (
                      <div className="text-center px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                        <Star size={14} fill="currentColor" /> Featured Pro
                      </div>
                    ) : job.featuredRequest ? (
                      <div className="text-center px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                        <Clock size={14} /> Feature Pending
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => featuredMutation.mutate(job._id)}
                        disabled={featuredMutation.isPending || job.status !== 'approved'}
                        className="w-full h-10 border-yellow-300 text-yellow-600 hover:bg-yellow-50 rounded-xl text-xs font-bold"
                      >
                        <Star size={14} className="mr-1" /> Request Feature
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
