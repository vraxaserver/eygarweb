// app/properties/[id]/edit/components/DetailsStep.jsx
import React from 'react';

export default function DetailsStep({ formData, handleChange }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Property Details</h2>

            <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                </label>
                <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="guest_house">Guest House</option>
                    <option value="hotel">Hotel</option>
                    {/* Add other property types as needed */}
                </select>
            </div>

            <div>
                <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Night
                </label>
                <input
                    type="number"
                    id="price_per_night"
                    name="price_per_night"
                    value={formData.price_per_night || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="0"
                />
            </div>

            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                </label>
                <input
                    type="text"
                    id="currency"
                    name="currency"
                    value={formData.currency || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                    </label>
                    <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">
                        Beds
                    </label>
                    <input
                        type="number"
                        id="beds"
                        name="beds"
                        value={formData.beds || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                    </label>
                    <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms || ''}
                        onChange={handleChange}
                        step="0.5"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor="max_guests" className="block text-sm font-medium text-gray-700 mb-1">
                        Max Guests
                    </label>
                    <input
                        type="number"
                        id="max_guests"
                        name="max_guests"
                        value={formData.max_guests || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="1"
                    />
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                    Featured Property
                </label>
            </div>
        </div>
    );
}
