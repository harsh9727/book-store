"use client";

import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const reviews = [
  {
    id: 1,
    name: "Sarah J.",
    role: "Verified Buyer",
    review:
      "Great selection, fast shipping, and excellent customer service. My go-to bookstore!",
  },
  {
    id: 2,
    name: "Michael T.",
    role: "Verified Buyer",
    review:
      "Love the variety and the prices are unbeatable. Highly recommend!",
  },
  {
    id: 3,
    name: "Emily R.",
    role: "Verified Buyer",
    review:
      "The pre-order feature is amazing. I never miss a new release!",
  },
  {
    id: 4,
    name: "David M.",
    role: "Verified Buyer",
    review:
      "A wonderful collection of Christian books. The ordering process was simple and smooth.",
  },
  {
    id: 5,
    name: "Rachel P.",
    role: "Verified Buyer",
    review:
      "Excellent quality books and very quick delivery. I will definitely shop here again.",
  },
  {
    id: 6,
    name: "John K.",
    role: "Verified Buyer",
    review:
      "I found exactly what I was looking for. Great books, great service, and quick delivery.",
  },
];

const Reviews = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="bg-white py-14 md:py-16">
      <div className="container px-5 lg:px-8">

        {/* Section Header */}
        <div className="mb-9 text-center">
          <p className="description mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Customer Reviews
          </p>

          <h2 className="title text-3xl font-semibold text-gray-900 sm:text-4xl">
            What Our Customers Say
          </h2>

          <p className="description mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
            Discover what our readers and customers say about their
            experience with GTBS Book Store.
          </p>
        </div>

        {/* Reviews Slider */}
        <div className="relative">

          <Swiper
            
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            speed={700}
            // autoplay={{
            //   delay: 4000,
            //   disableOnInteraction: false,
            //   pauseOnMouseEnter: true,
            // }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (
                typeof swiper.params.navigation !== "boolean" &&
                swiper.params.navigation
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <div className="group flex h-full min-h-[235px] flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out  hover:border-orange-200 hover:shadow-[0_12px_35px_rgba(249,115,22,0.10)]">

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={17}
                        strokeWidth={0}
                        className="fill-orange-500 text-orange-500"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="description mt-5 text-sm leading-6 text-gray-600">
                    &quot;{review.review}&quot;
                  </p>

                  {/* Customer */}
                  <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-5">

                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-semibold text-orange-600">
                      {review.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="title text-[15px] font-semibold text-gray-900">
                        {review.name}
                      </h3>

                      <p className="description mt-0.5 text-xs text-gray-400">
                        {review.role}
                      </p>
                    </div>

                    {/* Quote */}
                    <Quote
                      size={27}
                      strokeWidth={1.5}
                      className="ml-auto text-orange-100 transition-colors duration-300 group-hover:text-orange-200"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Previous Button */}
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous reviews"
            className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-all duration-300 hover:border-orange-600 hover:bg-orange-600 hover:text-white lg:flex"
          >
            <ChevronLeft size={19} />
          </button>

          {/* Next Button */}
          <button
            ref={nextRef}
            type="button"
            aria-label="Next reviews"
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-all duration-300 hover:border-orange-600 hover:bg-orange-600 hover:text-white lg:flex"
          >
            <ChevronRight size={19} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="mt-6 flex justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => prevRef.current?.click()}
            aria-label="Previous reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-300 hover:border-orange-600 hover:bg-orange-600 hover:text-white"
          >
            <ChevronLeft size={17} />
          </button>

          <button
            type="button"
            onClick={() => nextRef.current?.click()}
            aria-label="Next reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-300 hover:border-orange-600 hover:bg-orange-600 hover:text-white"
          >
            <ChevronRight size={17} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Reviews;