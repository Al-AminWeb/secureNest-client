import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllPolicies = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['allPolicies', page, category, search],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/policies?page=${page}&category=${category}&search=${search}`
            );
            return res.data;
        },
        keepPreviousData: true,
    });

    const handleCardClick = (policyId) => {
        navigate(`/policies/${policyId}`);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };


    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (isLoading) return <p className="text-center py-10 text-xl">Loading policies...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Failed to load policies.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">All Policies</h1>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className="border p-2 rounded-md w-full sm:w-1/3"
                />

                {/* Category Filter */}
                <select
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
                    disabled={page >= data?.totalPages}
                    className="px-4 py-2 bg-accent text-white rounded-md"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllPolicies;
