import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios.jsx';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import useAuth from "../../../hooks/useAuth.jsx";
// Removed: import './UserReview.css';

// Explicitly register Swiper modules (for reliability)
import { Swiper as SwiperCore } from 'swiper';
SwiperCore.use([Navigation, Pagination, Autoplay]);

const UserReview = () => {
    const { user } = useAuth();
    const axiosInstance = useAxios();

    const { data: reviews = [], isLoading, error } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get('/reviews');
                return Array.isArray(res.data) ? res.data : [];
            } catch (error) {
                console.error('Error fetching reviews:', error);
                return [];
            }
        }
    });

    if (isLoading) return <div className="text-center py-12">Loading reviews...</div>;
    if (error) return <div className="text-center py-12">Error loading reviews</div>;
    if (!reviews.length) return <div className="text-center py-12">No reviews yet</div>;

    return (
        <section className="user-reviews py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Customer Reviews</h2>
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop
                        speed={900}
                        className="h-[350px] md:h-[400px] lg:h-[450px]"
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review._id}>
                                <ReviewCard reviewData={review} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

const ReviewCard = ({ reviewData }) => {
    const { name, review, policyName, user: userData } = reviewData;
    const { rating, feedback } = review || { rating: 0, feedback: '' };

    const userPhotoURL = userData?.photoURL;
    const displayName = name || userData?.name || 'Anonymous';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col border border-gray-100">
            <div className="flex items-center mb-4">
                <div className="avatar">
                    {userPhotoURL ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                                src={userPhotoURL}
                                alt={displayName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/48';
                                }}
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-200 text-gray-600 rounded-full w-12 h-12 flex items-center justify-center font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{displayName}</h3>
                    {policyName && <p className="text-sm text-gray-500">{policyName}</p>}
                </div>
            </div>

            <div className="mb-4">
                <Rating
                    style={{ maxWidth: 100 }}
                    value={parseInt(rating) || 0}
                    readOnly
                />
            </div>

            <p className="text-gray-700 flex-grow">{feedback || 'No feedback provided'}</p>
        </div>
    );
};

export default UserReview;