"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Lock, CheckCircle, DollarSign, Star } from "lucide-react";
import Link from "next/link";

const HeroSection = ({}) => {

    const handleStartRegistration = () => {
        console.log('/step-1-identity-verification');
    };

    return (
        <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                            <Shield size={16} className="text-gray-600" />
                            <span>Trusted Host Program</span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                                Become a
                                <span className="text-primary block">
                                    Verified Host
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                Join thousands of successful hosts who earn
                                extra income by sharing their spaces and
                                experiences. Our comprehensive verification
                                process ensures trust, safety, and success for
                                everyone.
                            </p>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-border">
                            <div className="text-center">
                                <div className="text-2xl lg:text-3xl font-bold text-primary">
                                    50K+
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Active Hosts
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl lg:text-3xl font-bold text-primary">
                                    $2.5K
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Avg Monthly
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl lg:text-3xl font-bold text-primary">
                                    4.9★
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Host Rating
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="space-y-4">
                            <Link
                                href="/become-a-host/create-profile"
                                className="sm:w-auto sm:px-8 bg-primary py-3 text-white"
                            >
                                Start Verification Process
                            </Link>
                            
                            <p className="mt-5 text-sm text-muted-foreground flex items-center space-x-2">
                                <Clock size={16} />
                                <span>Takes 10-15 minutes to complete</span>
                            </p>
                        </div>

                        {/* Trust Signals */}
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Shield size={16} className="text-green-500" />
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Lock size={16} className="text-green-500" />
                                <span>Bank-Level Security</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>Verified Platform</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <div className="relative">
                        <div className="relative z-10">
                            <Image
                                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
                                alt="Happy host welcoming guests to beautiful property"
                                width="400"
                                height="400"
                                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                            />
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -top-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-lg z-20">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                                    <DollarSign size={20} className="text-green-500" />
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">
                                        $3,200
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        This month
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-lg z-20">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Star size={20} className="text-blue-500" />
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">
                                        4.95 ★
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Host rating
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-2xl transform rotate-3 -z-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
