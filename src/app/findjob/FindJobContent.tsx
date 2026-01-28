
'use client'

import React, { useState } from 'react'
import { useJobs } from '@/hooks/useJobs'
import JobCard from '@/Components/Home/Job/JobCard'
import { JobSkeleton } from '@/Components/helpers/SkeletonLoader'
import { Search, MapPin, Filter } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { IJob } from '@/models/Job'
import { useAppliedJobs } from '@/hooks/useAppliedJobs'

const FindJobContent = () => {
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [category, setCategory] = useState('')
    
    // Debounce or search button trigger could be added, for now live filtering or button trigger
    const [filters, setFilters] = useState({ title: '', location: '', category: '' })

    const { data: jobs, isLoading } = useJobs(filters)
    const { data: appliedJobIds } = useAppliedJobs()

    const handleSearch = () => {
        setFilters({ title, location, category: category === 'all' ? '' : category })
    }

    // Reset filters
    const handleReset = () => {
        setTitle('')
        setLocation('')
        setCategory('')
        setFilters({ title: '', location: '', category: '' })
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header & Search Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Find Your Dream Job</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Job title or keywords..." 
                                className="pl-9 h-10" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3 relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Location..." 
                                className="pl-9 h-10" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Software Development">Software Development</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <Button onClick={handleSearch} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                Search
                            </Button>
                            {(title || location || category) && (
                                <Button variant="outline" onClick={handleReset} className="px-3" title="Reset Filters">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Job List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <JobSkeleton key={i} />)
                    ) : (
                        jobs && jobs.length > 0 ? (
                            jobs.map((job: IJob) => (
                                <JobCard 
                                    key={job._id?.toString()} 
                                    item={job} 
                                    isApplied={appliedJobIds?.includes(job._id?.toString())}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No jobs found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                                    We couldn't find any jobs matching your search. Try adjusting your filters or search keywords.
                                </p>
                                <Button variant="link" onClick={handleReset} className="mt-4 text-purple-600">
                                    Clear all filters
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default FindJobContent
