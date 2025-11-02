"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRole, selectCurrentUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { VendorSidebar } from "./VendorSidebar";
import { ServicesTab } from "./VendorServices";
import { CouponsTab } from "./Coupons";
import { RequestsTab } from "./RequestsTab";
import { ReviewsTab } from "./ReviewsTab";

export default function VendorDashboard () {
    const [activeTab, setActiveTab] = useState("services");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const user = useSelector(selectCurrentUser);
    console.log("vendor user", user)

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
                return <ServicesTab />;
        }
    };

    return (
        <div id="vendor-dashboard" className="lg:flex min-h-screen bg-slate-50 p-10 bg-green-500">
            {/* The sidebar now receives state for mobile view */}
            <VendorSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content Area */}
            {/* The `flex-1` class makes this div take all available space */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header with Menu Button */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white">
                    <h2 className="text-lg font-semibold">Vendor Dashboard</h2>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                {/* The actual content */}
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
