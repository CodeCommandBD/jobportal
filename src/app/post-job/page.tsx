
import JobPostForm from '@/Components/Home/Job/JobPostForm'
import React from 'react'

const PostJobPage = () => {
  return (
    <div className='pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-950'>
        <div className='container mx-auto px-4'>
            <JobPostForm />
        </div>
    </div>
  )
}

export default PostJobPage
