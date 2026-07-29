"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubmitForReviewMutation } from "@/store/features/vendorProfileApi";
import { updateRole } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Send, AlertCircle } from "lucide-react";

export default function SubmitForReviewPage() {
    const dispatch = useDispatch();
    const [apiError, setApiError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [submitForReview, { isLoading }] = useSubmitForReviewMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        setApiError("");
        try {
            const payload = {
                ...data,
                additional_notes: data.additional_notes ? data.additional_notes.trim() : "",
            };
            await submitForReview(payload).unwrap();
            dispatch(updateRole("vendor"));
            router.push("/dashboard?status=pending");
        } catch (error) {
            console.error("Failed to submit for review:", error);
            if (error?.data?.terms_accepted?.[0]) {
                setApiError(`Terms: ${error.data.terms_accepted[0]}`);
            } else if (error?.data?.privacy_policy_accepted?.[0]) {
                setApiError(`Privacy Policy: ${error.data.privacy_policy_accepted[0]}`);
            } else if (error?.data?.detail) {
                setApiError(error.data.detail);
            } else if (error?.data?.message) {
                setApiError(error.data.message);
            } else {
                setApiError("Failed to submit application. Please verify all steps and try again.");
            }
        }
    };

    const textareaClass = (hasError) =>
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
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Send className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Final Step: Submit for Review
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Please accept our terms to complete your vendor application.
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

                            {/* Additional Notes */}
                            <div>
                                <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    id="additional_notes"
                                    rows="4"
                                    {...register("additional_notes", {
                                        maxLength: {
                                            value: 500,
                                            message: "Additional notes cannot exceed 500 characters.",
                                        },
                                    })}
                                    maxLength={500}
                                    className={textareaClass(errors.additional_notes)}
                                    placeholder="Is there anything else you'd like us to know?"
                                />
                                {errors.additional_notes && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.additional_notes.message}
                                    </p>
                                )}
                            </div>

                            {/* Policies & Terms */}
                            <div className="space-y-4">
                                <div className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="terms_accepted"
                                            type="checkbox"
                                            {...register("terms_accepted", {
                                                required: "You must accept the terms and conditions.",
                                            })}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="terms_accepted" className="font-medium text-gray-900">
                                            I agree to the <a href="/terms" target="_blank" className="text-indigo-600 hover:underline font-semibold">Terms and Conditions</a> *
                                        </label>
                                        {errors.terms_accepted && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.terms_accepted.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="privacy_policy_accepted"
                                            type="checkbox"
                                            {...register("privacy_policy_accepted", {
                                                required: "You must accept the privacy policy.",
                                            })}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="privacy_policy_accepted" className="font-medium text-gray-900">
                                            I agree to the <a href="/privacy" target="_blank" className="text-indigo-600 hover:underline font-semibold">Privacy Policy</a> *
                                        </label>
                                        {errors.privacy_policy_accepted && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.privacy_policy_accepted.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Form Footer & Submit Button */}
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit for Review
                                        <Send className="ml-2 h-4 w-4" />
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
