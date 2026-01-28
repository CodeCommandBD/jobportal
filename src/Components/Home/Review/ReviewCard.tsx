import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { Star } from 'lucide-react'

interface Props{
    item:{
        id: string | number,
        image: string | StaticImageData,
        review: string,
        username: string,
        userRole: string,
        rating?: number
    }
}

const ReviewCard = ({item}:Props) => {
  return (
    <div className='flex flex-col items-center w-full lg:w-[60%] mx-auto'>
        <Image className='object-cover rounded-full' src={item.image} alt={item.review} width={80} height={80}></Image>
        {item.rating && (
            <div className='flex items-center gap-1 mt-4'>
                {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={18} className='fill-yellow-400 text-yellow-400' />
                ))}
            </div>
        )}
        <h1 className='mt-4 text-lg font-bold text-purple-600 dark:text-white '>{item.review}</h1>
        <p className='mt-4 text-gray-600 dark:text-gray-400 text-center'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore qui quod numquam aut consequuntur libero laudantium iusto maxime quia amet!</p>
        <div className='mt-8 text-center '>
            <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200'>{item.username}</h2>
            <p className='text-gray-600 text-sm mt-2 dark:text-gray-400'>{item.userRole}</p>
        </div>
    </div>
  )
}

export default ReviewCard