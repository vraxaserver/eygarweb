"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { useGetAmenitiesQuery } from "@/store/features/amenitiesApi";
import { useGetMyExperiencesQuery } from "@/store/features/experienceApi";
import { resolveAmenityIcon } from "@/utils/amenityIconMap";

export default function AmenitiesExperiencesStep({ formData, setFormData }) {
    const { data: amenitiesList = [], isLoading: amenitiesLoading } = useGetAmenitiesQuery();
    const { data: experiencesList = [], isLoading: experiencesLoading } = useGetMyExperiencesQuery();

    const selectedAmenityIds = formData.amenity_ids || [];
    const selectedExperienceIds = formData.experience_ids || [];

    const toggleAmenity = (id) => {
        const updated = selectedAmenityIds.includes(id)
            ? selectedAmenityIds.filter((item) => item !== id)
            : [...selectedAmenityIds, id];
        setFormData((prev) => ({ ...prev, amenity_ids: updated }));
    };

    const toggleExperience = (id) => {
        const updated = selectedExperienceIds.includes(id)
            ? selectedExperienceIds.filter((item) => item !== id)
            : [...selectedExperienceIds, id];
        setFormData((prev) => ({ ...prev, experience_ids: updated }));
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Amenities & Experiences
            </h2>

            {/* Dynamic Amenities Section */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600" /> Choose Amenities
                </h3>
                {amenitiesLoading ? (
                    <div className="text-sm text-gray-500 py-4">Loading amenities...</div>
                ) : amenitiesList.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">No amenities available.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 border rounded-lg p-3 bg-gray-50">
                        {amenitiesList.map((amenity) => {
                            const isSelected = selectedAmenityIds.includes(amenity.id);
                            const IconComponent = resolveAmenityIcon(amenity.icon || amenity.name);
                            return (
                                <button
                                    key={amenity.id}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg border text-sm font-medium transition-all ${
                                        isSelected
                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <IconComponent className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                                        <span className="truncate">{amenity.name}</span>
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Dynamic Experiences Section */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" /> Choose Experiences
                </h3>
                {experiencesLoading ? (
                    <div className="text-sm text-gray-500 py-4">Loading experiences...</div>
                ) : experiencesList.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">No experiences available.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 border rounded-lg p-3 bg-gray-50">
                        {experiencesList.map((exp) => {
                            const isSelected = selectedExperienceIds.includes(exp.id);
                            return (
                                <button
                                    key={exp.id}
                                    type="button"
                                    onClick={() => toggleExperience(exp.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg border text-sm font-medium transition-all ${
                                        isSelected
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex flex-col text-left truncate">
                                        <span className="font-semibold text-gray-800">{exp.title}</span>
                                        {exp.category && (
                                            <span className="text-xs text-gray-500 capitalize">{exp.category}</span>
                                        )}
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-indigo-600 ml-2 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
