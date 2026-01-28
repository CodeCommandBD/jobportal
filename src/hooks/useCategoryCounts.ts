
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchCategoryCounts = async (): Promise<any[]> => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

export const useCategoryCounts = () => {
  return useQuery({
    queryKey: ['categoryCounts'],
    queryFn: fetchCategoryCounts,
  });
};
