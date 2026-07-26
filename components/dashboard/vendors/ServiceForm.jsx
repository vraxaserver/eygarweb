"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete";
import Image from "next/image";

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
            name: service?.serviceArea?.name || "New York, NY, USA",
            lat: service?.serviceArea?.lat || 40.7128,
            lng: service?.serviceArea?.lng || -74.006,
            radius: service?.serviceArea?.radius || 5,
        },
        image: service?.image || "",
        isActive: service?.isActive ?? true,
    });

    // Image upload state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(service?.image || null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass imageFile alongside formData so VendorServices can upload it
        onSubmit(formData, imageFile);
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

    // ── Image handling ──────────────────────────────────────
    const processFile = (file) => {
        if (!file) return;
        const accepted = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"];
        if (!accepted.includes(file.type)) {
            alert("Please select a valid image file (JPG, PNG, WebP, GIF, AVIF).");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert("Image size must be less than 10 MB.");
            return;
        }
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        // Clear the stored URL since a new file will be uploaded
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        processFile(file);
        // Reset input so same file can be re-selected if cleared
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const clearImage = () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        setFormData((prev) => ({ ...prev, image: "" }));
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                                                duration: Number(e.target.value),
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                                                allowedGuests: Number(e.target.value),
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Selected: {formData.serviceArea.name}
                                </p>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                                    className="rounded border-gray-300 text-blue-600 focus:ring-rose-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Image
                        </label>

                        {imagePreview ? (
                            /* Preview */
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                                <div className="relative w-full h-52">
                                    <Image
                                        src={imagePreview}
                                        alt="Service image preview"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                        unoptimized={imagePreview.startsWith("blob:")}
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-1.5 bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                {/* Status badge */}
                                {imageFile && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Ready to upload
                                    </div>
                                )}
                                <p className="px-3 py-2 text-xs text-gray-500 truncate">
                                    {imageFile ? imageFile.name : "Current image"}
                                </p>
                            </div>
                        ) : (
                            /* Drop zone */
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`relative flex flex-col items-center justify-center gap-3 w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                    isDragOver
                                        ? "border-rose-500 bg-rose-50 scale-[1.01]"
                                        : "border-gray-300 bg-gray-50 hover:border-rose-400 hover:bg-rose-50/50"
                                }`}
                            >
                                <div className="p-3 bg-white rounded-full shadow-sm border border-gray-200">
                                    <ImageIcon
                                        className={`w-7 h-7 transition-colors ${
                                            isDragOver ? "text-rose-500" : "text-gray-400"
                                        }`}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        {isDragOver
                                            ? "Drop your image here"
                                            : "Click to upload or drag & drop"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        JPG, PNG, WebP, GIF, AVIF — max 10 MB
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-rose-600 text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-rose-700 transition">
                                    <Upload className="w-3.5 h-3.5" />
                                    Browse files
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
                            onChange={handleFileChange}
                            className="hidden"
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
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {service ? "Update Service" : "Create Service"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
