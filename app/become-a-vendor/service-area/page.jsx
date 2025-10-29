"use client";

import { useForm } from "react-hook-form";
import { useUpdateServiceAreaMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";

const ServiceAreaPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [updateServiceArea, { isLoading }] = useUpdateServiceAreaMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await updateServiceArea(data).unwrap();
            router.push("/become-a-vendor/contact-details");
        } catch (error) {
            console.error("Failed to update service area:", error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Service Area</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Add all form fields as per the data format */}
                <div>
                    <label htmlFor="location_name">Location Name</label>
                    <input
                        id="location_name"
                        {...register("location_name", { required: true })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.location_name && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="address_line1">Address Line 1</label>
                    <input
                        id="address_line1"
                        {...register("address_line1", { required: true })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.address_line1 && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        {...register("city", { required: true })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.city && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                {/* ... other fields: address_line2, state, postal_code, country */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                    {isLoading ? "Saving..." : "Save and Continue"}
                </button>
            </form>
        </div>
    );
};

export default ServiceAreaPage;
