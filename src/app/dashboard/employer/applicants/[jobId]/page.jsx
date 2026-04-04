'use client'

import React, { useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import {
    Mail, FileText, ChevronLeft, ExternalLink,
    User, Calendar, StickyNote, CheckCircle2,
    Clock, XCircle, Star, Users, ArrowRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import { format } from 'date-fns';

// ATS Pipeline stages
const STAGES = [
    { key: 'pending',     label: 'Applied',     color: 'yellow',  icon: Clock },
    { key: 'shortlisted', label: 'Shortlisted', color: 'blue',    icon: Star },
    { key: 'interview',   label: 'Interview',   color: 'purple',  icon: Calendar },
    { key: 'hired',       label: 'Hired',       color: 'green',   icon: CheckCircle2 },
    { key: 'rejected',    label: 'Rejected',    color: 'red',     icon: XCircle },
];

const colorMap = {
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
    blue:   'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400',
    green:  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    red:    'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
};

// ─── Applicant Card ───────────────────────────────────────────────────────────
const ApplicantCard = ({ app, onStatusChange, isPending }) => {
    const [noteOpen, setNoteOpen] = useState(false);
    const [note, setNote] = useState(app.employerNote || '');
    const [dateInput, setDateInput] = useState(
        app.interviewDate ? format(new Date(app.interviewDate), 'yyyy-MM-dd') : ''
    );

    const currentStage = STAGES.find(s => s.key === app.status) || STAGES[0];
    const nextStages = STAGES.filter(s => s.key !== app.status && s.key !== 'rejected');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-lg transition-all">
            {/* Status bar */}
            <div className={`h-1.5 w-full ${
                currentStage.color === 'green' ? 'bg-green-500' :
                currentStage.color === 'blue' ? 'bg-blue-500' :
                currentStage.color === 'purple' ? 'bg-purple-500' :
                currentStage.color === 'red' ? 'bg-red-400' : 'bg-yellow-400'
            }`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-black text-xl flex items-center justify-center uppercase">
                            {app.userId?.name?.[0] || 'U'}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 dark:text-white">{app.userId?.name}</h4>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Mail size={11} /> {app.userId?.email}
                            </p>
                            {app.userId?.title && (
                                <p className="text-xs text-purple-600 font-bold mt-0.5">{app.userId?.title}</p>
                            )}
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colorMap[currentStage.color]}`}>
                        {currentStage.label}
                    </div>
                </div>

                {/* Applied date */}
                <p className="text-xs text-gray-400 font-bold mb-4">
                    Applied {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                </p>

                {/* Interview Date (if set) */}
                {app.interviewDate && (
                    <div className="flex items-center gap-2 text-sm text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-xl mb-4">
                        <Calendar size={14} /> Interview: {format(new Date(app.interviewDate), 'MMM dd, yyyy')}
                    </div>
                )}

                {/* Employer Note */}
                {app.employerNote && (
                    <p className="text-xs italic text-gray-500 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-xl mb-4 border-l-4 border-purple-300">
                        "{app.employerNote}"
                    </p>
                )}

                {/* Actions row */}
                <div className="flex gap-2 flex-wrap mb-3">
                    {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs border-purple-200 text-purple-600">
                                <FileText size={12} className="mr-1" /> Resume
                            </Button>
                        </a>
                    )}
                    <Button
                        variant="outline" size="sm"
                        className="h-8 rounded-xl text-xs"
                        onClick={() => setNoteOpen(o => !o)}
                    >
                        <StickyNote size={12} className="mr-1" /> Note
                    </Button>
                    {app.userId?._id && (
                        <Link href={`/candidates/${app.userId._id}`}>
                            <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs">
                                <ExternalLink size={12} className="mr-1" /> Profile
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Note editor */}
                {noteOpen && (
                    <div className="mb-3 space-y-2">
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={2}
                            placeholder="Add a private note about this candidate..."
                            className="w-full text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 resize-none"
                        />
                        {app.status === 'interview' && (
                            <input
                                type="date"
                                value={dateInput}
                                onChange={e => setDateInput(e.target.value)}
                                className="w-full text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-400"
                            />
                        )}
                        <Button
                            size="sm"
                            onClick={() => {
                                onStatusChange({ applicationId: app._id, employerNote: note, interviewDate: dateInput || undefined });
                                setNoteOpen(false);
                            }}
                            className="h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs"
                        >
                            Save Note
                        </Button>
                    </div>
                )}

                {/* Move to next stage */}
                <div className="border-t border-gray-50 dark:border-gray-700 pt-3 flex gap-2 flex-wrap">
                    {nextStages.slice(0, 3).map(stage => (
                        <Button
                            key={stage.key}
                            size="sm"
                            disabled={isPending}
                            onClick={() => onStatusChange({ applicationId: app._id, status: stage.key })}
                            className={`h-8 rounded-xl text-xs flex items-center gap-1 ${
                                stage.key === 'rejected'
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                            variant={stage.key === 'rejected' ? 'ghost' : 'default'}
                        >
                            → {stage.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Main Kanban Board ────────────────────────────────────────────────────────
const JobApplicantsPage = ({ params }) => {
    const { jobId } = use(params);
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('all');

    const { data: applicants = [], isLoading } = useQuery({
        queryKey: ['job-applicants', jobId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/employer/applicants/${jobId}`);
            return data;
        },
        enabled: !!jobId,
    });

    const statusMutation = useMutation({
        mutationFn: async (payload) => {
            await axiosInstance.patch('/employer/applicants/status', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-applicants', jobId] });
            toast.success('Updated!');
        },
        onError: () => toast.error('Update failed'),
    });

    const filtered = activeTab === 'all' ? applicants : applicants.filter(a => a.status === activeTab);

    if (isLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/employer" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            Applicant Pipeline
                        </h1>
                        <p className="text-gray-500 mt-1">Manage and move candidates through your hiring stages</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <Users size={16} className="text-gray-400 ml-2" />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 pr-2">
                            {applicants.length} total
                        </span>
                    </div>
                </div>

                {/* Stage filter tabs */}
                <div className="flex gap-2 flex-wrap mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm w-full overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All ({applicants.length})
                    </button>
                    {STAGES.map(stage => {
                        const count = applicants.filter(a => a.status === stage.key).length;
                        return (
                            <button
                                key={stage.key}
                                onClick={() => setActiveTab(stage.key)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === stage.key ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {stage.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Applicant Cards */}
                {filtered.length === 0 ? (
                    <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                        <Users size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No applicants in this stage</h3>
                        <p className="text-gray-500 text-sm">Move candidates through the pipeline using the stage buttons.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map(app => (
                            <ApplicantCard
                                key={app._id}
                                app={app}
                                onStatusChange={statusMutation.mutate}
                                isPending={statusMutation.isPending}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicantsPage;
