"use client";

import { useForm } from "react-hook-form";
import { useUpdateServiceAreaMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import useGoogleMapsScript from "@/hooks/useGoogleMapsScript"; // <-- Make sure this path is correct
import { MapPin, ArrowRight } from "lucide-react";


export default function ServiceAreaPage() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [updateServiceArea, { isLoading }] = useUpdateServiceAreaMutation();
    
    // 1. Use your custom hook to load the script
    const isGoogleMapsLoaded = useGoogleMapsScript();

    // 2. Refs for the input element and the autocomplete instance
    const inputRef = useRef(null);
    const autocompleteInstanceRef = useRef(null);

    // 3. useEffect to initialize Autocomplete when the script is loaded
    useEffect(() => {
        // Ensure the script is loaded, the input ref is attached, and we haven't already initialized.
        if (isGoogleMapsLoaded && inputRef.current && !autocompleteInstanceRef.current) {
            
            // Create a new Autocomplete instance
            const autocomplete = new window.google.maps.places.Autocomplete(
                inputRef.current,
                {
                    fields: ["address_components", "geometry", "name"], // Specify which data to return
                    types: ["address"], // Restrict to addresses
                }
            );

            // Store the instance in a ref
            autocompleteInstanceRef.current = autocomplete;

            // Add listener for when a place is selected
            autocomplete.addListener("place_changed", handlePlaceSelect);
        }

        // Cleanup function to remove the listener
        return () => {
            if (autocompleteInstanceRef.current) {
                 // The google object might not be available during fast-refresh in development
                if(window.google && window.google.maps && window.google.maps.event){
                    window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
                }
            }
        };
    }, [isGoogleMapsLoaded]); // Rerun this effect if the loaded status changes


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
            
            // Manually set the value for the location name input
            if (inputRef.current) {
                inputRef.current.value = place.name;
            }

            // Populate all form fields
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
        try {
            // console.log(data)
            await updateServiceArea(data).unwrap();
            router.push("/become-a-vendor/contact-details");
        } catch (error) {
            console.error("Failed to update service area:", error);
        }
    };

    const inputClass = (hasError) => 
        `w-full px-4 py-2 mt-2 border rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            hasError ? 'border-red-400' : 'border-gray-300'
        }`;

    // Show a loading state until your custom hook reports the script is ready
    if (!isGoogleMapsLoaded) {
        return (
             <div className="min-h-screen flex items-center justify-center">
                <p>Loading Map...</p>
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

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-8 space-y-6">
                            {/* Location Name (Autocomplete) */}
                            <div>
                                <label htmlFor="location_name" className="block text-sm font-medium text-gray-700">
                                    Location Name *
                                </label>
                                {/* 4. Attach the ref directly to the input */}
                                <input
                                    id="location_name"
                                    ref={inputRef}
                                    {...register("location_name", { required: "Location is required." })}
                                    className={inputClass(errors.location_name)}
                                    placeholder="Start typing your business address..."
                                />
                                {errors.location_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.location_name.message}
                                    </p>
                                )}
                            </div>
                            
                            {/* The rest of the form is the same, now populated by setValue */}
                            <div>
                                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">Address Line 1 *</label>
                                <input id="address_line1" {...register("address_line1", { required: "Address is required." })} className={inputClass(errors.address_line1)} />
                                {errors.address_line1 && <p className="mt-1 text-sm text-red-600">{errors.address_line1.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
                                    <input id="city" {...register("city", { required: "City is required." })} className={inputClass(errors.city)} />
                                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province *</label>
                                    <input id="state" {...register("state", { required: "State is required." })} className={inputClass(errors.state)} />
                                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                                </div>
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code *</label>
                                    <input id="postal_code" {...register("postal_code", { required: "Postal code is required." })} className={inputClass(errors.postal_code)} />
                                    {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
                                    <input id="country" {...register("country", { required: "Country is required." })} className={inputClass(errors.country)} />
                                    {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
                                </div>
                            </div>

                            <input type="hidden" {...register("latitude")} />
                            <input type="hidden" {...register("longitude")} />
                        </div>
                        
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
