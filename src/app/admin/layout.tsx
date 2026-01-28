
import React from 'react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    console.log("Admin Check Session:", session);
    console.log("User Role:", (session?.user as { role?: string })?.role);

    // Protection: Redirect if not admin
    if (!session || (session.user as { role?: string }).role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
            {/* Sidebar */}
            <AdminSidebar />
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
