
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { IJob } from '@/models/Job';

interface JobFilters {
  title?: string;
  location?: string;
  category?: string;
}

const fetchJobs = async (filters: JobFilters = {}): Promise<IJob[]> => {
  const { data } = await axiosInstance.get('/jobs', { params: filters });
  return data;
};

export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
  });
};
