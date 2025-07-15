import React from 'react'
import JobSearch from './JobSearch'
import Image from 'next/image'
import { herobg } from '@/Assets'


const HeroSection = () => {
  return (
    <div className='relative w-full h-screen flex justify-center '>
        <div className='container p-4 grid text-center grid-cols-1 xl:grid-cols-2 gap-10'>
            {/* text content */}
            <div data-aos='fade-right'>
                {/* heading */}
                <h1 className='text-3xl sm:text-5xl font-bold'>Join us And Expolre Thousands of Jobs</h1>
                {/* sub heading */}
                <p className='mt-4 text-sm sm:text-lg font-medium'>Find Jobs, Employment and Career Oppertunities</p>
                {/* job search */}
                <JobSearch></JobSearch>
                {/* popular search */}
                <div className='text-base font-semibold text-gray-700 dark:text-gray-300 mt-6 flex items-start space-x-6'>
                  <span className='text-nowrap'>Popular Search: </span>
                  <span className='text-sm text-start text-gray-700 dark:text-gray-300 font-light '>Designer, Developer, Web, IOS, PHP, senior, Engineer</span>
                </div>
            </div>
            {/* image content */}

            <div data-aos='fade-left' className='mx-auto hidden xl:block'>
              <Image width={900} height={900} src={herobg} alt='herobg'></Image>
            </div>
        </div>
    </div>
  )
}

export default HeroSection