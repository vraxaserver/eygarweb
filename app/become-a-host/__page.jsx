"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";

import {
    selectIsAuthenticated,
    selectCurrentRole,
    updateRole,
} from "@/store/slices/authSlice";
import { useGetCurrentStatusQuery } from "@/store/features/hostProfileApi";

import BenefitsSection from "@/components/become-a-host/BenefitsSection";
import CTASection from "@/components/become-a-host/CTASection";
import HeroSection from "@/components/become-a-host/HeroSection";
import ProcessOverview from "@/components/become-a-host/ProcessOverview";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";

const LoadingState = ({ message = "Checking your status..." }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-gray-600">{message}</p>
    </div>
);

const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    // Auth State
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectCurrentRole);

    // 1. Redirect Unauthenticated Users Immediately
    useEffect(() => {
        if (isAuthenticated === false) {
            // Encode the current path so the user returns here after login
            const returnUrl = encodeURIComponent("/become-a-host");
            router.push(`/login?returnUrl=${returnUrl}`);
        }
    }, [isAuthenticated, router]);

    // 2. Set Role to 'Host' if Authenticated
    useEffect(() => {
        if (isAuthenticated && role !== "host") {
            dispatch(updateRole("host"));
        }
    }, []);

    // 3. Fetch Status (Skip if not authenticated to prevent 401s)
    const { data, error, isLoading, isFetching } = useGetCurrentStatusQuery(
        undefined,
        {
            skip: !isAuthenticated,
            refetchOnMountOrArgChange: true,
        }
    );

    // 4. Redirect based on API Status
    useEffect(() => {
        // Wait for data to exist
        if (!data || !data.current_step) return;

        const step = data.current_step;

        const redirects = {
            business_profile: "/become-a-host/create-profile",
            identity_verification: "/become-a-host/verify-identity",
            contact_details: "/become-a-host/verify-contact",
            // If completed, send to dashboard (Host View)
            completed: "/dashboard",
        };

        const targetPath = redirects[step];

        if (targetPath) {
            // Use replace to prevent back-button loops
            router.replace(targetPath);
        }
    }, [data, router]);

    // --- RENDER LOGIC ---

    // Case A: Not authenticated (Wait for useEffect to redirect)
    if (isAuthenticated === false) {
        return null; // Render nothing while redirecting
    }

    // Case B: Loading API data or Initial Auth Check
    if (isLoading || isFetching) {
        return <LoadingState />;
    }

    // Case C: Error in API
    if (error) {
        console.error("Error checking host status:", error);
        // Optionally show an error state or fall through to landing page
        // allowing them to try clicking "Start" again
    }

    // Case D: Authenticated, Role Set, No Active Step (New Host)
    // Show the Landing Page to encourage them to start
    return (
        <div className="min-h-screen bg-background">
            <StepProgressIndicator />
            <main>
                <HeroSection />
                <ProcessOverview />
                <BenefitsSection />
                <CTASection />
            </main>
        </div>
    );
};

export default Page;
