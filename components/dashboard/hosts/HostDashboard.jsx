"use client";
import React from "react";
import { useState, Suspense, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    stats,
    upcomingBookings,
    ongoingBookings,
    experiences,
} from "./hostMockData"; // Example: move mock data out
import {
    Home,
    Calendar,
    Star,
    DollarSign,
    MessageSquare,
    Bell,
    Settings,
    Clock,
    CheckCircle,
    AlertCircle,
    X,
    Plus,
    MapPin,
    Image,
    FileText,
    ChevronRight,
    ChevronLeft,
    Check,
    Upload,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { getStatusColor } from "@/lib/utils";
import { useCreatePropertyMutation, useGetMyPropertiesQuery } from "@/store/features/propertiesApi";

// --- Lazy Load Components ---
const AddPropertyModal = React.lazy(() => import("./AddPropertyModal"));
const TabOverview = React.lazy(() => import("./TabOverview"));
const TabMyProperty = React.lazy(() => import("./TabMyProperty"));
const TabMyBookings = React.lazy(() => import("./TabMyBookings"));
const TabMyGuests = React.lazy(() => import("./TabMyGuests"));
const TabMyExperiences = React.lazy(() => import("./TabMyExperiences"));
const TabAnalytics = React.lazy(() => import("./TabAnalytics"));

// A simple loading component for Suspense fallback
const LoadingFallback = () => (
    <div className="p-10 text-center">Loading...</div>
);

export default function HostDashboard() {
    const [createProperty, { isLoading, error }] = useCreatePropertyMutation();
    const {data: properties} = useGetMyPropertiesQuery()

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const user = useSelector(selectCurrentUser);
    console.log("user: ", user);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        title: "",
        description: "",
        property_type: "house",
        place_type: "entire_place",
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        max_guests: 2,
        max_adults: 2,
        max_children: 0,
        max_infants: 0,
        pets_allowed: false,
        price_per_night: "",
        currency: "USD",
        cleaning_fee: "",
        service_fee: "",
        weekly_discount: 0,
        monthly_discount: 0,
        instant_book: false,

        // Step 2: Location
        location: {
            address: "",
            city: "",
            state: "",
            country: "",
            postal_code: "",
            latitude: "",
            longitude: "",
        },

        // Step 3: Images
        images: [],

        // Step 4: Amenities & Rules
        amenity_ids: [],
        house_rules: [""],

        // Step 5: Policies
        cancellation_policy: "",
        check_in_policy: "",
    });

    const steps = [
        { number: 1, title: "Basic Info", icon: Home },
        { number: 2, title: "Location", icon: MapPin },
        { number: 3, title: "Images", icon: Image },
        { number: 4, title: "Amenities & Rules", icon: Settings },
        { number: 5, title: "Policies", icon: FileText },
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value,
            },
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file, index) => ({
            image_url: URL.createObjectURL(file),
            display_order: formData.images.length + index,
            is_cover: formData.images.length === 0 && index === 0,
            alt_text: file.name,
        }));
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
        }));
    };

    const addHouseRule = () => {
        setFormData((prev) => ({
            ...prev,
            house_rules: [...prev.house_rules, ""],
        }));
    };

    const updateHouseRule = (index, value) => {
        const newRules = [...formData.house_rules];
        newRules[index] = value;
        setFormData((prev) => ({
            ...prev,
            house_rules: newRules,
        }));
    };

    const removeHouseRule = (index) => {
        setFormData((prev) => ({
            ...prev,
            house_rules: prev.house_rules.filter((_, i) => i !== index),
        }));
    };

    const nextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const blobUrlToFile = async (blobUrl, filename) => {
        try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return new File([blob], filename, { type: blob.type });
        } catch (error) {
            console.error("Error converting blob to file:", error);
            throw error;
        }
    };

    // Function to upload a single image
    const uploadImage = async (imageFile, displayOrder, isCover, altText) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("display_order", displayOrder);
        formData.append("is_cover", isCover);
        formData.append("alt_text", altText);

        try {
            // Get auth token from localStorage
            const token = localStorage.getItem("access_token");

            const response = await fetch(
                "http://127.0.0.1:8001/api/v1/images/upload",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        `Failed to upload image: ${response.statusText}`
                );
            }

            const data = await response.json();
            return data.image_url; // Assuming API returns { image_url: "..." }
        } catch (error) {
            console.error("Image upload error:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Validate minimum images
            if (formData.images.length < 5) {
                alert("Please upload at least 5 images");
                return;
            }

            // Step 1: Upload all images and get real URLs
            console.log("Starting image upload process...");
            const uploadedImages = [];
            const totalImages = formData.images.length;

            for (let i = 0; i < formData.images.length; i++) {
                const imageData = formData.images[i];

                console.log(`Uploading image ${i + 1}/${totalImages}...`);

                // Convert blob URL to File object
                const imageFile = await blobUrlToFile(
                    imageData.image_url,
                    imageData.alt_text || `image-${i}.jpg`
                );

                // Upload image and get URL
                const imageUrl = await uploadImage(
                    imageFile,
                    imageData.display_order,
                    imageData.is_cover,
                    imageData.alt_text
                );

                uploadedImages.push({
                    image_url: imageUrl, // Real URL from server
                    display_order: imageData.display_order,
                    is_cover: imageData.is_cover,
                    alt_text: imageData.alt_text,
                });

                // Update progress
                const progress = Math.round(((i + 1) / totalImages) * 100);
                setUploadProgress(progress);
                console.log(`Upload progress: ${progress}%`);
            }

            console.log("All images uploaded successfully!", uploadedImages);

            // Step 2: Transform form data with real image URLs
            const propertyData = {
                title: formData.title,
                description: formData.description,
                property_type: formData.property_type,
                place_type: formData.place_type,
                bedrooms: parseInt(formData.bedrooms),
                beds: parseInt(formData.beds),
                bathrooms: parseFloat(formData.bathrooms),
                max_guests: parseInt(formData.max_guests),
                max_adults: parseInt(formData.max_adults),
                max_children: parseInt(formData.max_children),
                max_infants: parseInt(formData.max_infants),
                pets_allowed: formData.pets_allowed,
                price_per_night: parseFloat(formData.price_per_night),
                currency: formData.currency,
                cleaning_fee: parseFloat(formData.cleaning_fee),
                service_fee: formData.service_fee
                    ? parseFloat(formData.service_fee)
                    : 0,
                weekly_discount: parseFloat(formData.weekly_discount) || 0,
                monthly_discount: parseFloat(formData.monthly_discount) || 0,
                instant_book: formData.instant_book,
                location: {
                    address: formData.location.address,
                    city: formData.location.city,
                    state: formData.location.state,
                    country: formData.location.country,
                    postal_code: formData.location.postal_code,
                    latitude: parseFloat(formData.location.latitude),
                    longitude: parseFloat(formData.location.longitude),
                },
                images: uploadedImages, // Use uploaded image URLs
                amenity_ids: formData.amenity_ids || [],
                house_rules: formData.house_rules.filter(
                    (rule) => rule.trim() !== ""
                ),
                cancellation_policy: formData.cancellation_policy,
                check_in_policy: formData.check_in_policy,
            };

            console.log("Submitting property data:", propertyData);

            // Step 3: Create property with real image URLs
            const result = await createProperty(propertyData).unwrap();
            console.log("Property created successfully:", result);

            // Success! Close modal and reset
            alert("Property created successfully!");
            setShowAddModal(false);
            setCurrentStep(1);

            // Reset form data
            setFormData({
                title: "",
                description: "",
                property_type: "entire_place",
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                max_guests: 2,
                max_adults: 2,
                max_children: 0,
                max_infants: 0,
                pets_allowed: false,
                price_per_night: "",
                currency: "USD",
                cleaning_fee: "",
                service_fee: "",
                weekly_discount: 0,
                monthly_discount: 0,
                instant_book: false,
                location: {
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    postal_code: "",
                    latitude: "",
                    longitude: "",
                },
                images: [],
                amenity_ids: [],
                house_rules: [""],
                cancellation_policy: "",
                check_in_policy: "",
            });
        } catch (err) {
            console.error("Failed to create property:", err);

            if (err.status === 401) {
                alert("Unauthorized: Please login");
                // Redirect to login if needed
            } else if (err.status === 403) {
                alert(
                    "Forbidden: You do not have permission to create properties"
                );
            } else {
                alert(`Error: ${err.message || "Failed to create property"}`);
            }
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
                return <CheckCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "checked-in":
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Luxury Beachfront Villa with Pool"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Describe your property..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Type *
                                </label>
                                <select
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                >
                                    <option value="house">
                                        House
                                    </option>
                                    <option value="apartment">
                                        Apartment
                                    </option>
                                    <option value="guest_house">
                                        Guest House
                                    </option>
                                    <option value="hotel">
                                        Hotel
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Place Type
                                </label>
                                <select
                                    name="place_type"
                                    value={formData.place_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                >
                                    <option value="entire_place">
                                        Entire Place
                                    </option>
                                    <option value="private_room">
                                        Private Room
                                    </option>
                                    <option value="shared_room">
                                        Shared Room
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bedrooms
                                </label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Beds
                                </label>
                                <input
                                    type="number"
                                    name="beds"
                                    value={formData.beds}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bathrooms
                                </label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    step="0.5"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Guests
                                </label>
                                <input
                                    type="number"
                                    name="max_guests"
                                    value={formData.max_guests}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price per Night (USD) *
                                </label>
                                <input
                                    type="number"
                                    name="price_per_night"
                                    value={formData.price_per_night}
                                    onChange={handleInputChange}
                                    placeholder="450"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cleaning Fee
                                </label>
                                <input
                                    type="number"
                                    name="cleaning_fee"
                                    value={formData.cleaning_fee}
                                    onChange={handleInputChange}
                                    placeholder="150"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="instant_book"
                                checked={formData.instant_book}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                Enable Instant Book
                            </label>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.location.address}
                                onChange={handleLocationChange}
                                placeholder="123 Beachfront Drive"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.location.city}
                                    onChange={handleLocationChange}
                                    placeholder="Miami Beach"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.location.state}
                                    onChange={handleLocationChange}
                                    placeholder="Florida"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.location.country}
                                    onChange={handleLocationChange}
                                    placeholder="USA"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.location.postal_code}
                                    onChange={handleLocationChange}
                                    placeholder="33139"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={formData.location.latitude}
                                    onChange={handleLocationChange}
                                    step="any"
                                    placeholder="25.7907"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={formData.location.longitude}
                                    onChange={handleLocationChange}
                                    step="any"
                                    placeholder="-80.1300"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <label className="cursor-pointer">
                                <span className="text-rose-600 font-medium hover:text-rose-700">
                                    Upload images
                                </span>
                                <span className="text-gray-600">
                                    {" "}
                                    or drag and drop
                                </span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-sm text-gray-500 mt-2">
                                PNG, JPG, GIF up to 10MB (minimum 5 images)
                            </p>
                        </div>

                        {formData.images.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Uploaded Images ({formData.images.length}/5
                                    minimum)
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={img.image_url}
                                                alt={img.alt_text}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            {img.is_cover && (
                                                <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded">
                                                    Cover
                                                </div>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        images: prev.images.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        ),
                                                    }))
                                                }
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.images.length < 5 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                                Please upload at least 5 images to continue
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                House Rules
                            </label>
                            {formData.house_rules.map((rule, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={rule}
                                        onChange={(e) =>
                                            updateHouseRule(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., No smoking inside the property"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                    {formData.house_rules.length > 1 && (
                                        <button
                                            onClick={() =>
                                                removeHouseRule(index)
                                            }
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addHouseRule}
                                className="mt-2 text-rose-600 text-sm font-medium hover:text-rose-700"
                            >
                                + Add another rule
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenity IDs (comma-separated)
                            </label>
                            <input
                                type="text"
                                placeholder="uuid1, uuid2, uuid3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter amenity UUIDs separated by commas
                            </p>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="pets_allowed"
                                checked={formData.pets_allowed}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                Pets Allowed
                            </label>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cancellation Policy *
                            </label>
                            <textarea
                                name="cancellation_policy"
                                value={formData.cancellation_policy}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="e.g., Free cancellation up to 48 hours before check-in..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check-in Policy *
                            </label>
                            <textarea
                                name="check_in_policy"
                                value={formData.check_in_policy}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="e.g., Check-in: 3:00 PM - 10:00 PM. Self check-in with keypad..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">
                                Terms & Conditions
                            </h4>
                            <div className="space-y-2 text-sm text-blue-800">
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        className="mt-1 mr-2"
                                        required
                                    />
                                    <span>
                                        I confirm that all information provided
                                        is accurate
                                    </span>
                                </label>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        className="mt-1 mr-2"
                                        required
                                    />
                                    <span>
                                        I agree to the host terms and conditions
                                    </span>
                                </label>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        className="mt-1 mr-2"
                                        required
                                    />
                                    <span>
                                        I understand the cancellation policy
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="hidden md:block">
                    <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800"
                    >
                        Host Dashboard
                    </Badge>
                </div>
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.last_name || user.email}
                    </h1>
                    <p className="text-gray-600">
                        Manage your properties, bookings, and guest experiences
                        all in one place.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-4 md:p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-purple-600">
                                        {stat.icon}
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-gray-600">
                                    {stat.title}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Dashboard Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
                        <TabsTrigger
                            value="overview"
                            className="text-xs md:text-sm"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="properties"
                            className="text-xs md:text-sm"
                        >
                            Properties
                        </TabsTrigger>
                        <TabsTrigger
                            value="bookings"
                            className="text-xs md:text-sm"
                        >
                            Bookings
                        </TabsTrigger>
                        <TabsTrigger
                            value="guests"
                            className="text-xs md:text-sm"
                        >
                            Guests
                        </TabsTrigger>
                        <TabsTrigger
                            value="experiences"
                            className="text-xs md:text-sm"
                        >
                            Experiences
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="text-xs md:text-sm"
                        >
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    <Suspense fallback={<LoadingFallback />}>
                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <TabOverview
                                setShowAddModal={setShowAddModal}
                                upcomingBookings={upcomingBookings}
                            />
                        </TabsContent>

                        {/* Properties Tab */}
                        <TabsContent value="properties" className="space-y-6">
                            <TabMyProperty
                                setShowAddModal={setShowAddModal}
                                properties={properties}
                            />
                        </TabsContent>

                        {/* Bookings Tab */}
                        <TabsContent value="bookings" className="space-y-6">
                            <TabMyBookings
                                ongoingBookings={ongoingBookings}
                                upcomingBookings={upcomingBookings}
                            />
                        </TabsContent>

                        {/* Bookings Tab */}
                        <TabsContent value="bookings" className="space-y-6">
                            <h2 className="text-xl font-semibold">
                                Booking Management
                            </h2>

                            <Tabs defaultValue="upcoming" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="upcoming">
                                        Upcoming
                                    </TabsTrigger>
                                    <TabsTrigger value="ongoing">
                                        Ongoing
                                    </TabsTrigger>
                                    <TabsTrigger value="past">Past</TabsTrigger>
                                    <TabsTrigger value="cancelled">
                                        Cancelled
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="upcoming"
                                    className="space-y-4"
                                >
                                    {upcomingBookings.map((booking) => (
                                        <Card key={booking.id}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage
                                                                src={
                                                                    booking.avatar
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {
                                                                    booking
                                                                        .guest[0]
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-semibold">
                                                                {booking.guest}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {
                                                                    booking.property
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(
                                                                    booking.checkIn
                                                                ).toLocaleDateString()}{" "}
                                                                -{" "}
                                                                {new Date(
                                                                    booking.checkOut
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-right">
                                                            <div className="font-semibold">
                                                                {booking.total}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {booking.guests}{" "}
                                                                guests
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            className={getStatusColor(
                                                                booking.status
                                                            )}
                                                        >
                                                            {getStatusIcon(
                                                                booking.status
                                                            )}
                                                            <span className="ml-1">
                                                                {booking.status}
                                                            </span>
                                                        </Badge>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                                Message
                                                            </Button>
                                                            {booking.status ===
                                                                "pending" && (
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-purple-600 hover:bg-purple-700"
                                                                >
                                                                    Approve
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent
                                    value="ongoing"
                                    className="space-y-4"
                                >
                                    {ongoingBookings.map((booking) => (
                                        <Card key={booking.id}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage
                                                                src={
                                                                    booking.avatar
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {
                                                                    booking
                                                                        .guest[0]
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-semibold">
                                                                {booking.guest}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {
                                                                    booking.property
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(
                                                                    booking.checkIn
                                                                ).toLocaleDateString()}{" "}
                                                                -{" "}
                                                                {new Date(
                                                                    booking.checkOut
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-right">
                                                            <div className="font-semibold">
                                                                {booking.total}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {booking.guests}{" "}
                                                                guests
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            className={getStatusColor(
                                                                booking.status
                                                            )}
                                                        >
                                                            {getStatusIcon(
                                                                booking.status
                                                            )}
                                                            <span className="ml-1">
                                                                checked-in
                                                            </span>
                                                        </Badge>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                                Message
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                Check Out
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        {/* Guests Tab */}
                        <TabsContent value="guests" className="space-y-6">
                            <TabMyGuests
                                ongoingBookings={ongoingBookings}
                                upcomingBookings={upcomingBookings}
                            />
                        </TabsContent>

                        {/* Experiences Tab */}
                        <TabsContent value="experiences" className="space-y-6">
                            <TabMyExperiences experiences={experiences} />
                        </TabsContent>

                        {/* Analytics Tab */}
                        <TabsContent value="analytics" className="space-y-6">
                            <TabAnalytics />
                        </TabsContent>
                    </Suspense>
                </Tabs>
            </div>
            <Suspense fallback={<div />}>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Add New Property
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setCurrentStep(1);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Progress Steps */}
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <div className="flex items-center justify-between">
                                    {steps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isActive =
                                            currentStep === step.number;
                                        const isCompleted =
                                            currentStep > step.number;

                                        return (
                                            <React.Fragment key={step.number}>
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                                            isCompleted
                                                                ? "bg-green-500 text-white"
                                                                : isActive
                                                                ? "bg-rose-500 text-white"
                                                                : "bg-gray-200 text-gray-400"
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <Check className="w-6 h-6" />
                                                        ) : (
                                                            <Icon className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-xs mt-2 font-medium ${
                                                            isActive
                                                                ? "text-rose-600"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {step.title}
                                                    </span>
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div
                                                        className={`flex-1 h-0.5 mx-2 ${
                                                            isCompleted
                                                                ? "bg-green-500"
                                                                : "bg-gray-200"
                                                        }`}
                                                    />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                {renderStepContent()}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                                        currentStep === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Previous
                                </button>

                                {currentStep < 5 ? (
                                    <button
                                        onClick={nextStep}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
                                    >
                                        Next
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                                    >
                                        <Check className="w-5 h-5" />
                                        Submit Property
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Suspense>
        </div>
    );
}
