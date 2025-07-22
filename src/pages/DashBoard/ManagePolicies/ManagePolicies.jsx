import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';

const ManagePolicies = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    // Fetch policies
    useEffect(() => {
        setIsLoading(true);
        axiosSecure.get('/policies/all')
            .then(res => {
                setPolicies(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching policies:", err);
                setIsLoading(false);
                Swal.fire('Error', 'Failed to load policies', 'error');
            });
    }, [axiosSecure]);

    // Add or Edit policy
    const handleAddOrEditPolicy = async (data) => {
        setIsSubmitting(true);
        try {
            if (selectedPolicy) {
                // Edit
                const res = await axiosSecure.put(`/policies/${selectedPolicy._id}`, data);
                Swal.fire('Updated!', 'Policy updated successfully.', 'success');
                setPolicies(prev => prev.map(p => p._id === selectedPolicy._id ? res.data : p));
            } else {
                // Add new
                const res = await axiosSecure.post('/policies', data);
                Swal.fire('Added!', 'Policy added successfully.', 'success');
                setPolicies(prev => [...prev, res.data]);
            }
            reset();
            setIsModalOpen(false);
            setSelectedPolicy(null);
        } catch (error) {
            Swal.fire('Error!', selectedPolicy ? 'Update failed.' : 'Creation failed.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete policy
    const handleDeletePolicy = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This policy will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/policies/${id}`);
                    Swal.fire('Deleted!', 'Policy deleted.', 'success');
                    setPolicies(prev => prev.filter(p => p._id !== id));
                } catch (error) {
                    Swal.fire('Error!', 'Deletion failed.', 'error');
                }
            }
        });
    };

    // Skeleton Loader Component
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </td>
            <td className="py-4 px-6">
                <div className="flex gap-2 justify-center">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            {/* Header and Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Policies</h2>
                    <p className="text-gray-600">View and manage all insurance policies</p>
                </div>
                <button
                    onClick={() => {
                        reset();
                        setSelectedPolicy(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-accent hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow transition"
                >
                    <FaPlus /> Add New Policy
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-blue-500 to-teal-500">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Policy Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Premium Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            Array(5).fill(0).map((_, index) => (
                                <SkeletonRow key={`skeleton-${index}`} />
                            ))
                        ) : policies.length > 0 ? (
                            policies.map((policy) => (
                                <tr key={policy._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{policy.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                {policy.category}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-green-700">
                                            {parseFloat(policy.base_premium).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {policy.duration} years
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedPolicy(policy);  // Set the policy to edit
                                                    reset(policy);              // Populate form with policy data
                                                    setIsModalOpen(true);       // Open the modal
                                                }}
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeletePolicy(policy._id)}
                                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No policies found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {selectedPolicy ? 'Edit Policy' : 'Add New Policy'}
                                </h2>
                                <button
                                    onClick={() => {
                                        reset();
                                        setIsModalOpen(false);
                                        setSelectedPolicy(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(handleAddOrEditPolicy)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Policy Title</label>
                                        <input
                                            type="text"
                                            {...register("title", { required: "Title is required" })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                        />
                                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Category</label>
                                        <select
                                            {...register("category", { required: "Category is required" })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                        >
                                            <option value="">Select</option>
                                            <option value="term_life">Term Life</option>
                                            <option value="senior">Senior</option>
                                            <option value="disability">Disability</option>
                                            <option value="health">Health</option>
                                        </select>
                                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            {...register("description", { required: "Description is required" })}
                                            className="textarea textarea-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                            rows={3}
                                        />
                                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Minimum Age</label>
                                        <input
                                            type="number"
                                            {...register("min_age", { required: "Minimum age is required" })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                        />
                                        {errors.min_age && <p className="text-red-500 text-sm">{errors.min_age.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Maximum Age</label>
                                        <input
                                            type="number"
                                            {...register("max_age", { required: "Maximum age is required" })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                        />
                                        {errors.max_age && <p className="text-red-500 text-sm">{errors.max_age.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Coverage Range</label>
                                        <input
                                            type="text"
                                            {...register("coverage_range", { required: "Coverage range is required" })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                            placeholder="e.g., 1L - 5L BDT"
                                        />
                                        {errors.coverage_range && <p className="text-red-500 text-sm">{errors.coverage_range.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Duration (years)</label>
                                        <input
                                            type="text"
                                            {...register("duration", { required: "Duration is required" })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                            placeholder="e.g., 10"
                                        />
                                        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Base Premium Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            {...register("base_premium", {
                                                required: "Base premium is required",
                                                validate: {
                                                    positive: v => parseFloat(v) > 0 || "Must be greater than 0",
                                                    maxPercentage: v => parseFloat(v) <= 100 || "Cannot exceed 100%"
                                                }
                                            })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                            placeholder="0.75"
                                        />
                                        {errors.base_premium && <p className="text-red-500 text-xs mt-1">{errors.base_premium.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Image URL</label>
                                        <input
                                            type="text"
                                            {...register("image", { required: "Image URL is required" })}
                                            className="input input-bordered w-full mt-1 bg-white/80 backdrop-blur-sm"
                                        />
                                        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setIsModalOpen(false);
                                            setSelectedPolicy(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 bg-white/80 backdrop-blur-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-accent hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : selectedPolicy ? (
                                            'Update Policy'
                                        ) : (
                                            'Create Policy'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePolicies;