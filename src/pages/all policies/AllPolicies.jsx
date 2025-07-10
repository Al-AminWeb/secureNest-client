import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllPolicies = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [page, setPage] = useState(1); // Current page state
    const [category, setCategory] = useState(''); // State for selected category
    const [order, setOrder] = useState('asc'); // State for sorting order (ascending/descending)

    // Fetch data using TanStack Query with pagination and sorting
    const { data, isLoading, isError } = useQuery({
        queryKey: ['allPolicies', page, category, , order],  // Include sort params in query key
        queryFn: async () => {
            const res = await axiosSecure.get(`/policies?page=${page}&category=${category}&sortBy=&order=${order}`);
            return res.data;
        },
        keepPreviousData: true, // Keep previous data while new data is loading
    });

    const handleCardClick = (policyId) => {
        navigate(`/policies/${policyId}`); // Navigate to Policy Details page
    };

    // Handle category change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);  // Reset to the first page when category changes
    };

    // Handle sort field change


    // Handle sort order change
    const handleOrderChange = (e) => {
        setOrder(e.target.value);
        setPage(1);  // Reset to the first page when order changes
    };

    // Change page handler
    const handlePageChange = (newPage) => {
        setPage(newPage); // Update the page state
    };

    if (isLoading) return <p className="text-center py-10 text-xl">Loading policies...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Failed to load policies.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">All Policies</h1>

            {/* Category Filter */}
            <div className="mb-6">
                <label htmlFor="category" className="mr-4">Filter by Category: </label>
                <select
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className="border p-2 rounded-md"
                >
                    <option value="">All Categories</option>
                    <option value="term_life">Term Life</option>
                    <option value="senior">Senior Plan</option>
                    <option value="disability">Disability</option>
                    <option value="health">Health</option>
                </select>
            </div>

            {/* Sorting */}

            {/* Policies Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {data?.policies.map((policy) => (
                    <div
                        key={policy._id}
                        onClick={() => handleCardClick(policy._id)}
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

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-accent text-white rounded-md"
                >
                    Prev
                </button>
                <span className="mx-4">{page}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={data?.currentPage === data?.totalPages}
                    className="px-4 py-2 bg-accent text-white rounded-md"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllPolicies;
