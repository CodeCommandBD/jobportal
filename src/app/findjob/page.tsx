
import React from 'react'
import { Metadata } from 'next'
import FindJobContent from './FindJobContent'

export const metadata: Metadata = {
  title: 'Find Your Dream Job | JobPortal',
  description: 'Search and apply for the latest job openings in software development, design, marketing, and more.',
}

const FindJobPage = () => {
  return <FindJobContent />
}

export default FindJobPage
