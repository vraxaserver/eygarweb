"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";

import {
    selectIsAuthenticated,
    selectCurrentRole,
    updateRole,
    selectAuthLoading, // Import loading selector
} from "@/store/slices/authSlice";
import { useGetCurrentStatusQuery } from "@/store/features/hostProfileApi";

import BenefitsSection from "@/components/become-a-host/BenefitsSection";
import CTASection from "@/components/become-a-host/CTASection";
import HeroSection from "@/components/become-a-host/HeroSection";
import ProcessOverview from "@/components/become-a-host/ProcessOverview";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";

const LoadingState = ({ message = "Checking your status..." }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">{message}</p>
    </div>
);

const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectCurrentRole);
    const authLoading = useSelector(selectAuthLoading);

    // 1. Handle Role Switch Logic immediately
    useEffect(() => {
        if (isAuthenticated && role !== "host") {
            dispatch(updateRole("host"));
        }
    }, [isAuthenticated, role, dispatch]);

    // 2. Fetch Host Status (Only if authenticated)
    const { data, error, isLoading, isFetching } = useGetCurrentStatusQuery(
        undefined,
        {
            skip: !isAuthenticated,
            refetchOnMountOrArgChange: true,
        }
    );

    // 3. Auth Redirect Logic
    useEffect(() => {
        if (!authLoading && isAuthenticated === false) {
            const returnUrl = encodeURIComponent("/become-a-host");
            router.push(`/login?returnUrl=${returnUrl}`);
        }
    }, [isAuthenticated, authLoading, router]);

    // 4. Status Redirect Logic
    useEffect(() => {
        // Only redirect if data exists AND we have successfully switched to host role
        if (data?.current_step && role === "host") {
            const step = data.current_step;

            const redirects = {
                business_profile: "/become-a-host/create-profile",
                identity_verification: "/become-a-host/verify-identity",
                contact_details: "/become-a-host/verify-contact",
                completed: "/dashboard",
            };

            const targetPath = redirects[step];
            if (targetPath) {
                router.push(targetPath);
            }
        }
    }, [data, role, router]);

    // --- RENDER ---

    if (authLoading) return <LoadingState message="Verifying session..." />;

    if (isAuthenticated === false) return null; // Wait for redirect

    if (isLoading || isFetching) return <LoadingState />;

    if (error) {
        console.error("Host status error:", error);
    }

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
