import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../index.css';
import { Pagination } from 'swiper/modules';
import slider1 from '../../assets/slider 1.jpg';
import slider2 from '../../assets/slider 2.jpg';
import slider3 from '../../assets/slider 3.jpg';

const Banner = () => {
    return (
        <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
            <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="h-full"
            >
                {[slider1, slider2, slider3].map((slide, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={slide}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;
