import { use } from 'react';
import { AuthContext } from "../contexts/AuthContext.jsx";
import { updateProfile } from 'firebase/auth';

const useAuth = () => {
    const authInfo = use(AuthContext);

    if (!authInfo) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const updateUserProfile = async (profileData) => {
        try {
            // Update Firebase auth profile
            await updateProfile(authInfo.user, profileData);

            // Update local state
            authInfo.setUser({
                ...authInfo.user,
                ...profileData
            });

            return { success: true };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    return {
        ...authInfo,
        updateUserProfile
    };
};

export default useAuth;