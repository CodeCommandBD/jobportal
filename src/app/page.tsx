import Home from '@/Components/Home/Home'
import React from 'react'

const page = () => {
  return (
    <div>
        <React.Suspense fallback={<div>Loading...</div>}>
            <Home></Home>
        </React.Suspense>
    </div>
  )
}

export default page