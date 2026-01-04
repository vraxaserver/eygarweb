"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    X,
    SlidersHorizontal,
    Snowflake,
    Wifi,
    Waves,
    Car,
    Shirt,
    UtensilsCrossed,
    Home,
    Building2,
    Hotel,
    House,
    Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/slices/searchSlice";
import { useGetAmenitiesQuery } from "@/store/features/amenitiesApi";
import {
    resolveAmenityIcon,
    DEFAULT_AMENITY_ICON,
} from "@/utils/amenityIconMap";
// ---------------------------
// Option Lists (chips)
// ---------------------------
// const AMENITIES = [
//     { key: "Air conditioning", icon: Snowflake },
//     { key: "Hot tub", icon: Waves },
//     { key: "Free parking", icon: Car },
//     { key: "Wifi", icon: Wifi },
//     { key: "Dryer", icon: Shirt },
//     { key: "Kitchen", icon: UtensilsCrossed },
// ];

const PLACE_TYPES = [
    { key: "Entire place", icon: Home },
    { key: "Private room", icon: Users },
    { key: "Shared room", icon: Users },
];

const PROPERTY_TYPES = [
    { key: "House", icon: House },
    { key: "Apartment", icon: Building2 },
    { key: "Guesthouse", icon: Home },
    { key: "Hotel", icon: Hotel },
];

function toggleInArray(arr, value) {
    const set = new Set(Array.isArray(arr) ? arr : []);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    return Array.from(set);
}

const Chip = ({ active, icon: Icon, label, onClick }) => {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={onClick}
            className={[
                "rounded-full h-10 px-4",
                "border-gray-300 hover:border-[#814193]",
                "flex items-center gap-2",
                active ? "border-[#814193] bg-[#814193]/10" : "",
            ].join(" ")}
        >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            <span className="text-sm">{label}</span>
        </Button>
    );
};

