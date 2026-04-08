import React from 'react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * Enhanced Admin Layout for the consolidated dashboard.
 * Includes the AdminSidebar for all administrative sub-pages.
 */
export default async function AdminLayout({
    children,
}) {
    const session = await auth();

    // Secondary role-based protection within the layout
    if (!session || session.user?.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-transparent">
            {/* The specialized Admin Sidebar */}
            <AdminSidebar />
            
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
