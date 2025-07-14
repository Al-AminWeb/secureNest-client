import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqData = [
        {
            question: "What is SecureNest?",
            answer:
                "SecureNest is an online platform providing a wide range of insurance policies for individuals, families, and businesses. Our goal is to offer accessible, affordable, and comprehensive insurance options to protect your future.",
        },
        {
            question: "How do I apply for a policy?",
            answer:
                "To apply for a policy, simply browse through the available plans, select the one that best suits your needs, and fill out the application form. After submitting your details, our team will review your application and get in touch with the next steps.",
        },
        {
            question: "Can I apply for multiple policies at once?",
            answer:
                "Yes, you can apply for as many policies as you need. Each application will be processed separately, and you will receive updates on the status of each policy through email or your SecureNest account.",
        },
        {
            question: "What happens after I submit my application?",
            answer:
                "After submission, your application will be reviewed by our team. You will receive an email with updates on the status of your policy, including whether it's been approved, rejected, or is still pending.",
        },
        {
            question: "How do I make a claim?",
            answer:
                "To make a claim, simply log in to your SecureNest account, go to the 'My Policies' section, and click on the 'Make a Claim' button. Follow the instructions provided to submit your claim, and our team will assist you throughout the process.",
        },
        {
            question: "Can I track the status of my application or claim?",
            answer:
                "Yes, you can track the status of both your application and claims directly from your SecureNest account. You'll be notified via email of any updates regarding your application or claim status.",
        },
        {
            question: "Is it safe to submit my personal information on SecureNest?",
            answer:
                "Absolutely! SecureNest uses the latest encryption technologies and security protocols to ensure your personal information is safe. We take your privacy seriously and comply with all data protection regulations.",
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept a wide range of payment methods including credit/debit cards, bank transfers, and online wallets. You can select your preferred payment method during the checkout process.",
        },
        {
            question: "Can I change my policy details after applying?",
            answer:
                "Yes, you can modify certain details of your policy after application. However, changes to coverage amounts, policy types, or other major modifications may require a new application process. Contact our support team for assistance.",
        },
        {
            question: "How can I contact customer support?",
            answer:
                "You can reach our customer support team through email, live chat, or by calling our helpline. We are available 24/7 to assist you with any queries or issues you may have regarding your policies or claims.",
        },
    ];

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqData.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200">
                        <div
                            className="flex items-center justify-between py-4 cursor-pointer"
                            onClick={() => toggleAnswer(index)}
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                            <span className="text-gray-600">
                                {activeIndex === index ? (
                                    <FaChevronUp className="text-xl" />
                                ) : (
                                    <FaChevronDown className="text-xl" />
                                )}
                            </span>
                        </div>
                        {activeIndex === index && (
                            <div className="p-4 text-gray-700 bg-gray-50 rounded-md">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
