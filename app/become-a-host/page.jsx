"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
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
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-gray-600">Checking your status...</p>
    </div>
);

const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectCurrentRole);

    // Call RTKQ always, skip when not authenticated
    const { data, error, isLoading, isFetching } = useGetCurrentStatusQuery(
        undefined,
        { skip: !isAuthenticated }
    );

    // Ensure role = host once
    useEffect(() => {
        if (role !== "host") {
            dispatch(updateRole("host"));
        }
    }, [role, dispatch]);

    // Redirect unauthenticated users
    useEffect(() => {
        if (isAuthenticated === false) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    // Redirect based on host onboarding step
    useEffect(() => {
        if (!data) return;

        const step = data.current_step;
        if (!step) return;

        const redirects = {
            business_profile: "/become-a-host/create-profile",
            identity_verification: "/become-a-host/verify-identity",
            contact_details: "/become-a-host/verify-contact",
            completed: "/dashboard",
        };

        const path = redirects[step];
        if (path) router.replace(path);

    }, [data, router]);

    // Show loader while data is loading
    if (isLoading || isFetching) {
        return <LoadingState />;
    }

    // Optional: log errors
    if (error) {
        console.log("Error checking host status:", error);
    }

    // If no redirect needed, show landing page
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
