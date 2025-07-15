'use client'
import React, { useState } from 'react'
import Navbar from './Navbar'
import MobileNavbar from './MobileNavbar'


const ResponsiveNav = () => {
  const [showNav,setShowNav] = useState(false)

  const openNav = () => {
    setShowNav(!showNav)
  }
  const close = () => {
    setShowNav(!showNav)
  }

  return (
    <div className=''>
      
        <Navbar openNav = {openNav} ></Navbar>
        <MobileNavbar showNav={showNav} close={close}></MobileNavbar>
      
    </div>
  )
}

export default ResponsiveNav