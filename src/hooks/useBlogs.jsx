
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const useBlogs = () => {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/blogs');
            return data;
        },
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (blogData) => {
            const { data } = await axiosInstance.post('/blogs', blogData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await axiosInstance.delete(`/blogs/${id}`); // Assuming delete route exists or will be added
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};
