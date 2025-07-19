import { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Assuming you are using useAxiosSecure

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        // Fetch all applications when the component mounts
        const fetchApplications = async () => {
            try {
                const response = await axiosSecure.get("/applications"); // No email query needed for admin
                setApplications(response.data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, [axiosSecure]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-semibold mb-4 text-center">Manage Insurance Applications</h2>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Applicant Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Policy Name</th>
                    <th className="py-2 px-4 border">Application Date</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {applications.map((application) => (
                    <tr key={application._id} className="text-center">
                        <td className="py-2 px-4">{application.name}</td>
                        <td className="py-2 px-4">{application.email}</td>
                        <td className="py-2 px-4">{application.policyName}</td>
                        <td className="py-2 px-4">
                            {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">{application.status}</td>
                        <td className="py-2 px-4">
                            <button className="text-blue-600 hover:underline font-medium">
                                View Details
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageApplications;