const FilterBar = () => {
    const dispatch = useDispatch();
    const { filters = {} } = useSelector((state) => state.search || {});
    const [showFilters, setShowFilters] = useState(false);
    const [showMoreAmenities, setShowMoreAmenities] = useState(false);
    const [propertyTypeOpen, setPropertyTypeOpen] = useState(true);

    const {
        data: amenitiesList = [],
        isLoading: amenitiesLoading,
        error,
    } = useGetAmenitiesQuery();
    if (!amenitiesLoading) {
        console.log("amenity_list: ", amenitiesList);
    }

    // Safe fallbacks for arrays
    const amenitiesSelected = filters.amenities ?? [];
    const placeTypeSelected = filters.placeType ?? [];
    const propertyTypeSelected = filters.propertyType ?? [];

    // ✅ PRICE RANGE FIX: normalize to valid numbers
    const minPrice = Number.isFinite(Number(filters?.priceRange?.min))
        ? Number(filters.priceRange.min)
        : 0;

    const maxPrice = Number.isFinite(Number(filters?.priceRange?.max))
        ? Number(filters.priceRange.max)
        : 1000;

    const activeFiltersCount = useMemo(() => {
        let count = 0;

        if (minPrice !== 0 || maxPrice !== 1000) count++;
        if (filters?.hasExperiences) count++;
        if (amenitiesSelected.length) count++;
        if (placeTypeSelected.length) count++;
        if (propertyTypeSelected.length) count++;

        return count;
    }, [
        minPrice,
        maxPrice,
        filters,
        amenitiesSelected,
        placeTypeSelected,
        propertyTypeSelected,
    ]);

    const clearAllFilters = () => {
        dispatch(
            setFilters({
                priceRange: { min: 0, max: 1000 },
                propertyType: [],
                amenities: [],
                placeType: [],
                hostLanguages: [],
                bookingOptions: [],
                hasExperiences: false,
            })
        );
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                {/* Trigger Button (taller) */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(true)}
                    className="flex items-center space-x-2 rounded-full border-gray-300 hover:border-[#814193]
                               h-12 px-5 py-3"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>

                    {activeFiltersCount > 0 && (
                        <Badge className="ml-1 bg-[#814193] text-white text-xs px-2 py-0.5 rounded-full">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>

                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                    {/* ✅ DOUBLE-X FIX:
                        Many shadcn versions render their own close button inside DialogContent.
                        We will HIDE the built-in close button and keep ONLY our custom one.
                    */}
                    <DialogContent className="sm:max-w-[560px] p-0 [&>button]:hidden">
                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            <DialogHeader className="mb-6">
                                <div className="flex items-start justify-between">
                                    <DialogTitle className="text-lg font-semibold">
                                        Filters
                                    </DialogTitle>

                                    {/* Keep ONLY one close button */}
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </DialogClose>
                                </div>
                            </DialogHeader>

                            {/* Amenities */}
                            <div className="pb-6 border-b border-gray-200">
                                <h4 className="text-base font-semibold mb-3">
                                    Amenities
                                </h4>

                                {amenitiesLoading ? (
                                    <div className="text-sm text-gray-500">
                                        Loading amenities...
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(showMoreAmenities
                                            ? amenitiesList
                                            : amenitiesList.slice(0, 6)
                                        ).map((a) => {
                                            const Icon =
                                                resolveAmenityIcon(a.icon) ||
                                                DEFAULT_AMENITY_ICON;

                                            return (
                                                <Button
                                                    key={a.id}
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        dispatch(
                                                            setFilters({
                                                                // store by id (recommended) OR by name.
                                                                // ✅ recommended: store IDs so it's stable
                                                                amenities:
                                                                    toggleInArray(
                                                                        amenitiesSelected,
                                                                        a.name
                                                                    ),
                                                            })
                                                        )
                                                    }
                                                    className={[
                                                        "rounded-full h-10 px-4 border-gray-300 hover:border-[#814193] flex items-center gap-2",
                                                        amenitiesSelected.includes(
                                                            a.name
                                                        )
                                                            ? "border-[#814193] bg-[#814193]/10"
                                                            : "",
                                                    ].join(" ")}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {a.name}
                                                    </span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}

                                {amenitiesList.length > 6 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="px-0 mt-3 text-sm underline underline-offset-4"
                                        onClick={() =>
                                            setShowMoreAmenities((v) => !v)
                                        }
                                    >
                                        {showMoreAmenities
                                            ? "Show less"
                                            : "Show more"}
                                    </Button>
                                )}
                            </div>

                            {/* Place type */}
                            <div className="py-6 border-b border-gray-200">
                                <h4 className="text-base font-semibold mb-3">
                                    Place type
                                </h4>

                                <div className="flex flex-wrap gap-2">
                                    {PLACE_TYPES.map(({ key, icon }) => (
                                        <Chip
                                            key={key}
                                            icon={icon}
                                            label={key}
                                            active={placeTypeSelected.includes(
                                                key
                                            )}
                                            onClick={() =>
                                                dispatch(
                                                    setFilters({
                                                        placeType:
                                                            toggleInArray(
                                                                placeTypeSelected,
                                                                key
                                                            ),
                                                    })
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Property type */}
                            <div className="py-6 border-b border-gray-200">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-between"
                                    onClick={() =>
                                        setPropertyTypeOpen((v) => !v)
                                    }
                                >
                                    <h4 className="text-base font-semibold">
                                        Property type
                                    </h4>
                                    <span className="text-xl leading-none">
                                        {propertyTypeOpen ? "▾" : "▸"}
                                    </span>
                                </button>

                                {propertyTypeOpen && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {PROPERTY_TYPES.map(({ key, icon }) => (
                                            <Chip
                                                key={key}
                                                icon={icon}
                                                label={key}
                                                active={propertyTypeSelected.includes(
                                                    key
                                                )}
                                                onClick={() =>
                                                    dispatch(
                                                        setFilters({
                                                            propertyType:
                                                                toggleInArray(
                                                                    propertyTypeSelected,
                                                                    key
                                                                ),
                                                        })
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ✅ Price Range (fixed) */}
                            <div className="py-6 border-b border-gray-200">
                                <h4 className="text-base font-semibold mb-3">
                                    Price range
                                </h4>

                                <div className="px-3">
                                    <Slider
                                        value={[minPrice, maxPrice]}
                                        onValueChange={(value) => {
                                            const nextMin = Number(
                                                value?.[0] ?? 0
                                            );
                                            const nextMax = Number(
                                                value?.[1] ?? 1000
                                            );

                                            dispatch(
                                                setFilters({
                                                    priceRange: {
                                                        min: nextMin,
                                                        max: nextMax,
                                                    },
                                                })
                                            );
                                        }}
                                        max={1000}
                                        min={0}
                                        step={10}
                                        className="mb-3"
                                    />

                                    {/* These were missing/blank before because min/max were undefined */}
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>${minPrice}</span>
                                        <span>${maxPrice}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Free experiences */}
                            <div className="py-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hasExperiences"
                                        checked={Boolean(
                                            filters?.hasExperiences
                                        )}
                                        onCheckedChange={(checked) =>
                                            dispatch(
                                                setFilters({
                                                    hasExperiences:
                                                        Boolean(checked),
                                                })
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="hasExperiences"
                                        className="text-base font-medium"
                                    >
                                        Free experiences
                                    </label>
                                </div>
                            </div>

                            <DialogFooter className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={clearAllFilters}
                                >
                                    Clear all
                                </Button>

                                <div className="flex items-center gap-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Close
                                        </Button>
                                    </DialogClose>

                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            className="bg-[#814193] hover:bg-[#6d3580] text-white"
                                        >
                                            Show results
                                        </Button>
                                    </DialogClose>
                                </div>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default FilterBar;
