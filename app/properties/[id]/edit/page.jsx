"use client";

import { selectCurrentUser } from "@/store/slices/authSlice";

import { useSelector } from "react-redux";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import DetailsStep from "./_components/DetailsStep";
import LocationStep from "./_components/LocationStep";
import ImagesDisplay from "./_components/ImagesDisplay";
import ConfirmStep from "./_components/ConfirmStep";
import {
    useGetPropertyByIdQuery,
    useUpdatePropertyMutation,
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

    // 1. Initialize Data
    useEffect(() => {
        if (propertyData) {
            if (propertyData.host_id === currentUserId) {
                setHasPermission(true);
                setFormData({
                    property_type: propertyData.property_type || "",
                    place_type: propertyData.place_type || "",
                    price_per_night: propertyData.price_per_night,
                    currency: propertyData.currency || "",
                    bedrooms: propertyData.bedrooms,
                    beds: propertyData.beds,
                    bathrooms: propertyData.bathrooms,
                    max_guests: propertyData.max_guests,
                    is_featured: propertyData.is_featured,
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

    const handleAddImages = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages((prev) => [...prev, ...files]);
        }
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setNewImages((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleRemoveExistingImage = (imageId) => {
        setDeletedImageIds((prev) => [...prev, imageId]);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
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
        console.log("=== formData ========");
        console.log(formData);

        if (!hasPermission) return;

        try {
            const payload = new FormData();

            // Append Basic Fields (Safe Number Conversion)
            payload.append("id", propertyId);
            payload.append("property_type", formData.property_type || "");
            payload.append("place_type", formData.place_type || "");
            payload.append("currency", formData.currency || "");
            payload.append("is_featured", formData.is_featured);

            // FIXED: Handle empty numbers becoming NaN
            payload.append(
                "price_per_night",
                formData.price_per_night
                    ? parseFloat(formData.price_per_night)
                    : 0
            );
            payload.append(
                "bedrooms",
                formData.bedrooms ? parseInt(formData.bedrooms, 10) : 0
            );
            payload.append(
                "beds",
                formData.beds ? parseInt(formData.beds, 10) : 0
            );
            payload.append(
                "bathrooms",
                formData.bathrooms ? parseFloat(formData.bathrooms) : 0
            );
            payload.append(
                "max_guests",
                formData.max_guests ? parseInt(formData.max_guests, 10) : 1
            );

            // Handle Location
            // We stringify it because FormData can't handle nested objects natively easily
            // Ensure your backend parses this, OR append individual fields if your backend prefers that.
            payload.append(
                "location",
                JSON.stringify({
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
                })
            );

            // Handle Images
            newImages.forEach((file) => {
                payload.append("uploaded_images", file);
            });

            deletedImageIds.forEach((id) => {
                payload.append("deleted_image_ids", id);
            });

            // FIXED: Manually attach ID to the FormData object instance
            // so the Redux Query can find it for the URL construction.
            payload.id = propertyId;
            console.log("payload: ", payload);
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
