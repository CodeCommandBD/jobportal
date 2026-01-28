
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

const fetchCategoryCounts = async (): Promise<Record<string, number>> => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

export const useCategoryCounts = () => {
  return useQuery({
    queryKey: ['categoryCounts'],
    queryFn: fetchCategoryCounts,
  });
};
