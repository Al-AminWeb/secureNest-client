import { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEye, FaUserCheck, FaTimesCircle } from "react-icons/fa";

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
    const axiosSecure = useAxiosSecure();

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
      setApplications((prev) => prev.map(app => app._id === applicationId ? { ...app, agentId } : app));
    } catch (error) {
      console.error("Error assigning agent:", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await axiosSecure.patch(`/applications/${applicationId}/status`, { status: "Rejected" });
      setApplications((prev) => prev.map(app => app._id === applicationId ? { ...app, status: "Rejected" } : app));
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
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
        </div>
    );
};

export default ManageApplications;
