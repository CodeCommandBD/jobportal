
'use client'

import React, { useState, useEffect } from 'react'
import { useJobs } from '@/hooks/useJobs'
import JobCard from '@/Components/Home/Job/JobCard'
import { JobSkeleton } from '@/Components/helpers/SkeletonLoader'
import { Search, MapPin, Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { useAppliedJobs } from '@/hooks/useAppliedJobs'

const FindJobContent = () => {
    // Search State
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [category, setCategory] = useState('all')
    const [jobType, setJobType] = useState('all')
    const [urgency, setUrgency] = useState('all')
    const [page, setPage] = useState(1)
    
    // Filters applied to query
    const [filters, setFilters] = useState({ 
        title: '', 
        location: '', 
        category: '', 
        jobType: '',
        urgency: '',
        page: 1,
        limit: 12
    })

    const { data, isLoading } = useJobs(filters)
    const { data: appliedJobIds } = useAppliedJobs()
    
    const jobs = data?.jobs || []
    const pagination = data?.pagination || { total: 0, totalPages: 1 }

    // Sync filters with local state on search button click
    const handleSearch = () => {
        setFilters(prev => ({
            ...prev,
            title,
            location,
            category: category === 'all' ? '' : category,
            jobType: jobType === 'all' ? '' : jobType,
            urgency: urgency === 'all' ? '' : urgency,
            page: 1 // Reset to page 1 on new search
        }))
        setPage(1)
    }

    // Handle Page Change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage)
            setFilters(prev => ({ ...prev, page: newPage }))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    // Reset filters
    const handleReset = () => {
        setTitle('')
        setLocation('')
        setCategory('all')
        setJobType('all')
        setUrgency('all')
        setPage(1)
        setFilters({ 
            title: '', 
            location: '', 
            category: '', 
            jobType: '',
            urgency: '',
            page: 1,
            limit: 12
        })
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Dynamic Search & Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-purple-500/5 border border-purple-100 dark:border-purple-900/20 mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Discover Opportunities</h1>
                            <p className="text-gray-500 dark:text-gray-400">Showing {jobs.length} of {pagination.total} jobs based on your criteria</p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={handleReset} 
                            className="flex items-center gap-2 border-purple-200 dark:border-purple-800 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                            <X size={16} /> Reset All
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Title Input */}
                        <div className="md:col-span-4 lg:col-span-3 group">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">What?</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400 group-focus-within:text-purple-600 transition-colors" />
                                <Input 
                                    placeholder="Title, keywords..." 
                                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="md:col-span-4 lg:col-span-3 group">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Where?</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400 group-focus-within:text-purple-600 transition-colors" />
                                <Input 
                                    placeholder="City or remote..." 
                                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Category Select */}
                        <div className="md:col-span-4 lg:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Field</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500/20 shadow-none">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Fields</SelectItem>
                                    <SelectItem value="Software Development">Software Development</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Job Type Select */}
                        <div className="md:col-span-6 lg:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Type</label>
                            <Select value={jobType} onValueChange={setJobType}>
                                <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500/20 shadow-none">
                                    <SelectValue placeholder="Job Type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Any Type</SelectItem>
                                    <SelectItem value="Full Time">Full Time</SelectItem>
                                    <SelectItem value="Part Time">Part Time</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-6 lg:col-span-2 flex items-end">
                            <Button 
                                onClick={handleSearch} 
                                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5"
                            >
                                <Filter className="mr-2 h-4 w-4" /> Find Jobs
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Job List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <JobSkeleton key={i} />)
                    ) : (
                        jobs && jobs.length > 0 ? (
                            jobs.map((job) => (
                                <JobCard 
                                    key={job._id} 
                                    item={job} 
                                    isApplied={appliedJobIds?.includes(job._id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                                <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-full mb-6">
                                    <Search className="h-12 w-12 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No matching jobs</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                    We couldn't find any results for your current filters. Try broadening your criteria.
                                </p>
                                <Button onClick={handleReset} variant="link" className="mt-6 text-purple-600 font-bold hover:text-purple-700">
                                    Clear all filters and show all jobs
                                </Button>
                            </div>
                        )
                    )}
                </div>

                {/* Glassmorphism Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-16 flex justify-center">
                        <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white dark:border-gray-700 rounded-2xl shadow-xl">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600"
                            >
                                <ChevronLeft size={20} />
                            </Button>
                            
                            <div className="flex gap-1 px-2">
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Logic to show limited page numbers if totalPages is high
                                    if (
                                        pagination.totalPages > 7 && 
                                        pageNum !== 1 && 
                                        pageNum !== pagination.totalPages && 
                                        Math.abs(pageNum - page) > 1
                                    ) {
                                        if (pageNum === 2 || pageNum === pagination.totalPages - 1) return <span key={pageNum} className="text-gray-400">...</span>;
                                        return null;
                                    }
                                    
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={page === pageNum ? "default" : "ghost"}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-xl transition-all ${
                                                page === pageNum 
                                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" 
                                                : "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-600 dark:text-gray-400"
                                            }`}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === pagination.totalPages}
                                className="rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600"
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FindJobContent
