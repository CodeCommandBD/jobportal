
'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Briefcase, Users, UserCheck, UserPlus } from 'lucide-react';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import RecentActivity from '@/Components/Admin/Dashboard/RecentActivity';
import PendingApprovals from '@/Components/Admin/Dashboard/PendingApprovals';
import QuickActions from '@/Components/Admin/Dashboard/QuickActions';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip 
} from 'recharts';

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/stats');
            return data;
        },
    });

    if (isLoading) return <CustomLoader />;

    return (
        <div className="space-y-8">
            <SectionHeading heading="Admin Overview" subheading="Real-time statistics of your platform's activity." />
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Jobs" 
                    value={stats?.totalJobs || 0} 
                    icon={Briefcase} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Total Users" 
                    value={stats?.totalUsers || 0} 
                    icon={Users} 
                    color="bg-purple-500" 
                />
                <StatCard 
                    title="Employers" 
                    value={stats?.totalEmployers || 0} 
                    icon={UserCheck} 
                    color="bg-green-500" 
                />
                <StatCard 
                    title="Jobseekers" 
                    value={stats?.totalJobseekers || 0} 
                    icon={UserPlus} 
                    color="bg-orange-500" 
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Growth Trends (Last 7 Days)</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12}}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="jobs" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorJobs)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sidebar - Takes 1 column */}
                <div className="space-y-6">
                    <PendingApprovals 
                        pendingJobs={stats?.pendingJobs || 0}
                        unverifiedEmployers={stats?.unverifiedEmployers || 0}
                    />
                    <QuickActions />
                </div>
            </div>

            {/* Recent Activity - Full Width */}
            <RecentActivity logs={stats?.recentLogs || []} />
        </div>
    );
};

export default AdminDashboard;
