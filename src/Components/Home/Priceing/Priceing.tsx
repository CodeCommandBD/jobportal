import SectionHeading from '@/Components/helpers/SectionHeading'
import React from 'react'
import PriceCard from './PriceCard'

const Priceing = () => {
    return (
        <div className='py-16'>
            <SectionHeading heading='Pricing Packages' subheading='choose your basic needed item, and buy your item.'></SectionHeading>
            <div className='max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' >

                <div
                data-aos='fade-right'
                data-aos-anchor-placement ='top-center'
                data-aos-delay={0}
                >
                    <PriceCard type='Basic' price='199'></PriceCard>
                </div>
                <div
                data-aos='fade-right'
                data-aos-anchor-placement ='top-center'
                data-aos-delay={0}
                >
                    <PriceCard type='Standard' price='249'></PriceCard>
                </div>
                <div
                data-aos='fade-right'
                data-aos-anchor-placement ='top-center'
                data-aos-delay={0}
                >
                    <PriceCard type='Extended' price='315'></PriceCard>
                </div>


            </div>
        </div>
    )
}

export default Priceing