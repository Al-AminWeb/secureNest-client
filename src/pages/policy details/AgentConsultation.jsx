import { useNavigate } from 'react-router';
import { useState } from 'react';
import Swal from 'sweetalert2';

const AgentConsultation = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        message: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would send the form data to your backend or API
        await Swal.fire({
            icon: 'success',
            title: 'Consultation Booked!',
            text: 'Your consultation request has been submitted. An agent will contact you soon.',
            confirmButtonText: 'OK',
        });
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2 md:px-6">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 md:p-10">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-accent hover:underline flex items-center gap-1"
                >
                    <span className="material-icons text-base">arrow_back</span>
                    Back to Policy Details
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-primary">Book Agent Consultation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="md:flex md:space-x-4">
                        <div className="flex-1 mb-4 md:mb-0">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="you@email.com"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Preferred Date</label>
                        <input
                            type="date"
                            name="preferredDate"
                            value={form.preferredDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Any specific questions or requests?"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent text-white font-semibold py-2 rounded-md hover:bg-accent/90 transition"
                    >
                        Book Consultation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AgentConsultation; 