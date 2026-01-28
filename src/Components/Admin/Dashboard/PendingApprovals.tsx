'use client'
import React from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface PendingApprovalsProps {
    pendingJobs: number;
    unverifiedEmployers: number;
}

const PendingApprovals = ({ pendingJobs, unverifiedEmployers }: PendingApprovalsProps) => {
    const items = [
        {
            label: 'Jobs Pending Approval',
            count: pendingJobs,
            href: '/admin/jobs',
            color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
            icon: AlertCircle
        },
        {
            label: 'Employers Awaiting Verification',
            count: unverifiedEmployers,
            href: '/admin/users',
            color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            icon: CheckCircle
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Pending Approvals</h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <Link 
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.color}`}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.label}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {item.count}
                                </p>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PendingApprovals;
