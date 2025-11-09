"use client";

import { useState, forwardRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageGallery = forwardRef(({ images }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Return null or a placeholder if there are no images to display
  if (!images || images.length === 0) {
    return (
      <div
        ref={ref}
        className="h-[400px] bg-gray-200 rounded-xl flex items-center justify-center"
      >
        <p className="text-gray-500">No images available.</p>
      </div>
    );
  }

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div id="photos" ref={ref} className="relative group mb-6">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={8}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            // For tablets
            768: {
              slidesPerView: 2,
            },
            // For desktops
            1024: {
              slidesPerView: 3,
            },
          }}
          className="h-[400px] rounded-xl"
        >
          {images.map((img, index) => (
            <SwiperSlide
              key={index}
              onClick={() => openModal(index)}
              className="cursor-pointer overflow-hidden rounded-lg"
            >
              <Image
                src={img.image_url} // Assuming `images` is an array of URL strings
                alt={`Property view ${index + 1}`}
                fill
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            variant="secondary"
            className="font-semibold"
            onClick={() => openModal(0)}
          >
            Show all photos
          </Button>
        </div>
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b">
            <button
              onClick={closeModal}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              {selectedImageIndex + 1} / {images.length}
            </span>
            <div className="w-9" /> {/* Spacer */}
          </div>

          {/* Image Container with Navigation */}
          <div className="flex-grow relative flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
              {/* Previous Button */}
              {selectedImageIndex > 0 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-0 sm:left-4 z-10 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <Image
                src={images[selectedImageIndex].image_url}
                alt={`Property view ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
              />

              {/* Next Button */}
              {selectedImageIndex < images.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-0 sm:right-4 z-10 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex-shrink-0 bg-white border-t p-4">
            <div className="max-w-7xl mx-auto">
              <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={4}
                navigation
                breakpoints={{
                  640: { slidesPerView: 6 },
                  768: { slidesPerView: 8 },
                  1024: { slidesPerView: 10 },
                  1280: { slidesPerView: 12 },
                }}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <button
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-full h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                        index === selectedImageIndex
                          ? "border-gray-900"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ImageGallery.displayName = "ImageGallery";

export default ImageGallery;