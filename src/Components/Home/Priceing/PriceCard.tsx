import React from 'react'
import { BiCheck } from 'react-icons/bi'

interface Props{
    type:string,
    price: string
}

const PriceCard = ({type, price} :Props) => {
  return (
    <div className='bg-gray-100 dark:bg-gray-700 p-10 rounded-lg relative'> 
       {/* type cheak for recomended badge */}
        {type === 'Standard' && <div className='absolute top-7 right-7 px-6 py-1.5 bg-purple-500 text-white rounded-full text-xs'>Recomended</div>}
        {/* type */}
        <h1 className='mt-6 text-xl font-bold text-purple-800 dark:text-white'>{type}</h1>
        {/* price */}
        <div className='mt-3'>
            <span className='text-4xl font-bold text-purple-950 dark:text-purple-400'>${price}</span>
            <span className='text-purple-950 dark:text-purple-400'>/monthly</span>
        </div>
        {/* Feature list */}
        <div className='mt-12'>
            <div className='flex items-center mb-6 gap-1'>
                <BiCheck className='w-7 h-7'></BiCheck>
                <span className='text-gray-700 dark:text-gray-300'>0 Featured Job</span>
            </div>
            <div className='flex items-center mb-6 gap-1'>
                <BiCheck className='w-7 h-7'></BiCheck>
                <span className='text-gray-700 dark:text-gray-300'>1 job Posting</span>
            </div>
            <div className='flex items-center mb-6 gap-1'>
                <BiCheck className='w-7 h-7'></BiCheck>
                <span className='text-gray-700 dark:text-gray-300'>Job dispayed for 20 days</span>
            </div>
            <div className='flex items-center mb-6 gap-1'>
                <BiCheck className='w-7 h-7'></BiCheck>
                <span className='text-gray-700 dark:text-gray-300'>Premium Support 24/7</span>
            </div>
        </div>
        <button className='mt-5 bg-purple-200 py-2 w-full rounded-full text-purple-900 cursor-pointer hover:bg-purple-700 hover:text-white transition-all duration-200'>View Profile</button>
    </div>
  )
}

export default PriceCard