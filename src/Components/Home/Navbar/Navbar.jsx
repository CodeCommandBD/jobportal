'use client'
import React, { useEffect, useState } from 'react'
import { LuNetwork } from 'react-icons/lu'
import { Navlinks } from '../../../../constants/constants'
import Link from 'next/link'
import { HiBars3BottomRight } from 'react-icons/hi2'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggler from '@/Components/helpers/ThemeToggler'
import NotificationDropdown from './NotificationDropdown'

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

const Navbar = ({ openNav }) => {
  const { data: session } = useSession();
  const [navbg, setNavbg] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/settings');
      return data;
    },
  });

  useEffect(() => {
    const handler = () => {
      if (window.scrollY >= 90) setNavbg(true)
      if (window.scrollY < 90) setNavbg(false)
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className={`transition-all duration-300 z-[1000] w-full ${navbg ? 'bg-white dark:bg-gray-900 shadow-xl' : 'bg-transparent'}`}>
      <div className='max-w-7xl mx-auto p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Link href="/">
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-purple-600 dark:bg-white rounded-full flex items-center justify-center'>
                <LuNetwork className='w-5 h-5 text-white dark:text-purple-600' ></LuNetwork>
              </div>
              <h1 className='text-xl hidden xl:block md:text-2xl text-purple-500 dark:text-white font-semibold'>
                {settings?.siteName || 'DevHire'}
              </h1>
            </div>
          </Link>
        </div>
        <div className='hidden xl:flex items-center space-x-6'>
          {
            Navlinks?.map((item) => (
              <Link
                className='text-base dark:hover:text-purple-400 hover:text-purple-700 font-medium transition-all duration-200'
                href={item.url}
                key={item.id}>{item.label}</Link>
            ))
          }
          {session?.user?.role === 'admin' && (
            <Link 
              href="/dashboard/admin" 
              className='text-base font-black text-purple-600 dark:text-purple-400 hover:text-purple-800 transition-all uppercase tracking-tighter'
            >
              Admin Panel
            </Link>
          )}
          {session?.user?.role === 'employer' && (
            <Link 
              href="/dashboard/employer" 
              className='text-base font-bold text-purple-600 dark:text-purple-400'
            >
              Employer Dashboard
            </Link>
          )}
          {session?.user?.role === 'jobseeker' && (
            <Link 
              href="/dashboard/candidate" 
              className='text-base font-bold text-purple-600 dark:text-purple-400'
            >
              My Dashboard
            </Link>
          )}
        </div>

        <div className='flex items-center gap-x-2 sm:gap-x-4'>
          <div className='flex gap-2 sm:gap-3'>
            {!session ? (
              <Link href="/signin">
                <button className='px-3 sm:px-5 py-1.5 text-[10px] sm:text-xs rounded-xl cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all duration-200 font-bold text-gray-900 border border-gray-200'>
                  Sign In
                </button>
              </Link>
            ) : (
              <button 
                onClick={() => signOut()}
                className='px-3 sm:px-5 py-1.5 text-[10px] sm:text-xs rounded-xl cursor-pointer bg-red-50 hover:bg-red-100 transition-all duration-200 font-bold text-red-600 border border-red-100'
              >
                Logout
              </button>
            )}
            
            <Link href={session ? "/post-job" : "/signin"}>
              <button className='px-4 sm:px-6 py-1.5 text-xs rounded-xl cursor-pointer bg-purple-600 hover:bg-purple-700 text-white hidden xl:block transition-all duration-300 font-bold shadow-lg shadow-purple-500/20'>
                Post Job
              </button>
            </Link>
          </div>
          
          <div className="flex flex-row items-center gap-x-1 sm:gap-x-3">
            {session && <NotificationDropdown />}
            <ThemeToggler></ThemeToggler>
          </div>

          <HiBars3BottomRight
            onClick={openNav}
            className='xl:hidden w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:text-purple-600 transition-colors duration-200'></HiBars3BottomRight>
        </div>
      </div>
    </div>
  )
}

export default Navbar
