import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllPolicies = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: policies = [], isLoading, isError } = useQuery({
        queryKey: ["allPolicies"],
        queryFn: async () => {
            const res = await axiosSecure.get("/policies");
            return res.data;
        },
    });

    if (isLoading) return <p className="text-center py-10 text-xl">Loading policies...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Failed to load policies.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">All Policies</h1>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {policies.map((policy) => (
                    <div
                        key={policy._id}
                        onClick={() => navigate(`/policies/${policy._id}`)}
                        className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
                    >
                        <img
                            src={policy.image}
                            alt={policy.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{policy.title}</h2>
                            <span className="text-sm text-accent font-medium uppercase">{policy.category}</span>
                            <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                                {policy.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPolicies;
