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
    const [sortOption, setSortOption] = useState('default'); // New state for sorting
    const [sortedPolicies, setSortedPolicies] = useState([]);

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

    // Apply sorting when data or sort option changes
    useEffect(() => {
        if (data?.policies) {
            let sorted = [...data.policies];

            switch(sortOption) {
                case 'premium-asc':
                    sorted.sort((a, b) => a.base_premium - b.base_premium);
                    break;
                case 'premium-desc':
                    sorted.sort((a, b) => b.base_premium - a.base_premium);
                    break;
                case 'title-asc':
                    sorted.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'title-desc':
                    sorted.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                default:
                    // Default sorting (as returned from API)
                    break;
            }

            setSortedPolicies(sorted);
        }
    }, [data, sortOption]);

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

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    if (isLoading) return <p className="text-center py-10 text-xl">Loading policies...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Failed to load policies.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">All Policies</h1>

            {/* Search, Filters, and Sorting */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

                {/* Sorting Controls */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="border p-2 rounded-md text-sm"
                    >
                        <option value="default">Default</option>
                        <option value="premium-asc">Premium (Low to High)</option>
                        <option value="premium-desc">Premium (High to Low)</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                    </select>
                </div>
            </div>

            {/* Policies Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {sortedPolicies.map((policy) => (
                    <div
                        key={policy._id}
                        onClick={() => handleCardClick(policy._id)}
                        className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition h-full flex flex-col"
                    >
                        <img
                            src={policy.image}
                            alt={policy.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex-grow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{policy.title}</h2>
                            <span className="text-sm text-accent font-medium uppercase">{policy.category}</span>
                            <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                                {policy.description}
                            </p>
                        </div>
                        <div className="px-4 pb-4">
                            <p className="text-sm font-medium">
                                Base Premium: {policy.base_premium}% of coverage
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
                    className="px-4 py-2 bg-accent text-white rounded-md disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="mx-4 flex items-center">{page} of {data?.totalPages}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= data?.totalPages}
                    className="px-4 py-2 bg-accent text-white rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllPolicies;