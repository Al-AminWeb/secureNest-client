import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";
import Swal from "sweetalert2";

const statusColors = {
    Approved: "bg-green-100 text-green-700 border-green-300",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Rejected: "bg-red-100 text-red-700 border-red-300",
};

const AssignedCustomers = () => {
    const { user } = useAuth();
    const { role, isLoading: roleLoading } = useUserRole();
    const axiosSecure = useAxiosSecure();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);



    useEffect(() => {
        if (!user?.email) return;

        const fetchAssignedCustomers = async () => {
            try {
                const res = await axiosSecure.get(`/assigned-customers?agentEmail=${user.email}`);

                
                // Handle the response structure properly
                if (res.data.success && res.data.customers) {
                    setCustomers(res.data.customers);
                } else if (Array.isArray(res.data)) {
                    setCustomers(res.data);
                } else {
                    setCustomers([]);
                }
            } catch (error) {
                console.error("Error fetching assigned customers:", error);
                Swal.fire("Error!", "Failed to load assigned customers.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedCustomers();
    }, [user, axiosSecure]);

    const handleStatusChange = async (applicationId, newStatus, currentStatus) => {
        try {
            // Don't allow changing if it's already the same status
            if (currentStatus === newStatus) {
                return;
            }

            const confirm = await Swal.fire({
                title: "Are you sure?",
                text: `Change status from ${currentStatus} to ${newStatus}?${newStatus === 'Approved' ? ' This will increment the policy purchase count.' : ''}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
            });

            if (!confirm.isConfirmed) return;

            await axiosSecure.patch(`/applications/${applicationId}/status`, { status: newStatus });

            setCustomers(prev =>
                prev.map(customer =>
                    customer._id === applicationId ? { ...customer, status: newStatus } : customer
                )
            );

            const successMessage = newStatus === 'Approved' 
                ? "Status updated successfully. Policy purchase count has been incremented." 
                : "Status updated successfully.";

            Swal.fire("Updated!", successMessage, "success");
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire("Error!", "Failed to update status.", "error");
        }
    };

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCustomer(null);
    };

    if (loading || roleLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Check if user is an agent
    if (!user || role !== 'agent') {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center text-red-500">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p>Only agents can view assigned customers.</p>
                    <p className="text-sm mt-2">Current role: {role || 'Not loaded'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Assigned Customers</h2>

            {customers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <h3 className="text-lg font-semibold mb-2">No Assigned Customers</h3>
                    <p>You don't have any customers assigned to you yet.</p>
                    <p className="text-sm mt-2">Customers will appear here once applications are assigned to you by an admin.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Policy
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer) => (
                            <tr key={customer._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                    <div className="text-sm text-gray-500">{customer.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{customer.policyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={customer.status}
                                        onChange={(e) => handleStatusChange(customer._id, e.target.value, customer.status)}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleViewDetails(customer)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
                        <div className="space-y-3">
                            <div>
                                <strong>Name:</strong> {selectedCustomer.name}
                            </div>
                            <div>
                                <strong>Email:</strong> {selectedCustomer.email}
                            </div>
                            <div>
                                <strong>Policy:</strong> {selectedCustomer.policyName}
                            </div>
                            <div>
                                <strong>Status:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                    selectedCustomer.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    selectedCustomer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {selectedCustomer.status}
                                </span>
                            </div>
                            <div>
                                <strong>Address:</strong> {selectedCustomer.address}
                            </div>
                            <div>
                                <strong>NID:</strong> {selectedCustomer.nid}
                            </div>
                            <div>
                                <strong>Nominee:</strong> {selectedCustomer.nomineeName} ({selectedCustomer.nomineeRelation})
                            </div>
                            {selectedCustomer.healthDisclosure && selectedCustomer.healthDisclosure.length > 0 && (
                                <div>
                                    <strong>Health Disclosure:</strong>
                                    <ul className="ml-4 mt-1">
                                        {selectedCustomer.healthDisclosure.map((condition, index) => (
                                            <li key={index} className="text-sm">• {condition}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div>
                                <strong>Applied Date:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignedCustomers;
