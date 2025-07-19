import { useForm } from 'react-hook-form';
import useAxios from "../../../hooks/useAxios.jsx";
import Swal from 'sweetalert2';
import useAuth from "../../../hooks/useAuth.jsx";

const CreateBlog = () => {
    const { user } = useAuth();  // Get the logged-in user's data (which includes displayName)
    const axiosInstance = useAxios();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const blogData = {
            ...data,
            author: user?.displayName, // Get the author's displayName from the user object
            publishDate: new Date().toISOString(),
        };

        try {
            const res = await axiosInstance.post('/blogs', blogData); // Send blog data to the backend
            if (res.status === 201 || res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Blog Published!",
                    text: "Your blog has been published successfully.",
                    background: "#e0f9e6", // Light green background
                    confirmButtonColor: "#28a745", // Green button color
                });
                reset(); // Reset the form after submission
            }
        } catch (error) {
            console.error("Error creating blog:", error);
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "Something went wrong. Please try again.",
                background: "#f8d7da", // Light red background
                confirmButtonColor: "#dc3545", // Red button color
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-lg rounded-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">Create a New Blog</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Title Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Blog Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="input input-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                {/* Content Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        {...register('content', { required: 'Content is required' })}
                        className="textarea textarea-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                    />
                    {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="btn bg-primary text-white hover:bg-primary/90 w-full mt-6 p-3 rounded-md shadow-lg"
                    >
                        Publish Blog
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
