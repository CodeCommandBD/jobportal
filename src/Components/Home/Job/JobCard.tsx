import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { BsBookmark } from 'react-icons/bs'
import { BiBriefcase } from 'react-icons/bi'
import { GrLocation } from 'react-icons/gr'
import { Star, CheckCircle } from 'lucide-react'
import { IJob } from '@/models/Job'
import { jobcardone } from '@/Assets' // Default fallback

interface Props {
    item: IJob
}

const JobCard = ({item}: Props) => {
  // Use employer image or fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobImage = (item.employerId as any)?.image || jobcardone;

  return (
    <Link href={`/job/${item._id}`}>
        <div className={`border-[1.5px] rounded-lg p-6 relative transition-all ${item.isFeatured ? 'border-yellow-400 bg-yellow-50/10 shadow-md ring-1 ring-yellow-400/20' : 'border-gray-200 dark:border-gray-700'}`}>
        {/* Featured Badge */}
        {item.isFeatured && (
            <div className='absolute -top-3 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm'>
                <Star size={10} fill="currentColor" />
                Featured
            </div>
        )}

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
                        <div className="flex items-center gap-1">
                            <p className='text-gray-500 text-sm'>{item.company}</p>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(item.employerId as any)?.isVerified && (
                                <CheckCircle size={14} className="text-blue-500" fill="currentColor" />
                            )}
                        </div>
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
    </Link>
  )
}

export default JobCard