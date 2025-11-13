"use client";

import { useForm } from "react-hook-form";
import { useSubmitForReviewMutation } from "@/store/features/vendorProfileApi";
import { updateRole } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Send, FileText, ShieldCheck } from "lucide-react";

export default function SubmitForReviewPage() {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [submitForReview, { isLoading }] = useSubmitForReviewMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await submitForReview(data).unwrap();
            // On success, update the user's role and redirect
            dispatch(updateRole("vendor"));
            router.push("/dashboard?status=pending");
        } catch (error) {
            console.error("Failed to submit for review:", error);
            // Optionally, show a user-facing error message here
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-8 space-y-6">
                            {/* Additional Notes */}
                            <div>
                                <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    id="additional_notes"
                                    rows="4"
                                    {...register("additional_notes")}
                                    className={textareaClass(errors.additional_notes)}
                                    placeholder="Is there anything else you'd like us to know?"
                                />
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
                                            I agree to the <a href="/terms" target="_blank" className="text-indigo-600 hover:underline">Terms and Conditions</a> *
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
                                            I agree to the <a href="/privacy" target="_blank" className="text-indigo-600 hover:underline">Privacy Policy</a> *
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
                                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
