import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    FaCalculator,
    FaUserAlt,
    FaVenusMars,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaSmoking
} from 'react-icons/fa';

const QuoteEstimator = () => {
    const { policyId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        coverage: '',
        duration: '',
        smoker: 'no',
    });
    const [quote, setQuote] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Sample policy data (would normally come from API)
    const samplePolicies = {
        'term-life': { name: 'Term Life Insurance', baseRate: 0.0005 },
        'whole-life': { name: 'Whole Life Insurance', baseRate: 0.0008 },
        'senior': { name: 'Senior Life Insurance', baseRate: 0.001 },
    };
    const currentPolicy = samplePolicies[policyId] || samplePolicies['term-life'];

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
    };

    const calculatePremium = ({ age, gender, coverage, duration, smoker }) => {
        let multiplier = 1;
        if (age < 25) multiplier += 0.2;
        else if (age > 50) multiplier += 0.4;
        if (gender === 'female') multiplier -= 0.1;
        if (smoker === 'yes') multiplier += 0.5;

        const annual = parseFloat(coverage)
            * currentPolicy.baseRate
            * parseFloat(duration)
            * multiplier;
        const monthly = annual / 12;

        return {
            monthly: monthly.toFixed(2),
            annual:  annual.toFixed(2),
            coverage: parseFloat(coverage).toLocaleString(),
            duration
        };
    };

    const handleSubmit = e => {
        e.preventDefault();
        setIsCalculating(true);

        setTimeout(() => {
            setQuote(calculatePremium(formData));
            setIsCalculating(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <FaCalculator /> {currentPolicy.name} Quote
                        </h1>
                        <p className="opacity-90 mt-1">Get your personalized insurance estimate</p>
                    </div>

                    {/* Form */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Age */}
                            <div className="form-control">
                                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaUserAlt className="text-blue-500" /> Age
                  </span>
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    min="18"
                                    max="80"
                                    required
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your age"
                                />
                            </div>

                            {/* Gender */}
                            <div className="form-control">
                                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaVenusMars className="text-blue-500" /> Gender
                  </span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="select select-bordered w-full focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Coverage */}
                            <div className="form-control">
                                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaMoneyBillWave className="text-blue-500" /> Coverage Amount (৳)
                  </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">৳</span>
                                    <input
                                        type="number"
                                        name="coverage"
                                        min="100000"
                                        step="50000"
                                        required
                                        value={formData.coverage}
                                        onChange={handleChange}
                                        className="input input-bordered w-full pl-8 focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 1,000,000"
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="form-control">
                                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" /> Duration (Years)
                  </span>
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    min="5"
                                    max="30"
                                    required
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                                    placeholder="Policy term in years"
                                />
                            </div>

                            {/* Smoker */}
                            <div className="form-control">
                                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaSmoking className="text-blue-500" /> Tobacco User?
                  </span>
                                </label>
                                <select
                                    name="smoker"
                                    value={formData.smoker}
                                    onChange={handleChange}
                                    className="select select-bordered w-full focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full mt-6 ${isCalculating ? 'loading' : ''}`}
                                disabled={isCalculating}
                            >
                                {isCalculating ? 'Calculating...' : 'Get My Quote'}
                            </button>
                        </form>

                        {/* Quote Result */}
                        {quote && (
                            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 animate-fade-in">
                                <h3 className="text-xl font-bold text-center text-blue-700 mb-4">
                                    Your Estimated Premium
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                        <div className="text-sm text-blue-600">Monthly Payment</div>
                                        <div className="text-3xl font-bold text-blue-800">৳{quote.monthly}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                        <div className="text-sm text-blue-600">Annual Payment</div>
                                        <div className="text-3xl font-bold text-blue-800">৳{quote.annual}</div>
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-600 mb-4">
                                    For ৳{quote.coverage} coverage over {quote.duration} years
                                </div>

                                {/* <–– HERE is the only change ––> */}
                                <button
                                    onClick={() =>
                                        navigate(`/policies/${policyId}/apply`, {
                                            state: {
                                                ...formData,
                                                monthlyPayment: Number(quote.monthly),
                                                annualPayment:  Number(quote.annual),
                                            }
                                        })
                                    }
                                    className="btn btn-accent bg-blue-500 rounded p-2 mt-4 w-full"
                                >
                                    Apply Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>This is an estimate only. Final premium may vary based on underwriting.</p>
                </div>
            </div>
        </div>
    );
};

export default QuoteEstimator;
