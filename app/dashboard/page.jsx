"use client"; // Or make it a Server Component if you can get the user role on the server

// import { useAuth } from "@/hooks/useAuth"; // <-- IMPORTANT: Use your actual auth hook/function
import GuestDashboard from "@/components/dashboard/guests/GuestDashboard";
import HostDashboard from "@/components/dashboard/hosts/HostDashboard";
import VendorDashboard from "@/components/dashboard/vendors/VendorDashboard";
import { Loader2 } from "lucide-react";

const user = {
    role: "guest",
}
export default function DashboardPage() {
    // This is a placeholder for your real authentication logic.
    // It should provide the user object and a loading state.
    // const { user, isLoading } = useAuth();
    const isLoading = false

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!user) {
        // Handle case where user is not logged in, e.g., redirect
        // This would typically be handled by middleware or a layout
        return <p>Please log in to view your dashboard.</p>;
    }

    // This is the core logic: render based on user role
    if (user.role === 'host') {
        return <HostDashboard user={user} />;
    } else if (user.role === "vendor") {
        return <VendorDashboard user={user} />;
    } else {
        return <GuestDashboard user={user} />;
    }

}
