"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Tag,
    Calendar,
    Users,
    Percent,
    Hash,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CouponForm } from "./CouponForm";
import {
    useGetMyCouponsQuery,
    useAddCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} from "@/store/features/vendorCouponApi";
import { useGetMyServicesQuery } from "@/store/features/vendorServiceApi";
import { toast } from "sonner";

export const CouponsTab = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch vendor's own services (for the form dropdown)
    const { data: services, isLoading: isLoadingServices } = useGetMyServicesQuery();
    // Fetch vendor's own coupons
    const { data: coupons, isLoading: isLoadingCoupons, error } = useGetMyCouponsQuery();

    const [addCoupon, { isLoading: isAdding }] = useAddCouponMutation();
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const isSubmitting = isAdding || isUpdating;

    if (isLoadingCoupons || isLoadingServices) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm">Loading coupons…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 bg-red-50 rounded-xl border border-red-200">
                Failed to load coupons. Please try again.
            </div>
        );
    }

    const now = new Date();

    const filteredCoupons = (coupons || []).filter((coupon) => {
        const matchesSearch = coupon.code
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            coupon.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const isExpired = new Date(coupon.validTo) < now;
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "valid" && !isExpired && coupon.isActive) ||
            (statusFilter === "expired" && isExpired) ||
            (statusFilter === "inactive" && !coupon.isActive && !isExpired);

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

    const handleDeleteCoupon = async (couponId) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await deleteCoupon(couponId).unwrap();
            toast.success("Coupon deleted successfully!");
        } catch (err) {
            toast.error(err?.data?.detail || err?.data?.message || "Failed to delete coupon");
        }
    };

    const handleSubmitCoupon = async (data) => {
        const toastId = toast.loading(editingCoupon ? "Updating coupon…" : "Creating coupon…");
        try {
            if (editingCoupon) {
                await updateCoupon({ id: editingCoupon.id, ...data }).unwrap();
                toast.success("Coupon updated successfully!", { id: toastId });
            } else {
                await addCoupon(data).unwrap();
                toast.success("Coupon created successfully!", { id: toastId });
            }
            setIsFormOpen(false);
            setEditingCoupon(null);
        } catch (err) {
            const msg = err?.data?.detail || err?.data?.message || "Operation failed.";
            toast.error(msg, { id: toastId });
        }
    };

    const isExpired = (validTo) => new Date(validTo) < now;

    const getDiscountLabel = (coupon) => {
        if (coupon.discountType === "percentage") {
            return `${coupon.discountValue}% OFF`;
        }
        return `$${coupon.discountValue} OFF`;
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
                        <p className="text-gray-600">Manage discount coupons for your services</p>
                    </div>
                     <Button
                        onClick={handleCreateCoupon}
                        className="bg-rose-600 hover:bg-rose-700 text-white w-full sm:w-auto"
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
                            placeholder="Search by code or title…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {["all", "valid", "expired", "inactive"].map((status) => (
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
                {filteredCoupons.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCoupons.map((coupon) => {
                            const expired = isExpired(coupon.validTo);
                            const usagePercent =
                                coupon.usageLimit > 0
                                    ? Math.min(
                                          Math.round(
                                              (coupon.usedCount / coupon.usageLimit) * 100
                                          ),
                                          100
                                      )
                                    : 0;

                            return (
                                <div
                                    key={coupon.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
                                >
                                    {/* Coloured top stripe */}
                                    <div
                                        className={`h-1.5 w-full ${
                                            expired
                                                ? "bg-gray-300"
                                                : coupon.isActive
                                                ? "bg-gradient-to-r from-rose-500 to-amber-500"
                                                : "bg-yellow-400"
                                        }`}
                                    />

                                    <div className="p-5 space-y-4">
                                        {/* Top row: discount badge + actions */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                                    {coupon.discountType}
                                                </span>
                                                <span className="text-2xl font-extrabold text-gray-900">
                                                    {getDiscountLabel(coupon)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Badge
                                                    variant={
                                                        expired
                                                            ? "destructive"
                                                            : coupon.isActive
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {expired
                                                        ? "Expired"
                                                        : coupon.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Title & service */}
                                        <div>
                                            <p className="font-semibold text-gray-900 truncate">
                                                {coupon.title}
                                            </p>
                                            {coupon.service?.title && (
                                                <p className="text-xs text-rose-600 mt-0.5 truncate">
                                                    {coupon.service.title}
                                                </p>
                                            )}
                                        </div>

                                        {/* Coupon code */}
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                            <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span className="font-mono font-bold text-gray-800 tracking-wider text-sm">
                                                {coupon.code}
                                            </span>
                                        </div>

                                        {/* Validity */}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                                            <span>
                                                {formatDate(coupon.validFrom)} →{" "}
                                                {formatDate(coupon.validTo)}
                                            </span>
                                        </div>

                                        {/* Usage bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    Usage
                                                </span>
                                                <span>
                                                    {coupon.usedCount} / {coupon.usageLimit}
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        usagePercent >= 90
                                                            ? "bg-red-500"
                                                            : usagePercent >= 60
                                                            ? "bg-yellow-400"
                                                            : "bg-emerald-500"
                                                    }`}
                                                    style={{ width: `${usagePercent}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-1 border-t border-gray-100">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-rose-600 hover:bg-rose-50"
                                                onClick={() => handleEditCoupon(coupon)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-red-500 hover:bg-red-50"
                                                onClick={() => handleDeleteCoupon(coupon.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            No coupons found
                        </h3>
                        <p className="text-gray-500 text-sm mb-5">
                            {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your search or filter."
                                : "Create your first coupon to start offering discounts."}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                            <Button onClick={handleCreateCoupon}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Coupon
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Coupon Form Modal */}
            <CouponForm
                key={editingCoupon ? editingCoupon.id : "new"}
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingCoupon(null);
                }}
                coupon={editingCoupon}
                services={services || []}
                onSubmit={handleSubmitCoupon}
                isLoading={isSubmitting}
            />
        </>
    );
};
