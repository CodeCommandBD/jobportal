
'use client'

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { 
    Briefcase, 
    Users, 
    UserCheck, 
    UserPlus, 
    TrendingUp, 
    Calendar, 
    Activity,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
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
    Tooltip,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/stats');
            return data;
        },
        refetchInterval: 30000, // Refetch every 30 seconds for "live" feel
    });

    const chartColors = {
        jobs: '#8b5cf6', // Purple
        users: '#3b82f6', // Blue
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <SectionHeading 
                    heading="System Statistics" 
                    subheading="Monitor platform performance, growth trends, and pending tasks." 
                />
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse ml-2"></div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mr-2">Live Status</span>
                </div>
            </div>
            
            {/* Main Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Active Listings", value: stats?.totalJobs, icon: Briefcase, color: "from-blue-500 to-cyan-400", trend: "+12%" },
                    { title: "Total Talent", value: stats?.totalUsers, icon: Users, color: "from-purple-600 to-indigo-400", trend: "+5%" },
                    { title: "Employers", value: stats?.totalEmployers, icon: UserCheck, color: "from-emerald-500 to-teal-400", trend: "+8%" },
                    { title: "Jobseekers", value: stats?.totalJobseekers, icon: UserPlus, color: "from-orange-500 to-amber-400", trend: "+15%" }
                ].map((stat, i) => (
                    <div key={i} className="group bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                <stat.icon size={22} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                                <TrendingUp size={14} /> {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value || 0}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Visualization */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Growth Analytics</h3>
                                <p className="text-sm text-gray-400">Daily registration and posting activity</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                    <span className="text-xs font-bold text-gray-500">Users</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                                    <span className="text-xs font-bold text-gray-500">Jobs</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[380px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.chartData || []}>
                                    <defs>
                                        <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartColors.jobs} stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor={chartColors.jobs} stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartColors.users} stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor={chartColors.users} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}}
                                        dy={15}
                                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '20px', 
                                            border: '1px solid #f1f5f9', 
                                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
                                            padding: '15px'
                                        }} 
                                        itemStyle={{ fontWeight: 700, fontSize: '13px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="jobs" 
                                        stroke={chartColors.jobs} 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorJobs)" 
                                        animationDuration={1500}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="users" 
                                        stroke={chartColors.users} 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorUsers)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <RecentActivity logs={stats?.recentLogs || []} />
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-8">
                    <div className="bg-purple-600 rounded-[2rem] p-8 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 bg-white/10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                             System Pulse <Activity size={18} className="animate-pulse" />
                        </h4>
                        <p className="text-purple-100 text-sm mb-6 leading-relaxed">
                            Infrastructure is running at optimal capacity. All background workers are active.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                                <p className="text-[10px] font-bold text-purple-200 uppercase mb-1">Response Time</p>
                                <p className="text-xl font-black">24ms</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                                <p className="text-[10px] font-bold text-purple-200 uppercase mb-1">Success Rate</p>
                                <p className="text-xl font-black">99.9%</p>
                            </div>
                        </div>
                    </div>

                    <PendingApprovals 
                        pendingJobs={stats?.pendingJobs || 0}
                        unverifiedEmployers={stats?.unverifiedEmployers || 0}
                    />
                    
                    <QuickActions />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
