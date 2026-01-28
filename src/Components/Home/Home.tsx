'use client'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from './Hero/HeroSection'

const Category = dynamic(() => import('./Category/Category'), { ssr: false })
const Job = dynamic(() => import('./Job/Job'), { ssr: false })
const TopCompany = dynamic(() => import('./TopCompany/TopCompany'), { ssr: false })
const Stats = dynamic(() => import('./Stats/Stats'), { ssr: false })
const Info = dynamic(() => import('./Info/Info'), { ssr: false })
const Review = dynamic(() => import('./Review/Review'), { ssr: false })
import 'aos/dist/aos.css';
const Home = () => {
  useEffect(()=>{
    const initAos = async () => {
      const AOS = (await import ('aos')).default;
      AOS.init({
        duration: 1000,
        easing:'ease',
        once:true,
        anchorPlacement:'top-bottom'
      })
    }
    initAos()
  },[])
  return (
    <div className='overflow-hidden '> 
      <HeroSection></HeroSection>
      <Category></Category>
      <Job></Job>
      <TopCompany></TopCompany>
      <Stats></Stats>
      <Info></Info>
      <Review></Review>
    </div>
  )
}

export default Home