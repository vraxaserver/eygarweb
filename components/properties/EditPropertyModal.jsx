"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DetailsStep from "@/app/properties/[id]/edit/_components/DetailsStep";
import LocationStep from "@/app/properties/[id]/edit/_components/LocationStep";
import AmenitiesExperiencesStep from "@/app/properties/[id]/edit/_components/AmenitiesExperiencesStep";
import ImagesDisplay from "@/app/properties/[id]/edit/_components/ImagesDisplay";
import ConfirmStep from "@/app/properties/[id]/edit/_components/ConfirmStep";
import {
    useGetPropertyByIdQuery,
    useUpdatePropertyMutation,
    useUploadImageMutation,
} from "@/store/features/propertiesApi";
import { toast } from "sonner";

export default function EditPropertyModal({ propertyId, open, onOpenChange, onSuccess }) {
    const [formData, setFormData] = useState({});
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const {
        data: propertyData,
        isLoading,
        isError,
        error: fetchError,
    } = useGetPropertyByIdQuery(propertyId, { skip: !propertyId || !open });

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

    // Initialize Form Data when modal opens & property data arrives
    useEffect(() => {
        if (open && propertyData) {
            setFormData({
                title: propertyData.title || "",
                description: propertyData.description || "",
                property_type: propertyData.property_type || "",
                place_type: propertyData.place_type || "",
                price_per_night: propertyData.price_per_night ? (propertyData.price_per_night / 100).toString() : "",
                currency: propertyData.currency || "USD",
                bedrooms: propertyData.bedrooms ?? 1,
                beds: propertyData.beds ?? 1,
                bathrooms: propertyData.bathrooms ?? 1,
                max_guests: propertyData.max_guests ?? 2,
                is_featured: propertyData.is_featured || false,
                amenity_ids: propertyData.amenities ? propertyData.amenities.map((a) => a.id) : [],
                experience_ids: propertyData.experiences ? propertyData.experiences.map((e) => e.id) : [],
                location: { ...propertyData.location },
            });
            setExistingImages(propertyData.images || []);
            setCurrentStep(0);
            setSubmitMessage("");
        }
    }, [open, propertyData]);

    // Handle Success redirect/close
    useEffect(() => {
        if (isUpdateSuccess) {
            setSubmitMessage("Property updated successfully!");
            toast.success("Property updated successfully!");
            setIsSubmitting(false);
            setTimeout(() => {
                onOpenChange(false);
                if (onSuccess) onSuccess();
            }, 800);
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
    }, [isUpdateSuccess, isUpdateError, updateError, onOpenChange, onSuccess]);

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
                setSubmitMessage("Error uploading images. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemoveExistingImage = (imageId) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId && img.image_url !== imageId));
    };

    const handleNext = (e) => {
        e.preventDefault();
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

    const handleLocationChange = (nameOrObj, value) => {
        setFormData((prev) => {
            const updatedLocation = typeof nameOrObj === 'object' && nameOrObj !== null
                ? { ...prev.location, ...nameOrObj }
                : { ...prev.location, [nameOrObj]: value };
            return {
                ...prev,
                location: updatedLocation,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");

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
                    address: formData.location?.address || "",
                    city: formData.location?.city || "",
                    state: formData.location?.state || "",
                    country: formData.location?.country || "",
                    postal_code: formData.location?.postal_code || "",
                    latitude: formData.location?.latitude
                        ? parseFloat(formData.location.latitude)
                        : 0,
                    longitude: formData.location?.longitude
                        ? parseFloat(formData.location.longitude)
                        : 0,
                    id: formData.location?.id,
                },
                images: existingImages.map((img, idx) => ({
                    image_url: img.image_url,
                    display_order: img.display_order ?? idx,
                    is_cover: img.is_cover ?? (idx === 0),
                    alt_text: img.alt_text ?? "",
                })),
            };

            await updateProperty(payload).unwrap();
        } catch (err) {
            console.error("Failed to update property:", err);
        }
    };

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
            onRemoveNewImage={() => {}}
            onRemoveExistingImage={handleRemoveExistingImage}
        />,
        <ConfirmStep
            key="confirm"
            formData={formData}
            newImagesCount={newImages.length}
            deletedImagesCount={deletedImageIds.length}
        />,
    ];

    const stepTitles = ["Details", "Location", "Amenities", "Images", "Confirm"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Edit Property {propertyData?.title ? `: ${propertyData.title}` : ""}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading property details...</div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-600">
                        Failed to load property: {fetchError?.data?.detail || "Error loading details"}
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 border-b pb-2">
                                {stepTitles.map((title, index) => (
                                    <div
                                        key={index}
                                        className={`flex-1 text-center font-medium ${
                                            index === currentStep
                                                ? "font-bold text-rose-600 border-b-2 border-rose-600 pb-1"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {index + 1}. {title}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {steps[currentStep]}

                            <div className="flex justify-between mt-8 pt-4 border-t">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
                                    >
                                        Back
                                    </button>
                                )}

                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="ml-auto px-5 py-2.5 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition duration-200"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isUpdating}
                                        className={`ml-auto px-5 py-2.5 rounded-lg font-medium transition duration-200 ${
                                            isSubmitting || isUpdating
                                                ? "bg-rose-400 text-white cursor-not-allowed"
                                                : "bg-rose-600 hover:bg-rose-700 text-white"
                                        }`}
                                    >
                                        {isSubmitting || isUpdating ? "Updating..." : "Update Property"}
                                    </button>
                                )}
                            </div>

                            {submitMessage && (
                                <p
                                    className={`mt-3 text-center text-sm ${
                                        submitMessage.includes("Error")
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {submitMessage}
                                </p>
                            )}
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
