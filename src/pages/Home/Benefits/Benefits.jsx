import React from 'react';
import {
    HiShieldCheck,
    HiSupport,
    HiDocumentText,
    HiCurrencyDollar,
    HiClipboardCheck,
    HiUserCircle
} from 'react-icons/hi';

const Benefits = () => {
    const benefits = [
        {
            icon: <HiShieldCheck className="w-12 h-12" />,
            title: 'Instant Quote Calculation',
            description: 'Get personalized insurance quotes within seconds with our easy-to-use platform.',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: <HiSupport className="w-12 h-12" />,
            title: 'Expert Agent Support',
            description: 'Access professional agents anytime for guidance and support with your policies.',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            icon: <HiDocumentText className="w-12 h-12" />,
            title: '100% Online Application',
            description: 'Enjoy the convenience of applying for insurance directly online, from anywhere.',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            icon: <HiCurrencyDollar className="w-12 h-12" />,
            title: 'Secure Online Payments',
            description: 'Pay your premiums securely with our encrypted online payment systems.',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            icon: <HiClipboardCheck className="w-12 h-12" />,
            title: 'Real-Time Claim Tracking',
            description: 'Track your claims in real-time to stay updated on the progress and status.',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600'
        },
        {
            icon: <HiUserCircle className="w-12 h-12" />,
            title: 'Personalized Dashboard Access',
            description: 'Access your personalized dashboard to manage policies, payments, and claims effortlessly.',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600'
        }
    ];

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-primary">SecureNest</span>?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Discover the exceptional benefits that make us the preferred choice for insurance solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Background highlight on hover */}
                            <div className={`absolute inset-0 ${benefit.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            <div className="relative z-10">
                                {/* Icon with animated background */}
                                <div className={`w-16 h-16 ${benefit.bgColor} rounded-full flex items-center justify-center mb-6 mx-auto transition-all duration-300 group-hover:scale-110`}>
                                    <div className={benefit.iconColor}>
                                        {benefit.icon}
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{benefit.title}</h3>
                                <p className="text-gray-600 text-center">{benefit.description}</p>

                                {/* Learn more link (hidden until hover) */}
                                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark inline-flex items-center">
                                        Learn more
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default Benefits;