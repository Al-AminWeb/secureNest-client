import { useSwiper } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios.jsx';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import useAuth from "../../../hooks/useAuth.jsx";

const UserReview = () => {
    const { user } = useAuth();
    const axiosInstance = useAxios();

    // Fetch reviews data using dedicated reviews endpoint with fallback
    const { data: reviews = [], isLoading, error } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            try {
                // First test if server is reachable
                const testRes = await axiosInstance.get('/test');
                console.log('Server test response:', testRes.data);
                
                // Try the dedicated reviews endpoint first
                const res = await axiosInstance.get('/reviews');
                console.log('Reviews data from /reviews:', res.data); // Debug log
                
                // Ensure we always return an array
                if (Array.isArray(res.data)) {
                    return res.data;
                } else {
                    console.error('Reviews data is not an array:', res.data);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching from /reviews, trying fallback:', error);
                
                // Fallback to applications endpoint
                try {
                    const fallbackRes = await axiosInstance.get('/applications');
                    console.log('Fallback applications data:', fallbackRes.data);
                    
                    // Filter for applications with reviews
                    const reviewsWithData = fallbackRes.data.filter(app => 
                        app.review && 
                        app.review.rating && 
                        app.review.feedback &&
                        app.paymentStatus === 'Paid'
                    );
                    
                    console.log('Filtered reviews from fallback:', reviewsWithData);
                    return reviewsWithData;
                } catch (fallbackError) {
                    console.error('Fallback also failed:', fallbackError);
                    return [];
                }
            }
        }
    });

    if (isLoading) return <div className="text-center">Loading reviews...</div>;
    if (error) return <div className="text-center">Error loading reviews: {error.message}</div>;
    if (!Array.isArray(reviews) || !reviews.length) return <div className="text-center">No reviews yet</div>;

    return (
        <div className="my-12 px-4 md:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }}
                className="py-8"
            >
                {reviews.slice(0, 5).map((reviewData) => (
                    <SwiperSlide key={reviewData._id}>
                        <ReviewCard reviewData={reviewData} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const ReviewCard = ({ reviewData }) => {
    const { user } = useAuth();
    const { name, review, policyName, user: userData } = reviewData;
    const { rating, feedback } = review;

    // Get user photo URL from the user data if available
    const userPhotoURL = userData?.photoURL;
    const displayName = name || userData?.name || 'Anonymous';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center mb-4">
                <div className="avatar placeholder">
                    {userPhotoURL ? (
                        <div className="w-12 h-12 rounded-full">
                            <img src={userPhotoURL} alt={displayName} className="w-full h-full rounded-full object-cover" />
                        </div>
                    ) : (
                        <div className="bg-neutral text-neutral-content rounded-full w-12 h-12 flex items-center justify-center">
                            <span className="text-xl">
                                {displayName?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}
                </div>
                <div className="ml-4">
                    <h3 className="font-semibold">{displayName}</h3>
                    <p className="text-sm text-gray-500">{policyName}</p>
                </div>
            </div>

            <div className="mb-4">
                <Rating
                    style={{ maxWidth: 100 }}
                    value={parseInt(rating)}
                    readOnly
                />
            </div>

            <p className="text-gray-700 flex-grow">{feedback}</p>
        </div>
    );
};

export default UserReview;