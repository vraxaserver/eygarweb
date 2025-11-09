import FeaturedSection from "@/components/home/FeaturedSection";
import SafetySection from "@/components/home/SafetySection";
import ExperiencesSection from "@/components/home/ExperiencesSection";
import PopularDestinationsSection from "@/components/home/PopularDestinationsSection";
import SafetyCertifiedHostsSection from "@/components/home/SafetyCertifiedHostsSection";
import SearchBar from "@/components/search/SearchBar";


export default function Home() {

    return (
        <>
            <SearchBar />
            <main className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-8">
                {/* Featured Properties Section */}
                <FeaturedSection />

                {/* Safety Section */}
                <SafetySection />

                {/* Unique Experiences Section */}
                <ExperiencesSection />

                {/* Popular Destinations Section */}
                <PopularDestinationsSection />

                {/* Safety-Certified Hosts Section */}
                <SafetyCertifiedHostsSection />
            </main>
        </>
    );
}
