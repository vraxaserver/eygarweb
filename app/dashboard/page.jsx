"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import GuestDashboard from "@/components/dashboard/guests/GuestDashboard";
import HostDashboard from "@/components/dashboard/hosts/HostDashboard";
import VendorDashboard from "@/components/dashboard/vendors/VendorDashboard";
import { Loader2 } from "lucide-react";
import {
    selectIsAuthenticated,
    selectCurrentRole,
    selectAuthLoading, // Use loading state from slice
} from "@/store/slices/authSlice";

export default function DashboardPage() {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectCurrentRole);
    const authLoading = useSelector(selectAuthLoading);

    // Local loading state to prevent flash while checking role
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // If auth loading is done
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push("/login");
            } else {
                setIsReady(true);
            }
        }
    }, [isAuthenticated, authLoading, router]);

    // Show loader while Redux is hydrating or checking auth
    if (authLoading || !isReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    console.log("Rendering Dashboard for Role:", role);

    // Render based on role
    if (role === "host") {
        return <HostDashboard />;
    } else if (role === "vendor") {
        return <VendorDashboard />;
    } else {
        return <GuestDashboard />;
    }
}
