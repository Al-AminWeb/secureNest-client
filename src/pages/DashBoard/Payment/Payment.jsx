// Payment.jsx
import React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useParams } from 'react-router';
import PaymentForm from "../payment status/PaymentFrom.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const Payment = () => {
    const { id } = useParams();


    return (
        <Elements stripe={stripePromise}>
            <PaymentForm applicationId={id} />  {/* Explicitly passing as applicationId */}
        </Elements>
    );
};

export default Payment;