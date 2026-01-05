"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { stats, upcomingBookings, ongoingBookings } from "./hostMockData";
import {
    Home,
    MapPin,
    Image,
    Settings,
    FileText,
    Bell,
    MessageSquare,
    Clock,
    X,
    ChevronRight,
    ChevronLeft,
    Check,
    Upload,
} from "lucide-react";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { useCreatePropertyMutation } from "@/store/features/propertiesApi";
import { BookingDetail } from "../guests/BookingDetails";

// --- Lazy Load Components ---
const TabOverview = React.lazy(() => import("./TabOverview"));
const TabMyProperty = React.lazy(() => import("./TabMyProperty"));
const TabMyBookings = React.lazy(() => import("./TabMyBookings"));
const TabMyGuests = React.lazy(() => import("./TabMyGuests"));
const TabMyExperiences = React.lazy(() => import("./TabMyExperiences"));
const TabAnalytics = React.lazy(() => import("./TabAnalytics"));

const LoadingFallback = () => (
    <div className="p-10 text-center">Loading...</div>
);

export default function HostDashboard() {
    const user = useSelector(selectCurrentUser);
    const [createProperty] = useCreatePropertyMutation();

    const [selectedBooking, setSelectedBooking] = useState(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleOwnerAgentChange = (e) => {
        const role = e.target.value; // "owner" | "agent"

        setFormData((prev) => {
            const isAgent = role === "agent";

            return {
                ...prev,
                is_owner: !isAgent,
                is_agent: isAgent,
                revenue_share_type: isAgent
                    ? prev.revenue_share_type || "percentage"
                    : "percentage",
                revenue_share: isAgent ? prev.revenue_share ?? 0 : 0,
            };
        });
    };

    const handleBackToDashboard = () => setSelectedBooking(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        property_type: "house",
        place_type: "entire_place",

        is_owner: true,
        is_agent: false,
        revenue_share_type: "percentage", // "percentage" | "fixed"
        revenue_share: 0,

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
        service_fee: 0,
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

    if (user?.eygar_host?.status !== "approved") {
        return (
            <div className="bg-indigo-600 p-8 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4"
                >
                    <Clock className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Application Under Review
                </h1>
                <p className="text-indigo-100 max-w-md mx-auto">
                    Thanks for setting up your host profile! We are currently
                    verifying your details to ensure the safety of the Eygar
                    community.
                </p>
            </div>
        );
    }

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
            location: { ...prev.location, [name]: value },
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        const newImages = files.map((file, index) => ({
            file,
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
        if (currentStep < 5) setCurrentStep((s) => s + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        try {
            setIsUploading(true);
            setUploadProgress(0);

            const propertyMeta = {
                ...formData,
                bedrooms: parseInt(formData.bedrooms, 10),
                beds: parseInt(formData.beds, 10),
                bathrooms: parseFloat(formData.bathrooms),
                max_guests: parseInt(formData.max_guests, 10),
                max_adults: parseInt(formData.max_adults, 10),
                max_children: parseInt(formData.max_children, 10),
                max_infants: parseInt(formData.max_infants, 10),

                price_per_night: Math.round(
                    parseFloat(formData.price_per_night || 0) * 100
                ),
                cleaning_fee: formData.cleaning_fee
                    ? Math.round(parseFloat(formData.cleaning_fee) * 100)
                    : 0,
                service_fee: formData.service_fee
                    ? Math.round(parseFloat(formData.service_fee) * 100)
                    : 0,

                weekly_discount: parseFloat(formData.weekly_discount) || 0,
                monthly_discount: parseFloat(formData.monthly_discount) || 0,

                location: {
                    ...formData.location,
                    latitude: formData.location.latitude
                        ? parseFloat(formData.location.latitude)
                        : 0,
                    longitude: formData.location.longitude
                        ? parseFloat(formData.location.longitude)
                        : 0,
                },

                house_rules: formData.house_rules.filter(
                    (r) => r.trim() !== ""
                ),

                images: formData.images.map((img) => ({
                    display_order: img.display_order,
                    is_cover: img.is_cover,
                    alt_text: img.alt_text,
                    image_url: "",
                })),
            };

            const propertyData = new FormData();
            propertyData.append("property_data", JSON.stringify(propertyMeta));

            formData.images.forEach((img) => {
                if (img.file) propertyData.append("image_files", img.file);
            });

            await createProperty(propertyData).unwrap();

            alert("Property created successfully!");
            setShowAddModal(false);
            setCurrentStep(1);
            setFormData({
                title: "",
                description: "",
                property_type: "house",
                place_type: "entire_place",
                is_owner: true,
                is_agent: false,
                revenue_share_type: "percentage", // "percentage" | "fixed"
                revenue_share: 0,
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
                service_fee: 0,
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
            alert(
                `Error: ${
                    err?.data?.message ||
                    err?.message ||
                    "Failed to create property"
                }`
            );
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        {/* Title & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                        </div>

                        {/* Types */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Type *
                                </label>
                                <select
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="guest_house">
                                        Guest House
                                    </option>
                                    <option value="hotel">Hotel</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Place Type *
                                </label>
                                <select
                                    name="place_type"
                                    value={formData.place_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
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
                            {/* ✅ Ownership / Agent (Grouped Radio) */}
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <h3 className="text-sm font-semibold mb-3 text-gray-700">
                                    Listing Role
                                </h3>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="listing_role"
                                            value="owner"
                                            checked={
                                                !!formData.is_owner &&
                                                !formData.is_agent
                                            }
                                            onChange={handleOwnerAgentChange}
                                            className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Owner
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="listing_role"
                                            value="agent"
                                            checked={!!formData.is_agent}
                                            onChange={handleOwnerAgentChange}
                                            className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Agent
                                        </span>
                                    </label>
                                </div>

                                {/* ✅ Revenue Share Fields: show only for Agent */}
                                {formData.is_agent && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Revenue Share Type
                                            </label>
                                            <select
                                                name="revenue_share_type"
                                                value={
                                                    formData.revenue_share_type
                                                }
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                <option value="percentage">
                                                    Percentage
                                                </option>
                                                <option value="fixed">
                                                    Fixed
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Revenue Share{" "}
                                                {formData.revenue_share_type ===
                                                "percentage"
                                                    ? "(%)"
                                                    : ""}
                                            </label>
                                            <input
                                                type="number"
                                                name="revenue_share"
                                                step="any"
                                                min="0"
                                                value={formData.revenue_share}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                placeholder={
                                                    formData.revenue_share_type ===
                                                    "percentage"
                                                        ? "0 - 100"
                                                        : "0.00"
                                                }
                                            />
                                            {formData.revenue_share_type ===
                                                "percentage" && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Use a value between 0 and
                                                    100.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Room Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bedrooms
                                </label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    min="0"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Beds
                                </label>
                                <input
                                    type="number"
                                    name="beds"
                                    min="0"
                                    value={formData.beds}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bathrooms
                                </label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    min="0"
                                    step="0.5"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Guest Capacity */}
                        <div className="p-3 bg-gray-50 rounded-lg border">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700">
                                Guest Capacity
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">
                                        Max Guests
                                    </label>
                                    <input
                                        type="number"
                                        name="max_guests"
                                        value={formData.max_guests}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">
                                        Adults
                                    </label>
                                    <input
                                        type="number"
                                        name="max_adults"
                                        value={formData.max_adults}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">
                                        Children
                                    </label>
                                    <input
                                        type="number"
                                        name="max_children"
                                        value={formData.max_children}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">
                                        Infants
                                    </label>
                                    <input
                                        type="number"
                                        name="max_infants"
                                        value={formData.max_infants}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Fees */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Currency
                                </label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="SAR">SAR</option>
                                    <option value="QAR">QAR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price/Night
                                </label>
                                <input
                                    type="number"
                                    name="price_per_night"
                                    placeholder="0.00"
                                    value={formData.price_per_night}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cleaning Fee
                                </label>
                                <input
                                    type="number"
                                    name="cleaning_fee"
                                    placeholder="0.00"
                                    value={formData.cleaning_fee}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service Fee
                                </label>
                                <input
                                    type="number"
                                    name="service_fee"
                                    placeholder="0.00"
                                    value={formData.service_fee}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Discounts */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Weekly Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="weekly_discount"
                                    value={formData.weekly_discount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Monthly Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="monthly_discount"
                                    value={formData.monthly_discount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-col gap-2 p-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="instant_book"
                                    name="instant_book"
                                    checked={formData.instant_book}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                                />
                                <label
                                    htmlFor="instant_book"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Enable Instant Book
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="pets_allowed"
                                    name="pets_allowed"
                                    checked={formData.pets_allowed}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                                />
                                <label
                                    htmlFor="pets_allowed"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Pets Allowed
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Street address"
                                value={formData.location.address}
                                onChange={handleLocationChange}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.location.city}
                                    onChange={handleLocationChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.location.state}
                                    onChange={handleLocationChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.location.country}
                                    onChange={handleLocationChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.location.postal_code}
                                    onChange={handleLocationChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 border rounded-lg">
                            <h4 className="text-sm font-medium mb-2 text-gray-700">
                                Coordinates (Optional)
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        step="any"
                                        value={formData.location.latitude}
                                        onChange={handleLocationChange}
                                        className="w-full mt-1 px-3 py-1.5 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        name="longitude"
                                        step="any"
                                        value={formData.location.longitude}
                                        onChange={handleLocationChange}
                                        className="w-full mt-1 px-3 py-1.5 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <label className="cursor-pointer mt-4 block">
                                <span className="text-rose-600 font-medium hover:text-rose-700">
                                    Click to upload images
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
                                Minimum 5 images required
                            </p>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
                                {formData.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-square"
                                    >
                                        <img
                                            src={img.image_url}
                                            alt={img.alt_text}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
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
                                                className="bg-white text-red-600 rounded-full p-2 hover:bg-red-50"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {index === 0 && (
                                            <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                House Rules
                            </label>
                            <div className="space-y-2">
                                {formData.house_rules.map((rule, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={rule}
                                            onChange={(e) =>
                                                updateHouseRule(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Rule #${index + 1}`}
                                            className="flex-1 px-4 py-2 border rounded-lg"
                                        />
                                        {formData.house_rules.length > 1 && (
                                            <button
                                                onClick={() =>
                                                    removeHouseRule(index)
                                                }
                                                className="p-2 text-gray-400 hover:text-red-500"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addHouseRule}
                                className="mt-3 text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center"
                            >
                                <span className="text-xl mr-1">+</span> Add
                                another rule
                            </button>
                        </div>

                        <div className="opacity-50">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenities (IDs)
                            </label>
                            <p className="text-xs text-gray-500 mb-2">
                                Select amenities available at your property.
                            </p>
                            <div className="border p-4 rounded-lg bg-gray-50 text-center text-sm text-gray-400">
                                Amenity selection interface would load here...
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cancellation Policy *
                            </label>
                            <textarea
                                name="cancellation_policy"
                                value={formData.cancellation_policy}
                                onChange={handleInputChange}
                                rows="6"
                                placeholder="Enter details about cancellation..."
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Check-in Policy *
                            </label>
                            <textarea
                                name="check_in_policy"
                                value={formData.check_in_policy}
                                onChange={handleInputChange}
                                rows="6"
                                placeholder="Enter details about check-in/out..."
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header & Main Content */}
            <header className="bg-white shadow-sm lg:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Host Dashboard</h1>
                    <Button
                        variant="ghost"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Settings className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-b px-4 py-2">
                    <Button variant="ghost" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                    </Button>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Welcome back, {user?.last_name || user?.email}
                    </h1>
                    <p className="text-gray-600 mt-1">Here's your dashboard.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {stat.title}
                                    </div>
                                </div>
                                <div className="text-purple-600">
                                    {stat.icon}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="properties">Properties</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="guests">Guests</TabsTrigger>
                        <TabsTrigger value="experiences">
                            Experiences
                        </TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <Suspense fallback={<LoadingFallback />}>
                        <TabsContent value="overview">
                            <TabOverview
                                setShowAddModal={setShowAddModal}
                                upcomingBookings={upcomingBookings}
                            />
                        </TabsContent>

                        <TabsContent value="properties">
                            <TabMyProperty setShowAddModal={setShowAddModal} />
                        </TabsContent>

                        <TabsContent value="bookings">
                            <TabMyBookings
                                ongoingBookings={ongoingBookings}
                                upcomingBookings={upcomingBookings}
                                onViewDetails={(booking) =>
                                    setSelectedBooking(booking)
                                }
                            />
                        </TabsContent>

                        <TabsContent value="guests">
                            <TabMyGuests
                                ongoingBookings={ongoingBookings}
                                upcomingBookings={upcomingBookings}
                            />
                        </TabsContent>

                        <TabsContent value="experiences">
                            <TabMyExperiences />
                        </TabsContent>

                        <TabsContent value="analytics">
                            <TabAnalytics />
                        </TabsContent>
                    </Suspense>
                </Tabs>
            </main>

            {/* Add Property Modal (your original) */}
            <Suspense fallback={<div />}>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowAddModal(false)}
                        />

                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Add New Property
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        {steps.map((s) => (
                                            <div
                                                key={s.number}
                                                className={`flex items-center ${
                                                    currentStep === s.number
                                                        ? "text-rose-600 font-medium"
                                                        : ""
                                                }`}
                                            >
                                                <span
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-1 ${
                                                        currentStep === s.number
                                                            ? "bg-rose-100"
                                                            : "bg-gray-100"
                                                    }`}
                                                >
                                                    {s.number}
                                                </span>
                                                <span className="hidden sm:inline">
                                                    {s.title}
                                                </span>
                                                {s.number < 5 && (
                                                    <ChevronRight className="w-3 h-3 mx-1" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {renderStepContent()}
                            </div>

                            <div className="px-6 py-4 border-t bg-gray-50/50 flex justify-between items-center">
                                <Button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    variant="outline"
                                    className="pl-2"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" />
                                    Back
                                </Button>
                                {currentStep < 5 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="pr-2 bg-rose-600 hover:bg-rose-700"
                                    >
                                        Next
                                        <ChevronRight className="w-5 h-5 ml-1" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isUploading}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isUploading ? (
                                            `Uploading... ${uploadProgress}%`
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5 mr-2" />
                                                Create Listing
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Suspense>

            {/* ✅ Booking Details Dialog - WIDE + SCROLL FIX */}
            <Dialog
                open={!!selectedBooking}
                onOpenChange={(open) => {
                    if (!open) setSelectedBooking(null);
                }}
            >
                <DialogContent
                    className="
                        p-0
                        !w-[98vw]
                        sm:!w-[90vw]
                        md:!w-[90vw]
                        lg:!w-[80vw]
                        xl:!w-[80vw]
                        2xl:!w-[70vw]
                        !max-w-none
                        h-[90vh]
                        overflow-hidden
                    "
                >
                    {/* Optional top header (keeps your modal title visible) */}
                    <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
                        <DialogHeader className="p-0">
                            <DialogTitle>Booking Details</DialogTitle>
                        </DialogHeader>

                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* ✅ Dedicated scroll area */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedBooking && (
                            <BookingDetail
                                booking={selectedBooking}
                                onBack={handleBackToDashboard}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
