
'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    Settings, 
    LogOut,
    MessageSquare,
    Grid,
    Megaphone,
    FileText,
    History
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const AdminSidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Manage Jobs', href: '/admin/jobs', icon: Briefcase },
        { name: 'Job Categories', href: '/admin/categories', icon: Grid },
        { name: 'Applications', href: '/admin/applications', icon: FileText },
        { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
        { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
        { name: 'Manage Users', href: '/admin/users', icon: Users },
        { name: 'Activity Logs', href: '/admin/logs', icon: History },
        { name: 'Live Chat', href: '/admin/chat', icon: MessageSquare },
        { name: 'Home Page Settings', href: '/admin/site-settings', icon: Settings },
        { name: 'General Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-purple-600 dark:text-white">Admin Panel</h2>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button 
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
