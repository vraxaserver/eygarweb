"use client";

import { useState, forwardRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ImageGallery = forwardRef(({ images }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Ensure we have at least 5 images for the layout
  const displayImages = images.slice(0, 5);

  return (
    <>
      <div id="photos" ref={ref} className="mb-6">
        <div className="grid grid-cols-4 gap-2 h-[400px] rounded-xl overflow-hidden">
          {/* Main large image - left side */}
          <div
            className="col-span-2 row-span-2 cursor-pointer relative group"
            onClick={() => openModal(0)}
          >
            <Image
              src={displayImages[0]}
              alt="Property main view"
              fill={true}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
          </div>

          {/* Top right images */}
          {displayImages.slice(1, 5).map((img, index) => (
            <div
              key={index}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openModal(index + 1)}
            >
              <Image
                src={img}
                alt={`Property view ${index + 2}`}
                fill={true}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />

              {/* Show all photos button on last image */}
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-gray-50 text-gray-900 font-semibold border-gray-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(0);
                    }}
                  >
                    Show all photos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-white border-b">
            <button
              onClick={closeModal}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              {selectedImageIndex + 1} / {images.length}
            </span>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>

          {/* Image Container */}
          <div className="h-full flex items-center justify-center pt-20 pb-6 px-6">
            <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
              <Image
                src={images[selectedImageIndex]}
                alt={`Property view ${selectedImageIndex + 1}`}
                fill={true}
                className="max-h-full max-w-full object-contain"
              />

              {/* Navigation Buttons */}
              {selectedImageIndex > 0 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {selectedImageIndex < images.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail Strip at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="flex gap-2 overflow-x-auto max-w-7xl mx-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? "border-gray-900"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill={true}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ImageGallery.displayName = "ImageGallery";

export default ImageGallery;