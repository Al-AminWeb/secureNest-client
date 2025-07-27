import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth.jsx";

const ClaimRequest = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reasons, setReasons] = useState({}); // Track reason for each policy

    // ✅ Fetch active applications
    useEffect(() => {
        if (!user || !user._id) return;

        const fetchApplications = async () => {
            try {
                const res = await axiosSecure.get(`/applications?userId=${user._id}&status=Active`);
                setApplications(res.data || []);
            } catch (error) {
                console.error("Error fetching active policies:", error);
                Swal.fire("Error", "Failed to load your active policies", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [axiosSecure, user]);


    // ✅ Handle reason input
    const handleReasonChange = (id, value) => {
        setReasons({
            ...reasons,
            [id]: value,
        });
    };

    // ✅ Submit claim
    const handleSubmit = async (app) => {
        const reason = reasons[app._id];
        if (!reason || reason.trim() === "") {
            Swal.fire("Error", "Please provide a reason for the claim", "error");
            return;
        }

        const claimData = {
            applicationId: app._id,
            userId: user._id,
            userEmail: user.email,
            policyName: app.policyName,
            reason,
        };

        try {
            const res = await axiosSecure.post("/claim-requests", claimData);
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Claim Submitted",
                    text: "Your claim request has been submitted successfully",
                    confirmButtonColor: "#3085d6",
                }).then(() => {
                    navigate("/dashboard");
                });
            } else {
                Swal.fire("Error", res.data.message || "Failed to submit claim", "error");
            }
        } catch (error) {
            console.error("Error submitting claim:", error);
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading your policies...</div>;
    }

    if (applications.length === 0) {
        return (
            <div className="p-6 text-center text-gray-700 font-semibold">
                You have no active policies to claim.
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Claim Request Form</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                    <div
                        key={app._id}
                        className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-5"
                    >
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">
                            {app.policyName}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Duration: {app.duration} Years | Coverage: {app.coverage}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Claim *
                            </label>
                            <textarea
                                value={reasons[app._id] || ""}
                                onChange={(e) => handleReasonChange(app._id, e.target.value)}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Describe the reason for your claim..."
                            ></textarea>
                        </div>

                        <button
                            onClick={() => handleSubmit(app)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Submit Claim
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClaimRequest;
