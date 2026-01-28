
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

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const userRole = (session?.user as { role?: string })?.role;

    const { data: settings, isLoading: isSettingsLoading } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/settings');
            return data;
        },
    });

    // Don't block while checking session or settings
    if (status === 'loading' || isSettingsLoading) {
        return <>{children}</>;
    }

    const isAuthRoute = pathname === '/signin' || pathname === '/signup';
    const isAdminRoute = pathname?.startsWith('/admin');
    const isMaintenanceMode = settings?.maintenanceMode;
    const isUserAdmin = userRole === 'admin';

    // If maintenance mode is ON and user is NOT an admin, show maintenance page
    // Except for admin routes and auth routes
    if (isMaintenanceMode && !isUserAdmin && !isAdminRoute && !isAuthRoute) {
        return <Maintenance />;
    }

    if (isAdminRoute) {
        return (
            <>
                <AnnouncementBanner />
                {children}
                {settings?.showChat && <ChatWidget />}
            </>
        );
    }

    return (
        <>
            <AnnouncementBanner />
            <ResponsiveNav />
            {children}
            <Footer />
            <ScrollToTheTop />
            {settings?.showChat && <ChatWidget />}
        </>
    );
};

export default LayoutWrapper;
