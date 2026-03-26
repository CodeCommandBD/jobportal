
'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { 
    Mail, 
    FileText, 
    CheckCircle, 
    XCircle, 
    Clock, 
    ChevronLeft,
    ExternalLink,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';

const JobApplicantsPage = ({ params }) => {
    const queryClient = useQueryClient();
    const [id, setId] = useState(null);

    // Resolve params manually as it might be a promise in Next.js 15
    React.useEffect(() => {
        const resolveParams = async () => {
            const resolved = await params;
            setId(resolved.jobId);
        };
        resolveParams();
    }, [params]);

    const { data: applicants, isLoading } = useQuery({
        queryKey: ['job-applicants', id],
        queryFn: async () => {
            if (!id) return [];
            const { data } = await axiosInstance.get(`/employer/applicants/${id}`);
            return data;
        },
        enabled: !!id,
    });

    const statusMutation = useMutation({
        mutationFn: async ({ applicationId, status }) => {
            await axiosInstance.patch('/employer/applicants/status', { applicationId, status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-applicants', id] });
            toast.success('Application status updated');
        },
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'interviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'reviewed': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    if (isLoading || !id) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/employer" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <SectionHeading 
                    heading="Manage Applicants" 
                    subheading={`Review and update status for candidates who applied for this role.`} 
                />

                <div className="mt-10 space-y-6">
                    {applicants?.length > 0 ? (
                        applicants.map((app) => (
                            <div key={app._id} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex flex-col lg:flex-row gap-8 items-start">
                                    {/* Candidate Info */}
                                    <div className="flex gap-6 flex-1">
                                        <div className="h-20 w-20 rounded-[1.5rem] bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center font-black text-2xl text-purple-600 uppercase border border-purple-100">
                                            {app.userId?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{app.userId?.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1"><Mail size={14} /> {app.userId?.email}</span>
                                            </div>
                                            <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions & Status */}
                                    <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
                                        <Button 
                                            onClick={() => statusMutation.mutate({ applicationId: app._id, status: 'interviewing' })}
                                            variant="outline" 
                                            className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                                        >
                                            Schedule Interview
                                        </Button>
                                        <Button 
                                            onClick={() => statusMutation.mutate({ applicationId: app._id, status: 'accepted' })}
                                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                        >
                                            Accept
                                        </Button>
                                        <Button 
                                            onClick={() => statusMutation.mutate({ applicationId: app._id, status: 'rejected' })}
                                            variant="ghost" 
                                            className="text-red-500 hover:bg-red-50 rounded-xl"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>

                                {/* Cover Letter & Resume */}
                                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Cover Letter</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                            "{app.coverLetter || "No cover letter provided."}"
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-end items-end gap-3">
                                        {app.resumeUrl && (
                                            <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="w-full">
                                                <Button variant="outline" className="w-full flex items-center justify-between h-14 rounded-2xl border-purple-100 dark:border-gray-700 hover:border-purple-300">
                                                    <span className="flex items-center gap-2"><FileText size={20} className="text-purple-500" /> View Resume</span>
                                                    <ExternalLink size={18} className="text-gray-400" />
                                                </Button>
                                            </a>
                                        )}
                                        <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-100 dark:border-gray-700">
                                            <span className="flex items-center gap-2 text-gray-500"><Mail size={20} /> Send Message</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No applicants yet</h3>
                            <p className="text-gray-500">Wait for talent to discover your job posting or try promoting it.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplicantsPage;
