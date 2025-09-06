"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Mail,
    Smartphone,
    MessageCircle,
    CheckCircle,
    ShieldCheck,
    ArrowRight,
    Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import Link from "next/link";

// Reusable component for each verification section
const VerificationItem = ({
    icon,
    title,
    description,
    isVerified,
    onSendCode,
    onVerifyCode,
}) => {
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState("");

    const handleSendCode = () => {
        onSendCode();
        setIsCodeSent(true);
    };

    const handleVerify = (e) => {
        e.preventDefault();
        onVerifyCode(code);
    };

    if (isVerified) {
        return (
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-green-100 rounded-full">
                    {icon}
                </div>
                <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    <p className="text-sm text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Verified
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                    {icon}
                </div>
                <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                {!isCodeSent && (
                    <button
                        type="button"
                        onClick={handleSendCode}
                        className="ml-4 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                    >
                        Send Code
                    </button>
                )}
            </div>
            {isCodeSent && (
                <form
                    onSubmit={handleVerify}
                    className="mt-4 flex items-center gap-3 pl-14"
                >
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
                    >
                        Verify
                    </button>
                </form>
            )}
        </div>
    );
};

export default function VerifyContactPage() {
    const router = useRouter();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isMobileVerified, setIsMobileVerified] = useState(false);
    const [isWhatsAppVerified, setIsWhatsAppVerified] = useState(false);

    // Mock handlers - in a real app, these would call your API
    const handleSend = (type) => console.log(`Sending code for ${type}...`);
    const handleVerify = (type, code) => {
        console.log(`Verifying ${type} with code: ${code}`);
        if (type === "email") setIsEmailVerified(true);
        if (type === "mobile") setIsMobileVerified(true);
        if (type === "whatsapp") setIsWhatsAppVerified(true);
    };

    const allVerified =
        isEmailVerified && isMobileVerified && isWhatsAppVerified;

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
                                            Verify Your Contact Info
                                        </h1>
                                        <p className="text-gray-500 mt-1">
                                            For security and communication,
                                            please verify your contact methods.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-6">
                                    <VerificationItem
                                        icon={
                                            <Mail className="h-5 w-5 text-gray-600" />
                                        }
                                        title="Email Address"
                                        description="Confirm your primary email for booking updates."
                                        isVerified={isEmailVerified}
                                        onSendCode={() => handleSend("email")}
                                        onVerifyCode={(code) =>
                                            handleVerify("email", code)
                                        }
                                    />
                                    <VerificationItem
                                        icon={
                                            <Smartphone className="h-5 w-5 text-gray-600" />
                                        }
                                        title="Mobile Number"
                                        description="Used for critical alerts and guest communication."
                                        isVerified={isMobileVerified}
                                        onSendCode={() => handleSend("mobile")}
                                        onVerifyCode={(code) =>
                                            handleVerify("mobile", code)
                                        }
                                    />
                                    <VerificationItem
                                        icon={
                                            <MessageCircle className="h-5 w-5 text-gray-600" />
                                        }
                                        title="WhatsApp (Optional)"
                                        description="Enable quick communication with guests."
                                        isVerified={isWhatsAppVerified}
                                        onSendCode={() =>
                                            handleSend("whatsapp")
                                        }
                                        onVerifyCode={(code) =>
                                            handleVerify("whatsapp", code)
                                        }
                                    />
                                </div>

                                <div className="mt-8 text-right">
                                    <Link
                                        href={"/become-a-host/review-submit"}
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                    >
                                        Save and Continue
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
