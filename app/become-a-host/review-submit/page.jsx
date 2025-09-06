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

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import Link from "next/link";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate an API call
        setTimeout(() => {
            console.log("Application submitted!");
            setIsSubmitting(false);
            setIsSubmitted(true);
            // Optionally redirect after a few seconds
            setTimeout(() => router.push("/dashboard"), 3000);
        }, 2000);
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
                    <div className="bg-slate-50 min-h-screen flex  justify-center p-4">
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

                                <div className="mt-8 text-center">
                                    <Link
                                        href={"/dashboard"}
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                        
                                    >
                                        Submit Application
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
}
