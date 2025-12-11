import { Bath, Bed, MapPin, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
// This is the new, reusable card component.
// It accepts a 'property' object as a prop.
export default function SafetyCertifierPropertyCard({ property }) {
    const router = useRouter();
    // Check if there is at least one free experience.
    const hasFreeExperience = property.experiences?.some((exp) => exp.isFree);

    const handleCardClick = () => {
        router.push(`/properties/${property.id}`);
    };

    return (
        <Card
            className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-xl bg-white pt-0"
            onClick={handleCardClick}
        >
            <div className="relative">
                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                    <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Safety Certified Badge */}
                    <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded flex items-center">
                        <span className="mr-1">✓</span>
                        Safety Certified
                    </div>

                    {/* Heart Icon Button */}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-4">
                    {/* Title and Rating */}
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {property.title}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">
                                {property.rating}
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    <p className="text-xs text-gray-600 mb-2 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.location.city}, {property.location.country}
                    </p>

                    {/* Property Details */}
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                        <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{property.maxGuests} guests</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Bed className="h-3 w-3" />
                            <span>
                                {property.beds} bed
                                {property.beds > 1 ? "s" : ""}
                            </span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Bath className="h-3 w-3" />
                            <span>{property.bathrooms} bath</span>
                        </span>
                    </div>

                    {/* Conditionally render Free Experience badge */}
                    {hasFreeExperience && (
                        <div className="mb-3">
                            <span className="text-xs text-orange-800 font-medium">
                                🎁 Free Experience
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-lg font-bold text-gray-900">
                                ${property.price_per_night}
                            </span>
                            <span className="text-sm text-gray-600">
                                {" "}
                                night
                            </span>
                        </div>
                    </div>

                    {/* Host Language */}
                    <p className="text-xs text-gray-500">
                        🗣️ Host speaks {property?.host?.languages.join(", ")}
                    </p>
                </div>
            </div>
        </Card>
    );
}
