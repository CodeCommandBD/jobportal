import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { GrLocation } from 'react-icons/gr'

interface Props {
    item: {
        id: number,
        image: string | StaticImageData,
        name: string,
        location: string,
        position: string,
    }
}


const TopCompanyCard = ({ item }: Props) => {
    return (
        <div className='bg-gray-100 dark:bg-gray-800 rounded-lg  p-6 m-3'>
            <Image className='object-cover mx-auto' src={item.image} alt={item.name} width={80} height={80}></Image>
            <h1 className='text-lg font-medium mt-4 text-center text-gray-800 dark:text-gray-200'>{item.name}</h1>
            <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 text-center justify-center mt-3'>
                <GrLocation className='w-4 h-4'></GrLocation>
                {item.location}
            </div>
            <button className='bg-purple-200 hover:bg-purple-900 text-purple-700 py-2 px-5 rounded-lg hover:text-white transition-all duration-200 text-center mt-4 mx-auto w-full cursor-pointer'>({item.position} Open Position)</button>
        </div>
    )
}

export default TopCompanyCard