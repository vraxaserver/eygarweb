"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { resolveAmenityIcon } from "@/utils/amenityIconMap";
import { Flame, Shield, X, HelpCircle } from "lucide-react";

const Amenities = ({ amenities = [] }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!amenities || amenities.length === 0) return null;

    // Display first 10 on page to match clean Airbnb layout
    const visibleAmenities = amenities.slice(0, 10);

    return (
        <div className="py-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                What this place offers
            </h3>

            {/* 2-Column Grid Layout matching clean minimalism */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {visibleAmenities.map((amenity, index) => {
                    const IconComponent = resolveAmenityIcon(amenity.icon || amenity.name);
                    const isUnavailable = amenity.available === false;

                    return (
                        <div
                            key={amenity.id || index}
                            className="flex items-center gap-4 py-1.5"
                        >
                            {/* Icon container */}
                            <div className="relative flex items-center justify-center w-7 h-7 flex-shrink-0">
                                <IconComponent
                                    className={`w-6 h-6 stroke-[1.5] ${
                                        isUnavailable
                                            ? "text-gray-400"
                                            : "text-gray-800"
                                    }`}
                                />
                                {isUnavailable && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-7 h-[1.5px] bg-gray-500 rotate-[45deg]" />
                                    </div>
                                )}
                            </div>

                            {/* Amenity label */}
                            <span
                                className={`text-base font-normal text-gray-800 ${
                                    isUnavailable ? "line-through text-gray-400" : ""
                                }`}
                            >
                                {amenity.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Show all amenities modal button if total > 10 */}
            {amenities.length > 10 && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="mt-8 h-12 px-6 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Show all {amenities.length} amenities
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl">
                        <DialogHeader className="border-b pb-4 mb-6">
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                What this place offers
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                {amenities.map((amenity, index) => {
                                    const IconComponent = resolveAmenityIcon(
                                        amenity.icon || amenity.name
                                    );
                                    const isUnavailable = amenity.available === false;

                                    return (
                                        <div
                                            key={amenity.id || index}
                                            className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="relative flex items-center justify-center w-7 h-7 flex-shrink-0">
                                                <IconComponent
                                                    className={`w-6 h-6 stroke-[1.5] ${
                                                        isUnavailable
                                                            ? "text-gray-400"
                                                            : "text-gray-800"
                                                    }`}
                                                />
                                                {isUnavailable && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-7 h-[1.5px] bg-gray-500 rotate-[45deg]" />
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={`text-base font-normal text-gray-800 ${
                                                    isUnavailable
                                                        ? "line-through text-gray-400"
                                                        : ""
                                                }`}
                                            >
                                                {amenity.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Amenities;
