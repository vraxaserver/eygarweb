import React, { useState } from 'react';

export default function DetailsStep({ formData, handleChange }) {
    const [titleError, setTitleError] = useState('');
    const [descError, setDescError] = useState('');

    const titleLength = formData.title?.trim()?.length || 0;
    const descLength = formData.description?.trim()?.length || 0;

    const TITLE_MIN = 10;
    const TITLE_MAX = 100;
    const DESC_MIN = 50;
    const DESC_MAX = 500;

    const validateTitle = (val) => {
        const trimmed = (val ?? '').trim();
        if (!trimmed) return "Property title is required.";
        if (trimmed.length < TITLE_MIN) return `Title must be at least ${TITLE_MIN} characters (${trimmed.length}/${TITLE_MIN}).`;
        if (trimmed.length > TITLE_MAX) return `Title cannot exceed ${TITLE_MAX} characters.`;
        return "";
    };

    const validateDesc = (val) => {
        const trimmed = (val ?? '').trim();
        if (!trimmed) return "Description is required.";
        if (trimmed.length < DESC_MIN) return `Description must be at least ${DESC_MIN} characters (${trimmed.length}/${DESC_MIN}).`;
        if (trimmed.length > DESC_MAX) return `Description cannot exceed ${DESC_MAX} characters.`;
        return "";
    };

    const handleTitleFocus = (e) => {
        setTitleError(validateTitle(e.target.value));
    };

    const handleDescFocus = (e) => {
        setDescError(validateDesc(e.target.value));
    };

    const handleTitleBlur = (e) => {
        setTitleError(validateTitle(e.target.value));
    };

    const handleDescBlur = (e) => {
        setDescError(validateDesc(e.target.value));
    };

    const handleTitleChange = (e) => {
        handleChange(e);
        setTitleError(validateTitle(e.target.value));
    };

    const handleDescChange = (e) => {
        handleChange(e);
        setDescError(validateDesc(e.target.value));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Property Basic Information</h2>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Property Title * <span className="text-xs text-gray-500 font-normal">(min {TITLE_MIN}, max {TITLE_MAX} chars)</span>
                    </label>
                    <span className={`text-xs font-medium ${
                        titleError ? 'text-red-600' : titleLength >= TITLE_MIN ? 'text-green-600' : 'text-gray-500'
                    }`}>
                        {titleLength}/{TITLE_MAX}
                    </span>
                </div>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleTitleChange}
                    onFocus={handleTitleFocus}
                    onBlur={handleTitleBlur}
                    placeholder={`Enter property title (${TITLE_MIN}–${TITLE_MAX} characters required)`}
                    maxLength={TITLE_MAX}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        titleError ? 'border-red-400 bg-red-50' : titleLength >= TITLE_MIN ? 'border-green-400' : 'border-gray-300'
                    }`}
                />
                {titleError && (
                    <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {titleError}</p>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description * <span className="text-xs text-gray-500 font-normal">(min {DESC_MIN}, max {DESC_MAX} chars)</span>
                    </label>
                    <span className={`text-xs font-medium ${
                        descError ? 'text-red-600' : descLength >= DESC_MIN ? 'text-green-600' : 'text-gray-500'
                    }`}>
                        {descLength}/{DESC_MAX}
                    </span>
                </div>
                {/* Progress bar showing how close description is to minimum */}
                {descLength > 0 && descLength < DESC_MIN && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
                        <div
                            className="bg-orange-400 h-1 rounded-full transition-all"
                            style={{ width: `${Math.min((descLength / DESC_MIN) * 100, 100)}%` }}
                        />
                    </div>
                )}
                <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description || ''}
                    onChange={handleDescChange}
                    onFocus={handleDescFocus}
                    onBlur={handleDescBlur}
                    placeholder={`Describe the property in detail (${DESC_MIN}–${DESC_MAX} characters required)`}
                    maxLength={DESC_MAX}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        descError ? 'border-red-400 bg-red-50' : descLength >= DESC_MIN ? 'border-green-400' : 'border-gray-300'
                    }`}
                />
                {descError && (
                    <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {descError}</p>
                )}
            </div>

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
                    placeholder="Enter Price Per Night (e.g. 150 - max 6 digits)"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="0"
                    max="999999"
                />
            </div>

            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                </label>
                <select
                    id="currency"
                    name="currency"
                    value={formData.currency || 'QAR'}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="QAR">QAR (Qatari Riyal)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="KWD">KWD (Kuwaiti Dinar)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                </select>
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
