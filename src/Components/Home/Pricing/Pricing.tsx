import SectionHeading from '@/Components/helpers/SectionHeading'
import React from 'react'
import PriceCard from './PriceCard'

const Pricing = () => {
    return (
        <div className='pt-16 pb-16'>
            <SectionHeading heading='Upgrade Your Plan' subheading='Know your worth and find the job that qualify your life'></SectionHeading>
            <div className='w-[90%] md:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 items-center mt-12'>
                <div 
                data-aos='fade-up'
                data-aos-anchor-placement ='top-center'
                >
                    <PriceCard type='Basic' price='199' />
                </div>
                <div 
                data-aos='fade-up'
                data-aos-anchor-placement ='top-center'
                data-aos-delay='100'
                >
                    <PriceCard type='Standard' price='249' />
                </div>
                <div 
                data-aos='fade-up'
                data-aos-anchor-placement ='top-center'
                data-aos-delay='200'
                >
                    <PriceCard type='Extended' price='315' />
                </div>
            </div>
        </div>
    )
}

export default Pricing