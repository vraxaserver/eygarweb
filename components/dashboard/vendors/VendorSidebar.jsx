"use client";

import { useState } from "react";
import { Package, Tag, FileText, Star, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


const menuItems = [
    { id: "services", label: "Services", icon: Package },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "requests", label: "Requests", icon: FileText },
    { id: "reviews", label: "Reviews", icon: Star },
];

export const VendorSidebar = ({ activeTab, onTabChange, isMobileOpen, setIsMobileOpen }) => {
    
    // The shared UI content for the sidebar
    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-white">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Vendor Menu</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your services</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "default" : "ghost"}
                            className={cn(
                                "w-full justify-start space-x-3 h-12 text-base",
                                activeTab === item.id && "bg-indigo-600 hover:bg-indigo-700 text-white"
                            )}
                            onClick={() => {
                                onTabChange(item.id);
                                setIsMobileOpen(false); // Close mobile menu on selection
                            }}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Button>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            {/* It's part of the flex layout, sticky, and hidden on mobile */}
            <div className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-gray-200">
                 <div className="sticky top-0 h-screen">
                    <SidebarContent />
                 </div>
            </div>

            {/* Mobile Sidebar (Overlay and Drawer) */}
            {/* Uses a transition for a smooth slide-in effect */}
            <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setIsMobileOpen(false)}
                />
                
                {/* Drawer */}
                <div className={`relative h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out ${isMobileOpen ? 'transform-none' : '-translate-x-full'}`}>
                    <div className="p-4 border-b flex items-center justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    {/* Note: The content itself is not scrollable here, if the menu is long, add `overflow-y-auto` to the parent div */}
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};
