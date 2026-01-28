'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { BiMoon, BiSun } from 'react-icons/bi'

const ThemeToggler = () => {
    const [mount, setMount] = useState(false)
    const {theme, setTheme, systemTheme} = useTheme()

    useEffect(()=>{
        setMount(true)
    },[])
    if(!mount) return null

    const currentTheme = theme === 'system' ? systemTheme : theme
  return (
    <button 
    onClick={()=> setTheme(currentTheme === "dark" ? 'light': 'dark')}
    className='w-10 h-10 flex items-center justify-center bg-purple-900 dark:bg-white rounded-full cursor-pointer'>
        {
            currentTheme === 'dark' ? <BiSun className='text-white dark:text-purple-600 w-7 h-7 '></BiSun>:<BiMoon className='text-white dark:text-purple-600 w-7 h-7'></BiMoon>
        }
    </button>
  )
}

export default ThemeToggler