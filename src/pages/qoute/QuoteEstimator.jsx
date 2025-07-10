import { useState } from 'react';
import { useNavigate } from 'react-router';

const QuoteEstimator = () => {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        coverage: '',
        duration: '',
        smoker: 'no',
    });
    const [quote, setQuote] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculatePremium = ({ age, gender, coverage, duration, smoker }) => {
        const baseRate = 0.0005;
        let multiplier = 1;

        if (age < 25) multiplier += 0.2;
        else if (age > 50) multiplier += 0.4;

        if (gender === 'female') multiplier -= 0.1;
        if (smoker === 'yes') multiplier += 0.5;

        const annual = parseFloat(coverage) * baseRate * parseFloat(duration) * multiplier;
        const monthly = annual / 12;

        return {
            monthly: monthly.toFixed(2),
            annual: annual.toFixed(2),
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = calculatePremium(formData);
        setQuote(result);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">Life Insurance Quote Estimator</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        min="18"
                        required
                        value={formData.age}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="select select-bordered w-full">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Coverage Amount (৳)</label>
                    <input
                        type="number"
                        name="coverage"
                        required
                        value={formData.coverage}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1">Duration (Years)</label>
                    <input
                        type="number"
                        name="duration"
                        required
                        value={formData.duration}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1">Smoker?</label>
                    <select name="smoker" value={formData.smoker} onChange={handleChange} className="select select-bordered w-full">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
                <button type="submit" className="btn bg-accent btn-primary p-2 rounded-xl w-full mt-4">Calculate Quote</button>
            </form>

            {quote && (
                <div className="mt-6 bg-gray-100 p-4 rounded shadow text-center">
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Estimated Premium</h3>
                    <p>Monthly: <span className="font-bold">৳{quote.monthly}</span></p>
                    <p>Annual: <span className="font-bold">৳{quote.annual}</span></p>
                    <button
                        onClick={() => navigate('/apply')}
                        className="btn btn-accent mt-4 bg-accent p-2 rounded-xl"
                    >
                        Apply for Policy
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuoteEstimator;
