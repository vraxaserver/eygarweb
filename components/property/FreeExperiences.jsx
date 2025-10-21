"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, ListChecks } from "lucide-react";
import Image from "next/image";


export default function FreeExperiences({ experiences }) {
    if (!experiences || experiences.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                <Gift className="h-7 w-7 text-green-600" />
                <span>Free Experiences Included</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp) => (
                    <Card
                        key={exp.id}
                        className="overflow-hidden py-0 border border-accent/20 shadow-sm hover:shadow-md transition-shadow rounded-xl flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative w-full h-48">
                            <Image
                                src={exp.image}
                                alt={exp.title}
                                fill
                                
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
                                className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-t-2xl"
                            />
                            
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-primary/90 text-white shadow-md">
                                    Free
                                </Badge>
                            </div>
                            <div className="absolute pl-3 bottom-5 w-60 bg-gray-700/60 space-y-2 text-md font-bold text-white flex-grow">
                                <div className="flex items-center space-x-2">
                                    <ListChecks className="h-4 w-4 text-red-600" />
                                    <span>On {exp.requirements}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-red-600" />
                                    <span>{exp.duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <CardContent className="flex flex-col flex-grow">
                            <h4 className="font-semibold text-foreground text-base mb-2 line-clamp-2">
                                {exp.title}
                            </h4>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <p className="text-sm text-muted-foreground">
                These experiences are offered exclusively by your host at no
                additional cost. Book your stay to access these unique local
                activities.
            </p>
        </div>
    );
}
