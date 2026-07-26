"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceForm } from "./ServiceForm";
import Image from "next/image";
import {
    useAddServiceMutation,
    useGetMyServicesQuery,
    useEditServiceMutation,
    useDeleteServiceMutation,
    useUploadVendorServiceImageMutation,
} from "@/store/features/vendorServiceApi";
import { toast } from "sonner";

export const ServicesTab = ({ activeUser }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: services, isLoading, error } = useGetMyServicesQuery();
    const [addService, { isLoading: isLoadingAddService }] = useAddServiceMutation();
    const [editService, { isLoading: isLoadingEditService }] = useEditServiceMutation();
    const [deleteService, { isLoading: isLoadingDeleteService }] = useDeleteServiceMutation();
    const [uploadVendorServiceImage] = useUploadVendorServiceImageMutation();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    console.log("services: ", services);

    const filteredServices = services?.filter((service) => {
        const matchesSearch = service.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && service.isActive) ||
            (statusFilter === "inactive" && !service.isActive);
        return matchesSearch && matchesStatus;
    }) || [];

    const handleCreateService = () => {
        setEditingService(null);
        setIsFormOpen(true);
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setIsFormOpen(true);
    };

    const handleDeleteService = async (serviceId) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await deleteService(serviceId).unwrap();
                toast.success("Service deleted successfully!");
            } catch (err) {
                toast.error(err?.data?.detail || err?.data?.message || "Failed to delete service");
            }
        }
    };

    /**
     * Upload imageFile to S3 at vendors/{vendorId}/services/{serviceId}/
     * and return the resulting public URL, or null on failure.
     */
    const uploadServiceImage = async (imageFile, vendorId, serviceId) => {
        if (!imageFile) return null;
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        uploadData.append("subfolder", `vendors/${vendorId}/services/${serviceId}`);
        uploadData.append("display_order", 0);
        uploadData.append("is_cover", true);
        uploadData.append("alt_text", imageFile.name || "");
        const uploadResponse = await uploadVendorServiceImage(uploadData).unwrap();
        return uploadResponse.image_url;
    };

    const handleSubmitService = async (data, imageFile) => {
        const vendorId = activeUser?.eygar_vendor?.id || activeUser?.id;

        if (editingService) {
            // Update existing service
            try {
                let updatedData = { ...data };

                // Upload new image if the vendor selected one
                if (imageFile) {
                    toast.info("Uploading image...");
                    const imageUrl = await uploadServiceImage(
                        imageFile,
                        vendorId,
                        editingService.id
                    );
                    if (imageUrl) updatedData.image = imageUrl;
                }

                await editService({ id: editingService.id, ...updatedData }).unwrap();
                toast.success("Service updated successfully!");
                setIsFormOpen(false);
            } catch (err) {
                toast.error(
                    err?.data?.detail || err?.data?.message || "Failed to update service"
                );
            }
        } else {
            // Create new service (image field will be set after upload)
            const newService = {
                vendorId,
                vendorName: activeUser?.first_name,
                rating: 0,
                reviewCount: 0,
                createdAt: new Date().toISOString(),
                ...data,
                image: data.image || "", // placeholder; replaced after upload
            };
            try {
                // Step 1: Create the service to get an ID
                const created = await addService(newService).unwrap();

                // Step 2: Upload image to S3 using the new service ID
                if (imageFile && created?.id) {
                    toast.info("Uploading image...");
                    const imageUrl = await uploadServiceImage(
                        imageFile,
                        vendorId,
                        created.id
                    );

                    // Step 3: Patch the service with the S3 URL
                    if (imageUrl) {
                        await editService({ id: created.id, image: imageUrl }).unwrap();
                    }
                }

                toast.success("Service created successfully!");
                setIsFormOpen(false);
            } catch (err) {
                toast.error(
                    err?.data?.detail || err?.data?.message || "An error occurred"
                );
            }
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Services
                        </h1>
                        <p className="text-gray-600">
                            Manage your service offerings
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateService}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {["all", "active", "inactive"].map((status) => (
                            <Button
                                key={status}
                                variant={
                                    statusFilter === status
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                                className="capitalize"
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                        >
                            <div className="relative h-48 bg-gray-100">
                                {service.image ? (
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200">
                                        <ImageIcon className="w-10 h-10 text-gray-300" />
                                        <span className="text-xs text-gray-400 font-medium">No image</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <Badge
                                        variant={
                                            service.isActive
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {service.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                                        <div className="flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleEditService(service)
                                                }
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteService(
                                                        service.id
                                                    )
                                                }
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {service.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-3">
                                    <span>Category: {service.category}</span>
                                    <span>Duration: {service.duration}h</span>
                                    <span>
                                        Max Guests: {service.allowedGuests}
                                    </span>
                                    <span>Price: ${service.price}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">
                                        ${service.price}
                                    </span>
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                        <span>★ {service.rating}</span>
                                        <span>({service.reviewCount})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No services found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search or create your first
                            service.
                        </p>
                        <Button onClick={handleCreateService}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Service
                        </Button>
                    </div>
                )}
            </div>

            {/* Service Form Modal */}
            <ServiceForm
                key={editingService ? editingService.id : "new"}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                service={editingService}
                onSubmit={handleSubmitService}
            />
        </>
    );
};
