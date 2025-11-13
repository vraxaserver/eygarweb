"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, UploadCloud, ArrowRight, FileText, MapPin } from "lucide-react";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useCreateBusinessProfileMutation } from "@/store/features/hostProfileApi";


const BUSINESS_TYPES = [
    "Restaurant",
    "Hotel",
    "Retail Store",
    "Service Provider",
    "Entertainment Venue",
    "Healthcare",
    "Professional Services",
    "Technology",
    "Manufacturing",
    "Other"
];

const COUNTRIES = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "Other"
];


export default function CreateBusinessProfilePage() {
    // console.log("apiModule:", apiModule);
    const router = useRouter();
    const [createBusinessProfile, { isLoading: loding }] = useCreateBusinessProfileMutation();

    const [formDataState, setFormDataState] = useState({
        business_name: "",
        business_type: "",
        license_number: "",
        business_address_line1: "",
        business_address_line2: "",
        business_city: "",
        business_state: "",
        business_postal_code: "",
        business_country: "",
        business_description: ""
    });

    const [files, setFiles] = useState({
        license_document: null,
        business_logo: null
    });

    const [previews, setPreviews] = useState({
        license_document: null,
        business_logo: null
    });

    const prevLogoUrlRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDataState(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // Handle file changes
    const handleFileChange = (e, fileType) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({
                ...prev,
                [fileType]: file
            }));
        }
    };

    // Create or update previews for business_logo and license_document
    useEffect(() => {
        // business_logo preview (image)
        if (files.business_logo && files.business_logo.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(files.business_logo);

            // revoke previous one
            if (prevLogoUrlRef.current) {
                URL.revokeObjectURL(prevLogoUrlRef.current);
            }

            prevLogoUrlRef.current = objectUrl;
            setPreviews(prev => ({
                ...prev,
                business_logo: objectUrl
            }));
        } else if (!files.business_logo) {
            // if cleared
            if (prevLogoUrlRef.current) {
                URL.revokeObjectURL(prevLogoUrlRef.current);
                prevLogoUrlRef.current = null;
            }
            setPreviews(prev => ({ ...prev, business_logo: null }));
        } else {
            // non-image file for logo (rare) — show filename
            setPreviews(prev => ({ ...prev, business_logo: files.business_logo.name }));
        }

        // license_document: if file is not an image we show filename, if image show file name as well (or you could generate preview)
        if (files.license_document) {
            setPreviews(prev => ({ ...prev, license_document: files.license_document.name }));
        } else {
            setPreviews(prev => ({ ...prev, license_document: null }));
        }

        // cleanup on unmount
        return () => {
            if (prevLogoUrlRef.current) {
                URL.revokeObjectURL(prevLogoUrlRef.current);
                prevLogoUrlRef.current = null;
            }
        };
    }, [files]);

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        const requiredFields = [
            'business_name',
            'business_type', 
            'license_number',
            'business_address_line1',
            'business_city',
            'business_state',
            'business_postal_code',
            'business_country',
            'business_description'
        ];

        requiredFields.forEach(field => {
            if (!formDataState[field]?.trim()) {
                newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
            }
        });

        if (!files.license_document) {
            newErrors.license_document = "License document is required";
        }

        if (!files.business_logo) {
            newErrors.business_logo = "Business logo is required";
        }

        if (formDataState.business_postal_code && !/^[\d\w\s-]{3,10}$/.test(formDataState.business_postal_code)) {
            newErrors.business_postal_code = "Please enter a valid postal code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Build FormData
            const submitData = new FormData();

            // Append all text fields
            Object.entries(formDataState).forEach(([key, value]) => {
                // ensure empty strings are appended as '' (or skip if you prefer)
                submitData.append(key, value ?? "");
            });

            // Append files
            if (files.license_document) {
                submitData.append('license_document', files.license_document);
            }
            if (files.business_logo) {
                submitData.append('business_logo', files.business_logo);
            }

            // Call RTK Query mutation with FormData. Use unwrap() to throw on error and get response.
            const response = await createBusinessProfile(submitData).unwrap();

            // Optionally do something with response
            console.log("Profile created:", response);

            // Navigate to next step
            router.push("/become-a-host/verify-identity");

        } catch (error) {
            console.log('Error submitting form:', error);
            // RTK Query errors may be objects; normalize a message
            const message = (error?.data?.detail) || error?.error || 'Failed to save profile. Please try again.';
            setErrors({ submit: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-background">
                <StepProgressIndicator />
                <main className="bg-slate-50 min-h-screen flex justify-center p-4">
                    <div className="w-full max-w-4xl">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                    <Building2 className="h-8 w-8 text-indigo-600" />
                                    Create Your Business Profile
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    Provide your business information to get started as a host.
                                </p>
                            </div>

                            {errors.submit && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{errors.submit}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Business Basic Information */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="business_name"
                                            id="business_name"
                                            value={formDataState.business_name}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_name ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="Enter your business name"
                                        />
                                        {errors.business_name && <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Type *
                                        </label>
                                        <select
                                            name="business_type"
                                            id="business_type"
                                            value={formDataState.business_type}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_type ? 'border-red-300' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select business type</option>
                                            {BUSINESS_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.business_type && <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>}
                                    </div>
                                </div>

                                {/* License Information */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-2">
                                            License Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="license_number"
                                            id="license_number"
                                            value={formDataState.license_number}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.license_number ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="Enter your business license number"
                                        />
                                        {errors.license_number && <p className="mt-1 text-sm text-red-600">{errors.license_number}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            License Document *
                                        </label>
                                        <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.license_document ? 'border-red-300' : 'border-gray-300'} hover:border-indigo-400 transition-colors`}>
                                            <input
                                                type="file"
                                                id="license_document"
                                                className="sr-only"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileChange(e, 'license_document')}
                                            />
                                            <label htmlFor="license_document" className="cursor-pointer">
                                                <FileText className="mx-auto h-8 w-8 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {previews.license_document || "Upload license document"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">PDF, DOC, or Image files</p>
                                            </label>
                                        </div>
                                        {errors.license_document && <p className="mt-1 text-sm text-red-600">{errors.license_document}</p>}
                                    </div>
                                </div>

                                {/* Business Logo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Logo *
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative h-24 w-24 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                            {previews.business_logo ? (
                                                <Image
                                                    src={previews.business_logo}
                                                    alt="Business logo preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Building2 className="h-12 w-12 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="business_logo"
                                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                <UploadCloud className="h-4 w-4 mr-2" />
                                                Upload Logo
                                            </label>
                                            <input
                                                id="business_logo"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'business_logo')}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    </div>
                                    {errors.business_logo && <p className="mt-1 text-sm text-red-600">{errors.business_logo}</p>}
                                </div>

                                {/* Business Address */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Business Address
                                    </h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="lg:col-span-2">
                                            <label htmlFor="business_address_line1" className="block text-sm font-medium text-gray-700 mb-2">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                name="business_address_line1"
                                                id="business_address_line1"
                                                value={formDataState.business_address_line1}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_address_line1 ? 'border-red-300' : 'border-gray-300'}`}
                                                placeholder="Street address"
                                            />
                                            {errors.business_address_line1 && <p className="mt-1 text-sm text-red-600">{errors.business_address_line1}</p>}
                                        </div>

                                        <div className="lg:col-span-2">
                                            <label htmlFor="business_address_line2" className="block text-sm font-medium text-gray-700 mb-2">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name="business_address_line2"
                                                id="business_address_line2"
                                                value={formDataState.business_address_line2}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Apartment, suite, etc. (optional)"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="business_city" className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="business_city"
                                                id="business_city"
                                                value={formDataState.business_city}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_city ? 'border-red-300' : 'border-gray-300'}`}
                                                placeholder="City"
                                            />
                                            {errors.business_city && <p className="mt-1 text-sm text-red-600">{errors.business_city}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="business_state" className="block text-sm font-medium text-gray-700 mb-2">
                                                State/Province *
                                            </label>
                                            <input
                                                type="text"
                                                name="business_state"
                                                id="business_state"
                                                value={formDataState.business_state}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_state ? 'border-red-300' : 'border-gray-300'}`}
                                                placeholder="State or Province"
                                            />
                                            {errors.business_state && <p className="mt-1 text-sm text-red-600">{errors.business_state}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="business_postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                                                Postal Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="business_postal_code"
                                                id="business_postal_code"
                                                value={formDataState.business_postal_code}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_postal_code ? 'border-red-300' : 'border-gray-300'}`}
                                                placeholder="Postal code"
                                            />
                                            {errors.business_postal_code && <p className="mt-1 text-sm text-red-600">{errors.business_postal_code}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="business_country" className="block text-sm font-medium text-gray-700 mb-2">
                                                Country *
                                            </label>
                                            <select
                                                name="business_country"
                                                id="business_country"
                                                value={formDataState.business_country}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_country ? 'border-red-300' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select country</option>
                                                {COUNTRIES.map(country => (
                                                    <option key={country} value={country}>{country}</option>
                                                ))}
                                            </select>
                                            {errors.business_country && <p className="mt-1 text-sm text-red-600">{errors.business_country}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Business Description */}
                                <div>
                                    <label htmlFor="business_description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Description *
                                    </label>
                                    <textarea
                                        id="business_description"
                                        name="business_description"
                                        rows={4}
                                        value={formDataState.business_description}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.business_description ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Describe your business, services, and what makes you unique..."
                                        maxLength={1000}
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        {errors.business_description && <p className="text-sm text-red-600">{errors.business_description}</p>}
                                        <p className="text-xs text-gray-500 ml-auto">
                                            {formDataState.business_description.length} / 1000
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                </main>
            </div>
        </>
    );
}
