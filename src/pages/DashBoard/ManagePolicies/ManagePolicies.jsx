import {useState} from 'react';
import {useForm} from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const ManagePolicies = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm();

    const axiosSecure = useAxiosSecure();


    const handleAddPolicy = (data) => {
        axiosSecure.post('/policies', data)
            .then(res => {
                console.log(res.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Policy Added Successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });

                reset();
                setIsModalOpen(false); // Close the modal after success
            })
            .catch(error => {
                console.error('Error adding policy:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Policy',
                    text: 'There was an error while adding the policy. Please try again.',
                });
            });
    };
    return (
        <div className="space-y-4">
            {/* Button to Open Modal */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-accent text-white py-2 px-4 rounded-md hover:bg-teal-600 transition"
            >
                Add New Policy
            </button>

            {/* Modal */}
            <div
                className={`fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300 ${
                    isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsModalOpen(false)}
            >
                <div
                    className="bg-white rounded-lg shadow-lg p-8 w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 max-w-3xl"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                    <h2 className="text-2xl font-semibold text-primary mb-6">Add New Policy</h2>

                    <form onSubmit={handleSubmit(handleAddPolicy)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Policy Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Policy Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    {...register('title', {required: 'Title is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    {...register('category', {required: 'Category is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                >
                                    <option value="term_life">Term Life</option>
                                    <option value="senior">Senior</option>
                                    <option value="disability">Disability</option>
                                    <option value="health">Health</option>
                                </select>
                                {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    {...register('description', {required: 'Description is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                ></textarea>
                                {errors.description &&
                                    <p className="text-red-500 text-xs">{errors.description.message}</p>}
                            </div>

                            {/* Minimum Age */}
                            <div>
                                <label htmlFor="min_age" className="block text-sm font-medium text-gray-700">
                                    Minimum Age
                                </label>
                                <input
                                    type="number"
                                    id="min_age"
                                    {...register('min_age', {required: 'Minimum age is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                />
                                {errors.min_age && <p className="text-red-500 text-xs">{errors.min_age.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Maximum Age */}
                            <div>
                                <label htmlFor="max_age" className="block text-sm font-medium text-gray-700">
                                    Maximum Age
                                </label>
                                <input
                                    type="number"
                                    id="max_age"
                                    {...register('max_age', {required: 'Maximum age is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                />
                                {errors.max_age && <p className="text-red-500 text-xs">{errors.max_age.message}</p>}
                            </div>

                            {/* Coverage Range */}
                            <div>
                                <label htmlFor="coverage_range" className="block text-sm font-medium text-gray-700">
                                    Coverage Range
                                </label>
                                <input
                                    type="text"
                                    id="coverage_range"
                                    {...register('coverage_range', {required: 'Coverage range is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                />
                                {errors.coverage_range && (
                                    <p className="text-red-500 text-xs">{errors.coverage_range.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Duration */}
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                    Duration Options
                                </label>
                                <input
                                    type="text"
                                    id="duration"
                                    {...register('duration', {required: 'Duration is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                />
                                {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
                            </div>

                            {/* Base Premium Rate */}
                            <div>
                                <label htmlFor="base_premium" className="block text-sm font-medium text-gray-700">
                                    Base Premium Rate
                                </label>
                                <input
                                    type="number"
                                    id="base_premium"
                                    {...register('base_premium', {required: 'Base premium rate is required'})}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                                />
                                {errors.base_premium && (
                                    <p className="text-red-500 text-xs">{errors.base_premium.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Policy Image (URL or Upload) */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Policy Image (URL or Upload)
                            </label>
                            <input
                                type="text"
                                id="image"
                                {...register('image')}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-teal-600 transition"
                            >
                                Add Policy
                            </button>
                        </div>
                    </form>

                    {/* Close Modal Button */}
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                    >
                        X
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagePolicies;
