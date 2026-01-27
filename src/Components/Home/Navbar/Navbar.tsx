'use client'
import React, { useEffect, useState } from 'react'
import { LuNetwork } from 'react-icons/lu'
import { Navlinks } from '../../../../constants/constants'
import Link from 'next/link'
import { HiBars3BottomRight } from 'react-icons/hi2'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggler from '@/Components/helpers/ThemeToggler'

interface Props {
  openNav: () => void;
}

const Navbar = ({ openNav }: Props) => {
  const { data: session } = useSession();
  const [navbg, setNavbg] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (window.scrollY >= 90) setNavbg(true)
      if (window.scrollY < 90) setNavbg(false)
    }
    window.addEventListener('scroll', handler)
    return () => removeEventListener('scroll', handler)
  }, [])

  return (
    <div className={` ${navbg ? 'bg-white dark:bg-gray-900 shadow-md' : 'fixed'} transition-all duration-200  z-[1000] fixed w-full`}>
      <div className='container p-4 flex items-center justify-between'>
        {/* LOGO */}
        <div className='flex items-center space-x-2'>
          <Link href="/">
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-purple-600 dark:bg-white rounded-full flex items-center justify-center'>
                <LuNetwork className='w-5 h-5 text-white dark:text-purple-600' ></LuNetwork>
              </div>
              <h1 className='text-xl hidden xl:block md:text-2xl text-purple-500 dark:text-white font-semibold'>DevHire</h1>
            </div>
          </Link>
        </div>
        {/* NavLink */}
        <div className='hidden lg:flex items-center space-x-10'>
          {
            Navlinks?.map((item) => (
              <Link
                className='text-base dark:hover:text-purple-400 hover:text-purple-700 font-medium transition-all duration-200'
                href={item.url}
                key={item.id}>{item.label}</Link>
            ))
          }
        </div>

        <div className='flex items-center gap-x-6'>
          {/* Auth buttons */}
          <div className='flex gap-4'>
            {!session ? (
              <Link href="/signin">
                <button className='px-8 py-2 text-xs sm:text-sm rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition-all duration-200 font-medium text-black'>
                  Sign In
                </button>
              </Link>
            ) : (
              <button 
                onClick={() => signOut()}
                className='px-8 py-2 text-xs sm:text-sm rounded-lg cursor-pointer bg-red-100 hover:bg-red-200 transition-all duration-200 font-medium text-red-600'
              >
                Logout
              </button>
            )}
            
            {/* job post button */}
            <Link href={session ? "/post-job" : "/signin"}>
              <button className='px-8 py-2 text-xs sm:text-sm rounded-lg cursor-pointer bg-purple-600 hover:bg-purple-900 text-white hidden sm:block transition-all duration-200 font-medium'>
                Job Post
              </button>
            </Link>
          </div>
          {/* Theme Toggler */}
          <div>
            <ThemeToggler></ThemeToggler>
          </div>
          {/* Burger menu */}
          <HiBars3BottomRight
            onClick={openNav}
            className=' lg:hidden w-8 h-8 cursor-pointer'></HiBars3BottomRight>
        </div>
      </div>
    </div>
  )
}

export default Navbar