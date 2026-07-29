"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MapPin,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { useVerifyContactMutation } from "@/store/features/hostProfileApi";
import PhoneInputWithCountry from "@/components/ui/PhoneInputWithCountry";

const FormInput = ({ label, name, value, onChange, placeholder, error, isRequired = false, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {isRequired && '*'}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label}`}
            maxLength={150}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                error ? 'border-red-300' : 'border-gray-300'
            }`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

export default function VerifyContactPage() {
    const router = useRouter();
    const [verifyContact, { isLoading }] = useVerifyContactMutation();

    const [mobileCountry, setMobileCountry] = useState("+974");
    const [whatsappCountry, setWhatsappCountry] = useState("+974");

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

        if (!formData.address_line1.trim()) {
            newErrors.address_line1 = "Address line 1 is required.";
        } else if (formData.address_line1.trim().length < 3) {
            newErrors.address_line1 = "Address line 1 must be at least 3 characters.";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required.";
        } else if (formData.city.trim().length < 2) {
            newErrors.city = "City must be at least 2 characters.";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State / Province is required.";
        } else if (formData.state.trim().length < 2) {
            newErrors.state = "State / Province must be at least 2 characters.";
        }

        if (!formData.postal_code.trim()) {
            newErrors.postal_code = "Postal code is required.";
        } else if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(formData.postal_code.trim())) {
            newErrors.postal_code = "Please enter a valid postal code (3-10 characters).";
        }

        if (!formData.country.trim()) {
            newErrors.country = "Country is required.";
        } else if (formData.country.trim().length < 2) {
            newErrors.country = "Country must be at least 2 characters.";
        }

        if (formData.latitude.trim() && isNaN(Number(formData.latitude))) {
            newErrors.latitude = "Please enter a valid numeric latitude (e.g. 24.7136).";
        }

        if (formData.longitude.trim() && isNaN(Number(formData.longitude))) {
            newErrors.longitude = "Please enter a valid numeric longitude (e.g. 46.6753).";
        }

        if (!formData.mobile_number.trim()) {
            newErrors.mobile_number = "Mobile number is required.";
        } else {
            const digits = formData.mobile_number.replace(/\D/g, "");
            if (digits.length < 7 || digits.length > 15) {
                newErrors.mobile_number = "Please enter a valid mobile number (7 to 15 digits).";
            }
        }

        if (formData.whatsapp_number.trim()) {
            const digits = formData.whatsapp_number.replace(/\D/g, "");
            if (digits.length < 7 || digits.length > 15) {
                newErrors.whatsapp_number = "Please enter a valid WhatsApp number (7 to 15 digits).";
            }
        }

        if (formData.facebook_page_url.trim() && !/^(https?:\/\/)?(www\.)?facebook\.com\/.+/i.test(formData.facebook_page_url.trim())) {
            newErrors.facebook_page_url = "Please enter a valid Facebook URL starting with https://facebook.com/";
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

        let mobile = formData.mobile_number.trim();
        if (mobile && !mobile.startsWith("+")) {
            mobile = `${mobileCountry}${mobile.replace(/\D/g, "")}`;
        }

        let whatsapp = formData.whatsapp_number.trim();
        if (whatsapp && !whatsapp.startsWith("+")) {
            whatsapp = `${whatsappCountry}${whatsapp.replace(/\D/g, "")}`;
        }

        const payload = {
            ...formData,
            address_line1: formData.address_line1.trim(),
            address_line2: formData.address_line2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postal_code: formData.postal_code.trim(),
            country: formData.country.trim(),
            mobile_number: mobile,
            whatsapp_number: whatsapp,
        };

        try {
            await verifyContact(payload).unwrap();
            router.push("/become-a-host/review-submit");
        } catch (err) {
            console.error("Failed to save contact info:", err);
            const errorMessage = err.data?.detail || err.data?.mobile_number?.[0] || 'Failed to save contact information. Please check your details and try again.';
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
                                <MapPin className="h-8 w-8 text-primary" />
                                Contact & Address Information
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Provide your contact details and business address for verification.
                            </p>
                        </div>
                        
                        {errors.submit && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                            {/* Address Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">Physical Address</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="lg:col-span-2">
                                        <FormInput
                                            label="Address Line 1"
                                            name="address_line1"
                                            value={formData.address_line1}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 123 Palm Boulevard, Building A"
                                            error={errors.address_line1}
                                            isRequired
                                        />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <FormInput
                                            label="Address Line 2 (Optional)"
                                            name="address_line2"
                                            value={formData.address_line2}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Suite 402 or Villa 12 (optional)"
                                            error={errors.address_line2}
                                        />
                                    </div>
                                    <FormInput
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Riyadh"
                                        error={errors.city}
                                        isRequired
                                    />
                                    <FormInput
                                        label="State / Province"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Riyadh Region"
                                        error={errors.state}
                                        isRequired
                                    />
                                    <FormInput
                                        label="Postal Code"
                                        name="postal_code"
                                        value={formData.postal_code}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 12211"
                                        error={errors.postal_code}
                                        isRequired
                                    />
                                    <FormInput
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Saudi Arabia"
                                        error={errors.country}
                                        isRequired
                                    />
                                    <FormInput
                                        label="Latitude (Optional)"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 24.7136"
                                        error={errors.latitude}
                                    />
                                    <FormInput
                                        label="Longitude (Optional)"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 46.6753"
                                        error={errors.longitude}
                                    />
                                </div>
                            </div>
                            
                            {/* Contact Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">Contact Numbers</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number *
                                        </label>
                                        <PhoneInputWithCountry
                                            countryCode={mobileCountry}
                                            onCountryCodeChange={setMobileCountry}
                                            value={formData.mobile_number}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, mobile_number: e.target.value }));
                                                if (errors.mobile_number) setErrors(prev => ({ ...prev, mobile_number: "" }));
                                            }}
                                            placeholder="Enter Mobile Number (e.g. 501234567)"
                                        />
                                        {errors.mobile_number && <p className="mt-1 text-sm text-red-600">{errors.mobile_number}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            WhatsApp Number (Optional)
                                        </label>
                                        <PhoneInputWithCountry
                                            countryCode={whatsappCountry}
                                            onCountryCodeChange={setWhatsappCountry}
                                            value={formData.whatsapp_number}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }));
                                                if (errors.whatsapp_number) setErrors(prev => ({ ...prev, whatsapp_number: "" }));
                                            }}
                                            placeholder="Enter WhatsApp Number (e.g. 501234567)"
                                        />
                                        {errors.whatsapp_number && <p className="mt-1 text-sm text-red-600">{errors.whatsapp_number}</p>}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Social Media Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">Social Presence (Optional)</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <FormInput
                                        label="Telegram Username (Optional)"
                                        name="telegram_username"
                                        value={formData.telegram_username}
                                        onChange={handleInputChange}
                                        placeholder="@yourusername"
                                        error={errors.telegram_username}
                                    />
                                    <FormInput
                                        label="Facebook Page URL (Optional)"
                                        name="facebook_page_url"
                                        value={formData.facebook_page_url}
                                        onChange={handleInputChange}
                                        placeholder="https://facebook.com/yourpage"
                                        error={errors.facebook_page_url}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
