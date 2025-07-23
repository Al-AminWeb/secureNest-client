import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useState, useEffect } from 'react';

const ApplicationForm = () => {
    const { policyId } = useParams();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();
    const [policyDetails, setPolicyDetails] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch policy data based on policyId
    useEffect(() => {
        const fetchPolicyDetails = async () => {
            try {
                const res = await axiosSecure.get(`/policies/${policyId}`);
                setPolicyDetails(res.data);
            } catch (error) {
                console.error('Error fetching policy details:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to load policy details',
                    text: 'Please try again later.',
                    background: '#fff',
                    backdrop: `
                        rgba(0,0,123,0.4)
                        url("/images/nyan-cat.gif")
                        left top
                        no-repeat
                    `
                });
            }
        };

        fetchPolicyDetails();
    }, [policyId]);

    const onSubmit = async (data) => {
        if (!policyDetails) {
            Swal.fire({
                icon: 'error',
                title: 'Policy details not found',
                text: 'Unable to submit the application without policy details.',
                background: '#fff1f0',
                confirmButtonColor: '#ff4444',
            });
            return;
        }

        setIsSubmitting(true);

        const application = {
            ...data,
            status: 'Pending',
            healthDisclosure: data.healthDisclosure || [],
            policyId,
            policyName: policyDetails.title,
            coverage: policyDetails.coverage_range,
            premium: policyDetails.base_premium,
            duration: policyDetails.duration,
        };

        try {
            const res = await axiosSecure.post('/applications', application);
            if (res.status === 201 || res.data.insertedId) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    html: `
                        <div class="text-center">
                            <p>We'll review your information shortly.</p>
                            <p class="text-sm text-gray-500 mt-2">Policy: ${policyDetails.title}</p>
                        </div>
                    `,
                    background: '#f8f9fa',
                    showConfirmButton: true,
                    confirmButtonColor: '#4bb543',
                    confirmButtonText: 'Got it!',
                    timer: 5000
                });
                reset();
            }
        } catch (error) {
            console.error('Application Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Something went wrong. Please try again.',
                background: '#fff1f0',
                confirmButtonColor: '#ff4444',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center">
                        Insurance Application Form
                    </h2>
                    {policyDetails && (
                        <p className="text-center text-blue-100 mt-2 text-sm sm:text-base">
                            Applying for: {policyDetails.title}
                        </p>
                    )}
                </div>

                {/* Form content */}
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                                        })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Address *</label>
                                    <input
                                        {...register('address', { required: 'Address is required' })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        placeholder="123 Main St, City"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">NID/SSN *</label>
                                    <input
                                        {...register('nid', { required: 'NID/SSN is required' })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        placeholder="123-45-6789"
                                    />
                                    {errors.nid && <p className="mt-1 text-sm text-red-600">{errors.nid.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Nominee Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                Nominee Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Nominee Name *</label>
                                    <input
                                        {...register('nomineeName', { required: 'Nominee name is required' })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        placeholder="Jane Doe"
                                    />
                                    {errors.nomineeName && <p className="mt-1 text-sm text-red-600">{errors.nomineeName.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Relationship *</label>
                                    <select
                                        {...register('nomineeRelation', { required: 'Relationship is required' })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    >
                                        <option value="">Select relationship</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Child">Child</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.nomineeRelation && <p className="mt-1 text-sm text-red-600">{errors.nomineeRelation.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Health Disclosure */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                Health Disclosure
                            </h3>
                            <p className="text-sm text-gray-600">Please check all that apply</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {['Diabetes', 'Heart Disease', 'Cancer', 'Hypertension', 'Asthma', 'Other'].map((condition) => (
                                    <label key={condition} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200">
                                        <input
                                            type="checkbox"
                                            value={condition}
                                            {...register('healthDisclosure')}
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-gray-700">{condition}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Terms and Submit */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        {...register('terms', { required: 'You must accept the terms' })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700">
                                        I agree to the terms and conditions
                                    </label>
                                    {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;