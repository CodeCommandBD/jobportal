'use client'

import { useEffect, useState } from "react"
import { FaArrowUp } from "react-icons/fa"

const ScrollToTheTop = () => {
    const [visiable, setVisiable] = useState(false)

    useEffect(() => {
        const toggle = () => {
            if (window.scrollY > 300) {
                setVisiable(true)
            } else {
                setVisiable(false)
            }
        }
        window.addEventListener('scroll', toggle)
        return () => window.removeEventListener('scroll', toggle)
    }, [])

    // scroll functional 

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className="fixed bottom-4 animate-pulse right-4">
            {visiable && (
                <button
                    onClick={scrollToTop}
                    className="bg-purple-700 cursor-pointer text-white rounded-full w-12 h-12 flex items-center justify-center focus:outline-0">
                    {/* Up Arrow SVG */}
                    <FaArrowUp></FaArrowUp>
                </button>
            )}
        </div>
    )
}

export default ScrollToTheTop