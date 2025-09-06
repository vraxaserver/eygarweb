"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import SafetyCertifierPropertyCard from "@/components/properties/SafetyCertifierPropertyCard";
import { useTranslation} from "@/lib/i18n";


const SafetyCertifiedHostsSection = ({properties}) => {

    const { t } = useTranslation()
    return (
        <div className="w-full mb-16 mt-10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 px-2 sm:px-0">
                <div className="w-full sm:w-auto">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {t("home.safety_certified_host_section_title")}
                    </h2>
                </div>
                <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 font-medium flex items-center w-full sm:w-auto"
                >
                    View All →
                </Button>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-6">
                {properties.map((property) => (
                    <SafetyCertifierPropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>

    );
};

export default SafetyCertifiedHostsSection;