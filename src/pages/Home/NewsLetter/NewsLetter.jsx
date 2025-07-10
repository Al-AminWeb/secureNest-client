import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const NewsLetter = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosSecure = useAxiosSecure(); // Axios for API requests (you can use this later for DB calls)

    const onSubmit = (data) => {
        // Simulate sending data to the server
        axiosSecure.post('/newsletter', data)
            .then(res => {
                console.log(res.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Subscription Successful!',
                    text: 'You have successfully subscribed to our newsletter.',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset(); // Reset the form after successful submission
            })
            .catch(error => {
                console.error('Error during subscription:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Subscription Failed',
                    text: 'There was an error with the subscription. Please try again.',
                });
            });
    };

    return (
        <div className="bg-background py-12 px-6">
            <h2 className="text-3xl font-semibold text-primary text-center mb-8">Subscribe to Our Newsletter</h2>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                    message: 'Please enter a valid email address'
                                }
                            })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-teal-600 transition"
                        >
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsLetter;
