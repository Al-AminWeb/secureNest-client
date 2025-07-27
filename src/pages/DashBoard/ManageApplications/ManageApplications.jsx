import { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEye, FaUserCheck, FaTimesCircle } from "react-icons/fa";
import Swal from 'sweetalert2';

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
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, agentsRes] = await Promise.all([
          axiosSecure.get("/applications"),
          axiosSecure.get("/agents")
        ]);
        setApplications(appsRes.data);
        setAgents(agentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load data',
          text: 'Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  const handleAgentChange = (applicationId, agentId) => {
    setSelectedAgents(prev => ({ ...prev, [applicationId]: agentId }));
  };

  const handleAssignAgent = async (applicationId) => {
    const agentId = selectedAgents[applicationId];
    if (!agentId) return;

    try {
      await axiosSecure.patch(`/applications/${applicationId}/assign-agent`, { agentId });
      setApplications(prev => prev.map(app =>
          app._id === applicationId ? { ...app, agentId, status: "Approved" } : app
      ));
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Agent assigned and application approved!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error assigning agent:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to assign agent. Please try again.'
      });
    }
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setRejectionFeedback('');
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    try {
      await axiosSecure.patch(`/applications/${rejectingId}/status`, {
        status: "Rejected",
        rejectionFeedback
      });
      setApplications(prev => prev.filter(app => app._id !== rejectingId));
      setRejectModalOpen(false);
      Swal.fire({ icon: 'success', title: 'Application Rejected', text: 'Feedback sent to user.', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to reject application. Please try again.' });
    }
  };

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
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-primary">
          Manage Insurance Applications
        </h2>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
          ) : applications.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-lg">
                No pending applications found.
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {application.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.policyName}</div>
                          <div className="text-sm text-gray-500">
                            ${application.coverage} coverage
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[application.status] || "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {application.status}
                      </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* View Button */}
                            <button
                                onClick={() => handleView(application._id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                title="View details"
                            >
                              <FaEye className="h-5 w-5" />
                            </button>

                            {/* Assign Agent Dropdown */}
                            <div className="relative inline-block">
                              <select
                                  value={selectedAgents[application._id] || ''}
                                  onChange={(e) => handleAgentChange(application._id, e.target.value)}
                                  className="block w-full pl-2 pr-8 py-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                  disabled={application.status === "Approved"}
                              >
                                <option value="">Select Agent</option>
                                {agents.map(agent => (
                                    <option key={agent._id} value={agent._id}>
                                      {agent.name}
                                    </option>
                                ))}
                              </select>
                              <button
                                  onClick={() => handleAssignAgent(application._id)}
                                  disabled={
                                      !selectedAgents[application._id] ||
                                      application.status === "Approved" ||
                                      application.status === "Active" ||
                                      application.status === "Rejected"
                                  }
                                  className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Assign agent"
                              >
                                <FaUserCheck className="inline mr-1" />
                                Assign
                              </button>

                            </div>

                            {/* Reject Button */}
                            <button
                                onClick={() => openRejectModal(application._id)}
                                disabled={application.status === "Rejected" || application.status === "Active"}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject application"
                            >
                              <FaTimesCircle className="h-5 w-5" />
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

        {/* Application Details Modal */}
        {modalOpen && selectedApplication && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={closeModal}
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Application Details
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries({
                            'Applicant Name': selectedApplication.name,
                            'Email': selectedApplication.email,
                            'Address': selectedApplication.address,
                            'NID/SSN': selectedApplication.nid,
                            'Policy Name': selectedApplication.policyName,
                            'Coverage': `$${selectedApplication.coverage}`,
                            'Premium': `$${selectedApplication.premium}`,
                            'Duration': selectedApplication.duration,
                            'Nominee Name': selectedApplication.nomineeName,
                            'Nominee Relation': selectedApplication.nomineeRelation,
                            'Health Disclosure': selectedApplication.healthDisclosure?.join(', ') || 'None',
                            'Status': selectedApplication.status,
                            'Created At': new Date(selectedApplication.createdAt).toLocaleString(),
                            'Agent': selectedApplication.agentId
                                ? agents.find(a => a._id === selectedApplication.agentId)?.name
                                : 'Not assigned'
                          }).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <p className="font-medium text-gray-500">{key}</p>
                                <p className="mt-1 text-gray-900">{value || '-'}</p>
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Rejection Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Rejection Feedback</h3>
              <textarea
                rows="4"
                value={rejectionFeedback}
                onChange={e => setRejectionFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="Enter reason for rejection..."
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >Cancel</button>
                <button
                  onClick={handleRejectSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default ManageApplications;