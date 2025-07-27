import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const statusColors = {
    Approved: "bg-green-100 text-green-700 border-green-300",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Rejected: "bg-red-100 text-red-700 border-red-300",
};

const AssignedCustomers = () => {
    const { user } = useAuth();
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
                setCustomers(res.data);
            } catch (error) {
                console.error("Error fetching assigned customers:", error);
                Swal.fire("Error!", "Failed to load assigned customers.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedCustomers();
    }, [user, axiosSecure]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const confirm = await Swal.fire({
                title: "Are you sure?",
                text: `Change status to ${newStatus}?`,
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

            Swal.fire("Updated!", "Status updated successfully.", "success");
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Assigned Customers</h2>

            {customers.length === 0 ? (
                <p className="text-center text-gray-500">No assigned customers yet.</p>
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
                                        onChange={(e) => handleStatusChange(customer._id, e.target.value)}
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
                        <p><strong>Name:</strong> {selectedCustomer.name}</p>
                        <p><strong>Email:</strong> {selectedCustomer.email}</p>
                        <p><strong>Policy:</strong> {selectedCustomer.policyName}</p>
                        <p><strong>Status:</strong> {selectedCustomer.status}</p>
                        <p><strong>Address:</strong> {selectedCustomer.address}</p>
                        <p><strong>Nominee:</strong> {selectedCustomer.nomineeName} ({selectedCustomer.nomineeRelation})</p>

                        <div className="flex justify-end mt-4">
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
