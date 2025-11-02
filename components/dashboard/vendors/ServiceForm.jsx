"use client";

import { useState } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete"; // Adjust the import path as needed

const categories = [
    "Food",
    "Coaching",
    "Training",
    "Car rental",
    "Local Guide",
    "Clubbing",
    "Workshop",
    "Other",
];

export const ServiceForm = ({ isOpen, onClose, service, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: service?.title || "",
        description: service?.description || "",
        category: service?.category || "Food",
        duration: service?.duration || 1,
        allowedGuests: service?.allowedGuests || 1,
        price: service?.price || 0,
        serviceArea: {
            name: service?.serviceArea.name || "New York, NY, USA",
            lat: service?.serviceArea.lat || 40.7128,
            lng: service?.serviceArea.lng || -74.0060,
            radius: service?.serviceArea.radius || 5,
        },
        image: service?.image || "",
        isActive: service?.isActive ?? true,
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handlePlaceSelect = (place) => {
        setFormData((prev) => ({
            ...prev,
            serviceArea: {
                ...prev.serviceArea,
                name: place.name,
                lat: place.lat,
                lng: place.lng,
            },
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {service ? "Edit Service" : "Create New Service"}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., Italian Cooking Class"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration / Service time (hours)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="24"
                                        value={formData.duration}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                duration: Number(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Guests / Items
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={formData.allowedGuests}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                allowedGuests: Number(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price per Guest / Items ($)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Service Area */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Area
                                </label>
                                <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
                                <p className="text-xs text-gray-500 mt-1">Selected: {formData.serviceArea.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Radius (km)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={formData.serviceArea.radius}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            serviceArea: {
                                                ...prev.serviceArea,
                                                radius: Number(e.target.value),
                                            },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isActive: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Service is active
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Describe your service in detail..."
                            rows={4}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Image (URL)
                        </label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    image: e.target.value,
                                }))
                            }
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                        >
                            {service ? "Update Service" : "Create Service"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
