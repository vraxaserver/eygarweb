import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import {
    Star,
    Eye,
    Edit,
    Trash2,
    Plus,
    MapPin,
    Clock
} from "lucide-react";
import { useGetMyExperiencesQuery } from "@/store/features/experienceApi";


const TabMyExperiences = () => {
    const { data: experiences, error, isLoading, refetch } = useGetMyExperiencesQuery();

    if (isLoading) return <div>Loading experiences...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;
    
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        Experience Management
                    </h2>
                    <p className="text-gray-600">
                        Create and manage unique experiences for your guests
                    </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Experience
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                    <Card
                        key={experience.id}
                        className="group hover:shadow-lg transition-all"
                    >
                        <CardContent className="p-0">
                            <div className="relative">
                                <img
                                    src={experience.image_url}
                                    alt={experience.title}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-8 h-8 p-0"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-8 h-8 p-0"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-8 h-8 p-0 text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                    {experience.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {experience.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {experience.min_nights}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default TabMyExperiences;
