'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import ResponsiveNav from "../Home/Navbar/ResponsiveNav";
import Footer from "../Home/Footer/Footer";
import ScrollToTheTop from "./ScrollToTheTop";
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import Maintenance from './Maintenance';
import ChatWidget from './ChatWidget';
import AnnouncementBanner from './AnnouncementBanner';

const LayoutWrapper = ({ children }) => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const userRole = session?.user?.role;

    const { data: settings, isLoading: isSettingsLoading } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/settings');
            return data;
        },
    });

    if (status === 'loading' || isSettingsLoading) {
        return <>{children}</>;
    }

    const isAuthRoute = pathname === '/signin' || pathname === '/signup';
    const isDashboardRoute = pathname?.startsWith('/dashboard');
    const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/admin');
    const isMaintenanceMode = settings?.maintenanceMode;
    const isUserAdmin = userRole === 'admin';

    if (isMaintenanceMode && !isUserAdmin && !isAdminRoute && !isAuthRoute) {
        return <Maintenance />;
    }

    // Hide global Navbar/Footer for all Dashboard routes (Admin, Employer, Jobseeker)
    if (isDashboardRoute || isAdminRoute) {
        return (
            <>
                <AnnouncementBanner />
                <div className="bg-white dark:bg-gray-950 min-h-screen">
                    {children}
                </div>
                {settings?.showChat && <ChatWidget />}
            </>
        );
    }

    return (
        <>
            <header className="fixed w-full top-0 z-[1000]">
                <AnnouncementBanner />
                <ResponsiveNav />
            </header>
            <div className="pt-24 lg:pt-32"> 
                {children}
            </div>
            <Footer />
            <ScrollToTheTop />
            {settings?.showChat && <ChatWidget />}
        </>
    );
};

export default LayoutWrapper;
