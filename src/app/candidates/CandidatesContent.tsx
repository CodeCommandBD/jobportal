
'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import Image from 'next/image'
import { Mail, MapPin, Briefcase, User as UserIcon } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { JobSkeleton } from '@/Components/helpers/SkeletonLoader'

interface Candidate {
    _id: string
    name: string
    email: string
    image?: string
    title?: string
    location?: string
    skills?: string[]
    bio?: string
}

const CandidatesContent = () => {
    const { data: candidates, isLoading, error } = useQuery({
        queryKey: ['candidates'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users/candidates')
            return data as Candidate[]
        }
    })

    if (error) return <div className="text-center py-20 text-red-500">Failed to load candidates.</div>

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Top Candidates</h1>
                     <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Discover talented professionals ready to join your team. Browse through our pool of skilled candidates.
                     </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                             <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-80 animate-pulse">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {candidates && candidates.map((candidate) => (
                            <div key={candidate._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <div className="relative w-24 h-24 mb-4">
                                    {candidate.image ? (
                                        <Image 
                                            src={candidate.image} 
                                            alt={candidate.name} 
                                            fill 
                                            sizes="96px"
                                            className="rounded-full object-cover border-4 border-gray-50 dark:border-gray-700" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                                            <UserIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{candidate.name}</h3>
                                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">{candidate.title || "Job Seeker"}</p>
                                
                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                                    <MapPin size={14} />
                                    <span>{candidate.location || "Remote"}</span>
                                </div>

                                {candidate.skills && candidate.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                                        {candidate.skills.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                                                {skill}
                                            </span>
                                        ))}
                                        {candidate.skills.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-xs rounded-md">
                                                +{candidate.skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto w-full pt-4 border-t border-gray-100 dark:border-gray-700">
                                     <Button variant="outline" className="w-full flex items-center justify-center gap-2 group">
                                        <Mail size={16} className="group-hover:text-purple-600 transition-colors" />
                                        Contact
                                     </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CandidatesContent
