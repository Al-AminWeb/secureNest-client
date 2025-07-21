import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import useAxios from '../../../hooks/useAxios';

const BlogDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    let timer;
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/blogs/${id}`);
        setBlog(res.data);
        setVisitCount(res.data.totalVisit || 0);
        // After 5 seconds, increment visit count
        timer = setTimeout(async () => {
          try {
            const patchRes = await axiosInstance.patch(`/blogs/${id}/visit`);
            setVisitCount(patchRes.data.totalVisit);
          } catch (err) {}
        }, 5000);
      } catch (error) {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    return () => clearTimeout(timer);
  }, [axiosInstance, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center text-gray-500 py-10">Blog not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/blogs" className="text-primary hover:underline mb-4 inline-block">
        &larr; Back to Blogs
      </Link>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-80 object-cover object-center rounded-t-xl"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-semibold text-primary mb-4 text-center">{blog.title}</h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="bg-accent text-white font-semibold px-4 py-2 rounded-full text-sm">
              {blog.author}
            </span>
          </div>
          <div className="text-center mb-4 text-gray-500">
            <p className="text-sm">
              <strong>Published:</strong>{' '}
              {new Date(blog.publishDate || blog.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <strong>Total Visits:</strong> <span className="font-bold">{visitCount}</span>
            </p>
          </div>
          <div className="text-gray-700 text-lg">
            <p>{blog.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
