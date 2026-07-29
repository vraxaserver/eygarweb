"use client";

import React from "react";
import Link from "next/link";
import { Clock, ShieldAlert, RefreshCw, Home, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VendorPendingApproval({ statusData, refetch, isRefetching }) {
    const status = statusData?.status || "pending";
    const companyName = statusData?.company_name || statusData?.business_name || "Your Business";

    if (status === "rejected") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
                    <div className="p-8 text-center border-b border-gray-100">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-red-600" />
                        </div>
                        <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                            Application Rejected
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Action Required for Vendor Application
                        </h1>
                        <p className="text-gray-600 text-sm max-w-md mx-auto">
                            Unfortunately, your vendor application for <span className="font-semibold text-gray-800">{companyName}</span> could not be approved at this time.
                        </p>
                    </div>

                    <div className="p-8 space-y-6 bg-slate-50/50">
                        {statusData?.rejection_reason && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <h4 className="text-xs font-semibold text-red-800 uppercase mb-1">Reason provided:</h4>
                                <p className="text-sm text-red-700">{statusData.rejection_reason}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button
                                onClick={() => refetch()}
                                disabled={isRefetching}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                                Check Status
                            </Button>
                            <Link href="/become-a-vendor/company-details" className="w-full sm:w-auto">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Update Application
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-white">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
                    </div>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                        Pending Approval
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Application Under Review
                    </h1>
                    <p className="text-gray-600 text-sm max-w-md mx-auto">
                        Thank you for completing your vendor registration! Your vendor account is currently being reviewed by our admin team.
                    </p>
                </div>

                {/* Progress Details */}
                <div className="p-8 space-y-6">
                    <div className="bg-slate-50 rounded-xl p-5 border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">Business Name:</span>
                            <span className="font-semibold text-gray-900">{companyName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">Review Status:</span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                In Verification
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">Expected Time:</span>
                            <span className="font-medium text-gray-700">24 – 48 Hours</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            What happens next?
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <span>Our verification team checks your company details & service area.</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <span>Once approved, full access to vendor dashboard features will be enabled automatically.</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                        <Button
                            onClick={() => refetch()}
                            disabled={isRefetching}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                            Refresh Status
                        </Button>
                        <Link href="/" className="w-full sm:w-auto">
                            <Button variant="default" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Home className="w-4 h-4 mr-2" />
                                Go to Homepage
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
