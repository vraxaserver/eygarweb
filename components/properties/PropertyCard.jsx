"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// New Imports for Icons
import { Heart, Star, ChevronLeft, ChevronRight, Eye, Pencil, Trash } from "lucide-react"; 
// New Imports for Modals (Assuming shadcn/ui)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import Image from "next/image";
import {formatCurrency} from "@/lib/utils"

// NOTE: You would typically import the delete mutation hook here, e.g.:
import { useDeletePropertyMutation } from "@/store/features/propertiesApi";


// Add currentUserId to the component props to enable ownership check
export default function PropertyCard({ property, currentUserId }) { 
    const router = useRouter();
    
    // UI State
    const [isFavorited, setIsFavorited] = useState(property.isLiked || false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false); // State for View modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for Delete confirmation

    // Mock RTKQ hook for deletion (Uncomment and replace with actual hook when available)
    const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();

    // Determine if the current user is the owner (assuming property has an ownerId field)
    const isOwner = property.host_id === currentUserId; 
    
    // Handler to navigate to the property details page on card body click
    const handleCardClick = () => {
        router.push(`/properties/${property.id}`);
    };
    
    // Toggles the favorite state locally
    const handleFavorite = (e) => {
        e.stopPropagation(); 
        setIsFavorited(!isFavorited);
        // API call to update favorite status goes here
    };

    // Handler for the View button (opens the details modal)
    const handleView = (e) => {
        e.stopPropagation();
        setShowDetailsModal(true);
    };

    // Handler for the Edit button (navigates to the edit page)
    const handleEdit = (e) => {
        e.stopPropagation();
        router.push(`/properties/${property.id}/edit`);
    };

    // Handler for the Delete button (opens the confirmation dialog)
    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    // Handler for confirming the deletion
    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        try {
            // Uncomment and use the actual mutation hook
            await deleteProperty(property.id).unwrap(); 
            // Add a success toast/message
            toast.success("Property deleted successfully!");
        } catch (error) {
            console.error("Failed to delete property:", error);
            // Add an error toast/message
            toast.error("Failed to delete property. Please try again.");
        }
        console.log(`Deleting property: ${property.id}`); // Placeholder logic
        // setShowDeleteConfirm(false); // Close confirmation modal
    };
    
    // Carousel navigation
    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex(
            (prev) => (prev - 1 + property.images.length) % property.images.length
        );
    };

    // Helper to format the location object into a readable string
    const locationString = property.location
        ? `${property.location.city}, ${property.location.country}`
        : "Location not available";

    return (
        <>
            <Card
                onClick={handleCardClick}
                className="group cursor-pointer py-0 rounded-2xl overflow-hidden border-transparent hover:shadow-xl transition-shadow duration-300 bg-white"
            >
                <CardContent className="p-0">
                    <div className="relative">
                        {/* Property Image Carousel */}
                        <div className="relative h-72 w-full">
                            <Image
                                src={property.images[currentImageIndex] || "/placeholder.svg"}
                                alt={property.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* Image Navigation Dots (existing code) */}
                        {property.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                {property.images.map((_, index) => (
                                    <button
                                        key={index}
                                        aria-label={`Go to image ${index + 1}`}
                                        className={`block w-2 h-2 rounded-full transition-colors ${
                                            index === currentImageIndex ? "bg-white" : "bg-white/60"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Navigation Arrows (existing code) */}
                        {property.images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Previous image"
                                    onClick={prevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Next image"
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </>
                        )}
                        
                        {/* Favorite Button (existing code - kept separate for common pattern) */}
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                            onClick={handleFavorite}
                            className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform z-10"
                        >
                            <Heart className={`h-5 w-5 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "fill-transparent"}`} />
                        </Button>

                        {/* Property Action Buttons (View, Edit, Delete) - Placed to the left of the Favorite button */}
                        <div className="absolute top-3 right-[48px] flex space-x-2 z-10"> 
                            {/* View Button (Always visible) */}
                            <Button
                                variant="ghost"
                                size="sm"
                                aria-label="View property details"
                                onClick={handleView}
                                className="h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform"
                            >
                                <Eye className="h-5 w-5" />
                            </Button>

                            {/* Edit and Delete Buttons (Owner only) */}
                            {isOwner && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Edit property"
                                        onClick={handleEdit}
                                        className="h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Delete property"
                                        onClick={handleDelete}
                                        className="h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Type & Beds Badge (existing code) */}
                        <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-white/90 text-black shadow">
                                {property.type} • {property.beds} bed{property.beds !== 1 ? "s" : ""}
                            </Badge>
                        </div>
                    </div>

                    {/* Card Information (existing code) */}
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-gray-800 truncate pr-2">{property.title}</h3>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                                <Star className="w-4 h-4 text-gray-800" />
                                <span className="text-sm font-medium text-gray-800">{property.rating}</span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mb-2">{locationString}</p>
                        
                        <div className="flex items-baseline space-x-1">
                            <span className="text-lg font-bold text-gray-900">
                                {formatCurrency(property.price_per_night, property.currency)}
                            </span>
                            <span className="text-gray-600 text-sm">/ night</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* View Property Details Dialog (Popup) */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="sm:max-w-[425px] md:max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{property.title} - Details</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="font-semibold">Location: {locationString}</p>
                        <p className="text-sm text-gray-600">{property.description || "No description available."}</p>
                        <hr />
                        <div className="flex justify-between">
                            <p>
                                <span className="font-bold">Price:</span> {formatCurrency(property.price_per_night, property.currency)} / night
                            </p>
                            <p>
                                <span className="font-bold">Rating:</span> <Star className="w-4 h-4 inline text-gray-800 mr-1" />{property.rating}
                            </p>
                        </div>
                        {/* In a real app, you would render a full PropertyDetails component here */}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the property &quot;{property.title}&quot; 
                            and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete} 
                            disabled={isDeleting} // Uncomment if using RTKQ hook
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
