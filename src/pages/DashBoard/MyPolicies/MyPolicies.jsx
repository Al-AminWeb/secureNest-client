import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../hooks/useAuth.jsx";


const MyPolicies = () => {
    const { user } = useAuth(); // Get the user from the context (email or user ID)
    const axiosSecure = useAxiosSecure();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (user?.email) {
            // Fetch the applications submitted by the logged-in user
            axiosSecure.get(`/applications/user?email=${user.email}`)
                .then(response => {
                    setApplications(response.data);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to load your policies.');
                    setIsLoading(false);
                });
        }
    }, [user?.email]);

    const handleReviewSubmit = async () => {
        if (!rating || !feedback) {
            Swal.fire('Please provide both rating and feedback');
            return;
        }

        try {
            const response = await axiosSecure.post('/applications/review', {
                applicationId: selectedApplication._id,
                rating,
                feedback
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Review submitted successfully!',
                    text: 'Thank you for your feedback.',
                });

                // Close the modal and reset the form
                setReviewModalOpen(false);
                setSelectedApplication(null);
                setRating(0);
                setFeedback("");
            }
        } catch (error) {
            Swal.fire('Error submitting review', error.message, 'error');
        }
    };

    if (isLoading) {
        return <p>Loading your policies...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-primary mb-6">My Policies</h2>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="table w-full text-center">
                    <thead className="bg-accent text-white text-sm uppercase">
                    <tr>
                        <th className="py-3 px-4">Policy Name</th>
                        <th className="py-3 px-4">Application Date</th>
                        <th className="py-3 px-4">Premium</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-800">
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <tr key={application._id} className="hover:bg-gray-50 transition">
                                <td className="py-2 px-4">{application.policyName}</td>
                                <td className="py-2 px-4">
                                    {new Date(application.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4">{application.premium}</td>
                                <td className="py-2 px-4 capitalize">{application.status}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <button
                                        onClick={() => handleViewPolicy(application._id)}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            setReviewModalOpen(true);
                                        }}
                                        className="text-green-600 hover:underline font-medium"
                                    >
                                        Give Review
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-4 text-gray-500">
                                You haven't applied for any policies yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Review Modal */}
            {reviewModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50">
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <h2 className="text-2xl font-semibold mb-4">Submit Your Review</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Rating (1-5)</label>
                            <input
                                type="number"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                min="1"
                                max="5"
                                className="input input-bordered w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Feedback</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="textarea textarea-bordered w-full mt-1"
                                rows="4"
                                placeholder="Enter your feedback here"
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setReviewModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleReviewSubmit}
                                className="px-4 py-2 bg-accent text-white rounded hover:bg-teal-600"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Handle actions for "View Details" and "Give Review" buttons
const handleViewPolicy = (policyId) => {
    window.location.href = `/policies/${policyId}`;
};

export default MyPolicies;
