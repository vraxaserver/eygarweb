"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectCurrentRole, updateRole } from "@/store/slices/authSlice";
import { useGetCurrentStatusQuery } from "@/store/features/profileApi";

import BenefitsSection from "@/components/become-a-host/BenefitsSection";
import CTASection from "@/components/become-a-host/CTASection";
import HeroSection from "@/components/become-a-host/HeroSection";
import ProcessOverview from "@/components/become-a-host/ProcessOverview";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import { Loader2 } from "lucide-react";

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

    // Use the RTK Query hook. It will only run if the user is authenticated.
    // It automatically handles fetching, caching, loading, and error states.
    const { data, error, isLoading, isFetching } = useGetCurrentStatusQuery(undefined, {skip: !isAuthenticated});

    // First, handle authentication. If not authenticated, redirect to login.
    if (!isAuthenticated) {
        router.push("/login");
        return;
    }

    // If the query is still running, do nothing yet.
    if (isLoading || isFetching) {
        return;
    }

    // If there's an error fetching status, log it. You might want to show a UI message.
    if (error) {
        console.log("Error checking host status:", error);
    }

    console.log('data', data)
    // Check if host profile is fully submitted and under review
    if (data.completion_percentage === 100 && data.status === "approved") {
        if (role !== "host") {
            dispatch(updateRole("host"));
        }
        router.push("/dashboard"); // Or a pending review page
        return;
    }

    if (data) {
            
        // Check if there's an incomplete step and redirect
        if (data.current_step) {
            switch (data.current_step) {
                case "business_profile":
                    router.push("/become-a-host/create-profile");
                    break;
                case "identity_verification":
                    router.push("/become-a-host/verify-identity");
                    break;
                case "contact_info": // Ensure this matches your API response
                    router.push("/become-a-host/verify-contact");
                    break;
                case "review_submission":
                    router.push("/become-a-host/review-submit");
                    break;
                case "compelted":
                    router.push("/dashboard");
                    break;
                default:
                    // Fallback for any other step, though explicit cases are better
                    router.push(`/become-a-host/${data.current_step}`);
                    break;
            }
            return; // Stop execution after redirection
        }
    }


    // Show a loading screen while the hook is fetching and we decide where to go.
    if (isLoading || isFetching) {
        return <LoadingState />;
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
