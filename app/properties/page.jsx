"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Star,
    Map
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import { mockProperties, mockExperiences } from "@/data/properties";
import SearchBar from "@/components/search/SearchBar";

export default function PropertyListings() {
    const [viewMode, setViewMode] = useState("grid");
    const { filters } = useState();
    const [category, setCategory] = useState("");

    const handleSearch = () => {
        console.log("Searching with filters:", filters);
    };

    const formatDate = (date) => {
        if (!date) return "Add dates";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        // if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
        // if (filters.hasExperiences) count++;
        // if (filters.propertyType.length > 0) count++;
        // if (filters.amenities.length > 0) count++;
        return count;
    };

    // const properties = [
    //     {
    //         id: 1,
    //         title: "River Laune in Main st Killorglin",
    //         type: "House",
    //         beds: 5,
    //         price: 750,
    //         rating: 4.9,
    //         reviews: 127,
    //         image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "Killorglin, Ireland",
    //         isLiked: false,
    //     },
    //     {
    //         id: 2,
    //         title: "Historic and Stunning, Large Castle",
    //         type: "House",
    //         beds: 6,
    //         price: 640.44,
    //         rating: 4.8,
    //         reviews: 89,
    //         image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "Scottish Highlands",
    //         isLiked: true,
    //     },
    //     {
    //         id: 3,
    //         title: "Lux Loft Apartment Nr City Centre",
    //         type: "Private Room",
    //         beds: 2,
    //         price: 989.78,
    //         rating: 4.95,
    //         reviews: 203,
    //         image: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "Dublin, Ireland",
    //         isLiked: false,
    //     },
    //     {
    //         id: 4,
    //         title: "Historic Georgian Lakeside Manor",
    //         type: "House",
    //         beds: 3,
    //         price: 756.89,
    //         rating: 4.7,
    //         reviews: 156,
    //         image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "Lake District, UK",
    //         isLiked: false,
    //     },
    //     {
    //         id: 5,
    //         title: "Adorable townhouse near MFL",
    //         type: "Shared Room",
    //         beds: 1,
    //         price: 550,
    //         rating: 4.6,
    //         reviews: 78,
    //         image: "https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "Philadelphia, PA",
    //         isLiked: true,
    //     },
    //     {
    //         id: 6,
    //         title: "Immaculate Lakefront Condo",
    //         type: "Shared Room",
    //         beds: 3,
    //         price: 500,
    //         rating: 4.8,
    //         reviews: 92,
    //         image: "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "Lake Tahoe, CA",
    //         isLiked: false,
    //     },
    //     {
    //         id: 7,
    //         title: "Classic Harlem Brownstone",
    //         type: "Private Room",
    //         beds: 2,
    //         price: 250,
    //         rating: 4.9,
    //         reviews: 145,
    //         image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "New York, NY",
    //         isLiked: false,
    //     },
    //     {
    //         id: 8,
    //         title: "Off-grid itHouse and stunning views",
    //         type: "House",
    //         beds: 3,
    //         price: 135,
    //         rating: 4.7,
    //         reviews: 67,
    //         image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800",
    //         location: "Big Sur, CA",
    //         isLiked: true,
    //     },
    // ];

    const categories = [
        "Beachfront",
        "Cabins",
        "Trending",
        "Tropical",
        "Unique stays",
        "Castles",
        "Countryside",
        "Design",
        "Islands",
        "Lakefront",
    ];

    const properties = mockProperties;

    return (
        <div>
            <SearchBar />
            {/* Categories */}
            <div className="border-b border-gray-200 pt-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-8 overflow-x-auto">
                        <button
                            key={"All"}
                            className={`whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors ${
                                category === "All"
                                    ? "border-purple-600 text-purple-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                            onClick={() => setCategory("All")}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors ${
                                    category === cat
                                        ? "border-purple-600 text-purple-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            

            {/* Main Content */}
            <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-8">
                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {properties.map((property) => (
                            <PropertyCard
                                className="py-0"
                                key={property.id}
                                property={property}
                            />
                        ))}
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="space-y-4 sm:space-y-6">
                        {properties.map((property) => (
                            <Card
                                key={property.id}
                                className="group cursor-pointer border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Image */}
                                        <div className="relative w-full sm:w-80 h-56 sm:h-64 flex-shrink-0">
                                            <img
                                                src={property.image}
                                                alt={property.title}
                                                className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`absolute top-3 right-3 w-8 h-8 rounded-full p-0 ${
                                                    property.isLiked
                                                        ? "text-red-500"
                                                        : "text-white"
                                                } hover:scale-110 transition-transform`}
                                            >
                                                <Heart
                                                    className={`w-5 h-5 ${
                                                        property.isLiked
                                                            ? "fill-current"
                                                            : ""
                                                    }`}
                                                />
                                            </Button>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                                                <div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="mb-2"
                                                    >
                                                        {property.type} •{" "}
                                                        {property.beds} bed
                                                        {property.beds !== 1
                                                            ? "s"
                                                            : ""}
                                                    </Badge>
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                                                        {property.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4">
                                                        {property.location}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                                                    <Star className="w-4 h-4 fill-current text-black" />
                                                    <span className="text-sm font-medium">
                                                        {property.rating}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        ({property.reviews})
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-baseline space-x-1">
                                                <span className="text-xl sm:text-2xl font-semibold text-gray-900">
                                                    ${property.price}
                                                </span>
                                                <span className="text-gray-600">
                                                    / Night
                                                </span>
                                                {property.rating >= 4.8 && (
                                                    <span className="text-yellow-600">
                                                        ⚡
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {viewMode === "map" && (
                    <div className="h-72 sm:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <Map className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">
                                Map view coming soon
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
