import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PolicyDetails = () => {
    const { policyId } = useParams();
    const [policy, setPolicy] = useState(null);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        axiosSecure.get(`/policies/${policyId}`)
            .then(res => setPolicy(res.data))
            .catch(err => console.error('Error fetching policy details:', err));
    }, [policyId]);

    if (!policy) return <p className="text-center py-10 text-xl">Loading policy details...</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">{policy.title}</h1>
            <div className="bg-background p-6 rounded-lg shadow-md">
                <img
                    src={policy.image}
                    alt={policy.title}
                    className="w-full h-full object-cover rounded-lg mb-6"
                />

                <div className="grid md:grid-cols-2 gap-6 text-gray-800">
                    <div>
                        <h2 className="text-xl font-semibold">Category</h2>
                        <p className="capitalize">{policy.category}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Base Premium</h2>
                        <p>৳{policy.base_premium}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Age Eligibility</h2>
                        <p>{policy.min_age} to {policy.max_age} years</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Coverage Range</h2>
                        <p>{policy.coverage_range}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Duration</h2>
                        <p>{policy.duration}</p>
                    </div>

                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold">Description</h2>
                        <p>{policy.description}</p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-wrap gap-4 justify-start">
                    <button
                        onClick={() => navigate('/quote')}
                        className="px-6 py-2 bg-accent text-white rounded-md hover:bg-teal-600 transition"
                    >
                        Get Quote
                    </button>
                    <button
                        onClick={() => navigate('/agent-consultation')}
                        className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                    >
                        Book Agent Consultation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;
