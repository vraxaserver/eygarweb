import { Clock, MapPin, Users, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ExperienceCard({ experience }) {
    return (
        <Card className="group hover:shadow-md transition-shadow duration-300">
            <div className="relative">
                <img
                    src={experience.image}
                    alt={experience.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                    {experience.isEligible ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            <Gift className="h-3 w-3 mr-1" />
                            Available
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Not Eligible</Badge>
                    )}
                </div>
            </div>

            <CardContent className="p-4">
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                        {experience.name}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {experience.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {experience.duration}
                        </div>
                        <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Max {experience.maxParticipants}
                        </div>
                    </div>

                    {experience.location && (
                        <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {experience.location}
                        </div>
                    )}

                    {experience.isEligible && (
                        <Button size="sm" className="w-full mt-3">
                            Book Experience
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
