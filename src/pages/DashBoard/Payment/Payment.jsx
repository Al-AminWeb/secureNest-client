// Payment.jsx
import React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useParams } from 'react-router';
import PaymentForm from "../payment status/PaymentFrom.jsx";

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Payment = () => {
    const { id } = useParams(); // This should be the application ID from the URL

    console.log('Payment component received id:', id); // Debug log

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm applicationId={id} />  {/* Explicitly passing as applicationId */}
        </Elements>
    );
};

export default Payment;