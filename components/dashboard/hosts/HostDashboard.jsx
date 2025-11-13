"use client";
import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    stats,
    upcomingBookings,
    ongoingBookings,
} from "./hostMockData"; // Example: move mock data out
import {
    Home,
    MapPin,
    Image,
    Settings,
    FileText,
    Bell,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    X,
    ChevronRight,
    ChevronLeft,
    Check,
    Upload,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { getStatusColor } from "@/lib/utils";
import { useCreatePropertyMutation } from "@/store/features/propertiesApi";

// --- Lazy Load Components ---
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
    const [createProperty] = useCreatePropertyMutation();
    const user = useSelector(selectCurrentUser);

    // return (
    //     <>
    //     {JSON.stringify(user)}
    //     </>
    // )

    if (user?.eygar_host?.status === "submitted") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Waiting for Approval
                    </h1>
                    <p className="text-gray-600">
                        Your host application is currently under review. We will
                        notify you once it has been approved.
                    </p>
                </div>
            </div>
        );
    }

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
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

    const uploadImage = async (imageFile, displayOrder, isCover, altText) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("display_order", displayOrder);
        formData.append("is_cover", isCover);
        formData.append("alt_text", altText);

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_PROPERTIES_API_URL}/images/upload`,
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
            return data.image_url;
        } catch (error) {
            console.error("Image upload error:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            setIsUploading(true);
            setUploadProgress(0);

            if (formData.images.length < 5) {
                alert("Please upload at least 5 images");
                setIsUploading(false);
                return;
            }

            const uploadedImages = [];
            const totalImages = formData.images.length;

            for (let i = 0; i < totalImages; i++) {
                const imageData = formData.images[i];
                const imageFile = await blobUrlToFile(
                    imageData.image_url,
                    imageData.alt_text || `image-${i}.jpg`
                );
                const imageUrl = await uploadImage(
                    imageFile,
                    imageData.display_order,
                    imageData.is_cover,
                    imageData.alt_text
                );
                uploadedImages.push({
                    image_url: imageUrl,
                    display_order: imageData.display_order,
                    is_cover: imageData.is_cover,
                    alt_text: imageData.alt_text,
                });
                const progress = Math.round(((i + 1) / totalImages) * 100);
                setUploadProgress(progress);
            }

            const propertyData = {
                ...formData,
                bedrooms: parseInt(formData.bedrooms, 10),
                beds: parseInt(formData.beds, 10),
                bathrooms: parseFloat(formData.bathrooms),
                max_guests: parseInt(formData.max_guests, 10),
                max_adults: parseInt(formData.max_adults, 10),
                max_children: parseInt(formData.max_children, 10),
                max_infants: parseInt(formData.max_infants, 10),
                price_per_night: parseFloat(formData.price_per_night),
                cleaning_fee: parseFloat(formData.cleaning_fee),
                service_fee: formData.service_fee
                    ? parseFloat(formData.service_fee)
                    : 0,
                weekly_discount: parseFloat(formData.weekly_discount) || 0,
                monthly_discount: parseFloat(formData.monthly_discount) || 0,
                location: {
                    ...formData.location,
                    latitude: parseFloat(formData.location.latitude),
                    longitude: parseFloat(formData.location.longitude),
                },
                images: uploadedImages,
                house_rules: formData.house_rules.filter(
                    (rule) => rule.trim() !== ""
                ),
            };

            await createProperty(propertyData).unwrap();
            alert("Property created successfully!");
            setShowAddModal(false);
            setCurrentStep(1);
            // Reset form
        } catch (err) {
            console.error("Failed to create property:", err);
            alert(`Error: ${err.message || "Failed to create property"}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
            case "checked-in":
                return <CheckCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };



    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Luxury Beachfront Villa"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Type *
                                </label>
                                <select
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                >
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="guest_house">Guest House</option>
                                    <option value="hotel">Hotel</option>
                                </select>
                            </div>
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
                                className="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Bedrooms, Beds, Bathrooms, Max Guests inputs */}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Price per Night, Cleaning Fee inputs */}
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="instant_book"
                                checked={formData.instant_book}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                            />
                            <label className="ml-2 text-sm">
                                Enable Instant Book
                            </label>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.location.address}
                                    onChange={handleLocationChange}
                                    className="w-full mt-1 px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.location.city}
                                    onChange={handleLocationChange}
                                    className="w-full mt-1 px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        {/* Other location fields */}
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <label className="cursor-pointer mt-4">
                                <span className="text-rose-600 font-medium">
                                    Upload images
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
                                Minimum 5 images
                            </p>
                        </div>
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={img.image_url}
                                            alt={img.alt_text}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    images: prev.images.filter(
                                                        (_, i) => i !== index
                                                    ),
                                                }))
                                            }
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
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
                            <label className="block text-sm font-medium">
                                House Rules
                            </label>
                            {formData.house_rules.map((rule, index) => (
                                <div key={index} className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={rule}
                                        onChange={(e) =>
                                            updateHouseRule(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 px-4 py-2 border rounded-lg"
                                    />
                                    {formData.house_rules.length > 1 && (
                                        <button onClick={() => removeHouseRule(index)}>
                                            <X className="w-5 h-5 text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addHouseRule}
                                className="mt-2 text-sm text-rose-600"
                            >
                                + Add another rule
                            </button>
                        </div>
                        {/* Amenities and Pets allowed */}
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Cancellation Policy *
                            </label>
                            <textarea
                                name="cancellation_policy"
                                value={formData.cancellation_policy}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full mt-1 px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Check-in Policy *
                            </label>
                            <textarea
                                name="check_in_policy"
                                value={formData.check_in_policy}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full mt-1 px-4 py-2 border rounded-lg"
                            />
                        </div>
                        {/* Terms & Conditions */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
                    <p className="text-gray-600 mt-1">
                        Here's your dashboard.
                    </p>
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
                                <div className="text-purple-600">{stat.icon}</div>
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
                        <TabsTrigger value="experiences">Experiences</TabsTrigger>
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

            <Suspense fallback={<div />}>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <div className="px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-bold">
                                    Add New Property
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                {renderStepContent()}
                            </div>
                            <div className="px-6 py-4 border-t flex justify-between items-center">
                                <Button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    variant="outline"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Previous
                                </Button>
                                {currentStep < 5 ? (
                                    <Button onClick={nextStep}>
                                        Next
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            `Uploading... ${uploadProgress}%`
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5 mr-2" />
                                                Submit
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Suspense>
        </div>
    );
}