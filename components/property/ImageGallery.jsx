"use client";

import { useState, forwardRef } from 'react';
import { Button } from '@/components/ui/button';


const ImageGallery = forwardRef(
  ({ images }, ref) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
      <div id="photos" ref={ref} className="mb-8 rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 gap-2 h-96">
          <div className="col-span-2 row-span-2">
            <img
              src={images[currentImageIndex]}
              alt="Property main"
              className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
              onClick={() => setCurrentImageIndex(0)}
            />
          </div>
          {images.slice(1, 5).map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
                onClick={() => setCurrentImageIndex(index + 1)}
              />
              {index === 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-100">
                    Show all photos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery;