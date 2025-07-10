import React from 'react';
import { HiShieldCheck, HiSupport, HiDocumentText, HiCurrencyDollar, HiClipboardCheck, HiUserCircle } from 'react-icons/hi';

const Benefits = () => {
    const benefits = [
        {
            icon: <HiShieldCheck className="w-12 h-12 text-accent" />,
            title: 'Instant Quote Calculation',
            description: 'Get personalized insurance quotes within seconds with our easy-to-use platform.'
        },
        {
            icon: <HiSupport className="w-12 h-12 text-accent" />,
            title: 'Expert Agent Support',
            description: 'Access professional agents anytime for guidance and support with your policies.'
        },
        {
            icon: <HiDocumentText className="w-12 h-12 text-accent" />,
            title: '100% Online Application',
            description: 'Enjoy the convenience of applying for insurance directly online, from anywhere.'
        },
        {
            icon: <HiCurrencyDollar className="w-12 h-12 text-accent" />,
            title: 'Secure Online Payments',
            description: 'Pay your premiums securely with our encrypted online payment systems.'
        },
        {
            icon: <HiClipboardCheck className="w-12 h-12 text-accent" />,
            title: 'Real-Time Claim Tracking',
            description: 'Track your claims in real-time to stay updated on the progress and status.'
        },
        {
            icon: <HiUserCircle className="w-12 h-12 text-accent" />,
            title: 'Personalized Dashboard Access',
            description: 'Access your personalized dashboard to manage policies, payments, and claims effortlessly.'
        }
    ];

    return (
        <div className="bg-background py-12 px-6">
            <h2 className="text-3xl font-semibold text-primary text-center mb-10">Why Choose Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-xl p-6 text-center transition-transform transform hover:scale-105"
                    >
                        <div className="mb-4">{benefit.icon}</div>
                        <h3 className="text-xl font-medium text-primary mb-2">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Benefits;
