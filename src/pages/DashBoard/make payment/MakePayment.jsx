import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdOutlinePolicy } from "react-icons/md";

const MakePayment = () => {
    const { id } = useParams();                   // this is the application ID
    console.log("[MakePayment] application id from URL:", id);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: application, isLoading } = useQuery({
        queryKey: ["application", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/${id}`);
            return res.data;
        },

    });
    console.log(id );
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

    // read the stored monthlyPayment
    const monthly = parseFloat(application.monthlyPayment);

    const handleStripePayment = () => {
        navigate(`/dashboard/stripe-payment/${application._id}`);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-blue-500 shadow-xl rounded-2xl p-6 sm:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
                    Payment for Policy
                </h2>

                {/* show policy name & monthly payment */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-lg">
                        <MdOutlinePolicy className="text-primary" />
                        <span>
              <strong>Policy:</strong> {application.policyName}
            </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                        <FaMoneyCheckAlt className="text-primary" />
                        <span>
              <strong>Monthly Payment:</strong> ৳{monthly.toFixed(2)}
            </span>
                    </div>
                </div>

                {/* total & proceed */}
                <div className="text-center">
                    <p className="mb-4 text-lg">
                        <strong>Total to Pay:</strong> ৳{monthly.toFixed(2)}
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
