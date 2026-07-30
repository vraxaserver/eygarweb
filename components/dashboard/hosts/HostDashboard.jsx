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
    DollarSign,
    Star,
    Calendar,
} from "lucide-react";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import {
    useCreatePropertyMutation,
    useUploadImageMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
    useGetMyPropertiesQuery,
} from "@/store/features/propertiesApi";
import { useListHostUpcomingBookingsQuery } from "@/store/features/bookingApi";
import { useGetAmenitiesQuery } from "@/store/features/amenitiesApi";
import { BookingDetail } from "../guests/BookingDetails";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";

function getDetailedErrorMessage(err) {
    if (!err) return "An unknown error occurred.";
    if (typeof err === "string") return err;
    const data = err?.data ?? err;
    if (typeof data === "string") return data;

    if (data?.detail) {
        if (typeof data.detail === "string") return data.detail;
        if (Array.isArray(data.detail)) {
            return data.detail.map((e) => `${e.loc?.slice(-1)?.[0] || 'Field'}: ${e.msg}`).join("\n");
        }
        return JSON.stringify(data.detail);
    }
    if (data?.message) {
        if (typeof data.message === "string") return data.message;
        return JSON.stringify(data.message);
    }
    if (data?.errors) {
        if (Array.isArray(data.errors)) {
            return data.errors.map(e => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join("\n");
        }
        if (typeof data.errors === 'object') {
            return Object.entries(data.errors)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join("\n");
        }
    }
    if (err?.message) return err.message;
    if (err?.error) return typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
    return "Server error occurred. Please check your inputs and try again.";
}

// --- Lazy Load Components ---
const TabOverview = React.lazy(() => import("./TabOverview"));
const TabMyProperty = React.lazy(() => import("./TabMyProperty"));
const TabMyBookings = React.lazy(() => import("./TabMyBookings"));
const TabMyExperiences = React.lazy(() => import("./TabMyExperiences"));
const TabAnalytics = React.lazy(() => import("./TabAnalytics"));

const LoadingFallback = () => (
    <div className="p-10 text-center">Loading...</div>
);

export default function HostDashboard() {
    const user = useSelector(selectCurrentUser);
    const { isLoaded: isGoogleMapLoaded } = useGoogleMaps();
    const { data: amenitiesData, isLoading: isAmenitiesLoading, error: amenitiesError } = useGetAmenitiesQuery();
    const [createProperty] = useCreatePropertyMutation();
    const [uploadImage] = useUploadImageMutation();
    const [updateProperty] = useUpdatePropertyMutation();
    const [deleteProperty] = useDeletePropertyMutation();

    const { data: myPropsData, isLoading: isPropsLoading } = useGetMyPropertiesQuery();
    const { data: hostBookingsData = [], isLoading: isBookingsLoading } = useListHostUpcomingBookingsQuery({ limit: 100, offset: 0 });

    const propertiesList = React.useMemo(() => {
        if (!myPropsData) return [];
        if (Array.isArray(myPropsData)) return myPropsData;
        if (Array.isArray(myPropsData.items)) return myPropsData.items;
        return [];
    }, [myPropsData]);

    const bookingsList = React.useMemo(() => {
        if (!hostBookingsData) return [];
        if (Array.isArray(hostBookingsData)) return hostBookingsData;
        if (Array.isArray(hostBookingsData.items)) return hostBookingsData.items;
        return [];
    }, [hostBookingsData]);

    const totalEarnings = React.useMemo(() => {
        return bookingsList.reduce((acc, b) => {
            const val = Number(b?.total_amount ?? b?.pricing_breakdown?.total_price ?? b?.total_price ?? b?.total ?? 0);
            return acc + (Number.isNaN(val) ? 0 : val);
        }, 0);
    }, [bookingsList]);

    const activeListingsCount = React.useMemo(() => {
        return propertiesList.filter((p) => p.status === "active" || p.is_active !== false).length;
    }, [propertiesList]);

    const avgRating = React.useMemo(() => {
        const ratedProps = propertiesList.filter((p) => Number(p.rating || p.average_rating || p.review_score || 0) > 0);
        if (ratedProps.length === 0) return propertiesList.length > 0 ? "5.0" : "0.0";
        const sum = ratedProps.reduce((acc, p) => acc + Number(p.rating || p.average_rating || p.review_score || 0), 0);
        return (sum / ratedProps.length).toFixed(1);
    }, [propertiesList]);

    const activeBookingsCount = React.useMemo(() => {
        return bookingsList.filter((b) => {
            const status = b?.booking_status || "";
            const checkoutStatus = b?.checkout_status || "";
            return (
                checkoutStatus === "checked_in" ||
                status === "confirmed" ||
                status === "host_approved" ||
                status === "booking_confirmed"
            );
        }).length;
    }, [bookingsList]);

    const dynamicStats = React.useMemo(() => [
        {
            title: "Total Earnings",
            value: isBookingsLoading ? "..." : `$${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
            change: "+12%",
            icon: <DollarSign className="w-6 h-6" />,
        },
        {
            title: "Active Listings",
            value: isPropsLoading ? "..." : String(activeListingsCount),
            change: `Total: ${propertiesList.length}`,
            icon: <Home className="w-6 h-6" />,
        },
        {
            title: "Total Bookings",
            value: isBookingsLoading ? "..." : String(bookingsList.length),
            change: "All time",
            icon: <Calendar className="w-6 h-6" />,
        },
        {
            title: "Average Rating",
            value: isPropsLoading ? "..." : String(avgRating),
            change: "Based on reviews",
            icon: <Star className="w-6 h-6" />,
        },
    ], [isBookingsLoading, isPropsLoading, totalEarnings, activeListingsCount, propertiesList.length, bookingsList.length, avgRating]);

    const handleAmenityToggle = (amenityId) => {
        setFormData((prev) => {
            const currentIds = prev.amenity_ids || [];
            const exists = currentIds.includes(amenityId);
            const updatedIds = exists
                ? currentIds.filter((id) => id !== amenityId)
                : [...currentIds, amenityId];
            return {
                ...prev,
                amenity_ids: updatedIds,
            };
        });
    };

    const [selectedBooking, setSelectedBooking] = useState(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stepErrors, setStepErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(""); // e.g. "Creating property...", "Uploading images (2/5)..."
    const [autocomplete, setAutocomplete] = useState(null);

    // pendingImageFiles holds { file: File, previewUrl: string, is_cover: bool, alt_text: string, display_order: number }
    // These are NOT uploaded yet — upload happens at submit time once we have a property_id
    const [pendingImageFiles, setPendingImageFiles] = useState([]);

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

    const steps = [
        { number: 1, title: "Basic Info", icon: Home },
        { number: 2, title: "Location", icon: MapPin },
        { number: 3, title: "Images", icon: Image },
        { number: 4, title: "Amenities & Rules", icon: Settings },
        { number: 5, title: "Policies", icon: FileText },
    ];

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
        if (!files.length) return;

        const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        const validFiles = [];
        for (const file of files) {
            const isTypeValid = ALLOWED_TYPES.includes(file.type.toLowerCase()) || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
            if (!isTypeValid) {
                alert(`Invalid file format for "${file.name}". Supported image formats: JPEG, PNG, WEBP, and GIF.`);
                continue;
            }
            if (file.size > MAX_SIZE) {
                alert(`File size exceeds 5MB limit: "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Please select images under 5MB.`);
                continue;
            }
            validFiles.push(file);
        }

        if (!validFiles.length) {
            e.target.value = "";
            return;
        }

        // Store files locally for preview — actual upload deferred to handleSubmit
        const newPending = validFiles.map((file, i) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            display_order: pendingImageFiles.length + i,
            is_cover: pendingImageFiles.length === 0 && i === 0,
            alt_text: file.name || "",
        }));

        setPendingImageFiles((prev) => [...prev, ...newPending]);

        // Reset the input so the same files can be re-selected if removed
        e.target.value = "";
    };

    const removePendingImage = (index) => {
        setPendingImageFiles((prev) => {
            // Revoke preview URL to avoid memory leaks
            URL.revokeObjectURL(prev[index].previewUrl);
            const updated = prev.filter((_, i) => i !== index);
            // Re-assign display_order and is_cover
            return updated.map((img, i) => ({
                ...img,
                display_order: i,
                is_cover: i === 0,
            }));
        });
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

    const validateCurrentStep = () => {
        const errors = {};
        if (currentStep === 1) {
            if (!formData.title?.trim()) {
                errors.title = "Property title is required.";
            } else if (formData.title.trim().length < 10) {
                errors.title = "Property title must be at least 10 characters.";
            } else if (formData.title.trim().length > 100) {
                errors.title = "Title exceeds 100 characters.";
            }

            if (!formData.description?.trim()) {
                errors.description = "Property description is required.";
            } else if (formData.description.trim().length < 20) {
                errors.description = "Property description must be at least 20 characters.";
            } else if (formData.description.trim().length > 1000) {
                errors.description = "Description exceeds 1000 characters.";
            }

            if (!formData.price_per_night || Number(formData.price_per_night) <= 0) {
                errors.price_per_night = "Please enter a valid price per night.";
            }
        }

        if (currentStep === 2) {
            if (!formData.location?.address?.trim()) {
                errors.address = "Street address is required.";
            } else if (formData.location.address.trim().length < 5) {
                errors.address = "Address must be at least 5 characters.";
            }

            if (!formData.location?.city?.trim()) {
                errors.city = "City is required.";
            } else if (formData.location.city.trim().length < 2) {
                errors.city = "City name must be at least 2 characters.";
            }

            if (formData.location?.state?.trim() && formData.location.state.trim().length < 2) {
                errors.state = "State/Province must be at least 2 characters.";
            }

            if (!formData.location?.country?.trim()) {
                errors.country = "Country is required.";
            } else if (formData.location.country.trim().length < 2) {
                errors.country = "Country name must be at least 2 characters.";
            }

            if (formData.location?.postal_code?.trim() && formData.location.postal_code.trim().length < 3) {
                errors.postal_code = "Postal code must be at least 3 characters.";
            }
        }

        setStepErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (!validateCurrentStep()) return;
        if (currentStep < 5) setCurrentStep((s) => s + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    };

    const INITIAL_FORM_DATA = {
        title: "",
        description: "",
        property_type: "house",
        place_type: "entire_place",
        is_owner: true,
        is_agent: false,
        revenue_share_type: "percentage",
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
        amenity_ids: [],
        house_rules: [""],
        cancellation_policy: "",
        check_in_policy: "",
    };

    const resetForm = () => {
        // Revoke all pending preview URLs to avoid memory leaks
        pendingImageFiles.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setPendingImageFiles([]);
        setFormData(INITIAL_FORM_DATA);
        setCurrentStep(1);
        setSubmitStatus("");
    };

    const handleSubmit = async () => {
        let createdPropertyId = null;
        try {
            setIsSubmitting(true);
            setSubmitStatus("Creating property...");

            // Step 1: Build the property payload (no images yet)
            const propertyMeta = {
                ...formData,
                bedrooms: parseInt(formData.bedrooms, 10),
                beds: parseInt(formData.beds, 10),
                bathrooms: parseFloat(formData.bathrooms),
                max_guests: parseInt(formData.max_guests, 10),
                max_adults: parseInt(formData.max_adults, 10),
                max_children: parseInt(formData.max_children, 10),
                max_infants: parseInt(formData.max_infants, 10),
                price_per_night: Math.round(parseFloat(formData.price_per_night || 0) * 100),
                cleaning_fee: formData.cleaning_fee ? Math.round(parseFloat(formData.cleaning_fee) * 100) : 0,
                service_fee: formData.service_fee ? Math.round(parseFloat(formData.service_fee) * 100) : 0,
                weekly_discount: parseFloat(formData.weekly_discount) || 0,
                monthly_discount: parseFloat(formData.monthly_discount) || 0,
                revenue_share: parseFloat(formData.revenue_share) || 0,
                location: {
                    ...formData.location,
                    latitude: formData.location.latitude ? parseFloat(formData.location.latitude) : 0,
                    longitude: formData.location.longitude ? parseFloat(formData.location.longitude) : 0,
                },
                house_rules: formData.house_rules.filter((r) => r.trim() !== ""),
                images: [], // Images uploaded separately after property creation
            };

            // Step 2: Create the property — get back the new property_id
            const createdProperty = await createProperty(propertyMeta).unwrap();
            createdPropertyId = createdProperty.id;

            // Step 3: Upload each pending image to S3 with property_id
            const uploadedImages = [];
            if (pendingImageFiles.length > 0) {
                for (let i = 0; i < pendingImageFiles.length; i++) {
                    const pending = pendingImageFiles[i];
                    setSubmitStatus(`Uploading images (${i + 1}/${pendingImageFiles.length})...`);

                    const uploadData = new FormData();
                    uploadData.append("image", pending.file);
                    uploadData.append("display_order", pending.display_order);
                    uploadData.append("is_cover", pending.is_cover);
                    uploadData.append("alt_text", pending.alt_text || pending.file.name || "");
                    uploadData.append("property_id", createdPropertyId);

                    const uploadResponse = await uploadImage(uploadData).unwrap();
                    uploadedImages.push({
                        image_url: uploadResponse.image_url,
                        display_order: uploadResponse.display_order,
                        is_cover: uploadResponse.is_cover,
                        alt_text: uploadResponse.alt_text || "",
                    });
                }

                // Step 4: Patch the property with the uploaded image URLs
                setSubmitStatus("Saving images to property...");
                await updateProperty({ id: createdPropertyId, images: uploadedImages }).unwrap();
            }

            alert("Success! Your property listing has been created and saved successfully.");
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            console.error("Failed to create property:", err);
            
            // Rollback if property was created but image upload or patch failed
            if (createdPropertyId) {
                try {
                    setSubmitStatus("Cleaning up database due to error...");
                    await deleteProperty(createdPropertyId).unwrap();
                    console.log(`Rolled back creation of property ID ${createdPropertyId}`);
                } catch (rollbackErr) {
                    console.error("Rollback failed:", rollbackErr);
                }
            }

            const detailedReason = getDetailedErrorMessage(err);
            alert(`Property Creation Failed!\n\nReason: ${detailedReason}\n\nNo property data was saved to the database.`);
        } finally {
            setIsSubmitting(false);
            setSubmitStatus("");
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
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Property Title *
                                    </label>
                                    <span className={`text-xs font-medium ${100 - (formData.title?.length || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        Remaining: {100 - (formData.title?.length || 0)}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        if (stepErrors.title) setStepErrors(prev => ({ ...prev, title: "" }));
                                    }}
                                    onBlur={(e) => {
                                        const val = e.target.value.trim();
                                        if (!val) {
                                            setStepErrors(prev => ({ ...prev, title: "Property title is required." }));
                                        } else if (val.length < 10) {
                                            setStepErrors(prev => ({ ...prev, title: `Title is too short — minimum 10 characters (${val.length}/10).` }));
                                        } else if (val.length > 100) {
                                            setStepErrors(prev => ({ ...prev, title: "Title exceeds the 100 character limit." }));
                                        } else {
                                            setStepErrors(prev => ({ ...prev, title: "" }));
                                        }
                                    }}
                                    placeholder="Enter Property Title (e.g. Modern Sunset Villa - max 100 chars)"
                                    maxLength={100}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 ${stepErrors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                />
                                {stepErrors.title && <p className="mt-1 text-xs text-red-600">{stepErrors.title}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description *
                                    </label>
                                    <span className={`text-xs font-medium ${1000 - (formData.description?.length || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        Remaining: {1000 - (formData.description?.length || 0)}
                                    </span>
                                </div>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        if (stepErrors.description) setStepErrors(prev => ({ ...prev, description: "" }));
                                    }}
                                    onBlur={(e) => {
                                        const val = e.target.value.trim();
                                        if (!val) {
                                            setStepErrors(prev => ({ ...prev, description: "Property description is required." }));
                                        } else if (val.length < 20) {
                                            setStepErrors(prev => ({ ...prev, description: `Description is too short — minimum 20 characters (${val.length}/20).` }));
                                        } else if (val.length > 1000) {
                                            setStepErrors(prev => ({ ...prev, description: "Description exceeds the 1000 character limit." }));
                                        } else {
                                            setStepErrors(prev => ({ ...prev, description: "" }));
                                        }
                                    }}
                                    rows="3"
                                    placeholder="Enter Detailed Description (max 1000 chars)"
                                    maxLength={1000}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 ${stepErrors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                />
                                {stepErrors.description && <p className="mt-1 text-xs text-red-600">{stepErrors.description}</p>}
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
                            {/* Ownership / Agent */}
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
                                    <option value="QAR">QAR</option>
                                    <option value="AED">AED</option>
                                    <option value="KWD">KWD</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price/Night *
                                </label>
                                <input
                                    type="number"
                                    name="price_per_night"
                                    placeholder="Enter Price/Night (max 6 digits)"
                                    value={formData.price_per_night}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        if (stepErrors.price_per_night) setStepErrors(prev => ({ ...prev, price_per_night: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg ${stepErrors.price_per_night ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                />
                                {stepErrors.price_per_night && <p className="mt-1 text-xs text-red-600">{stepErrors.price_per_night}</p>}
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
                    </div>
                );

            case 2:
                const currentLat = Number(formData.location.latitude) || 25.2854;
                const currentLng = Number(formData.location.longitude) || 51.531;

                return (
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Address *
                                </label>
                                <span className={`text-xs font-medium ${100 - (formData.location.address?.length || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                    Remaining: {100 - (formData.location.address?.length || 0)}
                                </span>
                            </div>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter Street Address (max 100 chars)"
                                maxLength={100}
                                value={formData.location.address}
                                onChange={(e) => {
                                    handleLocationChange(e);
                                    if (stepErrors.address) setStepErrors(prev => ({ ...prev, address: "" }));
                                }}
                                className={`w-full px-4 py-2 border rounded-lg ${stepErrors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                            />
                            {stepErrors.address && <p className="mt-1 text-xs text-red-600">{stepErrors.address}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        City *
                                    </label>
                                    <span className={`text-xs font-medium ${50 - (formData.location.city?.length || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        Remaining: {50 - (formData.location.city?.length || 0)}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter City Name (max 50 chars)"
                                    maxLength={50}
                                    value={formData.location.city}
                                    onChange={(e) => {
                                        handleLocationChange(e);
                                        if (stepErrors.city) setStepErrors(prev => ({ ...prev, city: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg ${stepErrors.city ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                />
                                {stepErrors.city && <p className="mt-1 text-xs text-red-600">{stepErrors.city}</p>}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        State/Province
                                    </label>
                                    <span className={`text-xs font-medium ${50 - (formData.location.state?.length || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        Remaining: {50 - (formData.location.state?.length || 0)}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="Enter State/Province (max 50 chars)"
                                    maxLength={50}
                                    value={formData.location.state}
                                    onChange={(e) => {
                                        handleLocationChange(e);
                                        if (stepErrors.state) setStepErrors(prev => ({ ...prev, state: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg ${stepErrors.state ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                />
                                {stepErrors.state && <p className="mt-1 text-xs text-red-600">{stepErrors.state}</p>}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Country *
                                    </label>
                                    <span className={`text-xs font-medium ${50 - (formData.location.country?.length || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        Remaining: {50 - (formData.location.country?.length || 0)}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Enter Country Name (max 50 chars)"
                                    maxLength={50}
                                    value={formData.location.country}
                                    onChange={(e) => {
                                        handleLocationChange(e);
                                        if (stepErrors.country) setStepErrors(prev => ({ ...prev, country: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg ${stepErrors.country ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                />
                                {stepErrors.country && <p className="mt-1 text-xs text-red-600">{stepErrors.country}</p>}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Postal Code
                                    </label>
                                    <span className={`text-xs font-medium ${20 - (formData.location.postal_code?.length || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        Remaining: {20 - (formData.location.postal_code?.length || 0)}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    name="postal_code"
                                    placeholder="Enter Postal Code (max 20 chars)"
                                    maxLength={20}
                                    value={formData.location.postal_code}
                                    onChange={(e) => {
                                        handleLocationChange(e);
                                        if (stepErrors.postal_code) setStepErrors(prev => ({ ...prev, postal_code: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg ${stepErrors.postal_code ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                />
                                {stepErrors.postal_code && <p className="mt-1 text-xs text-red-600">{stepErrors.postal_code}</p>}
                            </div>
                        </div>

                        {/* Interactive Google Map Pin Picker with Search Box */}
                        <div className="space-y-2 pt-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Select Property Map Location (Search or drag pin to place exact location)
                            </label>
                            {isGoogleMapLoaded && (
                                <div className="mb-2">
                                    <Autocomplete
                                        onLoad={(instance) => setAutocomplete(instance)}
                                        onPlaceChanged={() => {
                                            if (autocomplete !== null) {
                                                const place = autocomplete.getPlace();
                                                if (place?.geometry?.location) {
                                                    const lat = place.geometry.location.lat();
                                                    const lng = place.geometry.location.lng();
                                                    const formattedAddress = place.formatted_address || place.name || "";
                                                    
                                                    // Parse address components
                                                    let city = "";
                                                    let country = "";
                                                    let state = "";
                                                    let postalCode = "";

                                                    place.address_components?.forEach((component) => {
                                                        const types = component.types;
                                                        if (types.includes("locality") || types.includes("postal_town")) {
                                                            city = component.long_name;
                                                        }
                                                        if (types.includes("country")) {
                                                            country = component.long_name;
                                                        }
                                                        if (types.includes("administrative_area_level_1")) {
                                                            state = component.long_name;
                                                        }
                                                        if (types.includes("postal_code")) {
                                                            postalCode = component.long_name;
                                                        }
                                                    });

                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        location: {
                                                            ...prev.location,
                                                            address: formattedAddress,
                                                            city: city || prev.location.city,
                                                            country: country || prev.location.country,
                                                            state: state || prev.location.state,
                                                            postal_code: postalCode || prev.location.postal_code,
                                                            latitude: lat,
                                                            longitude: lng,
                                                        },
                                                    }));

                                                    // Clear location step errors when place is picked
                                                    setStepErrors((prev) => ({
                                                        ...prev,
                                                        address: "",
                                                        city: "",
                                                        country: "",
                                                        state: "",
                                                        postal_code: "",
                                                    }));
                                                }
                                            }
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search location on Google Map (e.g. West Bay, Doha)"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 text-sm"
                                        />
                                    </Autocomplete>
                                </div>
                            )}

                            <div className="border rounded-lg overflow-hidden border-gray-300">
                                {isGoogleMapLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={{ width: "100%", height: "300px" }}
                                        center={{ lat: currentLat, lng: currentLng }}
                                        zoom={13}
                                        options={{ zoomControl: true }}
                                    >
                                        <Marker
                                            position={{ lat: currentLat, lng: currentLng }}
                                            draggable={true}
                                            onDragEnd={(e) => {
                                                if (e?.latLng) {
                                                    const newLat = e.latLng.lat();
                                                    const newLng = e.latLng.lng();
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        location: {
                                                            ...prev.location,
                                                            latitude: newLat,
                                                            longitude: newLng
                                                        }
                                                    }));
                                                }
                                            }}
                                        />
                                    </GoogleMap>
                                ) : (
                                    <div className="h-[300px] bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                                        Loading Google Map...
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 flex justify-between px-1">
                                <span>Selected Pin Coordinates:</span>
                                <span className="font-mono text-indigo-600 font-medium">
                                    Lat: {currentLat.toFixed(6)}, Lng: {currentLng.toFixed(6)}
                                </span>
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
                                    Click to select images
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
                                Minimum 5 images recommended. Images will be uploaded when you create the listing.
                            </p>
                        </div>

                        {pendingImageFiles.length > 0 && (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-700">
                                        {pendingImageFiles.length} image{pendingImageFiles.length !== 1 ? "s" : ""} selected
                                    </p>
                                    <button
                                        onClick={() => {
                                            pendingImageFiles.forEach((img) => URL.revokeObjectURL(img.previewUrl));
                                            setPendingImageFiles([]);
                                        }}
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        Remove all
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
                                    {pendingImageFiles.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative group aspect-square"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={img.previewUrl}
                                                alt={img.alt_text}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                <button
                                                    onClick={() => removePendingImage(index)}
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
                                            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded truncate max-w-[80%]">
                                                {img.file.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
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

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Amenities
                                </label>
                                <span className="text-xs text-gray-500">
                                    Selected: {formData.amenity_ids?.length || 0}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Select amenities available at your property.
                            </p>

                            {isAmenitiesLoading ? (
                                <div className="border p-4 rounded-lg bg-gray-50 text-center text-sm text-gray-500">
                                    Loading available amenities...
                                </div>
                            ) : amenitiesError ? (
                                <div className="border p-4 rounded-lg bg-red-50 text-center text-sm text-red-600">
                                    Failed to load amenities. ({amenitiesError?.data?.message || amenitiesError?.error || "Error"})
                                </div>
                            ) : !amenitiesData || amenitiesData.length === 0 ? (
                                <div className="border p-4 rounded-lg bg-gray-50 text-center text-sm text-gray-500">
                                    No amenities found.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto border p-3 rounded-lg bg-gray-50">
                                    {amenitiesData.map((amenity) => {
                                        const isChecked = formData.amenity_ids?.includes(amenity.id);
                                        return (
                                            <label
                                                key={amenity.id}
                                                className={`flex items-center space-x-2.5 p-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                                                    isChecked
                                                        ? "border-rose-500 bg-rose-50 text-rose-900 font-medium"
                                                        : "border-gray-200 bg-white hover:bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleAmenityToggle(amenity.id)}
                                                    className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                                                />
                                                <span className="truncate">{amenity.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
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
                    {dynamicStats.map((stat, index) => (
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
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="properties">Properties</TabsTrigger>
                        <TabsTrigger value="bookings" className="relative">
                            Bookings
                            {!isBookingsLoading && activeBookingsCount > 0 && (
                                <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                                    {activeBookingsCount}
                                </span>
                            )}
                        </TabsTrigger>
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
                                onViewDetails={(booking) =>
                                    setSelectedBooking(booking)
                                }
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
                                        disabled={isSubmitting}
                                        className="bg-green-600 hover:bg-green-700 min-w-[160px]"
                                    >
                                        {isSubmitting ? (
                                            <span className="truncate text-sm">{submitStatus || "Submitting..."}</span>
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
