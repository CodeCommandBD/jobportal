import Image, { StaticImageData } from 'next/image'
import React from 'react'

interface Props{
    item:{
        id: number,
        image: string | StaticImageData,
        review: string,
        username: string,
        userRole: string
    }
}

const ReviewCard = ({item}:Props) => {
  return (
    <div className='flex flex-col items-center w-full lg:w-[60%] mx-auto'>
        <Image className='object-cover ' src={item.image} alt={item.review} width={80} height={80}></Image>
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