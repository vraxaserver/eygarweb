"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle,
    Circle,
    FileCheck,
    PartyPopper,
    ArrowRight,
} from "lucide-react";

import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useSubmitForReviewMutation } from "@/store/features/profileApi";

// Checklist item component
const ChecklistItem = ({ text, isComplete }) => (
    <li className="flex items-center gap-3 py-2">
        {isComplete ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
            <Circle className="h-6 w-6 text-gray-300" />
        )}
        <span
            className={`text-lg ${
                isComplete ? "text-gray-700" : "text-gray-400"
            }`}
        >
            {text}
        </span>
    </li>
);

export default function SubmitForReviewPage() {
    const router = useRouter();
    const [submitForReview, { isLoading }] = useSubmitForReviewMutation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        additional_notes: "",
        terms_accepted: false,
        privacy_policy_accepted: false,
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing/checking
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.terms_accepted) {
            newErrors.terms_accepted = "You must accept the terms and conditions";
        }
        
        if (!formData.privacy_policy_accepted) {
            newErrors.privacy_policy_accepted = "You must accept the privacy policy";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await submitForReview(formData).unwrap();
            console.log("Application submitted!");
            setIsSubmitted(true);
            // Optionally redirect after a few seconds
            setTimeout(() => router.push("/dashboard"), 3000);
        } catch (error) {
            console.error("Failed to submit application:", error);
            // Handle error (show toast, etc.)
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <PartyPopper className="mx-auto h-16 w-16 text-green-500" />
                        <h1 className="mt-6 text-3xl font-bold text-gray-800">
                            Application Submitted!
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Thank you! Our team will review your application and
                            get back to you within 3-5 business days. You will
                            be notified via email about the status of your
                            application.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Step Progress Indicator */}
                <StepProgressIndicator />
                {/* Main Content */}
                <main className="bg-slate-50 min-h-screen flex justify-center p-4">
                    <div className="bg-slate-50 min-h-screen flex justify-center p-4">
                        <div className="w-full max-w-2xl">
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="text-center">
                                    <FileCheck className="mx-auto h-12 w-12 text-indigo-600" />
                                    <h1 className="mt-4 text-3xl font-bold text-gray-800">
                                        You're All Set!
                                    </h1>
                                    <p className="mt-2 text-gray-500">
                                        Please review the completed steps below.
                                        Once you're ready, submit your
                                        application for review by our team.
                                    </p>
                                </div>

                                <div className="my-8 bg-gray-50 p-6 rounded-lg border">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                        Application Checklist
                                    </h2>
                                    <ul className="space-y-2">
                                        {/* In a real app, this data would come from your state management */}
                                        <ChecklistItem
                                            text="Host Profile Created"
                                            isComplete={true}
                                        />
                                        <ChecklistItem
                                            text="Identity Verified"
                                            isComplete={true}
                                        />
                                        <ChecklistItem
                                            text="Contact Information Confirmed"
                                            isComplete={true}
                                        />
                                    </ul>
                                </div>

                                {/* Application Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Additional Notes */}
                                    <div>
                                        <label 
                                            htmlFor="additional_notes" 
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            id="additional_notes"
                                            name="additional_notes"
                                            rows={4}
                                            value={formData.additional_notes}
                                            onChange={handleInputChange}
                                            placeholder="Please review my application. I'm excited to start hosting!"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="terms_accepted"
                                                    checked={formData.terms_accepted}
                                                    onChange={handleInputChange}
                                                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    I accept the{" "}
                                                    <a 
                                                        href="/terms" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-500 underline"
                                                    >
                                                        Terms and Conditions
                                                    </a>
                                                </span>
                                            </label>
                                            {errors.terms_accepted && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.terms_accepted}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="privacy_policy_accepted"
                                                    checked={formData.privacy_policy_accepted}
                                                    onChange={handleInputChange}
                                                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    I accept the{" "}
                                                    <a 
                                                        href="/privacy" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-500 underline"
                                                    >
                                                        Privacy Policy
                                                    </a>
                                                </span>
                                            </label>
                                            {errors.privacy_policy_accepted && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.privacy_policy_accepted}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-8 text-center">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Application
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
