import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth.jsx";

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', publishDate: '' });
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Fetch blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axiosSecure.get('/blogs');
                setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, [axiosSecure]);

    // Delete blog
    const handleDeleteBlog = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This blog will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/blogs/${id}`);
                setBlogs(prev => prev.filter(blog => blog._id !== id));
                Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Could not delete blog.', 'error');
            }
        }
    };

    // Open edit modal
    const handleEditBlog = (blog) => {
        setEditingBlog(blog);
        setEditModalOpen(true);
    };

    // Submit update
    const handleUpdateBlog = async () => {
        try {
            const { _id, title, content } = editingBlog;
            await axiosSecure.patch(`/blogs/${_id}`, { title, content });

            setBlogs(prev =>
                prev.map(blog =>
                    blog._id === _id ? { ...blog, title, content } : blog
                )
            );

            setEditModalOpen(false);
            Swal.fire('Updated!', 'Blog updated successfully.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update blog.', 'error');
        }
    };

    // Add blog
    const handleAddBlog = async () => {
        try {
            const { title, content, publishDate } = newBlog;
            if (!title || !content || !publishDate) {
                Swal.fire('Error', 'All fields are required.', 'error');
                return;
            }
            const author = user?.displayName || user?.name || user?.email || 'Unknown';
            const response = await axiosSecure.post('/blogs', { title, author, content, publishDate });
            setBlogs(prev => [response.data.blog, ...prev]);
            setAddModalOpen(false);
            setNewBlog({ title: '', content: '', publishDate: '' });
            Swal.fire('Success', 'Blog added successfully.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to add blog.', 'error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-white shadow rounded-lg">
            <h2 className="text-3xl font-semibold text-center text-primary mb-8">Manage Blogs</h2>
            <div className="flex justify-end mb-4">
                <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                    onClick={() => setAddModalOpen(true)}
                >
                    Add Blog
                </button>
            </div>

            {/* Blog Table */}
            <div className="overflow-x-auto bg-white rounded-md shadow">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-accent text-white uppercase">
                    <tr>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Author</th>
                        <th className="py-3 px-4">Content</th>
                        <th className="py-3 px-4">Publish Date</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <tr key={blog._id} className="hover:bg-gray-100">
                                <td className="py-2 px-4">{blog.title}</td>
                                <td className="py-2 px-4 capitalize">{blog.author}</td>
                                <td className="py-2 px-4">{blog.content.slice(0, 60)}...</td>
                                <td className="py-2 px-4">
                                    {new Date(blog.publishDate || blog.date).toLocaleDateString("en-GB")}
                                </td>
                                <td className="py-2 px-4 space-x-2">
                                    <button
                                        onClick={() => handleEditBlog(blog)}
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
                            <td colSpan="5" className="text-center py-4 text-gray-500">
                                No blogs available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editModalOpen && editingBlog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg relative">
                        <h3 className="text-2xl font-semibold mb-4 text-center">Edit Blog</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded"
                                value={editingBlog.title}
                                onChange={(e) =>
                                    setEditingBlog({ ...editingBlog, title: e.target.value })
                                }
                                placeholder="Blog Title"
                            />
                            <textarea
                                rows={5}
                                className="w-full px-4 py-2 border rounded"
                                value={editingBlog.content}
                                onChange={(e) =>
                                    setEditingBlog({ ...editingBlog, content: e.target.value })
                                }
                                placeholder="Blog Content"
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-primary text-white rounded"
                                    onClick={handleUpdateBlog}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Blog Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg relative">
                        <h3 className="text-2xl font-semibold mb-4 text-center">Add New Blog</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded"
                                value={newBlog.title}
                                onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                                placeholder="Blog Title"
                            />
                            <textarea
                                rows={5}
                                className="w-full px-4 py-2 border rounded"
                                value={newBlog.content}
                                onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                                placeholder="Blog Content"
                            />
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded"
                                value={newBlog.publishDate}
                                onChange={e => setNewBlog({ ...newBlog, publishDate: e.target.value })}
                                placeholder="Publish Date"
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded"
                                    onClick={() => setAddModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-primary text-white rounded"
                                    onClick={handleAddBlog}
                                >
                                    Add Blog
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBlogs;
