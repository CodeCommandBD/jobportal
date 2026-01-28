
import React from 'react'
import { Metadata } from 'next'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us | JobPortal',
  description: 'Have questions? Get in touch with our team for support or inquiries.',
}

const ContactPage = () => {
  return <ContactContent />
}

export default ContactPage
