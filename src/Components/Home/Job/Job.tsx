import SectionHeading from '@/Components/helpers/SectionHeading';
import React from 'react'
import JobCard from './JobCard';
import { useJobs } from '@/hooks/useJobs';
import { IJob } from '@/models/Job';

const Job = () => {
  const { data: jobs, isLoading, error } = useJobs();

  if (isLoading) {
      return <div className="text-center py-10">Loading jobs...</div>
  }
  if (error) {
      return <div className="text-center py-10 text-red-500">Error loading jobs. Ensure database is connected.</div>
  }

  return (
    <div className='pt-16 pb-16 '>
        <SectionHeading heading='Featured Jobs' subheading='Know your worth and find the job that qualify your life '></SectionHeading>
        <div className='max-w-6xl px-4 mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center'>
            {
                jobs?.map((item: IJob, i: number) => (
                    <div 
                    data-aos='fade-up'
                    data-aos-anchor-placement ='top-center'
                    data-aos-delay={i * 100}
                    key={item._id as unknown as string}>
                        <JobCard  item={item} />
                    </div>
                ))
            }
        </div>
        <div className='mt-10 text-center'>
            <button className='px-10 py-4 bg-purple-900 text-white rounded-lg cursor-pointer'>Load more Listing.... </button>
        </div>
    </div>
  )
}

export default Job