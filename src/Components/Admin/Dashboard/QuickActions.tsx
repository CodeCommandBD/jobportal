'use client'
import React from 'react';
import Link from 'next/link';
import { Megaphone, Users, Briefcase, Settings } from 'lucide-react';

const QuickActions = () => {
    const actions = [
        {
            label: 'Post Announcement',
            href: '/admin/announcements',
            icon: Megaphone,
            color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
            label: 'Manage Users',
            href: '/admin/users',
            icon: Users,
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            label: 'Review Jobs',
            href: '/admin/jobs',
            icon: Briefcase,
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            label: 'Site Settings',
            href: '/admin/settings',
            icon: Settings,
            color: 'bg-orange-500 hover:bg-orange-600'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                    <Link 
                        key={action.label}
                        href={action.href}
                        className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95`}
                    >
                        <action.icon size={24} />
                        <span className="text-sm font-medium text-center">{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
