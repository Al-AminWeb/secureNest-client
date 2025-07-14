import { useQuery } from '@tanstack/react-query';
 // Get user data from AuthContext
import useAxiosSecure from './useAxiosSecure';
import useAuth from "./useAuth.jsx"; // Secure axios instance

// Custom Hook to get User Role
const useUserRole = () => {
    const { user } = useAuth(); // Get the user from AuthContext
    const axiosSecure = useAxiosSecure(); // Secure axios instance

    // Use TanStack Query to fetch the role based on the user's email
    const { data: roleData, isLoading, isError, error } = useQuery({
        queryKey: ['userRole', user?.email], // Query by email
        queryFn: async () => {
            if (!user?.email) return null; // Ensure email exists before making the API call

            // Fetch the role by sending the email to the backend
            const response = await axiosSecure.get(`/check-role?email=${user.email}`);
            return response.data; // Assume response contains role data
        },
        enabled: !!user?.email, // Only enable this query if the user is logged in
    });

    // Return the role and loading/error states
    return {
        role: roleData ? (roleData.isAdmin ? 'admin' : roleData.isAgent ? 'agent' : 'user') : null,
        isLoading,
        isError,
        error,
    };
};

export default useUserRole;
