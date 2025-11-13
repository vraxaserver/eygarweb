"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { VendorSidebar } from "./VendorSidebar";
import { ServicesTab } from "./VendorServices";
import { CouponsTab } from "./Coupons";
import { RequestsTab } from "./RequestsTab";
import { ReviewsTab } from "./ReviewsTab";

export default function VendorDashboard() {
    const [activeTab, setActiveTab] = useState("services");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const user = useSelector(selectCurrentUser);

    // This function remains the same, correctly rendering the active tab's component
    const renderContent = () => {
        switch (activeTab) {
            case "services":
                return <ServicesTab activeUser={user} />;
            case "coupons":
                return <CouponsTab />;
            case "requests":
                return <RequestsTab />;
            case "reviews":
                return <ReviewsTab />;
            default:
                // It's good practice for the default to match one of the primary states
                return <ServicesTab activeUser={user} />;
        }
    };

    return (
        // The root div now focuses only on the flex layout
        <div id="vendor-dashboard" className="flex min-h-screen bg-slate-50">
            {/* The sidebar handles its own visibility and state */}
            <VendorSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-full">
                {/* Mobile Header with Menu Button, sits above the main content */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-semibold">Vendor Dashboard</h2>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </header>

                {/* The main content area where tabs are rendered */}
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};