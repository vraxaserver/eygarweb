"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, UploadCloud, ArrowRight, FileText, MapPin, AlertCircle } from "lucide-react";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useCreateBusinessProfileMutation } from "@/store/features/hostProfileApi";

const BUSINESS_TYPES = [
    "Holiday Home",
    "Serviced Apartment",
    "Vacation Rental",
    "Short-Term Rental",
    "Homestay",
    "Hotel",
    "Guest House"
];

const COUNTRIES = [
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "Oman",
    "Bahrain"
];

export default function CreateBusinessProfilePage() {
    const router = useRouter();
    const [createBusinessProfile, { isLoading: apiLoading }] = useCreateBusinessProfileMutation();

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

    // Handle file changes with validation & suggestive error messages
    const handleFileChange = (e, fileType) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clear existing field error
        setErrors(prev => ({ ...prev, [fileType]: "" }));

        if (fileType === 'business_logo') {
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!allowedImageTypes.includes(file.type.toLowerCase())) {
                setErrors(prev => ({
                    ...prev,
                    business_logo: "Unsupported file format: PDF and non-image files are not allowed for business logo. Only image files (PNG, JPG, JPEG, or WEBP) are supported."
                }));
                return;
            }

            const maxSizeBytes = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSizeBytes) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                setErrors(prev => ({
                    ...prev,
                    business_logo: `File size limit exceeded: Selected logo is ${sizeMB}MB. Please select an image smaller than 2MB.`
                }));
                return;
            }
        }

        if (fileType === 'license_document') {
            const allowedDocTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/webp'
            ];
            const fileExt = file.name.split('.').pop().toLowerCase();
            const validExts = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];

            if (!allowedDocTypes.includes(file.type.toLowerCase()) && !validExts.includes(fileExt)) {
                setErrors(prev => ({
                    ...prev,
                    license_document: "Unsupported file format: Only PDF, Word documents (.doc, .docx), or images (PNG, JPG) are allowed for license documents."
                }));
                return;
            }

            const maxSizeBytes = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSizeBytes) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                setErrors(prev => ({
                    ...prev,
                    license_document: `File size limit exceeded: Document size is ${sizeMB}MB. Please upload a file smaller than 5MB.`
                }));
                return;
            }
        }

        setFiles(prev => ({
            ...prev,
            [fileType]: file
        }));
    };

    // Previews for business_logo and license_document
    useEffect(() => {
        if (files.business_logo && files.business_logo.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(files.business_logo);

            if (prevLogoUrlRef.current) {
                URL.revokeObjectURL(prevLogoUrlRef.current);
            }

            prevLogoUrlRef.current = objectUrl;
            setPreviews(prev => ({
                ...prev,
                business_logo: objectUrl
            }));
        } else if (!files.business_logo) {
            if (prevLogoUrlRef.current) {
                URL.revokeObjectURL(prevLogoUrlRef.current);
                prevLogoUrlRef.current = null;
            }
            setPreviews(prev => ({ ...prev, business_logo: null }));
        }

        if (files.license_document) {
            setPreviews(prev => ({ ...prev, license_document: files.license_document.name }));
        } else {
            setPreviews(prev => ({ ...prev, license_document: null }));
        }

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

        if (!formDataState.business_name.trim()) {
            newErrors.business_name = "Business name is required.";
        } else if (formDataState.business_name.trim().length < 2) {
            newErrors.business_name = "Business name must be at least 2 characters.";
        }

        if (!formDataState.business_type) {
            newErrors.business_type = "Please select a business type.";
        }

        if (!formDataState.license_number.trim()) {
            newErrors.license_number = "License number is required.";
        } else if (formDataState.license_number.trim().length < 3) {
            newErrors.license_number = "License number must be at least 3 characters.";
        }

        if (!formDataState.business_address_line1.trim()) {
            newErrors.business_address_line1 = "Address line 1 is required.";
        }

        if (!formDataState.business_city.trim()) {
            newErrors.business_city = "City is required.";
        }

        if (!formDataState.business_state.trim()) {
            newErrors.business_state = "State / Province is required.";
        }

        if (!formDataState.business_postal_code.trim()) {
            newErrors.business_postal_code = "Postal code is required.";
        } else if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(formDataState.business_postal_code.trim())) {
            newErrors.business_postal_code = "Please enter a valid postal code (3-10 characters).";
        }

        if (!formDataState.business_country) {
            newErrors.business_country = "Please select a country.";
        }

        if (!formDataState.business_description.trim()) {
            newErrors.business_description = "Business description is required.";
        } else if (formDataState.business_description.trim().length < 10) {
            newErrors.business_description = "Description must be at least 10 characters long.";
        }

        if (!files.license_document) {
            newErrors.license_document = "License document is required. Upload a PDF, Word doc, or image file.";
        }

        if (!files.business_logo) {
            newErrors.business_logo = "Business logo is required. Upload an image file (PNG, JPG, or WEBP).";
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
            const submitData = new FormData();
            Object.entries(formDataState).forEach(([key, value]) => {
                submitData.append(key, value ? value.trim() : "");
            });

            if (files.license_document) {
                submitData.append('license_document', files.license_document);
            }
            if (files.business_logo) {
                submitData.append('business_logo', files.business_logo);
            }

            const response = await createBusinessProfile(submitData).unwrap();
            console.log("Profile created:", response);
            router.push("/become-a-host/verify-identity");

        } catch (error) {
            console.log('Error submitting form:', error);
            const newErrors = {};

            if (error?.data && typeof error.data === 'object') {
                const errorData = error.data;
                if (errorData.detail) {
                    newErrors.submit = errorData.detail;
                } else {
                    const fieldMessages = [];
                    Object.entries(errorData).forEach(([field, messages]) => {
                        const msgText = Array.isArray(messages) ? messages.join(' ') : messages;
                        newErrors[field] = msgText;
                        fieldMessages.push(`${field.replace(/_/g, ' ')}: ${msgText}`);
                    });
                    if (fieldMessages.length > 0) {
                        newErrors.submit = fieldMessages.join(' | ');
                    }
                }
            }

            if (!newErrors.submit) {
                newErrors.submit = error?.error || 'Failed to save business profile. Please check your details and try again.';
            }

            setErrors(newErrors);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <StepProgressIndicator />
            <main className="bg-slate-50 min-h-screen flex justify-center p-4">
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <Building2 className="h-8 w-8 text-primary" />
                                Create Your Business Profile
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Provide your business information to get started as a host.
                            </p>
                        </div>

                        {errors.submit && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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
                                        maxLength={100}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_name ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="e.g., Royal Palm Vacation Rentals"
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
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_type ? 'border-red-300' : 'border-gray-300'}`}
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
                                        maxLength={50}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.license_number ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="e.g., LIC-2026-987654"
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
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                                            onChange={(e) => handleFileChange(e, 'license_document')}
                                        />
                                        <label htmlFor="license_document" className="cursor-pointer">
                                            <FileText className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600 truncate">
                                                {previews.license_document || "Upload license document"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">PDF, Word (.doc, .docx) or Image files up to 10MB</p>
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
                                    <div className="relative h-24 w-24 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-gray-200">
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
                                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <UploadCloud className="h-4 w-4 mr-2" />
                                            Upload Logo
                                        </label>
                                        <input
                                            id="business_logo"
                                            type="file"
                                            className="sr-only"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={(e) => handleFileChange(e, 'business_logo')}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Only image files (PNG, JPG, WEBP) up to 5MB are supported.</p>
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
                                            maxLength={150}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_address_line1 ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="e.g., 456 Business Boulevard, Floor 3"
                                        />
                                        {errors.business_address_line1 && <p className="mt-1 text-sm text-red-600">{errors.business_address_line1}</p>}
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label htmlFor="business_address_line2" className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="business_address_line2"
                                            id="business_address_line2"
                                            value={formDataState.business_address_line2}
                                            onChange={handleInputChange}
                                            maxLength={150}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                            placeholder="Apartment, suite, unit, etc. (optional)"
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
                                            maxLength={100}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_city ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="e.g., Riyadh"
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
                                            maxLength={100}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_state ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="e.g., Riyadh Region"
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
                                            maxLength={10}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_postal_code ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="e.g., 12211"
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
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_country ? 'border-red-300' : 'border-gray-300'}`}
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
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.business_description ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Describe your property hosting services, history, and unique features..."
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
                                    disabled={isLoading || apiLoading}
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading || apiLoading ? (
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
    );
}
