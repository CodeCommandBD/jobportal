import { infoimg } from '@/Assets'
import Image from 'next/image'
import React from 'react'
import { BiCheck } from 'react-icons/bi'

const Info = () => {
  return (
    <div className='py-16'>
        <div className='max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
            {/* Image content */}
            <div
            data-aos='fade-right'
            data-aos-anchor-placement ='top-center'
            >
                <Image width={1000} height={1000} src={infoimg} alt='infoimg '></Image>
            </div>
            {/* text content */}
            <div 
            data-aos='fade-left'
            data-aos-anchor-placement ='top-center'
            data-aos-delay={150}
            > 
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold leading-8 lg:leading-16'>Get applications from the world best talents.</h1>
                <p className='mt-6 text-gray-700 dark:text-gray-300'>Search all the open positions on the web. Get you own personalized salary estimate. Read reviews on over 600,000 companies worldwide.</p>
                <div className='mt-8'>
                    <div className='flex items-center gap-2 mb-4'>
                        <BiCheck className='w-7 h-7 text-pink-600'></BiCheck>
                        <span className='text-gray-700 dark:text-gray-300 font-medium'>Bring to the table win-win survival</span>
                    </div>
                    <div className='flex items-center gap-2 mb-4'>
                        <BiCheck className='w-7 h-7 text-pink-600'></BiCheck>
                        <span className='text-gray-700 dark:text-gray-300 font-medium'>Capitalize on low hanging fruit to identify</span>
                    </div>
                    <div className='flex items-center gap-2 mb-4'>
                        <BiCheck className='w-7 h-7 text-pink-600'></BiCheck>
                        <span className='text-gray-700 dark:text-gray-300 font-medium'>But I must explain to you how all this  </span>
                    </div>
                
                </div>
                <button className='mt-8 px-10 py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-900 transition-all duration-200'>Post a Job</button>
            </div>
        </div>
    </div>
  )
}

export default Info