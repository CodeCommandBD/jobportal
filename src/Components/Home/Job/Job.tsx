import SectionHeading from '@/Components/helpers/SectionHeading';
import React from 'react'
import JobCard from './JobCard';
import { useJobs } from '@/hooks/useJobs';
import { IJob } from '@/models/Job';
import { useSearchParams } from 'next/navigation';
import { JobSkeleton } from '@/Components/helpers/SkeletonLoader';

const Job = () => {
  const searchParams = useSearchParams();
  const filters = {
    title: searchParams.get('title') || undefined,
    location: searchParams.get('location') || undefined,
    category: searchParams.get('category') || undefined,
  };

  const { data: jobs, isLoading, error } = useJobs(filters);

  if (error) {
       return <div className="text-center py-10 text-red-500">Error loading jobs. Ensure database is connected.</div>
  }

  return (
    <div className='pt-16 pb-16 '>
        <SectionHeading heading='Featured Jobs' subheading='Know your worth and find the job that qualify your life '></SectionHeading>
        <div className='max-w-6xl px-4 mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center'>
            {
                isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <JobSkeleton key={i} />
                    ))
                ) : (
                    jobs && jobs.length > 0 ? (
                        jobs.map((item: IJob, i: number) => (
                            <div 
                            data-aos='fade-up'
                            data-aos-anchor-placement ='top-center'
                            data-aos-delay={i * 100}
                            key={item._id?.toString()}>
                                <JobCard  item={item} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No jobs found matching your criteria.
                        </div>
                    )
                )
            }
        </div>
        {!isLoading && jobs && jobs.length > 0 && (
            <div className='mt-10 text-center'>
                <button className='px-10 py-4 bg-purple-900 text-white rounded-lg cursor-pointer'>Load more Listing.... </button>
            </div>
        )}
    </div>
  )
}

export default Job