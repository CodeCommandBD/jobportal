
'use client'
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { CustomLoader } from '@/Components/helpers/SkeletonLoader';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { toast } from 'react-hot-toast';

const SiteSettings = () => {
    const queryClient = useQueryClient();
    const { data: settings, isLoading } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/settings');
            return data;
        },
    });

    const [form, setForm] = useState({
        siteName: '',
        siteDescription: '',
        contactEmail: '',
        maintenanceMode: false,
        showChat: false,
        maxJobsPerEmployer: 10,
        metaKeywords: '',
    });

    useEffect(() => {
        if (settings) {
            setForm({
                siteName: settings.siteName || '',
                siteDescription: settings.siteDescription || '',
                contactEmail: settings.contactEmail || '',
                maintenanceMode: settings.maintenanceMode || false,
                showChat: settings.showChat || false,
                maxJobsPerEmployer: settings.maxJobsPerEmployer || 10,
                metaKeywords: settings.metaKeywords || '',
            });
        }
    }, [settings]);

    const mutation = useMutation({
        mutationFn: async (updatedSettings: any) => {
            await axiosInstance.patch('/admin/settings', updatedSettings);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
            toast.success('Settings updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update settings.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    if (isLoading) return <CustomLoader />;

    return (
        <div className="space-y-8">
            <SectionHeading heading="Site Settings" subheading="Configure global platform parameters and site metadata." />
            
            <Card className="max-w-4xl border-gray-100 dark:border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">General Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input 
                                    id="siteName" 
                                    value={form.siteName} 
                                    onChange={(e) => setForm({...form, siteName: e.target.value})} 
                                    placeholder="Enter site name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input 
                                    id="contactEmail" 
                                    type="email" 
                                    value={form.contactEmail} 
                                    onChange={(e) => setForm({...form, contactEmail: e.target.value})} 
                                    placeholder="support@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="siteDescription">Site Description</Label>
                            <Input 
                                id="siteDescription" 
                                value={form.siteDescription} 
                                onChange={(e) => setForm({...form, siteDescription: e.target.value})} 
                                placeholder="Enter a short description of your site"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metaKeywords">Meta Keywords (SEO)</Label>
                            <Input 
                                id="metaKeywords" 
                                value={form.metaKeywords} 
                                onChange={(e) => setForm({...form, metaKeywords: e.target.value})} 
                                placeholder="e.g. jobs, tech, developer, hiring"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="maxJobs">Max Jobs Per Employer</Label>
                                <Input 
                                    id="maxJobs" 
                                    type="number" 
                                    value={form.maxJobsPerEmployer} 
                                    onChange={(e) => setForm({...form, maxJobsPerEmployer: parseInt(e.target.value)})} 
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <input 
                                    type="checkbox" 
                                    id="maintenance" 
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    checked={form.maintenanceMode} 
                                    onChange={(e) => setForm({...form, maintenanceMode: e.target.checked})} 
                                />
                                <Label htmlFor="maintenance" className="cursor-pointer">Enable Maintenance Mode</Label>
                            </div>
                            <div className="flex items-center space-x-2 pt-4 md:pt-8">
                                <input 
                                    type="checkbox" 
                                    id="liveChat" 
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    checked={form.showChat} 
                                    onChange={(e) => setForm({...form, showChat: e.target.checked})} 
                                />
                                <Label htmlFor="liveChat" className="cursor-pointer">Enable Live Chat</Label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full md:w-auto px-10 bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SiteSettings;
