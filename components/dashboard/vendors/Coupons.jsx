"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CouponForm } from "./CouponForm";
import {
    useAddCouponMutation,
    useGetCouponsQuery,
    // You will need to create these mutations for edit/delete functionality
    // useUpdateCouponMutation,
    // useDeleteCouponMutation,
} from "@/store/features/vendorCouponApi";
import { useGetServicesQuery } from "@/store/features/vendorServiceApi";
import { toast } from "sonner";

export const CouponsTab = () => {
    // This local state is not connected to your RTK Query data.
    // For editing/deleting to work correctly, you should use mutations.
    // const [editCoupons, setEditCoupons] = useState([]);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetching services and coupons
    const { data: services, isLoading: isLoadingServices } = useGetServicesQuery();
    const { data: coupons, isLoading: isLoadingCoupons, error } = useGetCouponsQuery();
    
    // Mutation hooks
    const [addCoupon, { isLoading: isAddingCoupon }] = useAddCouponMutation();
    // const [updateCoupon] = useUpdateCouponMutation(); // Example for editing
    // const [deleteCoupon] = useDeleteCouponMutation(); // Example for deleting

    // --- FIX: Handle loading and error states for BOTH queries ---
    if (isLoadingCoupons || isLoadingServices) {
        return <div className="p-4">Loading coupons and services...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Failed to load coupons. Please try again.</div>;
    }
    
    // --- FIX: Safely calculate filtered coupons ---
    // Ensure coupons is an array before trying to filter it.
    const now = new Date();
    const filteredCoupons = (coupons || []).filter((coupon) => {
        const matchesSearch = coupon.code
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const isExpired = new Date(coupon.valid_to) < now; // Assuming field is valid_to from your model
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "valid" && !isExpired && coupon.is_active) ||
            (statusFilter === "expired" && isExpired);
        return matchesSearch && matchesStatus;
    });

    const handleCreateCoupon = () => {
        setEditingCoupon(null);
        setIsFormOpen(true);
    };

    const handleEditCoupon = (coupon) => {
        setEditingCoupon(coupon);
        setIsFormOpen(true);
    };

    const handleDeleteCoupon = (couponId) => {
        // This should be handled with a mutation, e.g., deleteCoupon(couponId);
        toast.info("Delete functionality requires a server mutation.");
    };

    const handleSubmitCoupon = async (data) => {
        const toastId = toast.loading(editingCoupon ? 'Updating coupon...' : 'Adding coupon...');
        try {
            if (editingCoupon) {
                // Example of how to handle updates with a mutation
                // await updateCoupon({ id: editingCoupon.id, ...data }).unwrap();
                toast.info("Update functionality requires a server mutation.", { id: toastId });
            } else {
                await addCoupon(data).unwrap();
                toast.success("Coupon added successfully!", { id: toastId });
            }
            setIsFormOpen(false);
            setEditingCoupon(null);
        } catch (err) {
            const errorMessage = err.data?.message || "Operation failed. Please try again.";
            toast.error(errorMessage, { id: toastId });
            console.error("Failed to submit coupon:", err);
        }
    };

    // --- FIX: Make this function safe by checking if services exist ---
    const getServiceTitle = (serviceId) => {
        if (!services || !Array.isArray(services)) {
            return "Loading service...";
        }
        return services.find((s) => s.id === serviceId)?.title || "Unknown Service";
    };

    const isExpired = (validTo) => new Date(validTo) < now;

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
                        <p className="text-gray-600">Manage discount coupons for your services</p>
                    </div>
                    <Button
                        onClick={handleCreateCoupon}
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Coupon
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search coupons by code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {["all", "valid", "expired"].map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                                className="capitalize"
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Coupons Grid */}
                {/* --- FIX: Use filteredCoupons for rendering and check length --- */}
                {filteredCoupons.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCoupons.map((coupon) => {
                            const expired = isExpired(coupon.valid_to);
                            const usagePercent = (coupon.used_count / coupon.usage_limit) * 100;

                            return (
                                <div
                                    key={coupon.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        {/* ... Card content ... */}
                                        <div className="font-medium text-gray-900">
                                            {getServiceTitle(coupon.service)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {/* ... No coupons found message ... */}
                    </div>
                )}
            </div>

            {/* Coupon Form Modal */}
            <CouponForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                coupon={editingCoupon}
                services={services || []}
                onSubmit={handleSubmitCoupon}
                isLoading={isAddingCoupon}
            />
        </>
    );
};
