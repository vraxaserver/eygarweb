'use client';

import React from 'react';
import Link from 'next/link'; // Import the Link component
import { Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import FeaturedPropertyCard from "@/components/properties/FeaturedPropertyCard";
import { useTranslation } from "@/lib/i18n";
import { useGetFeaturedPropertiesQuery } from "@/store/features/propertiesApi"

const FeaturedSection = () => {
    const { t } = useTranslation();
    const { data: featuredProperties, isLoading, isError } = useGetFeaturedPropertiesQuery();
    
    if(isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isError || !featuredProperties || featuredProperties.length === 0) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("home.featured_section_title")}
                    </h2>
                    <p className="text-gray-600">
                        {isError
                            ? "Could not load featured properties."
                            : "No featured properties are available at the moment."
                        }
                    </p>
                </div>
            </section>
        );
    }

    return (
        <div className="mb-16">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {t("home.featured_section_title")}
                </h2>
                {/* --- CHANGE 1: Wrapped the Button in a Link for navigation --- */}
                <Link href="/properties/featured" passHref>
                    <Button
                        as="a" // Render the button as an anchor tag for semantic HTML
                        variant="ghost"
                        className="text-[#814193] hover:text-[#6d3580] font-medium w-full sm:w-auto"
                    >
                        {t("common.view_all")} →
                    </Button>
                </Link>
            </div>

            {/* --- CHANGE 2: Replaced Grid with a horizontally scrolling Flex container --- */}
            {/*
              - `flex`: Creates a flex container.
              - `overflow-x-auto`: Enables horizontal scrolling when content overflows.
              - `space-x-6`: Adds horizontal space between the cards.
              - `pb-4`: Adds padding to the bottom to make space for the scrollbar.
              - For a cleaner look, you can install `tailwind-scrollbar-hide` and add the `scrollbar-hide` class.
            */}
            <div className="flex overflow-x-auto space-x-6 pb-4">
                {featuredProperties.map((property) => (
                    // --- CHANGE 3: Added a wrapper div to control card size in the flex container ---
                    // `flex-shrink-0`: Prevents cards from shrinking.
                    // `w-[300px] sm:w-[320px]`: Sets a fixed width for each card.
                    <div key={property.id} className="flex-shrink-0 w-[300px] sm:w-[320px]">
                        <FeaturedPropertyCard property={property} />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default FeaturedSection;
