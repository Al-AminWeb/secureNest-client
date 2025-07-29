import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth.jsx";
import { FaFileAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";

const ClaimRequest = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reasons, setReasons] = useState({});

    // Fetch active applications by email
    useEffect(() => {
        if (!user?.email) return;

        const fetchApplications = async () => {
            try {
                const res = await axiosSecure.get(`/applications/active-by-email?email=${user.email}`);
                setApplications(res.data || []);
            } catch (error) {
                console.error("Error fetching active policies:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to load your active policies",
                    background: '#fff',
                    color: '#1a365d',
                    confirmButtonColor: '#4299e1'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [axiosSecure, user?.email]);

    const handleReasonChange = (id, value) => {
        setReasons(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (app) => {
        const reason = reasons[app._id];
        if (!reason?.trim()) {
            Swal.fire({
                icon: "error",
                title: "Missing Information",
                text: "Please provide a reason for the claim",
                background: '#fff',
                color: '#1a365d',
                confirmButtonColor: '#4299e1'
            });
            return;
        }

        setSubmitting(true);
        const claimData = {
            applicationId: app._id,
            userEmail: user.email,
            policyName: app.policyName,
            reason,
            status: "Pending",
            submittedAt: new Date()
        };

        try {
            const res = await axiosSecure.post("/claim-requests", claimData);
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Claim Submitted!",
                    text: "Your claim request has been received",
                    background: '#fff',
                    color: '#1a365d',
                    confirmButtonColor: '#4299e1'
                });
                navigate("/");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Submission Failed",
                    text: res.data.message || "Failed to submit claim",
                    background: '#fff',
                    color: '#1a365d',
                    confirmButtonColor: '#4299e1'
                });
            }
        } catch (error) {
            console.error("Claim submission error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to submit claim. Please try again.",
                background: '#fff',
                color: '#1a365d',
                confirmButtonColor: '#4299e1'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
                    <p className="text-gray-700 text-lg">Loading your policies...</p>
                </div>
            </div>
        );
    }

    if (!applications.length) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md bg-white rounded-xl shadow-md p-8 text-center">
                    <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Policies</h2>
                    <p className="text-gray-600 mb-6">You don't have any active policies eligible for claims.</p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        File a <span className="text-blue-600">Claim Request</span>
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
                        Submit a claim for your active insurance policies
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map(app => (
                        <div key={app._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
                            <div className="bg-blue-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">{app.policyName}</h2>
                                <p className="text-blue-100">{app.coverage}</p>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Premium</p>
                                        <p className="text-lg font-semibold">{app.premium}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <div className="flex items-center">
                                            <FaCheckCircle className="text-green-500 mr-1" />
                                            <span className="font-medium">{app.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Claim <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={reasons[app._id] || ""}
                                        onChange={(e) => handleReasonChange(app._id, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={4}
                                        placeholder="Describe the reason for your claim in detail..."
                                        required
                                    />
                                </div>

                                <button
                                    onClick={() => handleSubmit(app)}
                                    disabled={submitting}
                                    className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                                        submitting ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {submitting ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Submit Claim Request'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClaimRequest;