'use client'
import React, { useState } from 'react'
import { FaMap } from 'react-icons/fa'
import { MdSearch } from 'react-icons/md'
import { useRouter, useSearchParams } from 'next/navigation'

const JobSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [title, setTitle] = useState(searchParams.get('title') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (title) params.set('title', title);
        if (location) params.set('location', location);
        
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <div className='w-full mt-8'>
            <div className='flex flex-col md:flex-row bg-white dark:bg-gray-900 shadow-2xl rounded-lg overflow-hidden'>
                {/* input fields */}
                <div className='flex items-center border-b md:border-b-0 md:border-r border-purple-200 dark:border-purple-600 px-4 sm:py-6 py-3 w-full md:w-1/2'>
                    <MdSearch className='text-purple-400 text-lg mr-2'></MdSearch>
                    <input 
                        className='w-full focus:outline-0 px-2' 
                        type="text" 
                        placeholder='Job title or company' 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                {/* where fields */}
                <div className='flex items-center border-b md:border-b-0 md:border-r border-purple-200 dark:border-purple-600 px-4 sm:py-6 py-3 w-full md:w-1/2'>
                    <FaMap className='text-purple-400 text-lg mr-2'></FaMap>
                    <input 
                        className='w-full focus:outline-0 px-2'  
                        type="text" 
                        placeholder='City or postcode' 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                {/* find job */}
                <button 
                    onClick={handleSearch}
                    className='bg-purple-600 text-white px-8 py-3 sm:py-6 cursor-pointer text-sm md:text-base w-full md:w-auto min-w-[140px] whitespace-nowrap hover:bg-purple-800 transition-all duration-200'>
                    Find Jobs
                </button>
            </div>

        </div>
    )
}

export default JobSearch