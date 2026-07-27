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
            setIsSubmitting(false);
            // Small delay so user sees the success message
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        }
        if (isUpdateError) {
            setSubmitMessage(
                `Error updating property: ${
                    updateError?.data?.detail ||
                    updateError?.message ||
                    "Unknown error"
                }`
            );
            setIsSubmitting(false);
        }
    }, [isUpdateSuccess, isUpdateError, updateError, router]);

    // --- Handlers ---

    const handleAddImages = async (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            setIsUploading(true);
            setSubmitMessage("Uploading images...");

            try {
                const uploadedUrls = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const uploadData = new FormData();
                    uploadData.append("image", file);
                    uploadData.append("display_order", existingImages.length + i);
                    uploadData.append("is_cover", existingImages.length === 0 && i === 0);
                    uploadData.append("alt_text", file.name || "");

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
                setSubmitMessage("Error uploading images. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemoveNewImage = (indexToRemove) => {
        // Since all new images are uploaded immediately and added to existingImages, this is a no-op
    };

    const handleRemoveExistingImage = (imageId) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId && img.image_url !== imageId));
    };

    // FIXED: Added preventDefault to stop auto-submission
    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
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
        e.preventDefault(); // Final prevention of default submission
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
