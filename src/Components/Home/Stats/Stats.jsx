'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Briefcase, Building2, Users } from 'lucide-react'

const Stats = () => {
    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const { data } = await axios.get('/api/site-settings');
            return data;
        },
    });

    const stats = [
        {
            icon: Briefcase,
            count: settings?.totalJobsDisplay || 0,
            label: 'Live Jobs',
            color: 'text-blue-600'
        },
        {
            icon: Building2,
            count: settings?.totalCompaniesDisplay || 0,
            label: 'Companies',
            color: 'text-purple-600'
        },
        {
            icon: Users,
            count: settings?.totalCandidatesDisplay || 0,
            label: 'Candidates',
            color: 'text-green-600'
        }
    ];

    return (
        <div className='py-16 bg-gray-50 dark:bg-gray-900'>
            <div className='max-w-6xl mx-auto p-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            data-aos='fade-up'
                            data-aos-delay={index * 100}
                            className='text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow'
                        >
                            <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                            <h3 className='text-4xl font-bold mb-2'>{stat.count.toLocaleString()}+</h3>
                            <p className='text-gray-600 dark:text-gray-400 font-medium'>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Stats
