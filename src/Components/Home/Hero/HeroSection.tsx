'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import JobSearch from './JobSearch'


const HeroSection = () => {
    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const { data } = await axios.get('/api/site-settings');
            return data;
        },
    });

    // Use dynamic image if available
    const heroImage = settings?.heroImage;

    return (
        <div className='relative w-full h-screen flex justify-center items-center overflow-hidden'>
            {/* Background Image with Overlay */}
            {heroImage && (
                <>
                    <div 
                        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/70 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/70' />
                </>
            )}

            <div className='container p-4 relative z-10'>
                <div className='max-w-3xl mx-auto text-center'>
                    {/* heading */}
                    <h1 className='text-4xl sm:text-6xl font-bold leading-tight' data-aos='fade-up'>
                        {settings?.heroTitle || 'Join us And Explore Thousands of Jobs'}
                    </h1>
                    {/* sub heading */}
                    <p className='mt-6 text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300' data-aos='fade-up' data-aos-delay='100'>
                        {settings?.heroSubtitle || 'Find Jobs, Employment and Career Opportunities'}
                    </p>
                    {/* job search */}
                    <div data-aos='fade-up' data-aos-delay='200'>
                        <JobSearch />
                    </div>
                    {/* popular search */}
                    <div className='text-base font-semibold text-gray-700 dark:text-gray-300 mt-8 flex flex-wrap items-center justify-center gap-2' data-aos='fade-up' data-aos-delay='300'>
                        <span className='text-nowrap'>Popular Search:</span>
                        <span className='text-sm text-gray-600 dark:text-gray-400 font-normal'>Designer, Developer, Web, IOS, PHP, senior, Engineer</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection