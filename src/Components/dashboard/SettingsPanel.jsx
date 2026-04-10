'use client';

import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Lock, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-hot-toast';
import SectionHeading from '@/Components/helpers/SectionHeading';

const SettingsPanel = ({ role = 'Candidate' }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match.");
        }

        setLoading(true);
        try {
            const { data } = await axiosInstance.patch('/user/settings', {
                currentPassword,
                newPassword
            });
            toast.success(data.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-12">
                    <SectionHeading 
                        heading="Account Settings" 
                        subheading={`Manage your ${role.toLowerCase()} account preferences and security.`}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                        <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Security & Password</h3>
                            <p className="text-sm font-bold text-gray-400">Ensure your account uses a strong, unique password.</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Current Password</label>
                            <input 
                                type="password" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full text-sm p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-medium"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full text-sm p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-medium"
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full text-sm p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-medium"
                                placeholder="Repeat new password"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-8 shadow-lg shadow-purple-500/20 font-black mt-4 flex items-center gap-2"
                        >
                            {loading ? "Updating..." : "Update Password"} <Save size={18} />
                        </Button>
                    </form>

                    <div className="mt-16 pt-8 border-t border-red-100 dark:border-red-900/30">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-red-600 uppercase tracking-tight mb-1">Danger Zone</h4>
                                <p className="text-sm font-bold text-gray-500 mb-4 max-w-md">Once you delete your account, there is no going back. Please be certain.</p>
                                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12 font-bold px-6">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPanel;
