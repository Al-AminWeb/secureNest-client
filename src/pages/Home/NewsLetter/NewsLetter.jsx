import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import { FaEnvelopeOpenText, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
                    background: '#ffffff',
                    backdrop: `
                        rgba(0,0,0,0.4)
                        url("/images/confetti.gif")
                        center top
                        no-repeat
                    `
                });
                reset();
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Subscription Failed',
                    text: 'There was an error with the subscription. Please try again.',
                    background: '#ffffff'
                });
            });
    };

    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-32 h-32 bg-accent/5 rounded-full blur-xl z-0 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-accent/20 rounded-full blur-md opacity-75 animate-pulse"></div>
                        <FaEnvelopeOpenText className="relative text-accent text-5xl md:text-6xl mb-4 animate-bounce-slow" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Stay Updated with SecureNest
                    </h2>
                    <p className="text-gray-600 text-center max-w-lg">
                        Join our community of savvy subscribers and receive exclusive insurance tips,
                        policy updates, and special offers straight to your inbox.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name.message}</p>}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
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
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <button
                            type="submit"
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-4 px-6 rounded-xl font-bold shadow-lg transition-all duration-500"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <FaPaperPlane className="transition-transform duration-300 group-hover:translate-x-1" />
                                Subscribe Now
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        </button>
                    </motion.div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        We respect your privacy. Unsubscribe at any time. By subscribing, you agree to our
                        <a href="/privacy" className="text-accent hover:underline ml-1">Privacy Policy</a>.
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default NewsLetter;