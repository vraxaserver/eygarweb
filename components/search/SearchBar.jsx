"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    Plus,
    Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { setFilters, setSearchQuery } from "@/store/slices/searchSlice";
import LocationSearch from "@/components/LocationSearch";
import { useRouter } from "next/navigation";

const PROPERTIES_API_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;

const SearchBar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const reduxFilters = useSelector((state) => state.search.filters);

    const [checkInDate, setCheckInDate] = useState(
        reduxFilters.checkIn ? new Date(reduxFilters.checkIn) : undefined
    );
    const [checkOutDate, setCheckOutDate] = useState(
        reduxFilters.checkOut ? new Date(reduxFilters.checkOut) : undefined
    );
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isCheckInCalendarOpen, setIsCheckInCalendarOpen] = useState(false);
    const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [adults, setAdults] = useState(reduxFilters.guests?.adults || 0);
    const [children, setChildren] = useState(
        reduxFilters.guests?.children || 0
    );
    const [selectedCategory, setSelectedCategory] = useState("");

    const [priceRange, setPriceRange] = useState(
        reduxFilters.priceRange || [0, 1000]
    );
    const [propertyTypes, setPropertyTypes] = useState(
        reduxFilters.propertyType ? [reduxFilters.propertyType] : []
    );
    const [placeTypes, setPlaceTypes] = useState(
        reduxFilters.placeType ? [reduxFilters.placeType] : []
    );
    const [amenities, setAmenities] = useState(reduxFilters.amenities || []);
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [hasExperiences, setHasExperiences] = useState(false);
    const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);

    const totalGuests = adults + children;

    useEffect(() => {
        const fetchAmenities = async () => {
            setIsLoadingAmenities(true);
            try {
                const res = await fetch(`${PROPERTIES_API_URL}/amenities`);
                if (res.ok) {
                    const data = await res.json();
                    setAmenitiesList(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingAmenities(false);
            }
        };
        fetchAmenities();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${PROPERTIES_API_URL}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategoryList(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = () => {
        const filterData = {
            checkIn: checkInDate
                ? checkInDate.toISOString().split("T")[0]
                : null,
            checkOut: checkOutDate
                ? checkOutDate.toISOString().split("T")[0]
                : null,
            guests: { adults, children },
            priceRange,
            propertyType: propertyTypes,
            placeType: placeTypes,
            amenities,
            category: selectedCategory,
            min_price: priceRange[0],
            max_price: priceRange[1],
            has_experiences: hasExperiences,
        };
        dispatch(setFilters(filterData));
        setShowFilters(false);
    };

    const formatDate = (date) => {
        if (!date) return "Add date";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
        if (hasExperiences) count++;
        if (propertyTypes.length > 0) count++;
        if (amenities.length > 0) count++;
        if (categoryList.length > 0) count++;
        return count;
    };

    const clearAllFilters = () => {
        setPriceRange([0, 1000]);
        setPropertyTypes([]);
        setAmenities([]);
        setHasExperiences(false);
        setCheckInDate(undefined);
        setCheckOutDate(undefined);
        setAdults(0);
        setChildren(0);
        setSelectedCategory("");

        dispatch(setSearchQuery(""));
        dispatch(
            setFilters({
                checkIn: null,
                checkOut: null,
                guests: { adults: 0, children: 0 },
                priceRange: [0, 1000],
                propertyTypes: [],
                placeTypes: [],
                amenities: [],
                category: "",
                min_price: 0,
                max_price: 1000,
                has_experiences: false,
            })
        );
    };

    return (
        <div className="border-b border-gray-200 bg-gray-100 sticky z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                {/* ======= Desktop View ======= */}
                <div className="hidden md:flex items-center space-x-4">
                    <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full shadow-lg pr-3">
                        <div className="flex-1 px-6 py-3">
                            <LocationSearch />
                        </div>

                        {/* Check-In */}
                        <div className="border-l border-gray-300">
                            <Popover
                                open={isCheckInCalendarOpen}
                                onOpenChange={setIsCheckInCalendarOpen}
                            >
                                <PopoverTrigger asChild>
                                    <button className="px-6 py-3 text-left hover:bg-gray-50 rounded-none">
                                        <div className="text-xs font-semibold text-gray-900">
                                            Check-In
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(checkInDate)}
                                        </div>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <CalendarComponent
                                        mode="single"
                                        selected={checkInDate}
                                        onSelect={(date) => {
                                            setCheckInDate(date);
                                            setIsCheckInCalendarOpen(false);
                                        }}
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Check-Out */}
                        <div className="border-l border-gray-300">
                            <Popover
                                open={isCheckOutCalendarOpen}
                                onOpenChange={setIsCheckOutCalendarOpen}
                            >
                                <PopoverTrigger asChild>
                                    <button className="px-6 py-3 text-left hover:bg-gray-50 rounded-none">
                                        <div className="text-xs font-semibold text-gray-900">
                                            Checkout
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(checkOutDate)}
                                        </div>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <CalendarComponent
                                        mode="single"
                                        selected={checkOutDate}
                                        onSelect={(date) => {
                                            setCheckOutDate(date);
                                            setIsCheckOutCalendarOpen(false);
                                        }}
                                        disabled={(date) =>
                                            date < new Date() ||
                                            (checkInDate && date <= checkInDate)
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Guests */}
                        <div className="border-l border-gray-300">
                            <Popover
                                open={isGuestDropdownOpen}
                                onOpenChange={setIsGuestDropdownOpen}
                            >
                                <PopoverTrigger asChild>
                                    <button className="px-6 py-3 text-left hover:bg-gray-50 flex items-center space-x-2">
                                        <div>
                                            <div className="text-xs font-semibold text-gray-900">
                                                Guests
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {totalGuests > 0
                                                    ? `${totalGuests} guest${
                                                          totalGuests !== 1
                                                              ? "s"
                                                              : ""
                                                      }`
                                                    : "Add guests"}
                                            </div>
                                        </div>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-80 p-0"
                                    align="start"
                                >
                                    <div className="p-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">
                                                    Adults
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Age 13+
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() =>
                                                        setAdults(
                                                            Math.max(
                                                                0,
                                                                adults - 1
                                                            )
                                                        )
                                                    }
                                                    disabled={adults <= 0}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center">
                                                    {adults}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() =>
                                                        setAdults(adults + 1)
                                                    }
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">
                                                    Children
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Ages 2-12
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() =>
                                                        setChildren(
                                                            Math.max(
                                                                0,
                                                                children - 1
                                                            )
                                                        )
                                                    }
                                                    disabled={children <= 0}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center">
                                                    {children}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() =>
                                                        setChildren(
                                                            children + 1
                                                        )
                                                    }
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Categories */}
                        <div className="border-l border-gray-300">
                            <Popover
                                open={isCategoryDropdownOpen}
                                onOpenChange={setIsCategoryDropdownOpen}
                            >
                                <PopoverTrigger asChild>
                                    <button className="px-6 py-3 text-left hover:bg-gray-50 flex items-center space-x-2">
                                        <div>
                                            <div className="text-xs font-semibold text-gray-900">
                                                Categories
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {selectedCategory
                                                    ? selectedCategory
                                                    : "Any type"}
                                            </div>
                                        </div>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-64 p-0"
                                    align="start"
                                >
                                    <div className="p-2 max-h-80 overflow-y-auto">
                                        {categoryList.map((category) => (
                                            <button
                                                key={category.slug}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category.slug
                                                    )
                                                }
                                                className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-md transition-colors ${
                                                    selectedCategory ===
                                                    category.slug
                                                        ? "bg-purple-50 text-purple-700 font-medium"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={handleSearch}
                            className="bg-[#814193] hover:bg-[#6d3580] text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors p-0"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* ======= Mobile View ======= */}
                <div className="flex md:hidden items-center bg-white border border-gray-300 rounded-full shadow p-2 space-x-2">
                    <div className="flex-1">
                        <LocationSearch />
                    </div>
                    <Button
                        onClick={handleSearch}
                        className="bg-[#814193] hover:bg-[#6d3580] text-white rounded-full w-10 h-10 flex items-center justify-center p-0"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
