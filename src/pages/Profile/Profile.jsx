import { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import useAuth from "../../hooks/useAuth.jsx";

const Profile = () => {
    const { user, loading, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        photoURL: '',
        email: '',
        lastLogin: '',
        role: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    // Get role badge color
    const getRoleBadgeColor = () => {
        switch(user?.role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'agent': return 'bg-blue-100 text-blue-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    // Format last login time
    const formatLastLogin = (timestamp) => {
        if (!timestamp) return 'Never logged in';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    useEffect(() => {
        if (user) {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            setFormData({
                name: user.displayName || '',
                photoURL: user.photoURL || '',
                email: user.email || '',
                lastLogin: currentUser?.metadata?.lastSignInTime || '',
                role: user.role || 'user'
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photoURL: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            // Update Firebase auth profile
            await updateUserProfile({
                displayName: formData.name,
                photoURL: formData.photoURL
            });

            // Update in MongoDB
            await axiosSecure.patch('/users/update-profile', {
                name: formData.name,
                photoURL: formData.photoURL
            });

            toast.success('Profile updated successfully');
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header with role badge */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                            {formData.role.toUpperCase()}
                        </span>
                    </div>

                    <div className="px-6 py-4">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Profile Photo */}
                                <div className="md:col-span-1 flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <img
                                            src={formData.photoURL || '/default-avatar.png'}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                                        />
                                        {editMode && (
                                            <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">Last login: {formatLastLogin(formData.lastLogin)}</p>
                                </div>

                                {/* Profile Info */}
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        ) : (
                                            <p className="px-3 py-2 bg-gray-100 rounded-md">{formData.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <p className="px-3 py-2 bg-gray-100 rounded-md">{formData.email}</p>
                                    </div>

                                    {/* Additional fields based on role */}
                                    {user?.role === 'agent' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
                                            <p className="px-3 py-2 bg-gray-100 rounded-md">{user.agentId || 'N/A'}</p>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        {editMode ? (
                                            <div className="flex space-x-3">
                                                <button
                                                    type="submit"
                                                    disabled={isUpdating}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditMode(false)}
                                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setEditMode(true)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;