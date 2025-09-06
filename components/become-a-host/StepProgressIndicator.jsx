"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Play, Shield, User, CheckCircle, Check, Popsicle } from "lucide-react";
import React from "react";

// Configuration for the steps in the registration process
const steps = [
    { id: 0, path: "/become-a-host/create-profile", label: "Get started", icon: Play },
    { id: 1, path: "/become-a-host/create-profile", label: "Create Profile", icon: Popsicle },
    { id: 2, path: "/become-a-host/verify-identity", label: "Identity", icon: Shield },
    { id: 3, path: "/become-a-host/verify-contact", label: "Contact", icon: User },
    { id: 4, path: "/become-a-host/review-submit", label: "Review & Submit", icon: CheckCircle },
];

const StepProgressIndicator = () => {
    const pathname = usePathname();

    // Determine the current step, defaulting to the first step if no match is found
    const currentIndex = Math.max(0, steps.findIndex((step) => step.path === pathname));

    const getStepStatus = (stepIndex) => {
        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "upcoming";
    };

    return (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                
                {/* Mobile View: Compact Segmented Bar */}
                <div className="lg:hidden">
                    <div className="mb-2">
                        <p className="text-sm font-semibold text-gray-800">
                            Step {currentIndex + 1} of {steps.length}:{" "}
                            <span className="font-normal text-gray-600">{steps[currentIndex].label}</span>
                        </p>
                    </div>
                    <div className="flex w-full h-1.5 space-x-1">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 rounded-full ${index <= currentIndex ? "bg-indigo-600" : "bg-gray-200"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop View: Full Stepper */}
                <div className="hidden lg:flex items-center justify-between">
                    {steps.map((step, index) => {
                        const status = getStepStatus(index);
                        const isAccessible = index <= currentIndex;

                        const StepIcon = () => {
                            const commonClasses = "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300";
                            if (status === 'completed') {
                                return <div className={`${commonClasses} bg-indigo-600 text-white`}><Check size={20} /></div>;
                            }
                            if (status === 'current') {
                                return <div className={`${commonClasses} border-2 border-indigo-600 text-indigo-600 bg-white`}><step.icon size={20} /></div>;
                            }
                            return <div className={`${commonClasses} bg-gray-200 text-gray-500`}><step.icon size={20} /></div>;
                        };

                        const StepContent = (
                            <div className="flex items-center gap-3">
                                <StepIcon />
                                <div>
                                    <h3 className={`font-medium text-sm transition-colors ${status === 'upcoming' ? 'text-gray-400' : 'text-gray-800'}`}>
                                        {step.label}
                                    </h3>
                                </div>
                            </div>
                        );

                        return (
                            <React.Fragment key={step.id}>
                                {isAccessible ? (
                                    <Link href={step.path} aria-current={status === 'current' ? 'step' : undefined} className="focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg p-1">
                                        {StepContent}
                                    </Link>
                                ) : (
                                    <div className="cursor-not-allowed">
                                        {StepContent}
                                    </div>
                                )}
                                
                                {index < steps.length - 1 && (
                                    <div className={`flex-grow h-0.5 mx-4 transition-colors duration-300 ${status === 'completed' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StepProgressIndicator;