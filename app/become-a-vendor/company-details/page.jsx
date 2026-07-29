"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateCompanyDetailsMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, AlertCircle } from "lucide-react";

export default function CompanyDetailsPage() {
    const [apiError, setApiError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [updateCompanyDetails, { isLoading }] = useUpdateCompanyDetailsMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        setApiError("");
        try {
            const payload = {
                company_name: data.company_name.trim(),
                company_description: data.company_description.trim(),
                website: data.website ? data.website.trim() : "",
            };
            await updateCompanyDetails(payload).unwrap();
            router.push("/become-a-vendor/service-area");
        } catch (error) {
            console.error("Failed to update company details:", error);
            if (error?.data?.company_name?.[0]) {
                setApiError(`Company Name: ${error.data.company_name[0]}`);
            } else if (error?.data?.company_description?.[0]) {
                setApiError(`Company Description: ${error.data.company_description[0]}`);
            } else if (error?.data?.website?.[0]) {
                setApiError(`Website: ${error.data.website[0]}`);
            } else if (error?.data?.detail) {
                setApiError(error.data.detail);
            } else if (error?.data?.message) {
                setApiError(error.data.message);
            } else {
                setApiError("Failed to update company details. Please check your inputs.");
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
                                <Building2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Tell Us About Your Business
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    This information will appear on your public vendor profile.
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

                            {/* Company Name Field */}
                            <div>
                                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                                    Company Name *
                                </label>
                                <input
                                    id="company_name"
                                    {...register("company_name", {
                                        required: "Company name is required.",
                                        minLength: {
                                            value: 2,
                                            message: "Company name must be at least 2 characters.",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Company name cannot exceed 100 characters.",
                                        },
                                        validate: (val) =>
                                            !!val.trim() || "Company name cannot be empty or only spaces.",
                                    })}
                                    maxLength={100}
                                    className={inputClass(errors.company_name)}
                                    placeholder="e.g., Pro Event Planners Inc."
                                />
                                {errors.company_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.company_name.message}
                                    </p>
                                )}
                            </div>

                            {/* Company Description Field */}
                            <div>
                                <label htmlFor="company_description" className="block text-sm font-medium text-gray-700">
                                    Company Description *
                                </label>
                                <textarea
                                    id="company_description"
                                    rows="4"
                                    {...register("company_description", {
                                        required: "A company description is required.",
                                        minLength: {
                                            value: 10,
                                            message: "Description must be at least 10 characters.",
                                        },
                                        maxLength: {
                                            value: 1000,
                                            message: "Description cannot exceed 1000 characters.",
                                        },
                                        validate: (val) =>
                                            !!val.trim() || "Description cannot be empty or only spaces.",
                                    })}
                                    maxLength={1000}
                                    className={inputClass(errors.company_description)}
                                    placeholder="Describe your company, your services, and what makes you unique."
                                />
                                {errors.company_description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.company_description.message}
                                    </p>
                                )}
                            </div>

                            {/* Website Field */}
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                    Website (Optional)
                                </label>
                                <input
                                    id="website"
                                    type="url"
                                    {...register("website", {
                                        pattern: {
                                            value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i,
                                            message: "Please enter a valid website URL (e.g., https://example.com).",
                                        },
                                    })}
                                    className={inputClass(errors.website)}
                                    placeholder="https://www.example.com"
                                />
                                {errors.website && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.website.message}
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
