import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../../hooks/useAxios.jsx';
import { FaStar, FaUsers, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

const PopularPolicies = () => {
    const axiosInstance = useAxios();

    const { data: popularPolicies = [], isLoading, error } = useQuery({
        queryKey: ['popularPolicies'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get('/policies/popular');
                console.log('Popular policies:', res.data);
                return res.data;
            } catch (error) {
                console.error('Error fetching popular policies:', error);
                return [];
            }
        }
    });

    if (isLoading) {
        return (
            <div className="my-12 px-4 md:px-8 lg:px-12">
                <h2 className="text-3xl font-bold text-center mb-8">Popular Policies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-12 px-4 md:px-8 lg:px-12">
                <h2 className="text-3xl font-bold text-center mb-8">Popular Policies</h2>
                <div className="text-center text-red-500">
                    Error loading popular policies. Please try again later.
                </div>
            </div>
        );
    }

    if (!popularPolicies.length) {
        return (
            <div className="my-12 px-4 md:px-8 lg:px-12">
                <h2 className="text-3xl font-bold text-center mb-8">Popular Policies</h2>
                <div className="text-center text-gray-500">
                    No popular policies available at the moment.
                </div>
            </div>
        );
    }

    return (
        <div className="my-12 px-4 md:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Policies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPolicies.map((policy) => (
                    <PolicyCard key={policy._id} policy={policy} />
                ))}
            </div>
        </div>
    );
};

const PolicyCard = ({ policy }) => {
    const {
        _id,
        title,
        coverage_range,
        duration,
        base_premium,
        purchaseCount = 0,
        image,
        category
    } = policy;

    // Calculate popularity badge
    const getPopularityBadge = (count) => {
        if (count >= 10) return { text: 'Very Popular', color: 'bg-red-500' };
        if (count >= 5) return { text: 'Popular', color: 'bg-orange-500' };
        if (count >= 2) return { text: 'Trending', color: 'bg-yellow-500' };
        return { text: 'New', color: 'bg-green-500' };
    };

    const popularity = getPopularityBadge(purchaseCount);

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Policy Image */}
            {image && (
                <div className="h-48 overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            
            {/* Policy Content */}
            <div className="p-6">
                {/* Title and Popularity Badge */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1 pr-2" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {title}
                    </h3>
                    <span className={`${popularity.color} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
                        {popularity.text}
                    </span>
                </div>

                {/* Category */}
                <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {category}
                    </span>
                </div>

                {/* Policy Details */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                        <FaShieldAlt className="mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Coverage:</span>
                        <span className="ml-2 text-sm">{coverage_range}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2 text-green-500" />
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="ml-2 text-sm">{duration}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                        <FaUsers className="mr-2 text-purple-500" />
                        <span className="text-sm font-medium">Purchased:</span>
                        <span className="ml-2 text-sm">{purchaseCount} times</span>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="text-2xl font-bold text-primary">
                        ৳{base_premium}
                    </div>
                    <div className="text-sm text-gray-500">Base Premium</div>
                </div>

                {/* CTA Button */}
                <Link
                    to={`/policies/${_id}`}
                    className="block w-full bg-primary text-white text-center py-3 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300 font-medium"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default PopularPolicies; 