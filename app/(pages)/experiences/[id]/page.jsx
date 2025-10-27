'use client'; // This must be a client component to use hooks

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Use useParams to get the ID from the URL
import { useGetExperienceQuery } from '@/store/features/experienceApi'; // Adjust import path
import { ArrowLeft, Clock, MapPin } from 'lucide-react';

const ExperienceDetailPage = () => {
    // Get the dynamic 'id' from the URL
    const { id } = useParams();

    // Fetch the specific experience using the ID. 
    // The 'skip' option prevents the query from running if there's no ID.
    const { data: experience, error, isLoading } = useGetExperienceQuery(id, {
        skip: !id,
    });

    // Handle loading state
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading experience details...</div>;
    }

    // Handle not found or error state
    if (error || !experience) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center">
                <h2 className="text-2xl font-bold mb-4">Experience Not Found</h2>
                <p className="text-gray-600 mb-6">
                    {error ? `Error: ${error.message}` : "We couldn't find the experience you were looking for."}
                </p>
                <Link href="/experiences" className="text-purple-600 hover:underline flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to all experiences
                </Link>
            </div>
        );
    }

    // Render the experience details
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href="/experiences" className="text-purple-600 hover:text-purple-800 flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Experiences
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex">
                    <div className="md:w-1/2">
                        <img
                            src={experience.image_url}
                            alt={experience.title}
                            className="w-full h-64 md:h-full object-cover"
                        />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {experience.title}
                        </h1>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">
                            {experience.description}
                        </p>

                        <div className="flex flex-col space-y-3 text-gray-600">
                             <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                                <span>Location details would go here.</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-3 text-purple-500" />
                                <span>Minimum stay: <strong>{experience.min_nights} nights</strong></span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                                Book This Experience
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceDetailPage;
