import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../index.css';
import { Pagination, Autoplay } from 'swiper/modules';
import slider4 from '../../assets/slider-4.jpg';
import slider2 from '../../assets/slider-2.jpg';
import slider3 from '../../assets/slider-3.jpg';
import slider1 from '../../assets/slider-1.jpg';
import { Link } from 'react-router';

const slides = [
    {
        image: slider1,
        heading: 'Secure Your Tomorrow Today',
        tagline: 'Protect your family and future with our trusted insurance plans.',
    },
    {
        image: slider2,
        heading: 'Peace of Mind, Guaranteed',
        tagline: 'Comprehensive coverage for every stage of life.',
    },
    {
        image: slider3,
        heading: 'Your Safety, Our Priority',
        tagline: 'Affordable premiums. Reliable support. Always here for you.',
    },
    {
        image: slider4,
        heading: 'Plan Ahead, Live Confidently',
        tagline: 'Get a free quote and start your journey to security.',
    },
];

const Banner = () => {
    return (
        <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] relative">
            <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination, Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                speed={900}
                className="h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center">
                            {/* Background Image */}
                            <img
                                src={slide.image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover object-center select-none pointer-events-none"
                                style={{ aspectRatio: '16/7', minHeight: '100%', minWidth: '100%' }}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-4 animate-fade-in">
                                    {slide.heading}
                                </h1>
                                <p className="text-base md:text-xl lg:text-2xl text-white font-medium mb-6 drop-shadow-md animate-fade-in delay-100">
                                    {slide.tagline}
                                </p>
                                <Link
                                    to="/quote"
                                    className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-300 animate-fade-in delay-200"
                                >
                                    Get a Free Quote
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;
