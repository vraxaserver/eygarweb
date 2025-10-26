// app/properties/[id]/edit/components/ImagesDisplay.jsx
import React from 'react';
import Image from 'next/image'; // Recommended for Next.js image optimization

export default function ImagesDisplay({ images, coverImage }) {
    if (!images || images.length === 0) {
        return <div className="text-center text-gray-500 py-8">No images available for this property.</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Property Images (View Only)</h2>
            <p className="text-sm text-gray-600">Image uploads are not supported on this page.</p>

            {coverImage && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                    <Image
                        src={coverImage.image_url}
                        alt="Cover Image"
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        Cover Image
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                {images.map((imageSrc, index) => (
                    <div key={index} className="relative w-full h-32 rounded-md overflow-hidden shadow-sm">
                        <Image
                            src={imageSrc.image_url}
                            alt={`Property Image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
