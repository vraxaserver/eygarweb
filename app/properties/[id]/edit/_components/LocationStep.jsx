// app/properties/[id]/edit/components/LocationStep.jsx
import React from 'react';

export default function LocationStep({ formData, handleChange }) {
    const location = formData.location || {};

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Location Details</h2>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={location.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={location.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                    </label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={location.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                    </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={location.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        value={location.postal_code || ''}
                        onChange={(e) => handleChange('postal_code', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                    </label>
                    <input
                        type="number"
                        id="latitude"
                        name="latitude"
                        value={location.latitude || ''}
                        onChange={(e) => handleChange('latitude', e.target.value)}
                        step="any"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                    </label>
                    <input
                        type="number"
                        id="longitude"
                        name="longitude"
                        value={location.longitude || ''}
                        onChange={(e) => handleChange('longitude', e.target.value)}
                        step="any"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
