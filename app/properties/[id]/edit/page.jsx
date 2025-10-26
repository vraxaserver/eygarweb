// app/properties/[id]/edit/page.jsx
"use client";

import { selectCurrentUser } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DetailsStep from './_components/DetailsStep';
import LocationStep from './_components/LocationStep';
import ImagesDisplay from './_components/ImagesDisplay'; // Assuming this component is for display, not upload
import ConfirmStep from './_components/ConfirmStep';
import { useGetPropertyByIdQuery, useUpdatePropertyMutation } from "@/store/features/propertiesApi"; // Import useGetPropertyByIdQuery

export default function PropertyEditPage({ params }) {
    const user = useSelector(selectCurrentUser);
    const { id: propertyId } = params;
    const router = useRouter();

    const [formData, setFormData] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [hasPermission, setHasPermission] = useState(false);

    const currentUserId = user?.eygar_host?.id;

    const { data: propertyData, isLoading, isError, error: fetchError } = useGetPropertyByIdQuery(propertyId);
    const [updateProperty, { isLoading: isUpdating, isError: isUpdateError, error: updateError, isSuccess: isUpdateSuccess }] = useUpdatePropertyMutation();


    // Effect to initialize formData and check permissions once propertyData is loaded
    useEffect(() => {
        if (propertyData) {
            if (propertyData.host_id === currentUserId) {
                setHasPermission(true);
                // Initialize formData with existing property data
                setFormData({
                    property_type: propertyData.property_type,
                    place_type: propertyData.place_type,
                    price_per_night: propertyData.price_per_night,
                    currency: propertyData.currency,
                    bedrooms: propertyData.bedrooms,
                    beds: propertyData.beds,
                    bathrooms: propertyData.bathrooms,
                    max_guests: propertyData.max_guests,
                    is_featured: propertyData.is_featured,
                    location: { ...propertyData.location },
                    // Add other fields you want to be editable
                });
            } else {
                router.push('/'); // Redirect if user does not own the property
            }
        }
    }, [propertyData, currentUserId, router]);

    // Effect for handling update response
    useEffect(() => {
        if (isUpdateSuccess) {
            setSubmitMessage('Property updated successfully!');
            setIsSubmitting(false);
            // Optionally redirect or show a success message
            // router.push(`/properties/${propertyId}`); // Example redirect
        }
        if (isUpdateError) {
            setSubmitMessage(`Error updating property: ${updateError?.data?.detail || updateError?.message || 'Unknown error'}`);
            setIsSubmitting(false);
        }
    }, [isUpdateSuccess, isUpdateError, updateError]);


    const handleNext = () => setCurrentStep((prev) => prev + 1);
    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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
        setIsSubmitting(true);
        setSubmitMessage('');

        if (!hasPermission) {
            setSubmitMessage("You do not have permission to edit this property.");
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                id: propertyId, // Make sure to include the ID for the mutation
                property_type: formData.property_type,
                place_type: formData.place_type, // Ensure place_type is included if editable
                price_per_night: parseFloat(formData.price_per_night),
                currency: formData.currency,
                bedrooms: parseInt(formData.bedrooms),
                beds: parseInt(formData.beds),
                bathrooms: parseFloat(formData.bathrooms),
                max_guests: parseInt(formData.max_guests),
                is_featured: formData.is_featured,
                location: {
                    address: formData.location.address,
                    city: formData.location.city,
                    state: formData.location.state,
                    country: formData.location.country,
                    postal_code: formData.location.postal_code,
                    latitude: parseFloat(formData.location.latitude),
                    longitude: parseFloat(formData.location.longitude),
                    id: formData.location.id, // Keep location ID if it's part of the update
                },
                // Add any other fields that can be updated
            };

            await updateProperty(payload).unwrap(); // .unwrap() to catch errors
        } catch (err) {
            // Error handling is now done in the useEffect for updateError
            console.error("Failed to update property:", err);
        } finally {
            // isSubmitting will be reset by the useEffect for isUpdateSuccess/isUpdateError
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading property data...</div>;
    }

    if (isError) {
        return <div className="p-8 text-red-600 text-center">Error: {fetchError?.data?.detail || fetchError?.message || 'Failed to load property'}</div>;
    }

    if (!hasPermission) {
        return null; // Redirect handled in useEffect
    }

    if (!propertyData) {
        return <div className="p-8 text-center">Property not found.</div>;
    }

    const steps = [
        <DetailsStep key="details" formData={formData} handleChange={handleChange} />,
        <LocationStep key="location" formData={formData} handleChange={handleLocationChange} />,
        <ImagesDisplay key="images" images={propertyData.images} coverImage={propertyData.images[0]} />,
        <ConfirmStep key="confirm" formData={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting || isUpdating} submitMessage={submitMessage} />,
    ];

    return (
        <div className="container mx-auto p-8 max-w-2xl bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Property: {propertyData.title}</h1>

            <div className="mb-6">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex-1 text-center py-2 ${index === currentStep ? 'font-bold text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
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
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                            Back
                        </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting || isUpdating}
                            className={`ml-auto px-6 py-3 rounded-md transition duration-200 ${
                                (isSubmitting || isUpdating) ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {(isSubmitting || isUpdating) ? 'Updating...' : 'Update Property'}
                        </button>
                    )}
                </div>
                {submitMessage && (
                    <p className={`mt-4 text-center ${submitMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {submitMessage}
                    </p>
                )}
            </form>
        </div>
    );
}
