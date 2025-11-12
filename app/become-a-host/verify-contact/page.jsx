"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Smartphone,
    Share2,
    ArrowRight,
} from "lucide-react";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useVerifyContactMutation } from "@/store/features/hostProfileApi";

// Reusable input component for consistency
const FormInput = ({ label, name, value, onChange, placeholder, error, isRequired = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {isRequired && '*'}
        </label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                error ? 'border-red-300' : 'border-gray-300'
            }`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

export default function VerifyContactPage() {
    const router = useRouter();
    const [verifyContact, { isLoading }] = useVerifyContactMutation();

    const [formData, setFormData] = useState({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        latitude: "",
        longitude: "",
        mobile_number: "",
        whatsapp_number: "",
        telegram_username: "",
        facebook_page_url: "",
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['address_line1', 'city', 'state', 'postal_code', 'country', 'mobile_number'];
        
        requiredFields.forEach(field => {
            if (!formData[field].trim()) {
                newErrors[field] = `${field.replace(/_/g, ' ')} is required.`;
            }
        });

        // Basic mobile number validation (e.g., must be digits, optional +)
        if (formData.mobile_number && !/^\+?[\d\s-]{10,15}$/.test(formData.mobile_number)) {
            newErrors.mobile_number = "Please enter a valid mobile number.";
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
            await verifyContact(formData).unwrap();
            router.push("/become-a-host/review-submit");
        } catch (err) {
            console.error("Failed to save contact info:", err);
            const errorMessage = err.data?.detail || 'Failed to save information. Please try again.';
            setErrors(prev => ({ ...prev, submit: errorMessage }));
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <StepProgressIndicator />
            <main className="bg-slate-50 min-h-screen flex justify-center p-4">
                <div className="w-full max-w-3xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <MapPin className="h-8 w-8 text-indigo-600" />
                                Contact & Address Information
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Provide your contact details and business address for verification.
                            </p>
                        </div>
                        
                        {errors.submit && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                            {/* Address Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">Physical Address</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="lg:col-span-2">
                                        <FormInput label="Address Line 1" name="address_line1" value={formData.address_line1} onChange={handleInputChange} error={errors.address_line1} isRequired />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <FormInput label="Address Line 2" name="address_line2" value={formData.address_line2} onChange={handleInputChange} error={errors.address_line2} />
                                    </div>
                                    <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} isRequired />
                                    <FormInput label="State / Province" name="state" value={formData.state} onChange={handleInputChange} error={errors.state} isRequired />
                                    <FormInput label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleInputChange} error={errors.postal_code} isRequired />
                                    <FormInput label="Country" name="country" value={formData.country} onChange={handleInputChange} error={errors.country} isRequired />
                                    {/* Latitude and Longitude can be hidden or auto-filled with a map API */}
                                    <FormInput label="Latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g., 40.7128" error={errors.latitude} />
                                    <FormInput label="Longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g., -74.0060" error={errors.longitude} />
                                </div>
                            </div>
                            
                            {/* Contact Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">Contact Numbers</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <FormInput label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} placeholder="+1 123 456 7890" error={errors.mobile_number} isRequired />
                                    <FormInput label="WhatsApp Number (Optional)" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleInputChange} placeholder="Same as mobile, if applicable" error={errors.whatsapp_number} />
                                </div>
                            </div>
                            
                            {/* Social Media Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">Social Presence (Optional)</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <FormInput label="Telegram Username" name="telegram_username" value={formData.telegram_username} onChange={handleInputChange} placeholder="@yourusername" error={errors.telegram_username} />
                                    <FormInput label="Facebook Page URL" name="facebook_page_url" value={formData.facebook_page_url} onChange={handleInputChange} placeholder="https://facebook.com/yourpage" error={errors.facebook_page_url} />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
    );
}
