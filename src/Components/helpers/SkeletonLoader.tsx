
import React from 'react';

/**
 * A premium-looking full-page or container-level spinner.
 */
export const CustomLoader = () => {
    return (
        <div className="flex items-center justify-center p-10">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-blue-500 rounded-full animate-spin-slow"></div>
            </div>
        </div>
    );
};

/**
 * Skeleton for Job Card items.
 */
export const JobSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
            </div>
            <div className="mt-6 flex space-x-2">
                <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-20"></div>
                <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-24"></div>
            </div>
        </div>
    );
};

/**
 * Skeleton for Job Category cards.
 */
export const CategorySkeleton = () => {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4 mx-auto"></div>
        </div>
    );
};

/**
 * Skeleton for Admin Table rows.
 */
export const TableRowSkeleton = () => {
    return (
        <tr className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div></td>
            <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-8 ml-auto"></div></td>
        </tr>
    );
};
