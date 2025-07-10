import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const ManagePolicies = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    // Fetch policies
    useEffect(() => {
        axiosSecure.get('/policies')
            .then(res => setPolicies(res.data))
            .catch(err => console.error("Error fetching policies:", err));
    }, [axiosSecure]);

    // Add or Edit policy
    const handleAddOrEditPolicy = (data) => {
        if (selectedPolicy) {
            // Edit
            axiosSecure.put(`/policies/${selectedPolicy._id}`, data)
                .then(res => {
                    Swal.fire('Updated!', 'Policy updated successfully.', 'success');
                    setPolicies(prev => prev.map(p => p._id === selectedPolicy._id ? res.data : p));
                })
                .catch(() => Swal.fire('Error!', 'Update failed.', 'error'));
        } else {
            // Add new
            axiosSecure.post('/policies', data)
                .then(res => {
                    Swal.fire('Added!', 'Policy added successfully.', 'success');
                    setPolicies(prev => [...prev, res.data]);
                })
                .catch(() => Swal.fire('Error!', 'Creation failed.', 'error'));
        }

        reset();
        setIsModalOpen(false);
        setSelectedPolicy(null);
    };

    // Open modal to edit
    const handleEditPolicy = (policy) => {
        setSelectedPolicy(policy);
        reset(policy);
        setIsModalOpen(true);
    };

    // Delete policy
    const handleDeletePolicy = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This policy will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then(result => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/policies/${id}`)
                    .then(() => {
                        Swal.fire('Deleted!', 'Policy deleted.', 'success');
                        setPolicies(prev => prev.filter(p => p._id !== id));
                    })
                    .catch(() => Swal.fire('Error!', 'Deletion failed.', 'error'));
            }
        });
    };

    return (
        <div className="p-6 w-full">
            {/* Header and Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold">Manage Policies</h2>
                <button
                    onClick={() => {
                        reset();
                        setSelectedPolicy(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-accent hover:bg-teal-600 text-white px-6 py-2 rounded-md shadow transition"
                >
                    + Add New Policy
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="table w-full text-center">
                    <thead className="bg-accent text-white text-sm uppercase">
                    <tr>
                        <th className="py-3 px-4">Policy Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-800">
                    {policies.length > 0 ? (
                        policies.map((policy) => (
                            <tr key={policy._id} className="hover:bg-gray-50 transition">
                                <td className="py-2 px-4">{policy.title}</td>
                                <td className="py-2 px-4 capitalize">{policy.category}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <button
                                        onClick={() => handleEditPolicy(policy)}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePolicy(policy._id)}
                                        className="text-red-600 hover:underline font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-4 text-gray-500">
                                No policies found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent bg-opacity-100 flex items-center justify-center z-50">
                    <div
                        className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-primary mb-4">
                            {selectedPolicy ? 'Edit Policy' : 'Add New Policy'}
                        </h2>

                        <form onSubmit={handleSubmit(handleAddOrEditPolicy)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Policy Title</label>
                                <input
                                    type="text"
                                    {...register("title", { required: "Title is required" })}
                                    className="input input-bordered w-full mt-1"
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    {...register("category", { required: "Category is required" })}
                                    className="input input-bordered w-full mt-1"
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
                                    className="textarea textarea-bordered w-full mt-1"
                                    rows={3}
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Minimum Age</label>
                                <input
                                    type="number"
                                    {...register("min_age", { required: "Minimum age is required" })}
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Maximum Age</label>
                                <input
                                    type="number"
                                    {...register("max_age", { required: "Maximum age is required" })}
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Coverage Range</label>
                                <input
                                    type="text"
                                    {...register("coverage_range", { required: "Coverage range is required" })}
                                    className="input input-bordered w-full mt-1"
                                    placeholder="e.g., 1L - 5L BDT"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Duration</label>
                                <input
                                    type="text"
                                    {...register("duration", { required: "Duration is required" })}
                                    className="input input-bordered w-full mt-1"
                                    placeholder="e.g., 10 years"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Base Premium Rate</label>
                                <input
                                    type="number"
                                    {...register("base_premium", { required: "Base premium is required" })}
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Image URL</label>
                                <input
                                    type="text"
                                    {...register("image", { required: "Image URL is required" })}
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setIsModalOpen(false);
                                        setSelectedPolicy(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-accent text-white rounded hover:bg-teal-600"
                                >
                                    {selectedPolicy ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePolicies;
