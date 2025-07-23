// PaymentForm.jsx
import React from 'react';
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

const PaymentForm = ({ applicationId }) => {  // Changed prop name to be explicit
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    console.log('PaymentForm received applicationId:', applicationId); // Debug log

    const {
        isLoading,
        data: application = {},
        error
    } = useQuery({
        queryKey: ['application', applicationId],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/applications/${applicationId}`);
                console.log('Application data:', res.data); // Debug log
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

        if (!stripe || !elements) {
            toast.error('Stripe not initialized');
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
            toast.error('Card details not found');
            return;
        }

        try {
            // 1. Create payment method
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (pmError) {
                toast.error(pmError.message);
                return;
            }

            // 2. Create payment intent (using application data)
            const paymentIntentRes = await axiosSecure.post('/create-payment-intent', {
                applicationId: application._id,  // Using the application ID from fetched data
                paymentMethodId: paymentMethod.id,
                amount: parseFloat(application.monthlyPayment) * 100, // Convert to cents
            });

            // 3. Confirm the payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                paymentIntentRes.data.clientSecret,
                {
                    payment_method: paymentMethod.id,
                }
            );

            if (confirmError) {
                toast.error(confirmError.message);
            } else if (paymentIntent.status === 'succeeded') {
                toast.success('Payment successful!');
                // 4. Update application status
                await axiosSecure.patch(`/applications/${application._id}/payment`, {
                    paymentId: paymentIntent.id,
                    status: 'active'
                });
                navigate('/dashboard/success');
            }
        } catch (err) {
            console.error('Payment error:', err);
            toast.error('Payment failed. Please try again.');
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

            {/* Payment form remains the same */}
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
                    disabled={!stripe}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Pay ৳{monthlyAmount.toFixed(2)}
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