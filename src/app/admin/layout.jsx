import React from 'react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}) {
    const session = await auth();

    console.log("Admin Check Session:", session);
    console.log("User Role:", session?.user?.role);

    if (!session || session.user?.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
            <AdminSidebar />
            
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
