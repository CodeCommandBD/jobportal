
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useSession } from 'next-auth/react';

export const useAppliedJobs = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['appliedJobs', session?.user?.email],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/applications/check');
      return data.appliedJobIds as string[];
    },
    enabled: !!session?.user?.email, // Only run if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
