import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import { FaEnvelopeOpenText } from 'react-icons/fa';

const NewsLetter = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const onSubmit = (data) => {
        axiosSecure.post('/newsletter', data)
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title: 'Subscription Successful!',
                    text: 'You have successfully subscribed to our newsletter.',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset();
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Subscription Failed',
                    text: 'There was an error with the subscription. Please try again.',
                });
            });
    };

    return (
        <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-accent/10 to-white overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-2xl z-0 animate-pulse" />

            <div className="relative max-w-lg mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-accent/20 p-8 z-10">
                <div className="flex flex-col items-center mb-6">
                    <FaEnvelopeOpenText className="text-accent text-5xl mb-2 animate-bounce-slow" />
                    <h2 className="text-3xl font-extrabold text-primary text-center mb-2 drop-shadow">Stay in the Loop!</h2>
                    <p className="text-gray-600 text-center mb-2">Subscribe to our newsletter for exclusive updates, tips, and offers.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent bg-gray-50 shadow-sm transition-all duration-200"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
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
                            className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-accent focus:border-accent bg-gray-50 shadow-sm transition-all duration-200"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-accent hover:bg-primary transition-colors duration-300 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-accent/50"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </form>
                <p className="text-xs text-gray-400 text-center mt-6">We respect your privacy. Unsubscribe at any time.</p>
            </div>
        </div>
    );
};

export default NewsLetter;
