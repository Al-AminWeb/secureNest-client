import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../hooks/useAuth.jsx";
import { PDFDownloadLink, Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 12
    },
    header: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1a365d'
    },
    section: {
        marginBottom: 10
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#2d3748'
    },
    value: {
        fontSize: 12,
        marginBottom: 5,
        color: '#4a5568'
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        marginVertical: 10
    }
});

// PDF Document Component
const PolicyPDF = ({ application }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.header}>SecureNest Insurance Policy Document</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Policy Information</Text>
                <Text style={styles.value}>Policy Name: {application.policyName}</Text>
                <Text style={styles.value}>Coverage: {application.coverage}</Text>
                <Text style={styles.value}>Premium Rate: {application.premium}%</Text>
                <Text style={styles.value}>Duration: {application.duration}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.label}>Policy Holder Details</Text>
                <Text style={styles.value}>Name: {application.name}</Text>
                <Text style={styles.value}>Email: {application.email}</Text>
                <Text style={styles.value}>Address: {application.address || 'Not provided'}</Text>
                <Text style={styles.value}>NID: {application.nid || 'Not provided'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.label}>Payment Information</Text>
                <Text style={styles.value}>Monthly Payment: ৳{application.monthlyPayment}</Text>
                <Text style={styles.value}>Annual Payment: ৳{application.annualPayment}</Text>
                <Text style={styles.value}>Payment Status: {application.paymentStatus || 'Pending'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.label}>Nominee Information</Text>
                <Text style={styles.value}>Nominee Name: {application.nomineeName || 'Not provided'}</Text>
                <Text style={styles.value}>Relation: {application.nomineeRelation || 'Not provided'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.label}>Policy Status</Text>
                <Text style={styles.value}>Status: {application.status}</Text>
                <Text style={styles.value}>Approved Date: {
                    application.lastUpdated
                        ? new Date(application.lastUpdated).toLocaleDateString()
                        : 'Not available'
                }</Text>
            </View>
        </Page>
    </Document>
);

const MyPolicies = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                if (user?.email) {
                    const response = await axiosSecure.get(`/applications/user?email=${user.email}`);
                    setApplications(response.data);
                }
            } catch (err) {
                setError('Failed to load your policies. Please try again later.');
                console.error('Error fetching policies:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolicies();
    }, [user?.email, axiosSecure]);

    const handleReviewSubmit = async () => {
        if (!rating || !feedback) {
            Swal.fire('Error', 'Please provide both rating and feedback', 'error');
            return;
        }

        try {
            await axiosSecure.post('/applications/review', {
                applicationId: selectedApplication._id,
                rating,
                feedback
            });

            Swal.fire('Success', 'Review submitted successfully!', 'success');
            setReviewModalOpen(false);
            setSelectedApplication(null);
            setRating(0);
            setFeedback("");
        } catch (error) {
            Swal.fire('Error', 'Failed to submit review', 'error');
            console.error('Review submission error:', error);
        }
    };

    const handleViewDetails = (applicationId) => {
        // Implement navigation to policy details
        console.log('View details for:', applicationId);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Insurance Policies</h2>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Policy</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Applied On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Premium</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <tr key={application._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{application.policyName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(application.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {application.premium}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                            {application.status}
                                        </span>
                                    {application.status === 'Approved' && (
                                        <div className="mt-2">
                                            <PDFDownloadLink
                                                document={<PolicyPDF application={application} />}
                                                fileName={`SecureNest_Policy_${application._id}.pdf`}
                                            >
                                                {({ loading }) => (
                                                    <button
                                                        className={`text-xs px-3 py-1 rounded ${
                                                            loading
                                                                ? 'bg-gray-400 text-white'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                        }`}
                                                        disabled={loading}
                                                    >
                                                        {loading ? 'Generating...' : 'Download PDF'}
                                                    </button>
                                                )}
                                            </PDFDownloadLink>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button
                                        onClick={() => handleViewDetails(application._id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Details
                                    </button>
                                    {application.status === 'Approved' && (
                                        <button
                                            onClick={() => {
                                                setSelectedApplication(application);
                                                setReviewModalOpen(true);
                                            }}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            Review
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                You haven't applied for any policies yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Review Modal */}
            {reviewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Submit Your Review</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                            <textarea
                                rows="4"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setReviewModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReviewSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPolicies;