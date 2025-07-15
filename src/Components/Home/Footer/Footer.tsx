import React from 'react'
import { LuNetwork } from 'react-icons/lu'

const Footer = () => {
    return (
        <div className='py-16 bg-gray-100 dark:bg-gray-600'>
            <div className='max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5  gap-10 items-start'>
                {/* 1st part */}
                <div className=''>
                    {/* logo */}
                    <div className='flex items-center space-x-2'>
                        <div className='w-10 h-10 bg-purple-600 dark:bg-white rounded-full flex items-center justify-center'>
                            <LuNetwork className='w-5 h-5 text-white dark:text-purple-600' ></LuNetwork>
                        </div>
                        <h1 className='text-xl hidden sm:block md:text-2xl text-purple-500 dark:text-white font-semibold'>DevHire</h1>
                    </div>
                    {/* description */}
                    <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis vero quam iusto, modi voluptatibus pariatur.</p>
                    {/* call */}
                    <div className='mt-5'>
                        <h1 className='lg:text-xl text-base text-gray-700 dark:text-gray-300 font-medium'>Call Us</h1>
                        <p className='mt-1 text-gray-500 dark:text-gray-300 font-blod'>+5654562356546</p>
                    </div>
                    {/* address */}
                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-4'>Dhaka Gazipur</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>Dhaka Gazipur Bangladesh</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>example@gmail.com</p>
                </div>
                {/* 2nd part */}
                <div className='space-y-6'>
                    <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200'>For Candidates</h1>
                    <p className='footer_link'>Browse jobs</p>
                    <p className='footer_link'>Browse category</p>
                    <p className='footer_link'>Candidate Dashboard</p>
                    <p className='footer_link'>Job Alerts</p>
                    <p className='footer_link'>My Bookmarks</p>
                </div>
                {/* 3rd part */}
                <div className='space-y-6'>
                    <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200'>For Employer</h1>
                    <p className='footer_link'>Browse Candidates</p>
                    <p className='footer_link'>Employer Deshboard</p>
                    <p className='footer_link'>Add Job</p>
                    <p className='footer_link'>Job Packages</p>
                    
                </div>
                {/* 4rd part */}
                <div className='space-y-6'>
                    <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200'>About Us</h1>
                    <p className='footer_link'>Job page</p>
                    <p className='footer_link'>Job Page Alternative</p>
                    <p className='footer_link'>Resume Page</p>
                    <p className='footer_link'>Blog</p>
                    <p className='footer_link'>Contact</p>
                    
                </div>
                {/* 5th part */}
                <div className='space-y-6'>
                    <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200'>Helpful Resourses</h1>
                    <p className='footer_link'>Site Map</p>
                    <p className='footer_link'>Terms of Use</p>
                    <p className='footer_link'>Privacy Center</p>
                    <p className='footer_link'>Security Center</p>
                    <p className='footer_link'>Accessibilty Center</p>
                </div> 
            </div>
            <div className='max-w-6xl px-4 pt-6 mt-10 border-t  mx-auto border-gray-300 dark:border-gray-800'>
                <p className='text-gray-500 dark:text-gray-400'>&copy; 2025 codeCommandBD. All Right Reserved </p>
            </div>

        </div>
    )
}

export default Footer