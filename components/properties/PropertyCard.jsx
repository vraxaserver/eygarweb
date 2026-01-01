"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// New Imports for Icons
import {
    Heart,
    Star,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Trash,
} from "lucide-react";
// New Imports for Modals (Assuming shadcn/ui)
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

import { useDeletePropertyMutation } from "@/store/features/propertiesApi";

export default function PropertyCard({ property, currentUserId }) {
    const router = useRouter();

    // UI State
    const [isFavorited, setIsFavorited] = useState(property.isLiked || false);

    // Index for the small card carousel
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Index for the large modal carousel
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [deleteProperty, { isLoading: isDeleting }] =
        useDeletePropertyMutation();

    const isOwner = property.host_id === currentUserId;

    const handleCardClick = () => {
        router.push(`/properties/${property.id}`);
    };

    const normalizeImageUrl = (url) => {
        if (!url) return "/images/placeholder.webp";

        // Convert Windows paths → web paths
        let normalized = url.replace(/\\/g, "/");

        // If already absolute, return as-is
        if (normalized.startsWith("http")) return normalized;

        // Ensure leading slash for relative URLs
        if (!normalized.startsWith("/")) {
            normalized = `/${normalized}`;
        }

        return normalized;
    };

    const handleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    const handleView = (e) => {
        e.stopPropagation();
        setShowDetailsModal(true);
        // Reset modal slider to start when opening
        setModalImageIndex(0);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        router.push(`/properties/${property.id}/edit`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        try {
            await deleteProperty(property.id).unwrap();
            toast.success("Property deleted successfully!");
        } catch (error) {
            console.error("Failed to delete property:", error);
            toast.error("Failed to delete property. Please try again.");
        }
    };

    // --- Card Carousel Navigation ---
    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex(
            (prev) =>
                (prev - 1 + property.images.length) % property.images.length
        );
    };

    // --- Modal Carousel Navigation ---
    const nextModalImage = () => {
        setModalImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevModalImage = () => {
        setModalImageIndex(
            (prev) =>
                (prev - 1 + property.images.length) % property.images.length
        );
    };

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
                        {/* Property Image Carousel (Card) */}
                        <div className="relative h-72 w-full">
                            <Image
                                src={normalizeImageUrl(
                                    property.images[currentImageIndex]
                                        ?.image_url ??
                                        property.images[currentImageIndex]
                                )}
                                alt={property.title}
                                fill
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* Navigation Dots (Card) */}
                        {property.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                {property.images.map((_, index) => (
                                    <button
                                        key={index}
                                        aria-label={`Go to image ${index + 1}`}
                                        className={`block w-2 h-2 rounded-full transition-colors ${
                                            index === currentImageIndex
                                                ? "bg-white"
                                                : "bg-white/60"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Navigation Arrows (Card) */}
                        {property.images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={prevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleFavorite}
                            className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform z-10"
                        >
                            <Heart
                                className={`h-5 w-5 transition-colors ${
                                    isFavorited
                                        ? "fill-red-500 text-red-500"
                                        : "fill-transparent"
                                }`}
                            />
                        </Button>

                        <div className="absolute top-3 right-[48px] flex space-x-2 z-10">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleView}
                                className="h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform"
                            >
                                <Eye className="h-5 w-5" />
                            </Button>

                            {isOwner && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleEdit}
                                        className="h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleDelete}
                                        className="h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="absolute bottom-3 left-3">
                            <Badge
                                variant="secondary"
                                className="bg-white/90 text-black shadow"
                            >
                                {property.type} • {property.beds} bed
                                {property.beds !== 1 ? "s" : ""}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-gray-800 truncate pr-2">
                                {property.title}
                            </h3>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                                <Star className="w-4 h-4 text-gray-800" />
                                <span className="text-sm font-medium text-gray-800">
                                    {property.rating}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mb-2">
                            {locationString}
                        </p>

                        <div className="flex items-baseline space-x-1">
                            <span className="text-lg font-bold text-gray-900">
                                {formatCurrency(
                                    property.price_per_night,
                                    property.currency
                                )}
                            </span>
                            <span className="text-gray-600 text-sm">
                                / night
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* View Property Details Dialog (Popup) */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="sm:max-w-[425px] md:max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>{property.title}</DialogTitle>
                    </DialogHeader>

                    {/* --- Modal Image Carousel --- */}
                    <div className="relative w-full h-64 md:h-96 bg-gray-100">
                        <Image
                            src={
                                property.images[modalImageIndex]?.image_url ||
                                property.images[modalImageIndex]
                            }
                            alt={`${property.title} - Image ${
                                modalImageIndex + 1
                            }`}
                            fill
                            loading="lazy" // Explicit lazy loading
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px" // Optimized sizes for modal
                        />

                        {/* Modal Arrows */}
                        {property.images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prevModalImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextModalImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </>
                        )}

                        {/* Modal Dots */}
                        {property.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                {property.images.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`block w-2.5 h-2.5 rounded-full transition-colors shadow-sm ${
                                            index === modalImageIndex
                                                ? "bg-white"
                                                : "bg-white/50"
                                        }`}
                                        onClick={() =>
                                            setModalImageIndex(index)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 pt-4 space-y-4">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <p>{locationString}</p>
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                                <span className="font-semibold text-gray-700">
                                    {property.rating}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                            {property.description ||
                                "No description available."}
                        </p>

                        <div className="border-t pt-4 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Price per night
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(
                                        property.price_per_night,
                                        property.currency
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={() =>
                                    router.push(`/properties/${property.id}`)
                                }
                            >
                                View Full Page
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the property &quot;{property.title}&quot; and
                            remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
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
