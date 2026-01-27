
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { IJob } from '@/models/Job';

const fetchJobs = async (): Promise<IJob[]> => {
  const { data } = await axiosInstance.get('/jobs');
  return data;
};

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });
};
