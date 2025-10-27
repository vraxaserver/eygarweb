// app/experiences/page.jsx
'use client'; // This must be a client component to use hooks

import React from 'react';
import Link from 'next/link';
import { useGetExperiencesQuery } from '@/store/features/experienceApi'; // Adjust the import path to your API slice
import { MapPin, Clock } from 'lucide-react';

const ExperiencesPage = () => {
    // Fetch data using the RTK Query hook
    const { data: experiences, error, isLoading } = useGetExperiencesQuery();

    // 1. Handle the loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Discover Our Experiences</h1>
                <p>Loading...</p>
            </div>
        );
    }

    // 2. Handle the error state
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Discover Our Experiences</h1>
                <p className="text-red-500">
                    Failed to load experiences: {error.message || 'An unknown error occurred'}
                </p>
            </div>
        );
    }

    // 3. Render the list of experiences
    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Discover Our Experiences</h1>
                <p className="text-gray-600 mb-8">Browse unique adventures and create unforgettable memories.</p>

                {experiences && experiences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {experiences.map((experience) => (
                            <Link 
                                href={`/experiences/${experience.id}/properties/`} 
                                key={experience.id}
                                className="group block"
                            >
                                <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <img
                                        src={experience.image_url}
                                        alt={experience.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-purple-600" title={experience.title}>
                                            {experience.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4 flex items-start h-20" title={experience.description}>
                                            <MapPin className="w-4 h-4 mr-1.5 mt-1 flex-shrink-0" />
                                            <span className="line-clamp-3">{experience.description}</span>
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>Min. {experience.min_nights} nights</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-xl font-medium">No Experiences Found</h2>
                        <p className="text-gray-600 mt-2">Check back later for new and exciting adventures!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExperiencesPage;
