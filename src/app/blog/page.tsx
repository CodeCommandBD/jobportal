
import React from 'react'
import { Metadata } from 'next'
import BlogContent from './BlogContent'

export const metadata: Metadata = {
  title: 'Blog & Career Advice | JobPortal',
  description: 'Read the latest career advice, industry news, and interview tips on JobPortal.',
}

const BlogPage = () => {
  return <BlogContent />
}

export default BlogPage
