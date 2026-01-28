
import React from 'react';
import { LuWrench } from 'react-icons/lu';

const Maintenance = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-3xl flex items-center justify-center mb-8 animate-bounce">
                <LuWrench size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                Under Maintenance
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
                We&apos;re currently performing some scheduled updates to improve your experience. We&apos;ll be back online shortly!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <a 
                    href="/signin" 
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all text-center"
                >
                    Sign In
                </a>
                <a 
                    href="mailto:support@devhire.com" 
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-center"
                >
                    Contact Support
                </a>
            </div>
            <div className="mt-20 text-sm text-gray-400 font-medium tracking-widest uppercase">
                &copy; DevHire Job Portal
            </div>
        </div>
    );
};

export default Maintenance;
