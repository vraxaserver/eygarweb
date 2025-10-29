import React from "react";
import Image from "next/image";
import Icon from '@/components/AppIcon';

const BenefitsSection = () => {
    const benefits = [
        {
            id: 1,
            icon: "DollarSign",
            title: "Maximize Earnings",
            description:
                "Verified hosts earn 40% more on average with access to premium booking features and higher search rankings.",
            highlight: "40% Higher Earnings",
            color: "success",
        },
        {
            id: 2,
            icon: "Shield",
            title: "Enhanced Safety",
            description:
                "Our verification process protects both hosts and guests with identity checks, secure payments, and 24/7 support.",
            highlight: "24/7 Protection",
            color: "primary",
        },
        {
            id: 3,
            icon: "Users",
            title: "Trusted Community",
            description:
                "Join a network of verified hosts with access to exclusive resources, training, and peer support groups.",
            highlight: "50K+ Hosts",
            color: "accent",
        },
        {
            id: 4,
            icon: "TrendingUp",
            title: "Growth Support",
            description:
                "Get personalized insights, marketing tools, and optimization tips to grow your hosting business successfully.",
            highlight: "Expert Guidance",
            color: "warning",
        },
    ];

    const features = [
        "Priority customer support",
        "Advanced booking management",
        "Professional photography assistance",
        "Marketing and promotion tools",
        "Insurance coverage options",
        "Tax reporting assistance",
    ];

    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Why Become a Verified Host?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Unlock exclusive benefits and opportunities that help
                        you succeed as a host while ensuring safety and trust
                        for everyone.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {benefits?.map((benefit) => (
                        <div
                            key={benefit?.id}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start space-x-4">
                                {/* Icon */}
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        benefit?.color === "success"
                                            ? "bg-success/10"
                                            : benefit?.color === "primary"
                                            ? "bg-primary/10"
                                            : benefit?.color === "accent"
                                            ? "bg-accent/10"
                                            : "bg-warning/10"
                                    }`}
                                >
                                    <Icon
                                        name={benefit?.icon}
                                        size={24}
                                        className={
                                            benefit?.color === "success"
                                                ? "text-success"
                                                : benefit?.color === "primary"
                                                ? "text-primary"
                                                : benefit?.color === "accent"
                                                ? "text-accent"
                                                : "text-warning"
                                        }
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {benefit?.title}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                benefit?.color === "success"
                                                    ? "bg-success/10 text-success"
                                                    : benefit?.color ===
                                                      "primary"
                                                    ? "bg-primary/10 text-primary"
                                                    : benefit?.color ===
                                                      "accent"
                                                    ? "bg-accent/10 text-accent"
                                                    : "bg-warning/10 text-warning"
                                            }`}
                                        >
                                            {benefit?.highlight}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {benefit?.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features & Image Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Features List */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">
                                What You Get as a Verified Host
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Access exclusive tools and support designed to
                                help you succeed in the hosting business.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {features?.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon
                                            name="Check"
                                            size={12}
                                            className="text-success"
                                        />
                                    </div>
                                    <span className="text-sm text-foreground">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Success Stats */}
                        <div className="bg-muted/50 rounded-lg p-6 mt-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        98%
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Success Rate
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        72hrs
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Avg Approval
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative">
                        <Image
                            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80"
                            alt="Successful host managing bookings on laptop"
                            width="400"
                            height="400"
                            className="w-full h-80 lg:h-96 object-cover rounded-xl shadow-lg"
                        />

                        {/* Overlay Card */}
                        <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon
                                        name="TrendingUp"
                                        size={20}
                                        className="text-primary"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">
                                        Growing Income
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Month over month growth
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenefitsSection;
