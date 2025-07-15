import React from 'react'
import { GiTakeMyMoney } from 'react-icons/gi'
import { MdOutlineCampaign } from "react-icons/md";
import { FiPenTool } from "react-icons/fi";
import { FaCode, FaProjectDiagram, FaUserNurse, FaCarSide, FaChalkboardTeacher, FaUserTie } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import SectionHeading from '@/Components/helpers/SectionHeading';
import CategoryCard from './CategoryCard';

const Category = () => {

    const categoryData = [
        {
            id: 1,
            categoryName: 'Accounting / Finance',
            openPositions: 2,
            icon: <GiTakeMyMoney className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 2,
            categoryName: 'Marketing',
            openPositions: 5,
            icon: <MdOutlineCampaign className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 3,
            categoryName: 'Design',
            openPositions: 3,
            icon: <FiPenTool className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 4,
            categoryName: 'Development',
            openPositions: 8,
            icon: <FaCode className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 5,
            categoryName: 'Project Manager',
            openPositions: 2,
            icon: <FaProjectDiagram className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 6,
            categoryName: 'Customer Service',
            openPositions: 4,
            icon: <MdSupportAgent className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 7,
            categoryName: 'Health and Care',
            openPositions: 6,
            icon: <FaUserNurse className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 8,
            categoryName: 'Automotive Jobs',
            openPositions: 3,
            icon: <FaCarSide className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 9,
            categoryName: 'Education',
            openPositions: 5,
            icon: <FaChalkboardTeacher className='w-10 h-10 text-purple-500 dark:text-white' />
        },
        {
            id: 10,
            categoryName: 'Human Resources',
            openPositions: 2,
            icon: <FaUserTie className='w-10 h-10 text-purple-500 dark:text-white' />
        },
    ]

  return (
    <div className='pt-16 pb-16'>
        <SectionHeading heading={'Popular Job Categories'} subheading='2025 jobs live - 293 added today.'></SectionHeading>
        <div className='mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto p-4'>
            {
                categoryData?.map((item,i)=>(
                    <div 
                    className='' 
                    key={item.id}
                    data-aos='fade-right'
                    data-aos-anchor-placement ='top-center'
                    data-aos-delay={i * 100}
                    >
                        <CategoryCard item={item}></CategoryCard>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Category