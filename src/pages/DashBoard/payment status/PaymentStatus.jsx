import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const PaymentStatus = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: applications = [], isLoading, isError } = useQuery({
        queryKey: ['myPayments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure(`/applications?email=${user.email}`);
            return res.data.filter(app => app.status === 'Approved');
        },
    });

    const SkeletonLoader = () => (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* ...same as before... */}
        </div>
    );

    if (isLoading) return <SkeletonLoader />;
    if (isError) return (
        <div className="p-4 text-center text-red-500">
            Failed to load payment information. Please try again later.
        </div>
    );
    if (applications.length === 0) return (
        <div className="p-4 text-center">
            {/* ...same no-data UI... */}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Status</h1>
                    <p className="text-gray-600">View and manage your policy payments</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {applications.map(app => (
                        <div key={app._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{app.policyName}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        app.paymentStatus === 'Paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {app.paymentStatus || 'Payment Due'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">Premium Amount</p>
                                        <p className="font-medium">৳{app.monthlyPayment}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">Payment Frequency</p>
                                        <p className="font-medium">
                                            {app.paymentFrequency === 'yearly'
                                                ? 'Annual'
                                                : app.paymentFrequency === 'monthly'
                                                    ? 'Monthly'
                                                    : 'Not selected'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">Coverage</p>
                                        <p className="font-medium">{app.coverage}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">Policy Duration</p>
                                        <p className="font-medium">{app.duration}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        {app.paymentStatus === 'Paid' ? (
                                            <>
                                                <FaCheckCircle className="text-green-500" />
                                                <span className="text-sm text-gray-600">Payment completed</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaExclamationCircle className="text-yellow-500" />
                                                <span className="text-sm text-gray-600">Payment pending</span>
                                            </>
                                        )}
                                    </div>

                                    {app.payment?.status !== 'Paid' && (
                                        <Link
                                            to={`/dashboard/make-payment/${app._id}`}
                                            className="btn btn-primary btn-sm md:btn-md flex items-center space-x-2"
                                        >
                                            <FaMoneyBillWave />
                                            <span>Make Payment</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-blue-800">
                        Need help with payments? <Link to="/support" className="font-semibold underline">Contact support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
