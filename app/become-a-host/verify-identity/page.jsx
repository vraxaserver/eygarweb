"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    UploadCloud,
    ArrowRight,
    ShieldCheck,
    FileCheck2,
    Info,
    AlertCircle,
} from "lucide-react";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useVerifyIdentityMutation } from "@/store/features/hostProfileApi";

const FileUploader = ({ title, onFileChange, fileName, error, setError }) => {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            onFileChange(null);
            return;
        }

        setError?.("");

        const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        const fileExt = file.name.split('.').pop().toLowerCase();
        const validExts = ['png', 'jpg', 'jpeg', 'webp'];

        if (!allowedImageTypes.includes(file.type.toLowerCase()) && !validExts.includes(fileExt)) {
            setError?.(
                "PDF and document files are not supported for ID verification. Please upload a clear photo or scan of your document in image format (JPG, JPEG, or PNG)."
            );
            onFileChange(null);
            return;
        }

        const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit matching backend serializer
        if (file.size > maxSizeBytes) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            setError?.(
                `File size limit exceeded: Selected document is ${sizeMB}MB. Please select an image file smaller than 5MB.`
            );
            onFileChange(null);
            return;
        }

        onFileChange(file);
    };

    const borderColor = error ? "border-red-400" : "border-gray-300";
    const hoverBorderColor = error ? "hover:border-red-500" : "hover:border-gray-400";

    return (
        <div>
            <label className={`relative block w-full cursor-pointer rounded-lg border-2 border-dashed p-8 text-center ${borderColor} ${hoverBorderColor} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors`}>
                <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                />
                <div className="flex flex-col items-center">
                    {fileName ? (
                        <>
                            <FileCheck2 className="mx-auto h-12 w-12 text-green-500" />
                            <span className="mt-2 block text-sm font-medium text-gray-900 truncate max-w-xs">
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
                                PNG, JPG, or JPEG images up to 5MB (PDFs are not accepted)
                            </span>
                        </>
                    )}
                </div>
            </label>
            {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
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

    const handleDocTypeChange = (type) => {
        if (type === "passport" && backFile) {
            setBackFile(null);
        }
        setDocType(type);
        setErrors({});
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!documentNumber.trim()) {
            newErrors.documentNumber = "Document number is required.";
        } else if (documentNumber.trim().length < 5) {
            newErrors.documentNumber = "Document number must be at least 5 characters long.";
        }

        if (!frontFile) {
            newErrors.frontFile = `Please upload the ${docType === "passport" ? "passport image" : "front of your ID"} file (JPG or PNG).`;
        }

        if (docType === "id" && !backFile) {
            newErrors.backFile = "Please upload the back of your ID file (JPG or PNG).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, submit: "" }));

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("document_type", docType);
        formData.append("document_number", documentNumber.trim());
        
        if (frontFile) {
            formData.append("document_image_front", frontFile);
        }
        if (docType === "id" && backFile) {
            formData.append("document_image_back", backFile);
        }

        try {
            await verifyIdentity(formData).unwrap();
            router.push("/become-a-host/verify-contact");
        } catch (err) {
            console.error("Failed to verify identity error details:", JSON.stringify(err));
            
            let errorMessage = "Identity verification failed. Please check your files and try again.";
            
            if (err?.data) {
                if (typeof err.data === 'string') {
                    errorMessage = err.data;
                } else if (err.data.error) {
                    errorMessage = err.data.error;
                } else if (err.data.detail) {
                    errorMessage = err.data.detail;
                } else if (err.data.document_image_front?.[0]) {
                    errorMessage = `Front Document Error: ${err.data.document_image_front[0]}`;
                } else if (err.data.document_image_back?.[0]) {
                    errorMessage = `Back Document Error: ${err.data.document_image_back[0]}`;
                } else if (err.data.document_number?.[0]) {
                    errorMessage = `Document Number Error: ${err.data.document_number[0]}`;
                }
            } else if (err?.error) {
                errorMessage = err.error;
            }

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
                            <ShieldCheck className="h-8 w-8 text-primary" />
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
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-8 space-y-8" noValidate>
                            {/* Document Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {["passport", "id"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleDocTypeChange(type)}
                                            className={`rounded-lg border p-4 text-left transition-all ${
                                                docType === type
                                                    ? "border-primary ring-2 ring-primary/20 bg-primary/10"
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
                                    {docType === 'passport' ? 'Passport Number' : 'National ID Number'} *
                                </label>
                                <input
                                    type="text"
                                    name="documentNumber"
                                    id="documentNumber"
                                    value={documentNumber}
                                    onChange={(e) => {
                                        setDocumentNumber(e.target.value);
                                        if (errors.documentNumber) setErrors(prev => ({ ...prev, documentNumber: "" }));
                                    }}
                                    maxLength={30}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                                        errors.documentNumber ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder={docType === 'passport' ? "e.g., A12345678" : "e.g., 10987654321"}
                                />
                                {errors.documentNumber && <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>}
                            </div>

                            {/* File Uploaders */}
                            <div className="space-y-6">
                                <FileUploader
                                    title={`Upload ${docType === "passport" ? "passport image (JPG/PNG)" : "front of National ID (JPG/PNG)"} *`}
                                    onFileChange={setFrontFile}
                                    fileName={frontFile?.name}
                                    error={errors.frontFile}
                                    setError={(msg) => setErrors(prev => ({ ...prev, frontFile: msg }))}
                                />
                                {docType === "id" && (
                                    <FileUploader
                                        title="Upload back of National ID (JPG/PNG) *"
                                        onFileChange={setBackFile}
                                        fileName={backFile?.name}
                                        error={errors.backFile}
                                        setError={(msg) => setErrors(prev => ({ ...prev, backFile: msg }))}
                                    />
                                )}
                            </div>

                            {/* Submission Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
