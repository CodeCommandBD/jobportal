import SectionHeading from '@/Components/helpers/SectionHeading';
import React from 'react'
import JobCard from './JobCard';
import { jobcardeight, jobcardfive, jobcardfour, jobcardnine, jobcardone, jobcardseven, jobcardsix, jobcardthree, jobcardtwo } from '@/Assets';


const jobs = [
    {
        id: 1,
        image: jobcardone,
        title: 'Software Engineer',
        location: 'London, UK',
        jobType: 'Full Time',
        urgency: 'Urgent',
    },
    {
        id: 2,
        image: jobcardtwo,
        title: 'UI/UX Designer',
        location: 'Berlin, Germany',
        jobType: 'Part Time',
        urgency: 'Normal',
    },
    {
        id: 3,
        image: jobcardthree,
        title: 'Digital Marketer',
        location: 'Dhaka, Bangladesh',
        jobType: 'Remote',
        urgency: 'Urgent',
    },
    {
        id: 4,
        image: jobcardfour,
        title: 'Project Manager',
        location: 'New York, USA',
        jobType: 'Full Time',
        urgency: 'Normal',
    },
    {
        id: 5,
        image: jobcardfive,
        title: 'Customer Support',
        location: 'Sydney, Australia',
        jobType: 'Part Time',
        urgency: 'Urgent',
    },
    {
        id: 6,
        image: jobcardsix,
        title: 'Automotive Engineer',
        location: 'Tokyo, Japan',
        jobType: 'Full Time',
        urgency: 'Normal',
    },
    {
        id: 7,
        image: jobcardseven,
        title: 'Health Care Assistant',
        location: 'Toronto, Canada',
        jobType: 'Full Time',
        urgency: 'Urgent',
    },
    {
        id: 8,
        image: jobcardeight,
        title: 'Education Coordinator',
        location: 'Paris, France',
        jobType: 'Part Time',
        urgency: 'Normal',
    },
    {
        id: 9,
        image: jobcardnine,
        title: 'HR Specialist',
        location: 'Amsterdam, Netherlands',
        jobType: 'Remote',
        urgency: 'Urgent',
    },
];


const Job = () => {
  return (
    <div className='pt-16 pb-16 '>
        <SectionHeading heading='Featured Jobs' subheading='Know your worth and find the job that qualify your life '></SectionHeading>
        <div className='max-w-6xl px-4 mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center'>
            {
                jobs?.map((item,i) => (
                    <div 
                    data-aos='fade-up'
                    data-aos-anchor-placement ='top-center'
                    data-aos-delay={i * 100}
                    key={item.id}>
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