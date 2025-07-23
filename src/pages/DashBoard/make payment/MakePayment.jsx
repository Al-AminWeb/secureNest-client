import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaMoneyCheckAlt, FaCalendarAlt } from "react-icons/fa";
import { MdOutlinePolicy } from "react-icons/md";

const MakePayment = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const [frequency, setFrequency] = useState("monthly");

    const { data: application, isLoading } = useQuery({
        queryKey: ["application", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/${id}`);
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!application) {
        return <p className="text-center text-red-500 mt-10">Application not found.</p>;
    }

    const premium = parseFloat(application.premium);
    const yearly = premium * 12 * 0.9;
    const total = frequency === "monthly" ? premium : yearly;

    const handleStripePayment = async () => {
        try {
            const res = await axiosSecure.post("/create-checkout-session", {
                amount: total,
                applicationId: id,
                email: application.email,
                frequency,
            });

            if (res.data?.url) {
                window.location.href = res.data.url;
            } else {
                alert("Something went wrong. Try again.");
            }
        } catch (err) {
            console.error("Stripe Payment Error:", err);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-blue-500 shadow-xl rounded-2xl p-6 sm:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
                    Payment for Policy
                </h2>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-lg">
                        <MdOutlinePolicy className="text-primary" />
                        <span><strong>Policy:</strong> {application.policyName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                        <FaMoneyCheckAlt className="text-primary" />
                        <span><strong>Base Premium:</strong> ${premium.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                        <FaCalendarAlt className="text-primary" />
                        <span><strong>Frequency:</strong> {frequency === "monthly" ? "Monthly" : "Yearly"}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Choose Payment Frequency:</label>
                    <select
                        className="select select-bordered w-full text-base"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                    >
                        <option value="monthly">Monthly - ${premium.toFixed(2)}</option>
                        <option value="yearly">Yearly (10% discount) - ${yearly.toFixed(2)}</option>
                    </select>
                </div>

                <div className="text-center">
                    <p className="mb-4 text-lg">
                        <strong>Total to Pay:</strong> ${total.toFixed(2)}
                    </p>
                    <button
                        onClick={handleStripePayment}
                        className="btn btn-primary btn-wide text-white text-lg"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MakePayment;
