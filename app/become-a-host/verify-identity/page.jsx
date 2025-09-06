"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    UploadCloud,
    ArrowRight,
    ShieldCheck,
    FileCheck2,
    Info,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";

// Reusable file upload component
const FileUploader = ({ title, onFileChange }) => {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileChange(file);
        }
    };

    return (
        <label className="relative block w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <input
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, application/pdf"
            />
            <div className="flex flex-col items-center">
                {fileName ? (
                    <>
                        <FileCheck2 className="mx-auto h-12 w-12 text-green-500" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                            {fileName}
                        </span>
                    </>
                ) : (
                    <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                            {title}
                        </span>
                        <span className="text-xs text-gray-500">
                            PNG, JPG or PDF up to 10MB
                        </span>
                    </>
                )}
            </div>
        </label>
    );
};

export default function VerifyIdentityPage() {
    const router = useRouter();
    const [docType, setDocType] = useState("passport");
    const [frontFile, setFrontFile] = useState(null);
    const [backFile, setBackFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would securely upload these files to a protected storage service
        // and send the file references to your backend for verification.
        console.log({ docType, frontFile, backFile });
        // Navigate to a "pending verification" or "review" page
        router.push("/registration-review-submit");
    };

    const isSubmitDisabled = !frontFile || (docType === "id" && !backFile);

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
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-8 w-8 text-indigo-600" />
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">
                                            Verify Your Identity
                                        </h1>
                                        <p className="text-gray-500 mt-1">
                                            We need to verify your identity to
                                            ensure trust and safety.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-800">
                                        Your information is encrypted and stored
                                        securely. It will only be shared with
                                        our payment provider and will not be
                                        visible to guests.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 space-y-8"
                                >
                                    {/* Document Type Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Document Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["passport", "id"].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() =>
                                                        setDocType(type)
                                                    }
                                                    className={`rounded-lg border p-4 text-left transition-all ${
                                                        docType === type
                                                            ? "border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50"
                                                            : "border-gray-300 bg-white hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <span className="font-semibold text-gray-800">
                                                        {type === "passport"
                                                            ? "Passport"
                                                            : "National ID"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* File Uploaders */}
                                    <div className="space-y-6">
                                        <FileUploader
                                            title={`Upload ${
                                                docType === "passport"
                                                    ? "passport"
                                                    : "front of ID"
                                            }`}
                                            onFileChange={setFrontFile}
                                        />
                                        {docType === "id" && (
                                            <FileUploader
                                                title="Upload back of ID"
                                                onFileChange={setBackFile}
                                            />
                                        )}
                                    </div>

                                    {/* Submission Button */}
                                    <div className="text-right">
                                        <Link
                                            href={
                                                "/become-a-host/verify-contact"
                                            }
                                            type="submit"
                                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                        >
                                            Save and Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
}
