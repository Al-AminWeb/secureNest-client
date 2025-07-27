import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosSecure.get("/users");
                // Filter out admin users - only show regular users and agents
                const filteredUsers = response.data.filter(user => user.role !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [axiosSecure]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axiosSecure.put(`/users/${userId}/role`, {
                role: newRole,
            });
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `${newRole} successfully assigned!`,
                    text: `User has been promoted/demoted to ${newRole}.`,
                });

                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, role: newRole } : user
                    )
                );
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to change role",
                text: "There was an error while updating the user role.",
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center mb-6 text-primary">
                Manage Users
            </h2>

            <div className="overflow-x-auto shadow-xl rounded-lg">
                <table className="min-w-full bg-white rounded-lg">
                    <thead>
                    <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 uppercase text-sm">
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Role</th>
                        <th className="py-3 px-4 text-left">Registered</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr
                            key={user._id}
                            className="border-b hover:bg-gray-100 transition-colors"
                        >
                            <td className="py-3 px-4 text-sm">{user.email}</td>
                            <td className="py-3 px-4 capitalize text-sm">{user.role}</td>
                            <td className="py-3 px-4 text-sm">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() =>
                                        handleRoleChange(
                                            user._id,
                                            user.role === "user" ? "agent" : "user"
                                        )
                                    }
                                    className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 ${
                                        user.role === "user"
                                            ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
                                            : "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700"
                                    }`}
                                >
                                    {user.role === "user"
                                        ? "Promote to Agent"
                                        : "Demote to User"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
