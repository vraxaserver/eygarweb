"use client";

import { useState } from "react";
import { X, Tag, Percent, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";


export const CouponForm = ({
    isOpen,
    onClose,
    coupon,
    services,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        serviceId: coupon?.serviceId || "",
        code: coupon?.code || "",
        discountPercent: coupon?.discountPercent || 10,
        validFrom: coupon?.validFrom
            ? new Date(coupon.validFrom).toISOString().slice(0, 16)
            : "",
        validTo: coupon?.validTo
            ? new Date(coupon.validTo).toISOString().slice(0, 16)
            : "",
        usageLimit: coupon?.usageLimit || 10,
        isActive: coupon?.isActive ?? true,
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            validFrom: new Date(formData.validFrom).toISOString(),
            validTo: new Date(formData.validTo).toISOString(),
        });
        onClose();
    };

    const generateCouponCode = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setFormData((prev) => ({ ...prev, code }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {coupon ? "Edit Coupon" : "Create New Coupon"}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Service Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service
                        </label>
                        <select
                            value={formData.serviceId}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    serviceId: e.target.value,
                                }))
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a service</option>
                            {services
                                .filter((s) => s.isActive)
                                .map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.title}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Coupon Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Coupon Code
                        </label>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            code: e.target.value.toUpperCase(),
                                        }))
                                    }
                                    placeholder="e.g., SAVE20"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={generateCouponCode}
                            >
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Discount Percentage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Percentage
                        </label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.discountPercent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        discountPercent: Number(e.target.value),
                                    }))
                                }
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Validity Period */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valid From
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.validFrom}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        validFrom: e.target.value,
                                    }))
                                }
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valid To
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.validTo}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        validTo: e.target.value,
                                    }))
                                }
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usage Limit
                        </label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                min="1"
                                value={formData.usageLimit}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        usageLimit: Number(e.target.value),
                                    }))
                                }
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="couponActive"
                            checked={formData.isActive}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    isActive: e.target.checked,
                                }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                            htmlFor="couponActive"
                            className="text-sm font-medium text-gray-700"
                        >
                            Coupon is active
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                        >
                            {coupon ? "Update Coupon" : "Create Coupon"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
