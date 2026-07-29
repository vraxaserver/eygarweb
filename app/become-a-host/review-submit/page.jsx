"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle,
    Circle,
    FileCheck,
    PartyPopper,
    ArrowRight,
    AlertCircle,
} from "lucide-react";

import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useSubmitForReviewMutation } from "@/store/features/hostProfileApi";

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
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.terms_accepted) {
            newErrors.terms_accepted = "You must accept the Terms and Conditions to proceed.";
        }
        
        if (!formData.privacy_policy_accepted) {
            newErrors.privacy_policy_accepted = "You must accept the Privacy Policy to proceed.";
        }

        if (formData.additional_notes && formData.additional_notes.length > 500) {
            newErrors.additional_notes = "Additional notes cannot exceed 500 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, submit: '' }));
        
        if (!validateForm()) {
            return;
        }

        try {
            const payload = {
                ...formData,
                additional_notes: formData.additional_notes ? formData.additional_notes.trim() : "",
            };
            await submitForReview(payload).unwrap();
            console.log("Application submitted!");
            setIsSubmitted(true);
            setTimeout(() => router.push("/dashboard"), 3000);
        } catch (error) {
            console.error("Failed to submit application:", error);
            const msg = error.data?.detail || error.data?.message || "Failed to submit host application. Please review your information and try again.";
            setErrors(prev => ({ ...prev, submit: msg }));
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <PartyPopper className="mx-auto h-16 w-16 text-green-500" />
                        <h1 className="mt-6 text-3xl font-bold text-gray-800">
                            Application Submitted!
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Thank you! Our team will review your host application and
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
        <div className="min-h-screen bg-background">
            <StepProgressIndicator />
            <main className="bg-slate-50 min-h-screen flex justify-center p-4">
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center">
                            <FileCheck className="mx-auto h-12 w-12 text-primary" />
                            <h1 className="mt-4 text-3xl font-bold text-gray-800">
                                You're All Set!
                            </h1>
                            <p className="mt-2 text-gray-500">
                                Please review the completed steps below.
                                Once you're ready, submit your
                                application for review by our team.
                            </p>
                        </div>

                        {errors.submit && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        <div className="my-8 bg-gray-50 p-6 rounded-lg border">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Application Checklist
                            </h2>
                            <ul className="space-y-2">
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
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                                    placeholder="Please review my application. I'm excited to start hosting on Eygar!"
                                    maxLength={500}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${errors.additional_notes ? 'border-red-300' : 'border-gray-300'}`}
                                />
                                {errors.additional_notes && <p className="mt-1 text-sm text-red-600">{errors.additional_notes}</p>}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="terms_accepted"
                                            checked={formData.terms_accepted}
                                            onChange={handleInputChange}
                                            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-700">
                                            I accept the{" "}
                                            <a 
                                                href="/terms" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-indigo-500 underline font-medium"
                                            >
                                                Terms and Conditions
                                            </a> *
                                        </span>
                                    </label>
                                    {errors.terms_accepted && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.terms_accepted}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="privacy_policy_accepted"
                                            checked={formData.privacy_policy_accepted}
                                            onChange={handleInputChange}
                                            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-700">
                                            I accept the{" "}
                                            <a 
                                                href="/privacy" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-indigo-500 underline font-medium"
                                            >
                                                Privacy Policy
                                            </a> *
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
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Submitting Application...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application for Review
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
