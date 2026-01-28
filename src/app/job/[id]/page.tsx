
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { 
  Building2, 
  MapPin, 
  CalendarDays, 
  Banknote, 
  Briefcase, 
  Clock, 
  Share2,
  CheckCircle2,
  Globe,
  ArrowLeft
} from 'lucide-react'

import dbConnect from '@/lib/db'
import Job from '@/models/Job'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
  }
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = params
  
  await dbConnect()
  
  // Fetch job with employer details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const job: any = await Job.findById(id).populate('employerId').lean()

  if (!job) {
    notFound()
  }

  // Format date
  const postedDate = job.createdAt ? format(new Date(job.createdAt), 'MMMM dd, yyyy') : 'Recently'

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-20">
      {/* Header / Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
            </Link>

            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        {job.employerId?.image ? (
                             <Image 
                                src={job.employerId.image} 
                                alt={job.company} 
                                width={80} 
                                height={80} 
                                className="rounded-xl border border-gray-200 dark:border-gray-700 object-cover"
                             />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-3xl">
                                {job.company?.charAt(0) || 'C'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <Building2 className="w-4 h-4" />
                                {job.company}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4" />
                                Posted {postedDate}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                                {job.jobType}
                            </Badge>
                            <Badge variant="secondary" className={`${job.urgency === 'Urgent' ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'}`}>
                                {job.urgency}
                            </Badge>
                             <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400">
                                {job.category}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                    <Button size="lg" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                        Apply Now
                    </Button>
                     <div className="flex gap-3">
                         <Button variant="outline" className="flex-1 justify-center">
                            Save Job
                         </Button>
                         <Button variant="outline" size="icon">
                             <Share2 className="w-4 h-4" />
                         </Button>
                     </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Job Description
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {job.description}
                </div>
            </div>

            {job.skills && job.skills.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill: string, index: number) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100 dark:border-gray-700">
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Job Overview</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-green-600 dark:text-green-400">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary Range</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{job.salaryRange || 'Not Disclosed'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-blue-600 dark:text-blue-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Type</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{job.jobType}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-purple-600 dark:text-purple-400">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{job.category}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Company</h3>
                <div className="flex items-center gap-4 mb-4">
                    {job.employerId?.image ? (
                        <Image 
                            src={job.employerId.image} 
                            alt={job.company} 
                            width={48} 
                            height={48} 
                            className="rounded-lg object-cover bg-gray-50"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500">
                             {job.company?.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{job.company}</h4>
                        <Link href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                            View Profile <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Link>
                    </div>
                </div>
                {job.employerId?.email && (
                     <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Globe className="w-4 h-4" />
                            <span>{job.employerId.email}</span>
                        </div>
                     </div>
                )}
            </div>
        </div>

      </div>
    </div>
  )
}
