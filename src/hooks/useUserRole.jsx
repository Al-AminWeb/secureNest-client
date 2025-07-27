import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from "./useAuth.jsx";

// Custom Hook to get User Role
const useUserRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();


    const { data: roleData, isLoading, isError, error } = useQuery({
        queryKey: ['userRole', user?.email], // Query by email
        queryFn: async () => {
            if (!user?.email) return null;

            const response = await axiosSecure.get(`/check-role?email=${user.email}`);
            return response.data;
        },
        enabled: !!user?.email,
    });


    return {
        role: roleData ? (roleData.isAdmin ? 'admin' : roleData.isAgent ? 'agent' : 'user') : null,
        isLoading,
        isError,
        error,
    };
};

export default useUserRole;
