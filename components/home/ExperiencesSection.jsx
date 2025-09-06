"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import {Star} from 'lucide-react';
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import { useTranslation} from "@/lib/i18n";

const ExperiencesSection = ({experiences}) => {
    const { t } = useTranslation()
    return (
        <div className="w-full mb-16 mt-10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 px-2 sm:px-0">
                <div className="w-full sm:w-auto">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {t("home.unique_experience_section_title")}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        {t("home.unique_experience_section_desc")}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    className="text-[#814193] hover:text-[#6d3580] font-medium w-full sm:w-auto"
                >
                    View All →
                </Button>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 py-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-6">
                {experiences.map((experience) => (
                    <Card
                        key={experience.id}
                        className="group w-full py-0 overflow-hidden hover:shadow-xl transition-all duration-300 border rounded-2xl"
                    >
                        <div className="relative">
                            {/* Image Section */}
                            <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 w-full overflow-hidden">
                                <img
                                    src={experience.image}
                                    alt={experience.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Free Badge */}
                                <Badge className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1">
                                    FREE
                                </Badge>

                                {/* Category Badge */}
                                <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs px-2 py-1">
                                    {experience.category}
                                </Badge>
                            </div>

                            {/* Card Content */}
                            <CardContent className="p-3 sm:p-4">
                                {/* Experience Title */}
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base">
                                    {experience.title}
                                </h3>

                                {/* Location and Duration */}
                                <div className="flex flex-wrap items-center gap-1 text-xs text-gray-600 mb-2">
                                    <span>📍 {experience.location}</span>
                                    <span>•</span>
                                    <span>⏱️ {experience.duration}</span>
                                    <span>•</span>
                                    <span>👥 {experience.participants}</span>
                                </div>

                                {/* Description */}
                                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                                    {experience.description || "Learn to cook authentic Emirati dishes with local spices and traditional cooking methods."}
                                </p>

                                {/* Host and Rating */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-[#814193] rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {experience.host.split(' ')[0]?.[0] || 'H'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-600">{experience.host}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-medium">{experience.rating}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

    );
};

export default ExperiencesSection;