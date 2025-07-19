import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Custom hook to use axios securely

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Fetch blogs based on user role
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axiosSecure.get('/blogs'); // Fetch blogs from the backend
                setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, [axiosSecure]);

    // Delete a blog
    const handleDeleteBlog = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this blog!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/blogs/${id}`);
                    Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
                    setBlogs(blogs.filter(blog => blog._id !== id)); // Update the local state
                } catch (error) {
                    Swal.fire('Error!', 'Something went wrong. Try again later.', 'error');
                }
            }
        });
    };

    // Edit a blog (navigate to the edit page or open a modal)
    const handleEditBlog = (id) => {
        navigate(`/dashboard/manage-blogs/edit/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-white shadow-sm rounded-lg">
            <h2 className="text-3xl font-semibold text-center text-primary mb-8">Manage Blogs</h2>

            {/* Add Blog Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate('/dashboard/manage-blogs/create')}
                    className="bg-accent text-white px-6 py-2 rounded-md shadow-md hover:bg-teal-600 transition"
                >
                    + Add New Blog
                </button>
            </div>

            {/* Blogs Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full table-auto text-sm text-gray-700">
                    <thead className="bg-accent text-white text-sm uppercase tracking-wide">
                    <tr>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Author</th>
                        <th className="py-3 px-4">Publish Date</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <tr key={blog._id} className="hover:bg-gray-50 transition">
                                <td className="py-2 px-4">{blog.title}</td>
                                <td className="py-2 px-4 capitalize">{blog.author}</td>
                                <td className="py-2 px-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <button
                                        onClick={() => handleEditBlog(blog._id)}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBlog(blog._id)}
                                        className="text-red-600 hover:underline font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-4 text-center text-gray-500">No blogs available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBlogs;
