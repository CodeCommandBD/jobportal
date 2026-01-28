'use client'
import React from 'react';
import { Clock, User, Briefcase } from 'lucide-react';

interface Log {
    _id: string;
    adminName: string;
    action: string;
    targetType?: string;
    details: string;
    createdAt: string;
}

interface RecentActivityProps {
    logs: Log[];
}

const RecentActivity = ({ logs }: RecentActivityProps) => {
    const getIcon = (targetType?: string) => {
        if (targetType === 'User') return <User size={16} className="text-purple-500" />;
        if (targetType === 'Job') return <Briefcase size={16} className="text-blue-500" />;
        return <Clock size={16} className="text-gray-500" />;
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-purple-600" />
                Recent Activity
            </h3>
            <div className="space-y-3">
                {logs.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
                ) : (
                    logs.map((log) => (
                        <div 
                            key={log._id} 
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="mt-1">{getIcon(log.targetType)}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {log.action}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {log.details}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    by {log.adminName} • {formatTime(log.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
