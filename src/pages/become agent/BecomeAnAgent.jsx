import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
// Update the path as needed
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth.jsx"; // Update the path as needed

const BecomeAnAgent = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();

    const mutation = useMutation({
        mutationFn: async (formData) => {
            const res = await axiosSecure.post("/agent-applications", formData);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Application Submitted!",
                text: "Our team will contact you soon.",
                confirmButtonColor: "#1ABC9C",
            });
            reset();
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Submission Failed!",
                text: "Please try again later.",
                confirmButtonColor: "#2C3E50",
            });
        },
    });

    const onSubmit = (data) => {
        const fullData = {
            ...data,
            name: user?.displayName,
            email: user?.email,
            status: "pending", // default status
        };
        mutation.mutate(fullData);
    };

    return (
        <div className="min-h-screen bg-[--color-background] px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-3xl  shadow-lg rounded-xl p-6 sm:p-10 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-[--color-primary]">
                    Become a SecureNest Agent
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block mb-1 font-medium text-[--color-primary]">Full Name</label>
                        <input
                            type="text"
                            value={user?.displayName || ""}
                            disabled
                            className="w-full input input-bordered border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium text-[--color-primary]">Email</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full input input-bordered border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block mb-1 font-medium text-[--color-primary]">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            {...register("phone", { required: true })}
                            className="w-full input input-bordered border-gray-300 rounded"
                        />
                    </div>

                    {/* NID */}
                    <div>
                        <label className="block mb-1 font-medium text-[--color-primary]">NID Number</label>
                        <input
                            type="text"
                            placeholder="National ID"
                            {...register("nid", { required: true })}
                            className="w-full input input-bordered border-gray-300 rounded"
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium text-[--color-primary]">Address</label>
                        <textarea
                            rows="3"
                            placeholder="Full residential address"
                            {...register("address", { required: true })}
                            className="w-full input input-bordered border-gray-300 rounded"
                        ></textarea>
                    </div>

                    {/* Experience */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium text-[--color-primary]">Experience</label>
                        <textarea
                            rows="3"
                            placeholder="Any experience in insurance, marketing, sales, etc."
                            {...register("experience")}
                            className="w-full input input-bordered border-gray-300 rounded"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-black px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BecomeAnAgent;
