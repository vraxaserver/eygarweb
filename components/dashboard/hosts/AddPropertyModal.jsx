// components/AddPropertyModal.js
"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
    Home, Image, MapPin, Settings, FileText, X, Check, Upload, ChevronLeft, ChevronRight
} from "lucide-react";

const initialFormData = {
    title: "", description: "", property_type: "entire_place", bedrooms: 1, beds: 1, bathrooms: 1, max_guests: 2,
    price_per_night: "", cleaning_fee: "", instant_book: false,
    location: { address: "", city: "", state: "", country: "", postal_code: "", latitude: "", longitude: "" },
    images: [], amenity_ids: [], house_rules: [""], cancellation_policy: "", check_in_policy: "",
};

const steps = [
    { number: 1, title: "Basic Info", icon: Home },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Images", icon: Image },
    { number: 4, title: "Amenities & Rules", icon: Settings },
    { number: 5, title: "Policies", icon: FileText },
];

// Memoize the Step Content component to prevent re-renders unless props change
const StepContent = React.memo(({ currentStep, formData, handlers }) => {
    // ... all the switch-case logic from your original `renderStepContent` function
    // For brevity, I'm showing just the structure. Paste your full switch-case here.
     switch (currentStep) {
        case 1:
            return <div>...Your Step 1 Form Fields...</div>;
        case 2:
            return <div>...Your Step 2 Form Fields...</div>;
        case 3:
            return <div>...Your Step 3 Form Fields...</div>;
        case 4:
            return <div>...Your Step 4 Form Fields...</div>;
        case 5:
            return <div>...Your Step 5 Form Fields...</div>;
        default:
            return null;
    }
});
StepContent.displayName = 'StepContent';


function AddPropertyModal({ show, onClose }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);

    // Use useCallback for all handler functions to stabilize their identity
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }, []);

    const handleLocationChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
    }, []);
    
    // ... other handlers like handleImageUpload, addHouseRule wrapped in useCallback ...
    
    const nextStep = useCallback(() => {
        if (currentStep < 5) setCurrentStep(s => s + 1);
    }, [currentStep]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) setCurrentStep(s => s - 1);
    }, [currentStep]);

    const handleSubmit = useCallback(() => {
        console.log("Submitting property:", formData);
        onClose(); // Close the modal
        // Reset state for next time
        setCurrentStep(1);
        setFormData(initialFormData);
    }, [formData, onClose]);

    // useMemo will prevent re-calculating handlers object on every render
    const handlers = useMemo(() => ({
        handleInputChange,
        handleLocationChange,
        // ... add other handlers here
    }), [handleInputChange, handleLocationChange]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                 <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b bg-gray-50">
                   {/* ... Your Progress Steps UI ... */}
                </div>
                
                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <StepContent currentStep={currentStep} formData={formData} handlers={handlers} />
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
                     <button onClick={prevStep} disabled={currentStep === 1}>Previous</button>
                     {currentStep < 5 ? (
                        <button onClick={nextStep}>Next</button>
                     ) : (
                        <button onClick={handleSubmit}>Submit Property</button>
                     )}
                </div>
            </div>
        </div>
    );
}

// Wrap the export in React.memo to prevent re-renders when parent's state changes
export default React.memo(AddPropertyModal);