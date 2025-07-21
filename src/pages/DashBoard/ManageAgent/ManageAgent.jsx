import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FaUserCheck, FaUserTimes, FaUserSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const ManageAgent = () => {
    const axiosSecure = useAxiosSecure();
    const [pendingAgents, setPendingAgents] = useState([]);
    const [currentAgents, setCurrentAgents] = useState([]);

    const fetchPendingAgents = async () => {
        try {
            const res = await axiosSecure.get('/agent-applications?status=pending');
            setPendingAgents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCurrentAgents = async () => {
        try {
            const res = await axiosSecure.get('/users?role=agent');
            setCurrentAgents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPendingAgents();
        fetchCurrentAgents();
    }, []);

    const handleApprove = async (email, applicationId) => {
        try {
            const res = await axiosSecure.patch(`/users/promote/${email}`);
            const del = await axiosSecure.delete(`/agent-applications/${applicationId}`);
            if (res.data.modifiedCount > 0 && del.data.deletedCount > 0) {
                Swal.fire('Approved', 'User promoted to Agent!', 'success');
                fetchPendingAgents();
                fetchCurrentAgents();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (applicationId) => {
        try {
            const res = await axiosSecure.delete(`/agent-applications/${applicationId}`);
            if (res.data.deletedCount > 0) {
                Swal.fire('Rejected', 'Agent application removed.', 'info');
                fetchPendingAgents();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDemote = async (email) => {
        try {
            const res = await axiosSecure.patch(`/users/demote/${email}`);
            if (res.data.modifiedCount > 0) {
                Swal.fire('Demoted', 'Agent demoted to customer.', 'info');
                fetchCurrentAgents();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            <h2 className="text-3xl font-bold text-center mb-6 text-primary">Manage Agents</h2>

            <Tab.Group>
                <Tab.List className="flex space-x-4 bg-gray-100 p-2 rounded-lg justify-center">
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'px-4 py-2 text-sm font-medium rounded',
                                selected
                                    ? 'bg-accent text-white shadow'
                                    : 'text-gray-600 hover:bg-gray-200'
                            )
                        }
                    >
                        Pending Applications
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'px-4 py-2 text-sm font-medium rounded',
                                selected
                                    ? 'bg-accent text-white shadow'
                                    : 'text-gray-600 hover:bg-gray-200'
                            )
                        }
                    >
                        All Current Agents
                    </Tab>
                </Tab.List>

                <Tab.Panels className="mt-6">
                    {/* Pending Applications */}
                    <Tab.Panel>
                        {pendingAgents.length === 0 ? (
                            <p className="text-center text-gray-500">No pending applications.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingAgents.map(app => (
                                    <div key={app._id} className="bg-white p-5 rounded-xl shadow border border-gray-100">
                                        <h3 className="text-lg font-semibold text-primary mb-2">{app.name}</h3>
                                        <p><strong>Email:</strong> {app.email}</p>
                                        <p><strong>Phone:</strong> {app.phone}</p>
                                        <p><strong>Address:</strong> {app.address}</p>
                                        <p><strong>NID:</strong> {app.nid}</p>
                                        <p><strong>Experience:</strong> {app.experience}</p>

                                        <div className="flex gap-4 mt-4">
                                            <button
                                                onClick={() => handleApprove(app.email, app._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
                                            >
                                                <FaUserCheck /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(app._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-1"
                                            >
                                                <FaUserTimes /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Tab.Panel>

                    {/* All Current Agents */}
                    <Tab.Panel>
                        {currentAgents.length === 0 ? (
                            <p className="text-center text-gray-500">No agents found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentAgents.map(agent => (
                                    <div key={agent._id} className="bg-white p-5 rounded-xl shadow border border-gray-100">
                                        <h3 className="text-lg font-semibold text-primary mb-2">{agent.name}</h3>
                                        <p><strong>Email:</strong> {agent.email}</p>
                                        <p><strong>Role:</strong> {agent.role}</p>
                                        <button
                                            onClick={() => handleDemote(agent.email)}
                                            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-1"
                                        >
                                            <FaUserSlash /> Demote
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default ManageAgent;
