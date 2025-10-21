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
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useVerifyIdentityMutation } from "@/store/features/profileApi";

// Reusable file upload component with error handling
const FileUploader = ({ title, onFileChange, fileName, error }) => {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        onFileChange(file || null); // Pass file or null to parent
    };

    const borderColor = error ? "border-red-400" : "border-gray-300";
    const hoverBorderColor = error ? "hover:border-red-500" : "hover:border-gray-400";

    return (
        <div>
            <label className={`relative block w-full cursor-pointer rounded-lg border-2 border-dashed p-8 text-center ${borderColor} ${hoverBorderColor} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors`}>
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
                            <span className="mt-2 block text-sm font-medium text-gray-900 truncate">
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
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default function VerifyIdentityPage() {
    const router = useRouter();
    const [verifyIdentity, { isLoading }] = useVerifyIdentityMutation();

    const [docType, setDocType] = useState("passport");
    const [documentNumber, setDocumentNumber] = useState("");
    const [frontFile, setFrontFile] = useState(null);
    const [backFile, setBackFile] = useState(null);
    const [errors, setErrors] = useState({});

    // Clear back file if user switches from ID to Passport
    const handleDocTypeChange = (type) => {
        if (type === "passport" && backFile) {
            setBackFile(null);
        }
        setDocType(type);
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!documentNumber.trim()) {
            newErrors.documentNumber = "Document number is required.";
        }
        if (!frontFile) {
            newErrors.frontFile = "Please upload the front of your document.";
        }
        if (docType === "id" && !backFile) {
            newErrors.backFile = "Please upload the back of your ID.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, submit: "" })); // Clear previous submission errors

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("document_type", docType);
        formData.append("document_number", documentNumber);
        formData.append("front_image", frontFile);
        if (docType === "id" && backFile) {
            formData.append("back_image", backFile);
        }

        try {
            await verifyIdentity(formData).unwrap();
            // Navigate to the next step on success
            router.push("/become-a-host/verify-contact");
        } catch (err) {
            console.error("Failed to verify identity:", err);
            const errorMessage = err.data?.detail || 'Verification failed. Please try again.';
            setErrors(prev => ({ ...prev, submit: errorMessage }));
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <StepProgressIndicator />
            <main className="bg-slate-50 min-h-screen flex justify-center p-4">
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-indigo-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Verify Your Identity</h1>
                                <p className="text-gray-500 mt-1">We need to verify your identity to ensure trust and safety.</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">
                                Your information is encrypted and stored securely. It will only be used for verification purposes.
                            </p>
                        </div>
                        
                        {errors.submit && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-8 space-y-8" noValidate>
                            {/* Document Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {["passport", "id"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleDocTypeChange(type)}
                                            className={`rounded-lg border p-4 text-left transition-all ${
                                                docType === type
                                                    ? "border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50"
                                                    : "border-gray-300 bg-white hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="font-semibold text-gray-800">
                                                {type === "passport" ? "Passport" : "National ID"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Document Number */}
                            <div>
                                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    {docType === 'passport' ? 'Passport Number' : 'ID Number'} *
                                </label>
                                <input
                                    type="text"
                                    name="documentNumber"
                                    id="documentNumber"
                                    value={documentNumber}
                                    onChange={(e) => setDocumentNumber(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.documentNumber ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your document number"
                                />
                                {errors.documentNumber && <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>}
                            </div>

                            {/* File Uploaders */}
                            <div className="space-y-6">
                                <FileUploader
                                    title={`Upload ${docType === "passport" ? "passport" : "front of ID"} *`}
                                    onFileChange={setFrontFile}
                                    fileName={frontFile?.name}
                                    error={errors.frontFile}
                                />
                                {docType === "id" && (
                                    <FileUploader
                                        title="Upload back of ID *"
                                        onFileChange={setBackFile}
                                        fileName={backFile?.name}
                                        error={errors.backFile}
                                    />
                                )}
                            </div>

                            {/* Submission Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Verifying...
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
            </main>
        </div>
    );
}