"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { useGetVendorStatusQuery } from "@/store/features/vendorProfileApi";
import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { ServicesTab } from "./VendorServices";
import { CouponsTab } from "./Coupons";
import { RequestsTab } from "./RequestsTab";
import { ReviewsTab } from "./ReviewsTab";
import VendorPendingApproval from "./VendorPendingApproval";

export default function VendorDashboard() {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);
    const [activeTab, setActiveTab] = useState("services");
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Fetch live vendor status
    const { data: statusData, isLoading, isFetching, refetch } = useGetVendorStatusQuery();

    useEffect(() => {
        if (statusData?.current_step && statusData.status !== "approved") {
            const incompleteSteps = [
                "company_details",
                "service_area",
                "contact_details",
                "submit_for_review",
            ];
            if (incompleteSteps.includes(statusData.current_step)) {
                router.push(`/become-a-vendor/${statusData.current_step}`);
            }
        }
    }, [statusData, router]);

    // 1. Show loading indicator while checking status
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
                <p className="text-gray-600 text-sm font-medium">Verifying vendor account status...</p>
            </div>
        );
    }

    // 2. Block access if status is not approved
    if (!statusData || statusData.status !== "approved") {
        return (
            <VendorPendingApproval
                statusData={statusData}
                refetch={refetch}
                isRefetching={isFetching}
            />
        );
    }

    // 3. Render Dashboard features only when status === "approved"
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
                return <ServicesTab activeUser={user} />;
        }
    };

    return (
        <div id="vendor-dashboard" className="flex min-h-screen bg-slate-50">
            <VendorSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1 flex flex-col w-full">
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

                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}