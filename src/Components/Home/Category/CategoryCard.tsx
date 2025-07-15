'use client'
import React from 'react'
import Tilt from 'react-parallax-tilt'
interface Props {
    item: {
        id: number,
        categoryName: string,
        openPositions: number,
        icon: React.JSX.Element,
    }
}

const CategoryCard = ({ item }: Props) => {
    return (
        <Tilt scale={1.5} transitionSpeed={500}>
            <div className='bg-purple-50 dark:bg-purple-500 text-black dark:text-white p-4 flex flex-col items-center shadow-lg rounded-md'>
                <h2 className='w-16 h-16 bg-white dark:bg-gray-800 flex items-center justify-center rounded-full'> {item.icon} </h2>
                <h2 className='mt-6 text-center font-medium text-gray-800 dark:text-gray-200 '> {item.categoryName} </h2>
                <p className='mt-2 text-gray-600 dark:text-gray-300 text-sm text-center'>({item.openPositions} Open Position)</p>
            </div>
        </Tilt>
    )
}

export default CategoryCard