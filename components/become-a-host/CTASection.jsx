"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import Icon from '@/components/AppIcon';
import Link from "next/link";

const CTASection = () => {

    const handleStartRegistration = () => {
        console.log("/step-1-identity-verification");
    };

    const benefits = [
        "Complete verification in 10-15 minutes",
        "Start earning within 72 hours",
        "Join 50,000+ successful hosts",
        "24/7 support throughout the process",
    ];

    return (
        <div className="bg-gradient-to-r from-primary to-accent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    {/* Main CTA Content */}
                    <div className="mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Hosting Journey?
                        </h2>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                            Join thousands of successful hosts who are earning
                            extra income by sharing their spaces. Complete
                            verification today and start hosting tomorrow.
                        </p>

                        {/* Benefits List */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                            {benefits?.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 text-white/90"
                                >
                                    <Icon
                                        name="Check"
                                        size={16}
                                        className="text-white flex-shrink-0"
                                    />
                                    <span className="text-sm">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="space-y-4">
                            <Link
                                href="/become-a-host/create-profile"
                                className="bg-white py-3 text-primary hover:bg-white/90 px-8"
                            >
                                Start Verification Process
                            </Link>

                            <p className="mt-5 text-sm text-white/80 flex items-center justify-center space-x-2">
                                <Icon name="Shield" size={16} />
                                <span>
                                    Secure • Free • No commitment required
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="border-t border-white/20 pt-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    50K+
                                </div>
                                <div className="text-sm text-white/80">
                                    Verified Hosts
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    98%
                                </div>
                                <div className="text-sm text-white/80">
                                    Approval Rate
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    4.9★
                                </div>
                                <div className="text-sm text-white/80">
                                    Host Rating
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    24/7
                                </div>
                                <div className="text-sm text-white/80">
                                    Support
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CTASection;
