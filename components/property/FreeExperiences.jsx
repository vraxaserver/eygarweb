"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, ListChecks, Sparkles } from "lucide-react";
import Image from "next/image";

export default function FreeExperiences({ experiences }) {
    if (!experiences || experiences.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                <Sparkles className="h-6 w-6 text-[#7a3d8a]" />
                <span>Enjoy Free Experiences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp) => {
                    const imageUrl = exp.image_url || exp.image || "/placeholder.svg";
                    return (
                        <Card
                            key={exp.id}
                            className="overflow-hidden py-0 border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl flex flex-col group bg-white"
                        >
                            {/* Image */}
                            <div className="relative w-full h-48 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageUrl}
                                    alt={exp.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                                />

                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-emerald-600 text-white font-medium text-xs px-2.5 py-1 shadow-sm">
                                        FREE
                                    </Badge>
                                </div>

                                {exp.category && (
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-black/60 backdrop-blur-sm text-white font-medium text-xs px-2.5 py-1">
                                            {exp.category}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <CardContent className="flex flex-col flex-grow p-4 space-y-2">
                                <h4 className="font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-[#7a3d8a] transition-colors" title={exp.title}>
                                    {exp.title}
                                </h4>

                                {exp.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                        {exp.description}
                                    </p>
                                )}

                                <div className="pt-2 mt-auto border-t flex flex-col gap-1 text-xs text-gray-500">
                                    {exp.min_nights ? (
                                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                                            <ListChecks className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Requires min. {exp.min_nights} nights stay</span>
                                        </div>
                                    ) : exp.requirements ? (
                                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                                            <ListChecks className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>On {exp.requirements}</span>
                                        </div>
                                    ) : null}

                                    {exp.duration && (
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                                            <span>{exp.duration}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <p className="text-sm text-gray-500">
                These experiences are offered exclusively by your host at no
                additional cost. Book your stay to access these unique local
                activities.
            </p>
        </div>
    );
}
