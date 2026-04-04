import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import {
    Globe, Building2, Users, Briefcase, MapPin,
    Clock, ArrowLeft, ArrowRight, Star
} from 'lucide-react';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import Job from '@/models/Job';
import { Badge } from '@/Components/ui/badge';

export async function generateMetadata({ params }) {
    const { id } = await params;
    await dbConnect();
    const employer = await User.findById(id).select('companyName companyDescription companyIndustry image').lean();

    return {
        title: employer?.companyName ? `${employer.companyName} — Jobs & Company Profile` : 'Company Profile',
        description: employer?.companyDescription?.slice(0, 160) || `Explore jobs and learn more about ${employer?.companyName}.`,
        openGraph: {
            title: employer?.companyName,
            description: employer?.companyDescription?.slice(0, 160),
            images: employer?.image ? [employer.image] : [],
        },
    };
}

export default async function CompanyProfilePage({ params }) {
    const { id } = await params;

    await dbConnect();

    const employer = await User.findById(id)
        .select('name image companyName companyLogo companyDescription companyWebsite companySize companyIndustry createdAt')
        .lean();

    if (!employer) notFound();

    const jobs = await Job.find({ employerId: id, status: 'approved' })
        .sort({ isFeatured: -1, createdAt: -1 })
        .lean();

    const displayName = employer.companyName || employer.name || 'Company';
    const logo = employer.companyLogo || employer.image;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-20 pt-24">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <Link href="/findjob" className="inline-flex items-center text-purple-200 hover:text-white text-sm mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Browse All Jobs
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        {/* Logo */}
                        <div className="h-24 w-24 rounded-[1.5rem] bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xl">
                            {logo ? (
                                <Image src={logo} alt={displayName} width={96} height={96} className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-4xl font-black text-white">{displayName[0]}</span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-black mb-3">{displayName}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-purple-200">
                                {employer.companyIndustry && (
                                    <span className="flex items-center gap-1.5"><Building2 size={14} /> {employer.companyIndustry}</span>
                                )}
                                {employer.companySize && (
                                    <span className="flex items-center gap-1.5"><Users size={14} /> {employer.companySize} employees</span>
                                )}
                                {employer.companyWebsite && (
                                    <a href={employer.companyWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
                                        <Globe size={14} /> {employer.companyWebsite.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                            </div>
                            <div className="mt-4">
                                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {jobs.length} Open Position{jobs.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Jobs */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">
                        Open Positions
                    </h2>

                    {jobs.length === 0 ? (
                        <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <Briefcase size={40} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-500 font-medium">No open positions right now.</p>
                        </div>
                    ) : (
                        jobs.map(job => (
                            <Link key={job._id.toString()} href={`/job/${job._id}`} className="block group">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                                                    {job.title}
                                                </h3>
                                                {job.isFeatured && (
                                                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-yellow-200">
                                                        <Star size={9} /> FEATURED
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                                                <span className="flex items-center gap-1"><Clock size={11} /> {format(new Date(job.createdAt), 'MMM dd, yyyy')}</span>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">{job.jobType}</Badge>
                                                <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">{job.category}</Badge>
                                                {job.urgency === 'Urgent' && (
                                                    <Badge variant="secondary" className="text-xs bg-red-50 text-red-700">Urgent</Badge>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-gray-300 group-hover:text-purple-500 transition-colors shrink-0 mt-1" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Right: About */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">About the Company</h3>
                        {employer.companyDescription ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {employer.companyDescription}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No description provided yet.</p>
                        )}

                        {employer.companyWebsite && (
                            <a
                                href={employer.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 flex items-center gap-2 text-purple-600 text-sm font-bold hover:underline"
                            >
                                <Globe size={14} /> Visit Website
                            </a>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
                        <h4 className="font-bold mb-2">Ready to apply?</h4>
                        <p className="text-purple-100 text-sm mb-4">Browse all open positions and find the perfect role.</p>
                        <Link href="/findjob" className="block text-center bg-white text-purple-600 hover:bg-gray-100 rounded-xl py-2 text-sm font-bold transition-colors">
                            Browse All Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
