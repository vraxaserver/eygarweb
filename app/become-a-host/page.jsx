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

// A simple loading component to show while checking status
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

    // Always call the RTK Query hook to preserve hooks order, but skip when not authenticated
    const { data, error, isLoading, isFetching } = useGetCurrentStatusQuery(
        // pass arguments expected by your query or `undefined`/`null`
        undefined,
        { skip: !isAuthenticated }
    );

    // Handle authentication redirect as a side effect (not during render)
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    //   return (
    //     <>
    //     {JSON.stringify(data)}
    //     </>
    //   )

    // Handle redirection based on fetched status as a side effect
    useEffect(() => {
        // If query was skipped (not authenticated) or data not available yet, do nothing
        if (!data) return;

        // Redirect based on current_step
        if (data?.current_step) {
            switch (data.current_step) {
                case "business_profile":
                    router.push("/become-a-host/create-profile");
                    break;
                case "identity_verification":
                    router.push("/become-a-host/verify-identity");
                    break;
                case "contact_details":
                    router.push("/become-a-host/verify-contact");
                    break;
                default:
                    dispatch(updateRole("host"));
                    router.push("/dashboard");
                    break;
            }
        }

        // If complete and approved/submitted/pending completed state -> become host
        if (
            data?.completion_percentage === 100 &&
            (data?.status === "approved" ||
                data?.status === "submited" ||
                data?.next_step === "completed")
        ) {
            if (role !== "host") {
                dispatch(updateRole("host"));
            }
            router.push("/dashboard"); // Or a pending review page
            return;
        }
    }, [data, role, dispatch, router]);

    // Show loader while query is in progress (only happens when not skipped)
    if (isLoading || isFetching) {
        return <LoadingState />;
    }

    // Log error if any (you can display UI if you want)
    if (error) {
        console.log("Error checking host status:", error);
    }

    // Render the main landing page content if no redirection is needed.
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
