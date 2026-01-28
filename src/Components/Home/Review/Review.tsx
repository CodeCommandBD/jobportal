'use client'
import SectionHeading from '@/Components/helpers/SectionHeading'
import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReviewCard from './ReviewCard';
import { reviewone, reviewthree, reviewtwo } from '@/Assets';

const reviews = [
    {
        id: 1,
        image: reviewone,
        review: 'great Quality',
        username: 'jasica',
        userRole: 'App Developer'
    },
    {
        id: 2,
        image: reviewtwo,
        review: 'awesome work',
        username: 'shanto',
        userRole: 'web Developer'
    },
    {
        id: 3,
        image: reviewthree,
        review: 'wow it is good',
        username: 'kumar',
        userRole: 'Game Developer'
    },
]

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1324 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1324, min: 764 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 764, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};
const Review = () => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className='py-16'>
            <SectionHeading heading='Testimonials' subheading='all man can feedbak , and send their opnions. '></SectionHeading>
            <div className='max-w-6xl p-4 mx-auto mt-8'>
                <Carousel

                    draggable={true}
                    showDots={false}
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={4000}

                >
                    {
                        reviews?.map((item) => (
                            <ReviewCard key={item.id} item={item}></ReviewCard>
                        ))
                    }


                </Carousel>
            </div>
        </div>
    )
}

export default Review