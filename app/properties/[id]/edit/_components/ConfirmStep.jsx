// app/properties/[id]/edit/components/ConfirmStep.jsx
import React from 'react';

export default function ConfirmStep({ formData, onSubmit, isSubmitting, submitMessage }) {
    const renderValue = (value) => {
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        return value;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Review and Confirm</h2>
            <p className="text-gray-600">Please review the changes before submitting.</p>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Property Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {Object.entries(formData).map(([key, value]) => {
                        if (key === 'location') return null; // Handle location separately
                        return (
                            <div key={key}>
                                <span className="font-semibold text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                                <span className="text-gray-900">{renderValue(value)}</span>
                            </div>
                        );
                    })}
                </div>

                {formData.location && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-medium mb-3 text-gray-800">Location Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            {Object.entries(formData.location).map(([key, value]) => (
                                <div key={`location-${key}`}>
                                    <span className="font-semibold text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                                    <span className="text-gray-900">{renderValue(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-4 text-gray-700">Click "Update Property" to save your changes.</p>
        </div>
    );
}
