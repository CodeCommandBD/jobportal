'use client'
import SectionHeading from '@/Components/helpers/SectionHeading'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReviewCard from './ReviewCard';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1324 },
        items: 1,
        slidesToSlide: 1
    },
    tablet: {
        breakpoint: { max: 1324, min: 764 },
        items: 1,
        slidesToSlide: 1
    },
    mobile: {
        breakpoint: { max: 764, min: 0 },
        items: 1,
        slidesToSlide: 1
    }
};

const Review = () => {
    const [mounted, setMounted] = React.useState(false)

    const { data: testimonials = [] } = useQuery({
        queryKey: ['testimonials'],
        queryFn: async () => {
            const { data } = await axios.get('/api/testimonials');
            return data;
        },
        enabled: mounted
    });

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // If no testimonials, don't render the section
    if (testimonials.length === 0) return null;

    return (
        <div className='py-16'>
            <SectionHeading heading='Testimonials' subheading='What our users say about their experience'></SectionHeading>
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
                        testimonials?.map((item: { _id: string; image: string; comment: string; name: string; role: string; rating: number }) => (
                            <ReviewCard 
                                key={item._id} 
                                item={{
                                    id: item._id,
                                    image: item.image,
                                    review: item.comment,
                                    username: item.name,
                                    userRole: item.role,
                                    rating: item.rating
                                }}
                            />
                        ))
                    }
                </Carousel>
            </div>
        </div>
    )
}

export default Review