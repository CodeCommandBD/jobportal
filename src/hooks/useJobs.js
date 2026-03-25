
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

/**
 * Custom hook to fetch jobs with pagination and multifaceted filters
 * @param {Object} filters - Filter parameters (title, location, category, jobType, etc.)
 */
const fetchJobs = async (filters = {}) => {
  const { data } = await axiosInstance.get('/jobs', { params: filters });
  return data; // Returns { jobs: [], pagination: {} }
};

export const useJobs = (filters = {}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    keepPreviousData: true, // Useful for pagination to avoid flickering
  });
};
