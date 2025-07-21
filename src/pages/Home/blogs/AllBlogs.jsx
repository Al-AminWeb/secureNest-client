import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useAxios from '../../../hooks/useAxios';

const cardColors = [
  'bg-gradient-to-br from-primary to-accent',
  'bg-gradient-to-br from-accent to-secondary',
  'bg-gradient-to-br from-secondary to-primary',
];

const getSummary = (content) => {
  if (!content) return '';
  const words = content.split(' ');
  return words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');
};

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get('/blogs');
        setBlogs(res.data);
      } catch (error) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [axiosInstance]);

  const handleGoToDetails = (id) => {
    navigate(`/blogs/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">All Blogs</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div
              key={blog._id}
              className={`rounded-xl shadow-lg overflow-hidden text-white flex flex-col ${cardColors[idx % cardColors.length]} transition-transform hover:scale-105`}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover object-center"
                />
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 truncate">{blog.title}</h3>
                <p className="mb-2 text-sm opacity-90">{getSummary(blog.content)}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white text-primary font-semibold px-3 py-1 rounded-full text-xs">{blog.author}</span>
                </div>
                <div className="text-xs text-white/80 mb-2">
                  {new Date(blog.publishDate || blog.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs mb-4">Visits: <span className="font-bold">{blog.totalVisit || 0}</span></div>
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={() => handleGoToDetails(blog._id)}
                    className="inline-block bg-white text-primary font-semibold px-4 py-2 rounded-lg shadow hover:bg-primary hover:text-white transition"
                  >
                    Read more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
