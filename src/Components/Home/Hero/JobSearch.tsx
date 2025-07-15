import React from 'react'
import { FaMap } from 'react-icons/fa'
import { MdSearch } from 'react-icons/md'

const JobSearch = () => {
    return (
        <div className='w-full mt-8'>
            <div className='flex flex-col md:flex-row bg-white dark:bg-gray-900 shadow-2xl rounded-lg overflow-hidden'>
                {/* input fields */}
                <div className='flex items-center border-b md:border-b-0 md:border-r border-purple-200 dark:border-purple-600 px-4 sm:py-6 py-3 w-full md:w-1/2'>
                    <MdSearch className='text-purple-400 text-lg mr-2'></MdSearch>
                    <input className='w-full focus:outline-0 px-2' type="text" placeholder='Job title or company' />
                </div>
                {/* where fields */}
                <div className='flex items-center border-b md:border-b-0 md:border-r border-purple-200 dark:border-purple-600 px-4 sm:py-6 py-3 w-full md:w-1/2'>
                    <FaMap className='text-purple-400 text-lg mr-2'></FaMap>
                    <input className='w-full focus:outline-0 px-2'  type="text" placeholder='City of postcode' />
                </div>
                {/* find job */}
                <button className='bg-purple-600 text-white px-8 py-3 sm:py-6 cursor-pointer text-sm md:text-base w-full md:w-auto min-w-[140px] whitespace-nowrap hover:bg-purple-800 transition-all duration-200'>
                    Find Jobs
                </button>
            </div>

        </div>
    )
}

export default JobSearch