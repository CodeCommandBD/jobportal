
'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

const ContactContent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axiosInstance.post('/contact', formData)
            toast.success("Message sent successfully!")
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (error) {
            console.error(error)
            toast.error("Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="grid lg:grid-cols-2 gap-12">
                     
                     {/* Contact Info */}
                     <div>
                         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h1>
                         <p className="text-gray-600 dark:text-gray-300 lg:text-lg mb-12 leading-relaxed">
                             Have questions about our services or need assistance? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
                         </p>

                         <div className="space-y-8">
                             <div className="flex items-start gap-4">
                                 <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                                     <Mail size={24} />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                                     <p className="text-gray-600 dark:text-gray-400">support@jobportal.com</p>
                                     <p className="text-gray-600 dark:text-gray-400">info@jobportal.com</p>
                                 </div>
                             </div>

                             <div className="flex items-start gap-4">
                                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                                     <Phone size={24} />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-gray-900 dark:text-white mb-1">Call Us</h3>
                                     <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                                     <p className="text-gray-600 dark:text-gray-400">Mon - Fri, 9am - 6pm EST</p>
                                 </div>
                             </div>

                             <div className="flex items-start gap-4">
                                 <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-orange-600 dark:text-orange-400">
                                     <MapPin size={24} />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                                     <p className="text-gray-600 dark:text-gray-400">123 Innovation Dr, Suite 500</p>
                                     <p className="text-gray-600 dark:text-gray-400">San Francisco, CA 94103</p>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Contact Form */}
                     <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
                         <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="grid md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                                     <Input 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        placeholder="John Doe" 
                                        required 
                                        className="h-12"
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                     <Input 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        type="email" 
                                        placeholder="john@example.com" 
                                        required 
                                        className="h-12"
                                     />
                                 </div>
                             </div>
                             
                             <div className="space-y-2">
                                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                 <Input 
                                    name="subject" 
                                    value={formData.subject} 
                                    onChange={handleChange} 
                                    placeholder="Inquiry about..." 
                                    required 
                                    className="h-12"
                                 />
                             </div>

                             <div className="space-y-2">
                                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                 <Textarea 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    placeholder="Write your message here..." 
                                    required 
                                    className="min-h-[150px] resize-y"
                                 />
                             </div>

                             <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-semibold rounded-xl"
                             >
                                 {loading ? "Sending..." : (
                                     <span className="flex items-center gap-2">
                                         Send Message <Send size={18} />
                                     </span>
                                 )}
                             </Button>
                         </form>
                     </div>
                 </div>
             </div>
        </div>
    )
}

export default ContactContent
