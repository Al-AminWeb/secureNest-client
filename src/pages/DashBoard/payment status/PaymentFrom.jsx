import React, { useState } from 'react';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import PolicySkeleton from '../../shared/loading/PolicySkeleton';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAuth from "../../../hooks/useAuth.jsx";


const CARD_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#374151',
            fontFamily: '"Inter", sans-serif',
            '::placeholder': {
                color: '#9CA3AF',
            },
        },
        invalid: {
            color: '#EF4444',
        },
    },
};

const PaymentForm = ({ applicationId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [processing, setProcessing] = useState(false);
    const {user} = useAuth()
    const {
        isLoading,
        data: application = {},
        error
    } = useQuery({
        queryKey: ['application', applicationId],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/applications/${applicationId}`);
                return res.data;
            } catch (err) {
                toast.error('Failed to load application details');
                console.error('Error fetching application:', err);
                throw err;
            }
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            Swal.fire({
                icon: 'error',
                title: 'Payment System Not Ready',
                text: 'Please try again later',
            });
            setProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
            Swal.fire({
                icon: 'error',
                title: 'Card Details Missing',
                text: 'Please enter your card information',
            });
            setProcessing(false);
            return;
        }

        try {
            // Show loading SweetAlert
            Swal.fire({
                title: 'Processing Payment',
                html: 'Please wait while we process your payment',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Create payment method
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: application.name || 'Customer'
                }
            });

            if (pmError) throw pmError;

            // Create payment intent
            const paymentIntentRes = await axiosSecure.post('/create-payment-intent', {
                applicationId: application._id,
                amount: Math.round(parseFloat(application.monthlyPayment) * 100),
                currency: 'bdt',
                metadata: {
                    applicationId: application._id,
                    policyName: application.policyName
                }
            });

            // Confirm payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                paymentIntentRes.data.clientSecret,
                {
                    payment_method: paymentMethod.id,
                    receipt_email: application.customerEmail || undefined
                }
            );

            if (confirmError) throw confirmError;

            // Handle successful payment
            if (paymentIntent.status === 'succeeded') {
                // Call the new payment/success endpoint
                const paymentSuccessResponse = await axiosSecure.post('/payment/success', {
                    applicationId: application._id,
                    paymentId: paymentIntent.id,
                    amount: paymentIntent.amount / 100, // Convert back to regular amount
                    paymentMethod: 'card',
                    userId: user._id,
                    userEmail: user.email,
                    userName: user.displayName || user.name || ''
                });

                if (paymentSuccessResponse.data.success) {
                    console.log('Payment and record creation successful!', {
                        paymentId: paymentIntent.id,
                        amount: paymentIntent.amount / 100,
                        currency: paymentIntent.currency,
                        applicationId: application._id
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        text: `Your payment of ৳${(paymentIntent.amount / 100).toFixed(2)} has been processed`,
                        confirmButtonText: 'View Payment History'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/dashboard/payment-history');
                        } else {
                            navigate('/dashboard');
                        }
                    });
                } else {
                    throw new Error('Failed to record payment details');
                }
            }
        } catch (err) {
            console.error('Payment error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: err.message || 'There was an issue processing your payment',
                confirmButtonText: 'Try Again'
            });
        } finally {
            setProcessing(false);
            Swal.close();
        }
    };

    if (isLoading) return <PolicySkeleton />;
    if (error) return <p className="text-red-500 text-center mt-8">Error loading application details</p>;
    if (!application) return <p className="text-red-500 text-center mt-8">Application not found</p>;

    const monthlyAmount = parseFloat(application.monthlyPayment || 0);

    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Complete Your Payment
                </h2>
                <p className="text-gray-600 mt-2">
                    Monthly Payment: <span className="font-semibold">৳{monthlyAmount.toFixed(2)}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3">
                        <CardNumberElement options={CARD_OPTIONS} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date
                        </label>
                        <div className="border border-gray-300 rounded-lg p-3">
                            <CardExpiryElement options={CARD_OPTIONS} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                        </label>
                        <div className="border border-gray-300 rounded-lg p-3">
                            <CardCvcElement options={CARD_OPTIONS} />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${
                        !stripe || processing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {processing ? 'Processing...' : `Pay ৳${monthlyAmount.toFixed(2)}`}
                </button>

                <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Payments are secure and encrypted
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;