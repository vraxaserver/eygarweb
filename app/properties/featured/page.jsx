import FeaturedPropertyCard from "@/components/properties/FeaturedPropertyCard";
import { useGetFeaturedPropertiesQuery } from "@/store/features/propertiesApi";
import SearchBar from "@/components/search/SearchBar";

export default function FeaturedProperties() {
    const {
        data: featuredProperties,
        isLoading,
        isError,
    } = useGetFeaturedPropertiesQuery();

    return (
        <div>
            <SearchBar />
           

            {/* Main Content */}
            <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-8">
                {isLoading && (
                    <div className="center">Loading..</div>
                )}
                {/* 
                  MODIFICATION: Since the switcher is hidden on mobile, we can simplify this logic. 
                  On small screens, it will always be grid view. On larger screens, it respects the viewMode state.
                */}
                <div className="">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {featuredProperties && featuredProperties.map((property) => (
                            // --- CHANGE 3: Added a wrapper div to control card size in the flex container ---
                            // `flex-shrink-0`: Prevents cards from shrinking.
                            // `w-[300px] sm:w-[320px]`: Sets a fixed width for each card.
                            <FeaturedPropertyCard property={property} key={property.id} />
                        ))}
                    </div>
                </div>

                
            </div>
        </div>
    );
}
