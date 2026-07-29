"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateServiceAreaMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";
import useGoogleMapsScript from "@/hooks/useGoogleMapsScript";
import { MapPin, ArrowRight, AlertCircle } from "lucide-react";

export default function ServiceAreaPage() {
    const router = useRouter();
    const [apiError, setApiError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [updateServiceArea, { isLoading }] = useUpdateServiceAreaMutation();
    const isGoogleMapsLoaded = useGoogleMapsScript();

    const inputRef = useRef(null);
    const autocompleteInstanceRef = useRef(null);

    useEffect(() => {
        if (isGoogleMapsLoaded && inputRef.current && !autocompleteInstanceRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(
                inputRef.current,
                {
                    fields: ["address_components", "geometry", "name"],
                    types: ["address"],
                }
            );

            autocompleteInstanceRef.current = autocomplete;
            autocomplete.addListener("place_changed", handlePlaceSelect);
        }

        return () => {
            if (autocompleteInstanceRef.current) {
                if (window.google && window.google.maps && window.google.maps.event) {
                    window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
                }
            }
        };
    }, [isGoogleMapsLoaded]);

    const handlePlaceSelect = () => {
        if (autocompleteInstanceRef.current) {
            const place = autocompleteInstanceRef.current.getPlace();
            if (!place || !place.geometry || !place.address_components) {
                console.error("No details available for selected place.");
                return;
            }

            const getAddressComponent = (type) => {
                const component = place.address_components.find(c => c.types.includes(type));
                return component ? component.long_name : "";
            };

            const streetNumber = getAddressComponent("street_number");
            const route = getAddressComponent("route");
            
            if (inputRef.current) {
                inputRef.current.value = place.name;
            }

            setValue("location_name", place.name, { shouldValidate: true });
            setValue("address_line1", `${streetNumber} ${route}`.trim(), { shouldValidate: true });
            setValue("city", getAddressComponent("locality"), { shouldValidate: true });
            setValue("state", getAddressComponent("administrative_area_level_1"), { shouldValidate: true });
            setValue("postal_code", getAddressComponent("postal_code"), { shouldValidate: true });
            setValue("country", getAddressComponent("country"), { shouldValidate: true });
            setValue("latitude", place.geometry.location.lat());
            setValue("longitude", place.geometry.location.lng());
        }
    };
    
    const onSubmit = async (data) => {
        setApiError("");
        try {
            const payload = {
                ...data,
                location_name: data.location_name.trim(),
                address_line1: data.address_line1.trim(),
                city: data.city.trim(),
                state: data.state.trim(),
                postal_code: data.postal_code.trim(),
                country: data.country.trim(),
            };
            await updateServiceArea(payload).unwrap();
            router.push("/become-a-vendor/contact-details");
        } catch (error) {
            console.error("Failed to update service area:", error);
            if (error?.data?.location_name?.[0]) {
                setApiError(`Location Name: ${error.data.location_name[0]}`);
            } else if (error?.data?.address_line1?.[0]) {
                setApiError(`Address: ${error.data.address_line1[0]}`);
            } else if (error?.data?.city?.[0]) {
                setApiError(`City: ${error.data.city[0]}`);
            } else if (error?.data?.state?.[0]) {
                setApiError(`State: ${error.data.state[0]}`);
            } else if (error?.data?.postal_code?.[0]) {
                setApiError(`Postal Code: ${error.data.postal_code[0]}`);
            } else if (error?.data?.country?.[0]) {
                setApiError(`Country: ${error.data.country[0]}`);
            } else if (error?.data?.detail) {
                setApiError(error.data.detail);
            } else if (error?.data?.message) {
                setApiError(error.data.message);
            } else {
                setApiError("Failed to update service area. Please check your inputs.");
            }
        }
    };

    const inputClass = (hasError) => 
        `w-full px-4 py-2 mt-2 border rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            hasError ? 'border-red-400' : 'border-gray-300'
        }`;

    if (!isGoogleMapsLoaded) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
                <p className="text-gray-600 text-sm">Loading map & location services...</p>
             </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 bg-white border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Define Your Service Area
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Enter your primary business location to help customers find you.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="p-8 space-y-6">
                            {/* API Error Alert */}
                            {apiError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">{apiError}</p>
                                </div>
                            )}

                            {/* Location Name */}
                            <div>
                                <label htmlFor="location_name" className="block text-sm font-medium text-gray-700">
                                    Location Name *
                                </label>
                                <input
                                    id="location_name"
                                    ref={inputRef}
                                    {...register("location_name", {
                                        required: "Location name is required.",
                                        minLength: {
                                            value: 2,
                                            message: "Location name must be at least 2 characters.",
                                        },
                                        validate: (val) =>
                                            !!val.trim() || "Location name cannot be empty or only spaces.",
                                    })}
                                    className={inputClass(errors.location_name)}
                                    placeholder="Start typing your business address..."
                                />
                                {errors.location_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.location_name.message}
                                    </p>
                                )}
                            </div>
                            
                            {/* Address Line 1 */}
                            <div>
                                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">
                                    Address Line 1 *
                                </label>
                                <input
                                    id="address_line1"
                                    {...register("address_line1", {
                                        required: "Address line 1 is required.",
                                        minLength: {
                                            value: 3,
                                            message: "Address line 1 must be at least 3 characters.",
                                        },
                                        validate: (val) =>
                                            !!val.trim() || "Address line 1 cannot be empty or only spaces.",
                                    })}
                                    className={inputClass(errors.address_line1)}
                                    placeholder="Street address or P.O. Box"
                                />
                                {errors.address_line1 && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.address_line1.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City *
                                    </label>
                                    <input
                                        id="city"
                                        {...register("city", {
                                            required: "City is required.",
                                            minLength: {
                                                value: 2,
                                                message: "City name must be at least 2 characters.",
                                            },
                                            validate: (val) =>
                                                !!val.trim() || "City cannot be empty or only spaces.",
                                        })}
                                        className={inputClass(errors.city)}
                                        placeholder="e.g., Doha"
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.city.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State / Province *
                                    </label>
                                    <input
                                        id="state"
                                        {...register("state", {
                                            required: "State or Province is required.",
                                            minLength: {
                                                value: 2,
                                                message: "State name must be at least 2 characters.",
                                            },
                                            validate: (val) =>
                                                !!val.trim() || "State cannot be empty or only spaces.",
                                        })}
                                        className={inputClass(errors.state)}
                                        placeholder="e.g., Doha Municipality"
                                    />
                                    {errors.state && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.state.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                                        Postal Code *
                                    </label>
                                    <input
                                        id="postal_code"
                                        {...register("postal_code", {
                                            required: "Postal code is required.",
                                            pattern: {
                                                value: /^[a-zA-Z0-9\s-]{3,10}$/,
                                                message: "Please enter a valid postal code (3-10 characters).",
                                            },
                                        })}
                                        className={inputClass(errors.postal_code)}
                                        placeholder="e.g., 00000"
                                    />
                                    {errors.postal_code && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.postal_code.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country *
                                    </label>
                                    <input
                                        id="country"
                                        {...register("country", {
                                            required: "Country is required.",
                                            minLength: {
                                                value: 2,
                                                message: "Country name must be at least 2 characters.",
                                            },
                                            validate: (val) =>
                                                !!val.trim() || "Country cannot be empty or only spaces.",
                                        })}
                                        className={inputClass(errors.country)}
                                        placeholder="e.g., Qatar"
                                    />
                                    {errors.country && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.country.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <input type="hidden" {...register("latitude")} />
                            <input type="hidden" {...register("longitude")} />
                        </div>
                        
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Save and Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
