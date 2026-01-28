'use client'
import React, { useEffect } from 'react'
import HeroSection from './Hero/HeroSection'
import Category from './Category/Category'
import Job from './Job/Job'
import TopCompany from './TopCompany/TopCompany'
import Info from './Info/Info'
import Pricing from './Pricing/Pricing'
import Review from './Review/Review'
import AOS from 'aos';
import 'aos/dist/aos.css';
const Home = () => {
  useEffect(()=>{
    const initAos = async () => {
      await import ('aos');
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
      <Info></Info>
      <Pricing></Pricing>
      <Review></Review>
    </div>
  )
}

export default Home