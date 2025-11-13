"use client";

import { useForm } from "react-hook-form";
import { useUpdateContactDetailsMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";
import { User, ArrowRight } from "lucide-react";

export default function ContactDetailsPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [updateContactDetails, { isLoading }] = useUpdateContactDetailsMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await updateContactDetails(data).unwrap();
            router.push("/become-a-vendor/submit-for-review");
        } catch (error) {
            console.error("Failed to update contact details:", error);
            // Optionally, display an error message to the user here
        }
    };
    
    // Reusable class strings for inputs to keep the JSX clean
    const inputClass = (hasError) => 
        `w-full px-4 py-2 mt-2 border rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            hasError ? 'border-red-400' : 'border-gray-300'
        }`;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="p-8 bg-white border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Primary Contact Information
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Who should we contact regarding your services?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-8 space-y-6">
                            {/* Primary Contact Name */}
                            <div>
                                <label htmlFor="primary_contact_name" className="block text-sm font-medium text-gray-700">
                                    Full Name *
                                </label>
                                <input
                                    id="primary_contact_name"
                                    {...register("primary_contact_name", {
                                        required: "Contact name is required.",
                                    })}
                                    className={inputClass(errors.primary_contact_name)}
                                    placeholder="e.g., Jane Doe"
                                />
                                {errors.primary_contact_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.primary_contact_name.message}
                                    </p>
                                )}
                            </div>

                            {/* Primary Contact Email */}
                            <div>
                                <label htmlFor="primary_contact_email" className="block text-sm font-medium text-gray-700">
                                    Email Address *
                                </label>
                                <input
                                    id="primary_contact_email"
                                    type="email"
                                    {...register("primary_contact_email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Please enter a valid email address."
                                        }
                                    })}
                                    className={inputClass(errors.primary_contact_email)}
                                    placeholder="you@example.com"
                                />
                                {errors.primary_contact_email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.primary_contact_email.message}
                                    </p>
                                )}
                            </div>

                            {/* Primary Contact Phone */}
                            <div>
                                <label htmlFor="primary_contact_phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number *
                                </label>
                                <input
                                    id="primary_contact_phone"
                                    type="tel"
                                    {...register("primary_contact_phone", {
                                        required: "Phone number is required.",
                                    })}
                                    className={inputClass(errors.primary_contact_phone)}
                                    placeholder="(123) 456-7890"
                                />
                                {errors.primary_contact_phone && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.primary_contact_phone.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Form Footer & Submit Button */}
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
