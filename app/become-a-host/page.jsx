import BenefitsSection from "@/components/become-a-host/BenefitsSection";
import CTASection from "@/components/become-a-host/CTASection";
import HeroSection from "@/components/become-a-host/HeroSection";
import ProcessOverview from "@/components/become-a-host/ProcessOverview";
import Footer from "@/components/layout/Footer";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";

const Page = ({}) => {
    return (
        <>
            
            <div className="min-h-screen bg-background">
                {/* Step Progress Indicator */}
                <StepProgressIndicator />
                {/* Main Content */}
                <main className="">
                    {/* Hero Section */}
                    <HeroSection />

                    {/* Process Overview */}
                    <ProcessOverview />

                    {/* Benefits Section */}
                    <BenefitsSection />

                    {/* Final CTA */}
                    <CTASection />
                </main>
            
            </div>
            <Footer />
        </>
    );
};

export default Page;
