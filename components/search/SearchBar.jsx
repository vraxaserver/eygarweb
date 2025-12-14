"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, ChevronDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    setCategories,
    setCheckIn,
    setCheckOut,
    setGuests,
} from "@/store/slices/searchSlice";
import LocationSearch from "@/components/LocationSearch";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/store/features/categoryApi";
import FilterBar from "@/components/search/FilterBar";

const SearchBar = () => {
    // UI state for popovers
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isCheckInCalendarOpen, setIsCheckInCalendarOpen] = useState(false);
    const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);

    const { data: categories, isLoading: isLoadingCategories } =
        useGetCategoriesQuery();

    const router = useRouter();
    const dispatch = useDispatch();

    // Get the entire search state from Redux
    const reduxSearch = useSelector((state) => state.search);
    const { filters, location } = reduxSearch;

    // --- DERIVE STATE DIRECTLY FROM REDUX ---
    // This ensures the component always reflects the true application state.

    // Dates
    const checkInDate = filters.checkIn ? new Date(filters.checkIn) : undefined;
    const checkOutDate = filters.checkOut
        ? new Date(filters.checkOut)
        : undefined;

    // Guests
    const { adults, children } = filters.guests;
    const totalGuests = adults + children;

    // Categories
    const selectedCategories = filters.categories || [];

    // --- HANDLERS TO DISPATCH ACTIONS TO REDUX ---

    /**
     * Handles changes to guests and dispatches the update to Redux immediately.
     * @param {'adults' | 'children'} type - The type of guest to update.
     * @param {number} value - The new value for the guest type.
     */
    const handleGuestsChange = (type, value) => {
        // Ensure value is not negative
        const newValue = Math.max(0, value);

        // Dispatch the entire guests object to maintain state integrity
        dispatch(
            setGuests({
                ...filters.guests,
                [type]: newValue,
            })
        );
    };

    /**
     * Toggles a category's selection status by dispatching the slug to Redux.
     * The reducer contains the logic to add or remove the item.
     * @param {string} slug - The category slug to toggle.
     */
    const handleCategoryToggle = (slug) => {
        dispatch(setCategories(slug));
    };

    const handleSearch = () => {
        // Guest and Category state is already in Redux.
        // This function will now be used to build the query string and navigate.
        console.log("Searching with Redux State: ", reduxSearch);

        // Example of building a query string for navigation
        const params = new URLSearchParams();
        if (location?.city) params.append("location", location.city);
        if (filters.checkIn) params.append("check_in", filters.checkIn);
        if (filters.checkOut) params.append("check_out", filters.checkOut);
        if (totalGuests > 0) params.append("guests", totalGuests);
        if (selectedCategories.length > 0)
            params.append("categories", selectedCategories.join(","));

        console.log("URL params: ", params.toString());
        router.push(`/properties/search?${params.toString()}`);
    };

    const formatDate = (date) => {
        if (!date) return "Add date";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    // Derived value for displaying selected category names
    const selectedCategoryNames = (categories || [])
        .filter((c) => selectedCategories.includes(c.slug))
        .map((c) => c.name)
        .join(", ");

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
                                            if (date) {
                                                dispatch(
                                                    setCheckIn(
                                                        date
                                                            .toLocaleDateString()
                                                            .split("T")[0]
                                                    )
                                                );
                                                setIsCheckInCalendarOpen(false);
                                            }
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
                                            if (date) {
                                                dispatch(
                                                    setCheckOut(
                                                        date
                                                            .toLocaleDateString()
                                                            .split("T")[0]
                                                    )
                                                );
                                                setIsCheckOutCalendarOpen(
                                                    false
                                                );
                                            }
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
                                                        handleGuestsChange(
                                                            "adults",
                                                            adults - 1
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
                                                        handleGuestsChange(
                                                            "adults",
                                                            adults + 1
                                                        )
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
                                                        handleGuestsChange(
                                                            "children",
                                                            children - 1
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
                                                        handleGuestsChange(
                                                            "children",
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
                                    <button
                                        type="button"
                                        className="px-6 py-3 text-left hover:bg-gray-50 flex items-center justify-between w-full"
                                    >
                                        <div className="flex-1 text-left">
                                            <div className="text-xs font-semibold text-gray-900">
                                                Categories
                                            </div>
                                            <div className="text-sm text-gray-600 truncate">
                                                {selectedCategoryNames ||
                                                    "Any type"}
                                            </div>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-500 ml-3" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-64 p-0"
                                    align="start"
                                >
                                    <div className="p-2 max-h-80 overflow-y-auto">
                                        {isLoadingCategories && (
                                            <p className="p-2 text-sm text-gray-500">
                                                Loading...
                                            </p>
                                        )}
                                        {categories?.map((category) => {
                                            const id = `cat-${category.slug}`;
                                            const checked =
                                                selectedCategories.includes(
                                                    category.slug
                                                );
                                            return (
                                                <label
                                                    key={category.slug}
                                                    htmlFor={id}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors ${
                                                        checked
                                                            ? "bg-purple-50 text-purple-700 font-medium"
                                                            : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    <input
                                                        id={id}
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() =>
                                                            handleCategoryToggle(
                                                                category.slug
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-purple-300"
                                                    />
                                                    <span className="text-sm">
                                                        {category.name}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                        {!isLoadingCategories &&
                                            (!categories ||
                                                categories.length === 0) && (
                                                <p className="p-2 text-sm text-gray-500">
                                                    No categories found.
                                                </p>
                                            )}
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
