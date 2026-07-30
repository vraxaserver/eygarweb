"use client";

import { selectCurrentUser } from "@/store/slices/authSlice";

import { useSelector } from "react-redux";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import DetailsStep from "./_components/DetailsStep";
import LocationStep from "./_components/LocationStep";
import AmenitiesExperiencesStep from "./_components/AmenitiesExperiencesStep";
import ImagesDisplay from "./_components/ImagesDisplay";
import ConfirmStep from "./_components/ConfirmStep";
import {
    useGetPropertyByIdQuery,
    useUpdatePropertyMutation,
    useUploadImageMutation,
} from "@/store/features/propertiesApi";

function getDetailedErrorMessage(err) {
    if (!err) return "An unknown error occurred.";
    if (typeof err === "string" && err.trim()) return err;
    const data = err?.data ?? err;
    if (typeof data === "string" && data.trim()) return data;

    if (data?.detail) {
        if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
        if (Array.isArray(data.detail)) {
            return data.detail.map((e) => typeof e === 'string' ? e : `${e.loc?.slice(-1)?.[0] || 'Field'}: ${e.msg || JSON.stringify(e)}`).join("\n");
        }
        return JSON.stringify(data.detail);
    }
    if (data?.message) {
        if (typeof data.message === "string" && data.message.trim()) return data.message;
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
    if (err?.error && typeof err.error === 'string') return err.error;
    if (err?.message && typeof err.message === 'string') return err.message;
    if (err?.status) return `Request failed with status code ${err.status}`;

    try {
        const str = JSON.stringify(err);
        if (str && str !== "{}") return str;
    } catch {}

    return "Server error occurred. Please verify inputs and try again.";
}

export default function PropertyEditPage({ params }) {
    const { id: propertyId } = use(params);
    const router = useRouter();

    const user = useSelector(selectCurrentUser);

    const [formData, setFormData] = useState({});

    // Image Management State
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [hasPermission, setHasPermission] = useState(false);

    const currentUserId = user?.eygar_host?.id;

    const {
        data: propertyData,
        isLoading,
        isError,
        error: fetchError,
    } = useGetPropertyByIdQuery(propertyId);
    const [
        updateProperty,
        {
            isLoading: isUpdating,
            isError: isUpdateError,
            error: updateError,
            isSuccess: isUpdateSuccess,
        },
    ] = useUpdatePropertyMutation();
    const [uploadImage] = useUploadImageMutation();
    const [isUploading, setIsUploading] = useState(false);

    // 1. Initialize Data
    useEffect(() => {
        if (propertyData) {
            if (propertyData.host_id === currentUserId) {
                setHasPermission(true);
                setFormData({
                    title: propertyData.title || "",
                    description: propertyData.description || "",
                    property_type: propertyData.property_type || "",
                    place_type: propertyData.place_type || "",
                    price_per_night: propertyData.price_per_night,
                    currency: propertyData.currency || "",
                    bedrooms: propertyData.bedrooms,
                    beds: propertyData.beds,
                    bathrooms: propertyData.bathrooms,
                    max_guests: propertyData.max_guests,
                    is_featured: propertyData.is_featured,
                    amenity_ids: propertyData.amenities ? propertyData.amenities.map(a => a.id) : [],
                    experience_ids: propertyData.experiences ? propertyData.experiences.map(e => e.id) : [],
                    location: { ...propertyData.location },
                });
                setExistingImages(propertyData.images || []);
            } else {
                router.push("/");
            }
        }
    }, [propertyData, currentUserId, router]);

    // 2. Handle Success/Error Redirects
    useEffect(() => {
        if (isUpdateSuccess) {
            setSubmitMessage("Property updated successfully!");
            alert("Success! Property updated successfully.");
            setIsSubmitting(false);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        }
        if (isUpdateError) {
            const reason = getDetailedErrorMessage(updateError);
            setSubmitMessage(`Error updating property: ${reason}`);
            alert(`Property Update Failed!\n\nReason: ${reason}`);
            setIsSubmitting(false);
        }
    }, [isUpdateSuccess, isUpdateError, updateError, router]);

    // --- Handlers ---

    const handleAddImages = async (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB

            const validFiles = [];
            for (const file of files) {
                const isTypeValid = ALLOWED_TYPES.includes(file.type.toLowerCase()) || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
                if (!isTypeValid) {
                    alert(`Invalid file format for "${file.name}". Supported formats: JPEG, PNG, WEBP, and GIF.`);
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

            setIsUploading(true);
            setSubmitMessage("Uploading images...");

            try {
                const uploadedUrls = [];
                for (let i = 0; i < validFiles.length; i++) {
                    const file = validFiles[i];
                    const uploadData = new FormData();
                    uploadData.append("image", file);
                    uploadData.append("display_order", existingImages.length + i);
                    uploadData.append("is_cover", existingImages.length === 0 && i === 0);
                    uploadData.append("alt_text", file.name || "");
                    uploadData.append("property_id", propertyId);

                    const response = await uploadImage(uploadData).unwrap();
                    uploadedUrls.push({
                        image_url: response.image_url,
                        display_order: existingImages.length + i,
                        is_cover: existingImages.length === 0 && i === 0,
                        alt_text: file.name || "",
                    });
                }
                setExistingImages((prev) => [...prev, ...uploadedUrls]);
                setSubmitMessage("Images uploaded successfully!");
            } catch (err) {
                console.error("Failed to upload images:", err);
                const reason = getDetailedErrorMessage(err);
                setSubmitMessage(`Upload failed: ${reason}`);
                alert(`Image Upload Failed!\n\nReason: ${reason}`);
            } finally {
                setIsUploading(false);
                e.target.value = "";
            }
        }
    };

    const handleRemoveNewImage = (indexToRemove) => {
        // Since all new images are uploaded immediately and added to existingImages, this is a no-op
    };

    const handleRemoveExistingImage = (imageId) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId && img.image_url !== imageId));
    };

    const validateStep = (step) => {
        const errors = [];
        if (step === 0) { // Basic Details
            const title = formData.title?.trim() || "";
            if (!title) {
                errors.push("Property Title is required.");
            } else if (title.length < 10) {
                errors.push(`Property Title must be at least 10 characters (${title.length}/10).`);
            } else if (title.length > 100) {
                errors.push("Property Title cannot exceed 100 characters.");
            }

            const desc = formData.description?.trim() || "";
            if (!desc) {
                errors.push("Description is required.");
            } else if (desc.length < 50) {
                errors.push(`Description must be at least 50 characters (${desc.length}/50).`);
            } else if (desc.length > 500) {
                errors.push("Description cannot exceed 500 characters.");
            }

            const price = Number(formData.price_per_night);
            if (!formData.price_per_night || Number.isNaN(price) || price <= 0) {
                errors.push("Price Per Night must be a valid number greater than 0.");
            }
        }

        if (step === 1) { // Location
            const loc = formData.location || {};
            if (!loc.address?.trim()) {
                errors.push("Street Address is required.");
            } else if (loc.address.trim().length < 5) {
                errors.push("Street Address must be at least 5 characters.");
            }

            if (!loc.city?.trim()) {
                errors.push("City is required.");
            } else if (loc.city.trim().length < 2) {
                errors.push("City name must be at least 2 characters.");
            }

            if (!loc.country?.trim()) {
                errors.push("Country is required.");
            } else if (loc.country.trim().length < 2) {
                errors.push("Country name must be at least 2 characters.");
            }

            if (loc.postal_code?.trim() && loc.postal_code.trim().length < 3) {
                errors.push("Postal code must be at least 3 characters.");
            }
        }

        if (errors.length > 0) {
            alert(`Validation Failed!\n\n${errors.join("\n")}`);
            return false;
        }

        return true;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        if (currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLocationChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(0) || !validateStep(1)) return;
        setIsSubmitting(true);
        setSubmitMessage("");

        if (!hasPermission) return;

        try {
            const payload = {
                id: propertyId,
                title: formData.title || "",
                description: formData.description || "",
                property_type: formData.property_type || "",
                place_type: formData.place_type || "",
                currency: formData.currency || "",
                is_featured: formData.is_featured,
                price_per_night: formData.price_per_night
                    ? Math.round(parseFloat(formData.price_per_night) * 100)
                    : 0,
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : 0,
                beds: formData.beds ? parseInt(formData.beds, 10) : 0,
                bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : 0,
                max_guests: formData.max_guests ? parseInt(formData.max_guests, 10) : 1,
                amenity_ids: formData.amenity_ids || [],
                experience_ids: formData.experience_ids || [],
                location: {
                    address: formData.location.address || "",
                    city: formData.location.city || "",
                    state: formData.location.state || "",
                    country: formData.location.country || "",
                    postal_code: formData.location.postal_code || "",
                    latitude: formData.location.latitude
                        ? parseFloat(formData.location.latitude)
                        : 0,
                    longitude: formData.location.longitude
                        ? parseFloat(formData.location.longitude)
                        : 0,
                    id: formData.location.id,
                },
                images: existingImages.map((img, idx) => ({
                    image_url: img.image_url,
                    display_order: img.display_order ?? idx,
                    is_cover: img.is_cover ?? (idx === 0),
                    alt_text: img.alt_text ?? ""
                }))
            };

            await updateProperty(payload).unwrap();
        } catch (err) {
            console.error("Failed to update property:", err);
            // Error displayed via useEffect
        }
    };

    if (isLoading)
        return <div className="p-8 text-center">Loading property data...</div>;
    if (isError)
        return (
            <div className="p-8 text-red-600 text-center">
                Error: {fetchError?.data?.detail || "Failed to load property"}
            </div>
        );
    if (!hasPermission || !propertyData) return null;

    const steps = [
        <DetailsStep
            key="details"
            formData={formData}
            handleChange={handleChange}
        />,
        <LocationStep
            key="location"
            formData={formData}
            handleChange={handleLocationChange}
        />,
        <AmenitiesExperiencesStep
            key="amenities_experiences"
            formData={formData}
            setFormData={setFormData}
        />,
        <ImagesDisplay
            key="images"
            existingImages={existingImages}
            newImages={newImages}
            onAddImages={handleAddImages}
            onRemoveNewImage={handleRemoveNewImage}
            onRemoveExistingImage={handleRemoveExistingImage}
        />,
        <ConfirmStep
            key="confirm"
            formData={formData}
            newImagesCount={newImages.length}
            deletedImagesCount={deletedImageIds.length}
        />,
    ];

    return (
        <div className="container mx-auto p-8 max-w-2xl bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Edit Property: {propertyData.title}
            </h1>

            <div className="mb-6">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`flex-1 text-center py-2 ${
                                index === currentStep
                                    ? "font-bold text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500"
                            }`}
                        >
                            Step {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {steps[currentStep]}

                <div className="flex justify-between mt-8">
                    {currentStep > 0 && (
                        <button
                            type="button" // CRITICAL: explicit type="button"
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                            Back
                        </button>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <button
                            type="button" // CRITICAL: explicit type="button" prevents auto-submit
                            onClick={handleNext}
                            className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit" // Only the last button submits
                            disabled={isSubmitting || isUpdating}
                            className={`ml-auto px-6 py-3 rounded-md transition duration-200 ${
                                isSubmitting || isUpdating
                                    ? "bg-green-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        >
                            {isSubmitting || isUpdating
                                ? "Updating..."
                                : "Update Property"}
                        </button>
                    )}
                </div>
                {submitMessage && (
                    <p
                        className={`mt-4 text-center ${
                            submitMessage.includes("Error")
                                ? "text-red-600"
                                : "text-green-600"
                        }`}
                    >
                        {submitMessage}
                    </p>
                )}
            </form>
        </div>
    );
}
