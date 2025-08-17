import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import axios from "axios";
import { FiEdit, FiSave, FiX, FiUpload, FiUser, FiMail, FiKey, FiClock } from 'react-icons/fi';

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
    const [isUploading, setIsUploading] = useState(false);

    // Get role badge color and icon
    const getRoleDetails = () => {
        switch(user?.role) {
            case 'admin':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: '👑'
                };
            case 'agent':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    icon: '🛡️'
                };
            default:
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: '👤'
                };
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
                role: user.role ? user.role : (user.isAdmin ? 'admin' : '')
            });
        }
    }, [user]);

    // Fetch role from backend if missing
    useEffect(() => {
        if (formData.email && !formData.role) {
            axios.get(`${import.meta.env.VITE_API_URL}/users?email=${formData.email}`)
                .then(res => {
                    if (res.data && res.data.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            role: res.data[0].role || 'user'
                        }));
                    }
                })
                .catch(() => {
                    // fallback: keep role as 'user'
                });
        }
    }, [formData.email, formData.role]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                // Create FormData for image upload
                const data = new FormData();
                data.append('image', file);

                // Upload to ImgBB
                const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
                const res = await axios.post(imageUploadUrl, data);

                if (res.data.success) {
                    setFormData(prev => ({ ...prev, photoURL: res.data.data.url }));
                    toast.success('Image uploaded successfully');
                } else {
                    throw new Error('Image upload failed');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            // Update Firebase auth profile
            const updateData = {
                displayName: formData.name
            };

            if (formData.photoURL && !formData.photoURL.startsWith('data:')) {
                updateData.photoURL = formData.photoURL;
            }

            await updateUserProfile(updateData);

            // Update in MongoDB
            await axiosSecure.patch('/users/update-profile', {
                name: formData.name,
                email: user.email,
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    // Defensive: always show a role
    const displayRole = formData.role ? formData.role : 'user';
    const roleDetails = (() => {
        switch(displayRole) {
            case 'admin':
                return { color: 'bg-red-100 text-red-800', icon: '👑' };
            case 'agent':
                return { color: 'bg-blue-100 text-blue-800', icon: '🛡️' };
            default:
                return { color: 'bg-green-100 text-green-800', icon: '👤' };
        }
    })();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <img
                                        src={formData.photoURL || '/default-avatar.png'}
                                        alt="Profile"
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                                    />
                                    {editMode && (
                                        <label className={`absolute -bottom-2 -right-2 ${isUploading ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-full p-2 cursor-pointer ${isUploading ? 'cursor-not-allowed' : 'hover:bg-blue-600'} transition-all shadow-md`}>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                disabled={isUploading}
                                            />
                                            {isUploading ? (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <FiUpload className="h-4 w-4" />
                                            )}
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold">{formData.name}</h1>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${roleDetails.color} flex items-center`}>
                                            <span className="mr-1">{roleDetails.icon}</span>
                                            {displayRole.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
                                >
                                    <FiEdit className="h-4 w-4" />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Personal Info Section */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FiUser className="mr-2 text-primary" />
                                        Personal Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    required
                                                />
                                            ) : (
                                                <p className="px-4 py-2 bg-white rounded-lg border border-gray-200">{formData.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                            <p className="px-4 py-2 bg-white rounded-lg border border-gray-200 flex items-center">
                                                <FiMail className="mr-2 text-gray-500" />
                                                {formData.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Info Section */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FiKey className="mr-2 text-primary" />
                                        Account Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Last Login</label>
                                            <p className="px-4 py-2 bg-white rounded-lg border border-gray-200 flex items-center">
                                                <FiClock className="mr-2 text-gray-500" />
                                                {formatLastLogin(formData.lastLogin)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Additional fields for agents */}
                                    {user?.role === 'agent' && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Agent ID</label>
                                            <p className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                                                {user.agentId || 'N/A'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {editMode && (
                                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditMode(false)}
                                            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                                        >
                                            <FiX className="mr-2" />
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUpdating || isUploading}
                                            className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 transition-all"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSave className="mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;