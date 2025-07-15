'use client'
import React from 'react'
import { Navlinks } from '../../../../constants/constants'
import Link from 'next/link'
import { CgClose } from 'react-icons/cg'

interface Props{
  showNav: boolean,
  close:() => void
}

const MobileNavbar = ({showNav, close}:Props) => {

  const navOpen = showNav ? 'translate-x-0': 'translate-x-[100%]'

  return (
    <div>
      {/* overlay */}
      <div className={`${navOpen} fixed inset-0 transform transition-all right-0 duration-500 z-[100002] bg-black opacity-70 w-full h-screen`}>
      </div>
        {/* navlinks */}
        <div className={`${navOpen} text-white  fixed  justify-center flex flex-col h-full transform transition-all duration-500 delay-300 w-[80%] sm:w-[60%] bg-purple-500 space-y-6 z-[1000050] right-0`}>
          {
            Navlinks.map((link) => (
              <Link className='text-white w-fit border-b-[1.5px] pb-1 border-white sm:text-[30px] text-xl ml-10  flex flex-col gap-y-5' href={link.url} key={link.id}>{link.label}</Link>
            ))
          }
          {/* close btn */}
          <CgClose 
          onClick={close}
          className='absolute top-2.5 right-2.5 text-white w-6 h-6 sm:w-8 sm:h-8'></CgClose>
        </div>
    </div>
  )
}

export default MobileNavbar