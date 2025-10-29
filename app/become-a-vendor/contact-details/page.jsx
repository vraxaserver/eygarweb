"use client";

import { useForm } from "react-hook-form";
import { useUpdateContactDetailsMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";

const ContactDetailsPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [updateContactDetails, { isLoading }] =
        useUpdateContactDetailsMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await updateContactDetails(data).unwrap();
            router.push("/become-a-vendor/submit-for-review");
        } catch (error) {
            console.error("Failed to update contact details:", error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Contact Details</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="primary_contact_name">
                        Primary Contact Name
                    </label>
                    <input
                        id="primary_contact_name"
                        {...register("primary_contact_name", {
                            required: true,
                        })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.primary_contact_name && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="primary_contact_email">
                        Primary Contact Email
                    </label>
                    <input
                        id="primary_contact_email"
                        type="email"
                        {...register("primary_contact_email", {
                            required: true,
                        })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.primary_contact_email && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="primary_contact_phone">
                        Primary Contact Phone
                    </label>
                    <input
                        id="primary_contact_phone"
                        type="tel"
                        {...register("primary_contact_phone", {
                            required: true,
                        })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.primary_contact_phone && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
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

export default ContactDetailsPage;
