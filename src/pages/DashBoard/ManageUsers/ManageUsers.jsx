import {useState, useEffect} from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        // Fetch all users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await axiosSecure.get("/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [axiosSecure]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axiosSecure.put(`/users/${userId}/role`, {role: newRole});
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `${newRole} successfully assigned!`,
                    text: `User has been promoted/demoted to ${newRole}.`,
                });

                // Update the users list in the UI
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? {...user, role: newRole} : user
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
            <h2 className="text-3xl font-semibold mb-4 text-center">Manage Users</h2>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Role</th>
                    <th className="py-2 px-4 border">Registration Date</th>
                    <th className="py-2 px-4 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id} className="text-center">
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4 capitalize">{user.role}</td>
                        <td className="py-2 px-4">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 space-x-2">
                            <button
                                className="text-blue-600 hover:underline font-medium"
                                onClick={() => handleRoleChange(user._id, user.role === "user" ? "agent" : "user")}
                            >
                                {user.role === "user" ? "Promote to Agent" : "Demote to User"}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
