"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateContactDetailsMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";
import { User, ArrowRight, AlertCircle } from "lucide-react";
import PhoneInputWithCountry from "@/components/ui/PhoneInputWithCountry";

export default function ContactDetailsPage() {
    const [phoneCountry, setPhoneCountry] = useState("+974");
    const [apiError, setApiError] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const [updateContactDetails, { isLoading }] = useUpdateContactDetailsMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        setApiError("");
        try {
            let phone = (data.primary_contact_phone || "").trim();
            if (phone && !phone.startsWith("+")) {
                const digits = phone.replace(/\D/g, "");
                phone = `${phoneCountry}${digits}`;
            }
            const payload = {
                primary_contact_name: data.primary_contact_name.trim(),
                primary_contact_email: data.primary_contact_email.trim(),
                primary_contact_phone: phone,
            };
            await updateContactDetails(payload).unwrap();
            router.push("/become-a-vendor/submit-for-review");
        } catch (error) {
            console.error("Failed to update contact details:", error);
            if (error?.data?.primary_contact_phone?.[0]) {
                setApiError(`Phone Number Error: ${error.data.primary_contact_phone[0]}`);
            } else if (error?.data?.primary_contact_name?.[0]) {
                setApiError(`Contact Name Error: ${error.data.primary_contact_name[0]}`);
            } else if (error?.data?.primary_contact_email?.[0]) {
                setApiError(`Email Error: ${error.data.primary_contact_email[0]}`);
            } else if (error?.data?.detail) {
                setApiError(error.data.detail);
            } else if (error?.data?.message) {
                setApiError(error.data.message);
            } else {
                setApiError("Failed to update contact details. Please check your inputs.");
            }
        }
    };
    
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
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="p-8 space-y-6">
                            {/* API Error Alert */}
                            {apiError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">{apiError}</p>
                                </div>
                            )}

                            {/* Primary Contact Name */}
                            <div>
                                <label htmlFor="primary_contact_name" className="block text-sm font-medium text-gray-700">
                                    Full Name *
                                </label>
                                <input
                                    id="primary_contact_name"
                                    {...register("primary_contact_name", {
                                        required: "Contact name is required.",
                                        minLength: {
                                            value: 2,
                                            message: "Contact name must be at least 2 characters.",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Contact name cannot exceed 100 characters.",
                                        },
                                        validate: (val) =>
                                            !!val.trim() || "Contact name cannot be empty or only spaces.",
                                    })}
                                    maxLength={100}
                                    className={inputClass(errors.primary_contact_name)}
                                    placeholder="Enter Full Name (e.g., John Doe)"
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
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Please enter a valid email address.",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Email cannot exceed 100 characters.",
                                        },
                                    })}
                                    maxLength={100}
                                    className={inputClass(errors.primary_contact_email)}
                                    placeholder="Enter Email Address (e.g. name@domain.com)"
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
                                <div className="mt-2">
                                    <PhoneInputWithCountry
                                        countryCode={phoneCountry}
                                        onCountryCodeChange={setPhoneCountry}
                                        value={watch("primary_contact_phone") || ""}
                                        onChange={(e) => {
                                            setValue("primary_contact_phone", e.target.value, {
                                                shouldValidate: true,
                                            });
                                            if (apiError) setApiError("");
                                        }}
                                        placeholder="Enter Mobile Number (e.g. 55123456 - max 15 digits)"
                                    />
                                    {/* Register hidden field for validation */}
                                    <input
                                        type="hidden"
                                        {...register("primary_contact_phone", {
                                            required: "Phone number is required.",
                                            validate: (val) => {
                                                if (!val) return "Phone number is required.";
                                                const digits = val.replace(/\D/g, "");
                                                if (digits.length < 7 || digits.length > 15) {
                                                    return "Please enter a valid phone number (7 to 15 digits).";
                                                }
                                                return true;
                                            },
                                        })}
                                    />
                                </div>
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
