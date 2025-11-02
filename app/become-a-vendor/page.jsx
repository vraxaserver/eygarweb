"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
    selectIsAuthenticated,
    selectCurrentRole,
    updateRole,
} from "@/store/slices/authSlice";
import { useGetVendorStatusQuery } from "@/store/features/vendorProfileApi";
import { Loader2 } from "lucide-react";

// You can create shared components for these sections or tailor them for vendors
import BenefitsSection from "@/components/become-a-vendor/BenefitsSection";
import CTASection from "@/components/become-a-vendor/CTASection";
import HeroSection from "@/components/become-a-vendor/HeroSection";
import ProcessOverview from "@/components/become-a-vendor/ProcessOverview";
import StepProgressIndicator from "@/components/become-a-vendor/StepProgressIndicator";
import { useEffect } from "react";

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-gray-600">Checking your vendor status...</p>
    </div>
);

const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectCurrentRole);

    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    const { data, error, isLoading, isFetching } = useGetVendorStatusQuery(
        undefined,
        { skip: !isAuthenticated }
    );

    if (error) {
        console.error("Error checking vendor status:", error);
    }

    console.log("data :", data)

    useEffect(() => {
        if (data?.status === "approved") {
            role !== "vendor" && dispatch(updateRole("vendor"));
            router.push("/dashboard");
            return;
        }

        if (data?.current_step) {
            switch (data.current_step) {
                case "company_details":
                    router.push("/become-a-vendor/company-details");
                    break;
                case "service_area":
                    router.push("/become-a-vendor/service-area");
                    break;
                case "contact_details":
                    router.push("/become-a-vendor/contact-details");
                    break;
                case "submit_for_review":
                    router.push("/become-a-vendor/submit-for-review");
                    break;
                case "completed":
                    router.push("/dashboard");
                    break;

                default:
                    // Fallback for any other step
                    router.push(`/become-a-vendor/${data.current_step}`);
                    break;
            }
            return null; // Stop execution after redirection
        }

    }, [data?.status, role, dispatch, router]);

  // If the query is still running, do nothing yet.
    if (isLoading || isFetching) {
        return <LoadingState />;
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
