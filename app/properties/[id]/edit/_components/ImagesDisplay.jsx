import React from 'react';
import Image from 'next/image';

export default function ImagesDisplay({ 
    existingImages, 
    newImages, 
    onAddImages, 
    onRemoveExistingImage, 
    onRemoveNewImage 
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manage Images</h2>
            
            {/* Upload Section */}
            <div className="bg-gray-50 p-4 rounded-md border-2 border-dashed border-gray-300 text-center">
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-blue-600 hover:text-blue-500">Upload new images</span>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                    <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        accept="image/*"
                        onChange={onAddImages}
                    />
                </label>
            </div>

            {/* Existing Images */}
            {existingImages && existingImages.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Current Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {existingImages.map((image) => (
                            <div key={image.id} className="relative h-32 rounded-md overflow-hidden shadow-sm group">
                                <Image
                                    src={image.image_url}
                                    alt="Property"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveExistingImage(image.id)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Images Preview */}
            {newImages && newImages.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">New Images to Upload</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {newImages.map((file, index) => (
                            <div key={index} className="relative h-32 rounded-md overflow-hidden shadow-sm group border-2 border-green-400">
                                {/* Create local preview URL */}
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="New Preview"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveNewImage(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                                    title="Cancel Upload"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {existingImages.length === 0 && newImages.length === 0 && (
                <p className="text-center text-gray-500">No images. Please upload some.</p>
            )}
        </div>
    );
}
