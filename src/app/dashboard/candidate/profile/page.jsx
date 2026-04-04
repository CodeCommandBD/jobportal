'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import {
    User, Mail, MapPin, Briefcase, Save, CloudUpload,
    ChevronLeft, Github, Linkedin, Globe, Plus, Trash2,
    GraduationCap, FileText, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import SectionHeading from '@/Components/helpers/SectionHeading';

// ─── Education Entry Component ────────────────────────────────────────────────
const EducationEntry = ({ entry, onUpdate, onRemove }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 relative group">
        <button
            type="button"
            onClick={onRemove}
            className="absolute top-3 right-3 h-8 w-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
            <Trash2 size={14} />
        </button>
        <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 block">Degree</label>
            <input
                value={entry.degree || ''}
                onChange={e => onUpdate('degree', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                placeholder="B.Sc. Computer Science"
            />
        </div>
        <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 block">Institution</label>
            <input
                value={entry.institution || ''}
                onChange={e => onUpdate('institution', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                placeholder="BUET / NSU / IUT"
            />
        </div>
        <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 block">Field of Study</label>
            <input
                value={entry.fieldOfStudy || ''}
                onChange={e => onUpdate('fieldOfStudy', e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                placeholder="Computer Science & Engineering"
            />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 block">From</label>
                <input
                    value={entry.startYear || ''}
                    onChange={e => onUpdate('startYear', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                    placeholder="2019"
                />
            </div>
            <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 block">To</label>
                <input
                    value={entry.endYear || ''}
                    onChange={e => onUpdate('endYear', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                    placeholder="2023 / Present"
                />
            </div>
        </div>
    </div>
);

// ─── Main Profile Page ────────────────────────────────────────────────────────
const ProfilePage = () => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [uploadState, setUploadState] = useState({ uploading: false, progress: 0 });
    const [formData, setFormData] = useState({
        name: '', title: '', location: '', bio: '', skills: '',
        github: '', linkedin: '', portfolio: '', yearsOfExperience: 0,
        resumeUrl: '', education: [],
    });

    const { data: user, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/candidate/profile');
            return data;
        },
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                title: user.title || '',
                location: user.location || '',
                bio: user.bio || '',
                skills: user.skills?.join(', ') || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
                portfolio: user.portfolio || '',
                yearsOfExperience: user.yearsOfExperience || 0,
                resumeUrl: user.resumeUrl || '',
                education: user.education || [],
            });
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: async (updatedData) => {
            const dataToSubmit = {
                ...updatedData,
                skills: updatedData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
            };
            return await axiosInstance.patch('/candidate/profile', dataToSubmit);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast.success('Profile updated successfully!');
        },
        onError: () => toast.error('Failed to update profile'),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    // Education management
    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', institution: '', fieldOfStudy: '', startYear: '', endYear: '' }],
        }));
    };

    const updateEducation = (index, field, value) => {
        setFormData(prev => {
            const updated = [...prev.education];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, education: updated };
        });
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index),
        }));
    };

    // Resume upload
    const handleResumeUpload = async (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') return toast.error('Only PDF files are allowed');
        if (file.size > 5 * 1024 * 1024) return toast.error('File must be under 5MB');

        setUploadState({ uploading: true, progress: 10 });
        const fd = new FormData();
        fd.append('resume', file);

        try {
            setUploadState({ uploading: true, progress: 50 });
            const { data } = await axiosInstance.post('/candidate/profile/upload-resume', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, resumeUrl: data.resumeUrl }));
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast.success('Resume uploaded!');
        } catch {
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploadState({ uploading: false, progress: 0 });
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleResumeUpload(file);
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard/candidate" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>

                <SectionHeading
                    heading="Manage Profile"
                    subheading="Build a complete profile that stands out to top employers."
                />

                <form onSubmit={handleSubmit} className="mt-10 space-y-8">

                    {/* ── Basic Info ── */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <User size={18} className="text-purple-500" /> Personal Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Full Name', name: 'name', icon: User, placeholder: 'Your full name' },
                                { label: 'Professional Title', name: 'title', icon: Briefcase, placeholder: 'e.g. Senior Frontend Engineer' },
                                { label: 'Location', name: 'location', icon: MapPin, placeholder: 'e.g. Dhaka, Bangladesh' },
                            ].map(({ label, name, icon: Icon, placeholder }) => (
                                <div key={name} className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</label>
                                    <div className="relative">
                                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            className="w-full h-13 pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                            placeholder={placeholder}
                                        />
                                    </div>
                                </div>
                            ))}
                            {/* Email read-only */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email (Read-only)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full h-13 pl-11 pr-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 border-none cursor-not-allowed text-gray-400 font-bold text-sm"
                                    />
                                </div>
                            </div>
                            {/* Years of experience */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Years of Experience</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number" min="0" max="50"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleChange}
                                        className="w-full h-13 pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                        placeholder="3"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Bio */}
                        <div className="mt-6 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Professional Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm resize-none"
                                placeholder="Tell employers about yourself, your passion, and what you bring to the table..."
                            />
                        </div>
                        {/* Skills */}
                        <div className="mt-6 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Skills (comma-separated)</label>
                            <input
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full h-13 px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                placeholder="React, Next.js, Node.js, MongoDB, TypeScript"
                            />
                        </div>
                    </div>

                    {/* ── Social Links ── */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Globe size={18} className="text-blue-500" /> Social & Portfolio Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'GitHub', name: 'github', icon: Github, placeholder: 'https://github.com/username' },
                                { label: 'LinkedIn', name: 'linkedin', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
                                { label: 'Portfolio', name: 'portfolio', icon: Globe, placeholder: 'https://yourportfolio.com' },
                            ].map(({ label, name, icon: Icon, placeholder }) => (
                                <div key={name} className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</label>
                                    <div className="relative">
                                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            className="w-full h-13 pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                                            placeholder={placeholder}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Resume Upload ── */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText size={18} className="text-green-500" /> Resume / CV
                        </h3>
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                            onClick={() => !uploadState.uploading && fileInputRef.current?.click()}
                            className="border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl p-10 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-all group"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={e => handleResumeUpload(e.target.files[0])}
                            />
                            {uploadState.uploading ? (
                                <div className="space-y-3">
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all" style={{ width: `${uploadState.progress}%` }} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">Uploading...</p>
                                </div>
                            ) : formData.resumeUrl ? (
                                <div className="space-y-3">
                                    <div className="h-14 w-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto">
                                        <CheckCircle size={28} className="text-green-500" />
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">Resume Uploaded</p>
                                    <a
                                        href={formData.resumeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-purple-600 text-sm font-bold hover:underline"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        View Current PDF →
                                    </a>
                                    <p className="text-xs text-gray-400">Click or drag to replace</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        <CloudUpload size={28} className="text-purple-500" />
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">Drag & drop your PDF here</p>
                                    <p className="text-sm text-gray-400">or click to browse — PDF only, max 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Education ── */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                                <GraduationCap size={18} className="text-yellow-500" /> Education
                            </h3>
                            <Button
                                type="button"
                                onClick={addEducation}
                                variant="outline"
                                className="h-9 px-4 rounded-xl text-sm font-bold border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                                <Plus size={16} className="mr-1" /> Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {formData.education.length === 0 ? (
                                <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl">
                                    <GraduationCap size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-bold">No education added yet</p>
                                </div>
                            ) : (
                                formData.education.map((entry, i) => (
                                    <EducationEntry
                                        key={i}
                                        entry={entry}
                                        onUpdate={(field, value) => updateEducation(i, field, value)}
                                        onRemove={() => removeEducation(i)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className="flex justify-end pb-8">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 flex items-center gap-2"
                        >
                            {mutation.isPending ? (
                                <>
                                    <AlertCircle size={20} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Save All Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
