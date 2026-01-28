'use client'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { jobcardeight, jobcardfive, jobcardfour, jobcardnine, jobcardone, jobcardseven, jobcardsix, jobcardthree, jobcardtwo } from '@/Assets';
import SectionHeading from '@/Components/helpers/SectionHeading';
import TopCompanyCard from './TopCompanyCard';

const companyData = [
    {
        id: 1,
        image: jobcardone,
        name: 'Udemy',
        location: 'London, UK',
        position: '20',
    },
    {
        id: 2,
        image: jobcardtwo,
        name: 'Google',
        location: 'Berlin, Germany',
        position: '35',
    },
    {
        id: 3,
        image: jobcardthree,
        name: 'Meta',
        location: 'Dhaka, Bangladesh',
        position: '15',
    },
    {
        id: 4,
        image: jobcardfour,
        name: 'Amazon',
        location: 'New York, USA',
        position: '50',
    },
    {
        id: 5,
        image: jobcardfive,
        name: 'Microsoft',
        location: 'Sydney, Australia',
        position: '28',
    },
    {
        id: 6,
        image: jobcardsix,
        name: 'Tesla',
        location: 'Tokyo, Japan',
        position: '12',
    },
    {
        id: 7,
        image: jobcardseven,
        name: 'Apple',
        location: 'Toronto, Canada',
        position: '22',
    },
    {
        id: 8,
        image: jobcardeight,
        name: 'IBM',
        location: 'Paris, France',
        position: '18',
    },
    {
        id: 9,
        image: jobcardnine,
        name: 'Netflix',
        location: 'Amsterdam, Netherlands',
        position: '10',
    },
];

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1324 },
        items: 4,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1324, min: 764 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 764, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};
import React, { useEffect, useState } from 'react'

const TopCompany = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className='py-16 '>
            <SectionHeading heading='Top Company Registered' subheading='Some of the companies we have helped recruit excellent applicants over the years'></SectionHeading>
            <div className='max-w-6xl p-4 mx-auto'>
                <Carousel
                    
                    draggable={true}
                    showDots={true}
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={4000}
                    containerClass="react-multi-carousel-list"
                    dotListClass="react-multi-carousel-dot-list"
                >
                    {
                        companyData?.map((item) => (
                         <TopCompanyCard key={item.id} item={item}></TopCompanyCard>
                        ))
                    }

                </Carousel>
            </div>
        </div>
    )
}

export default TopCompany