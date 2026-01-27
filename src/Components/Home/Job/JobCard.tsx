import Image from 'next/image'
import React from 'react'
import { BsBookmark } from 'react-icons/bs'
import { BiBriefcase } from 'react-icons/bi'
import { GrLocation } from 'react-icons/gr'
import { IJob } from '@/models/Job'
import { jobcardone } from '@/Assets' // Default fallback

interface Props {
    item: IJob
}

const JobCard = ({item}: Props) => {
  // Use employer image or fallback
  const jobImage = (item.employerId as any)?.image || jobcardone;

  return (
    <div className='border-[1.5px] border-gray-300 dark:border-gray-700 rounded-lg p-6 relative'>
        {/* bookmark icon */}
        <div className='w-7 h-7 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 flex items-center transition-all justify-center rounded-full absolute top-4 right-4'>
            <BsBookmark className='w-3 h-3'></BsBookmark>
        </div>
        {/*  */}
        <div className='flex items-center space-x-4'>
            <Image src={jobImage} alt={item.title} width={48} height={48} className="rounded-full object-cover" />
            <div>
                <h1 className='text-base font-medium '>{item.title}</h1>
                <div className='flex items-center gap-5 mt-2'>
                    <div className='flex items-center gap-1 text-gray-500'>
                        <BiBriefcase className='w-5 h-5 '></BiBriefcase>
                        <p className='text-gray-500 text-sm'>{item.company}</p>
                    </div>
                    <div className='flex items-center gap-1 text-gray-500'>
                        <GrLocation className='w-5 h-5 '></GrLocation>
                        <p className='text-gray-500 text-sm'>{item.location}</p>
                    </div>
                    
                </div>
            </div>
        </div>
        <div className='flex items-center gap-4 mt-4'>
            <div className={`py-1 px-2 rounded-full ${item.jobType === "Full Time" ? " bg-blue-200 dark:bg-purple-500" : 'bg-orange-200 dark:bg-orange-600 '}`}>
                <p className='text-blue-800 text-xs dark:text-white '>{item.jobType}</p>
            </div>
             <div className={`px-4 py-1 rounded-full text-xs ${item.urgency === 'Urgent' ? "bg-red-200 text-red-800" : 'bg-green-200 text-green-800'}`}>
                <p className=''>{item.urgency}</p>
             </div>
        </div>
    </div>
  )
}

export default JobCard