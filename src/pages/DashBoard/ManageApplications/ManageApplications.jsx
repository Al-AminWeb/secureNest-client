import { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEye, FaUserCheck, FaTimesCircle } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const statusColors = {
  Approved: "bg-green-100 text-green-700 border-green-300",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Rejected: "bg-red-100 text-red-700 border-red-300",
};

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
        const response = await axiosSecure.get("/applications");
                setApplications(response.data);
            } catch (error) {
                console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
            }
        };
    const fetchAgents = async () => {
      try {
        const response = await axiosSecure.get("/agents");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
        fetchApplications();
    fetchAgents();
    }, [axiosSecure]);

  const handleAgentChange = (applicationId, agentId) => {
    setSelectedAgents((prev) => ({ ...prev, [applicationId]: agentId }));
  };

  const handleAssignAgent = async (applicationId) => {
    const agentId = selectedAgents[applicationId];
    if (!agentId) return;
    try {
      await axiosSecure.patch(`/applications/${applicationId}/assign-agent`, { agentId });
      setApplications((prev) => prev.map(app => app._id === applicationId ? { ...app, agentId, status: "Approved" } : app));
      Swal.fire({
        icon: 'success',
        title: 'Agent Assigned',
        text: 'Agent has been assigned and application approved!'
      });
    } catch (error) {
      console.error("Error assigning agent:", error);
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: 'Failed to assign agent. Please try again.'
      });
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await axiosSecure.patch(`/applications/${applicationId}/status`, { status: "Rejected" });
      setApplications((prev) => prev.map(app => app._id === applicationId ? { ...app, status: "Rejected" } : app));
      Swal.fire({
        icon: 'success',
        title: 'Application Rejected',
        text: 'The application has been rejected.'
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      Swal.fire({
        icon: 'error',
        title: 'Rejection Failed',
        text: 'Failed to reject application. Please try again.'
      });
    }
  };

  // Replace handleView to open modal
  const handleView = (applicationId) => {
    const app = applications.find(a => a._id === applicationId);
    setSelectedApplication(app);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplication(null);
  };

    return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Manage Insurance Applications</h2>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-lg">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-50 sticky top-0 z-10">
                  <th className="py-3 px-4 border-b font-semibold">Applicant Name</th>
                  <th className="py-3 px-4 border-b font-semibold">Email</th>
                  <th className="py-3 px-4 border-b font-semibold">Policy Name</th>
                  <th className="py-3 px-4 border-b font-semibold">Application Date</th>
                  <th className="py-3 px-4 border-b font-semibold">Status</th>
                  <th className="py-3 px-4 border-b font-semibold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {applications.map((application, idx) => (
                  <tr
                    key={application._id}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-blue-50 transition"
                        : "bg-gray-50 hover:bg-blue-50 transition"
                    }
                  >
                    <td className="py-3 px-4 border-b">{application.name}</td>
                    <td className="py-3 px-4 border-b">{application.email}</td>
                    <td className="py-3 px-4 border-b">{application.policyName}</td>
                    <td className="py-3 px-4 border-b">
                            {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${
                          statusColors[application.status] || "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                        {/* View Details */}
                        <button
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded transition"
                          title="View Details"
                          onClick={() => handleView(application._id)}
                        >
                          <FaEye /> <span className="hidden md:inline">View</span>
                        </button>
                        {/* Assign Agent Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            className="border rounded px-2 py-1 text-sm focus:outline-primary"
                            value={selectedAgents[application._id] || ''}
                            onChange={e => handleAgentChange(application._id, e.target.value)}
                            title="Select Agent"
                          >
                            <option value="">Assign Agent</option>
                            {agents.map(agent => (
                              <option key={agent._id} value={agent._id}>{agent.name}</option>
                            ))}
                          </select>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm disabled:opacity-50"
                            onClick={() => handleAssignAgent(application._id)}
                            disabled={!selectedAgents[application._id]}
                            title="Assign Agent"
                          >
                            <FaUserCheck /> <span className="hidden md:inline">Assign</span>
                          </button>
                        </div>
                        {/* Reject Button */}
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 text-sm disabled:opacity-50"
                          onClick={() => handleReject(application._id)}
                          disabled={application.status === "Rejected"}
                          title="Reject Application"
                        >
                          <FaTimesCircle /> <span className="hidden md:inline">Reject</span>
                            </button>
                      </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal for Application Details */}
      {modalOpen && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 👇 Blurry Transparent Background Layer */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* 👇 Modal Content */}
            <div className="relative z-50 bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
              <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={closeModal}
                  title="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4 text-primary">Application Details</h3>
              <div className="space-y-2">
                <div><span className="font-semibold">Applicant Name:</span> {selectedApplication.name}</div>
                <div><span className="font-semibold">Email:</span> {selectedApplication.email}</div>
                <div><span className="font-semibold">Address:</span> {selectedApplication.address}</div>
                <div><span className="font-semibold">NID:</span> {selectedApplication.nid}</div>
                <div><span className="font-semibold">Policy Name:</span> {selectedApplication.policyName}</div>
                <div><span className="font-semibold">Coverage:</span> {selectedApplication.coverage}</div>
                <div><span className="font-semibold">Premium:</span> {selectedApplication.premium}</div>
                <div><span className="font-semibold">Duration:</span> {selectedApplication.duration}</div>
                <div><span className="font-semibold">Nominee Name:</span> {selectedApplication.nomineeName}</div>
                <div><span className="font-semibold">Nominee Relation:</span> {selectedApplication.nomineeRelation}</div>
                <div><span className="font-semibold">Health Disclosure:</span> {selectedApplication.healthDisclosure}</div>
                <div><span className="font-semibold">Status:</span> {selectedApplication.status}</div>
                <div><span className="font-semibold">Created At:</span> {new Date(selectedApplication.createdAt).toLocaleString()}</div>
                <div><span className="font-semibold">Last Updated:</span> {selectedApplication.lastUpdated ? new Date(selectedApplication.lastUpdated).toLocaleString() : 'N/A'}</div>
              </div>
            </div>
          </div>
      )}

    </div>
    );
};

export default ManageApplications;
