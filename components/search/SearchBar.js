'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Calendar as CalendarIcon, ChevronDown,Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

import {useDispatch, useSelector} from "react-redux";
import { setLocation, setDates, setGuests, setFilters } from '@/store/slices/searchSlice';

const SearchBar = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.search);
    const [searchQuery, setSearchQuery] = useState("");
    const [checkInDate, setCheckInDate] = useState();
    const [checkOutDate, setCheckOutDate] = useState();
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [isCheckInCalendarOpen, setIsCheckInCalendarOpen] = useState(false);
    const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [showGuests, setShowGuests] = useState(false);
    const [locationSuggestions] = useState([
        'Dubai, UAE',
        'New York, USA',
        'London, UK',
        'Paris, France',
        'Tokyo, Japan',
        'Sydney, Australia'
    ]);
    const totalGuests = adults + children;
    const handleSearch = () => {
        console.log('Searching with filters:', filters);
    };

    const formatDate = (date) => {
        if (!date) return 'Add date';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getTotalGuests = () => {
        const total = filters.guests.adults + filters.guests.children;
        if (total === 0) return 'Add guests';
        return total === 1 ? '1 guest' : `${total} guests`;
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
        if (filters.hasExperiences) count++;
        if (filters.propertyType.length > 0) count++;
        if (filters.amenities.length > 0) count++;
        return count;
    };

    const clearAllFilters = () => {
        dispatch(setFilters({
            priceRange: { min: 0, max: 1000 },
            propertyType: [],
            amenities: [],
            hostLanguages: [],
            bookingOptions: [],
            hasExperiences: false,
        }));
    };

    const handleLocationSearch = (value) => {
        dispatch(setLocation(value));
        setShowLocationSuggestions(value.length > 0);
    };

    const selectLocation = (location) => {
        dispatch(setLocation(location));
        setShowLocationSuggestions(false);
    };

    const handleCheckInSelect = (date) => {
        setCheckInDate(date);
        if (date) {
            dispatch(setDates({
                checkIn: date.toISOString().split('T')[0],
                checkOut: filters.checkOut
            }));
        }
        setShowCheckIn(false);
    };

    const handleCheckOutSelect = (date) => {
        setCheckOutDate(date);
        if (date) {
            dispatch(setDates({
                checkIn: filters.checkIn,
                checkOut: date.toISOString().split('T')[0]
            }));
        }
        setShowCheckOut(false);
    };

    console.log("Filters: ", filters)

    return (
        <div className="border-b border-gray-200 bg-gray-100 sticky z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full shadow-lg pr-3">
                            <div className="flex-1 px-6 py-3">
                                <Input
                                    placeholder="Search Destinations"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="border-0 focus-visible:ring-0 text-sm font-medium"
                                />
                            </div>

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
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

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
                                                setIsCheckOutCalendarOpen(
                                                    false
                                                );
                                            }}
                                            disabled={(date) =>
                                                date < new Date() ||
                                                (checkInDate &&
                                                    date <= checkInDate)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="border-l border-gray-300">
                                <Popover
                                    open={isGuestDropdownOpen}
                                    onOpenChange={setIsGuestDropdownOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <button className="px-6 py-3 text-left hover:bg-gray-50 rounded-none flex items-center space-x-2">
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
                                                            setAdults(
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

                            <div className="border-l border-gray-300">
                                <button className="px-6 py-3 text-left hover:bg-gray-50 rounded-none">
                                    <div className="text-xs font-semibold text-gray-900">
                                        Categories
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Any type
                                    </div>
                                </button>
                            </div>

                            <Button
                                onClick={handleSearch}
                                className="bg-[#814193] hover:bg-[#6d3580] text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors p-0"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>

                        <Popover
                            open={showFilters}
                            onOpenChange={setShowFilters}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center space-x-2 rounded-full border-gray-300 hover:border-[#814193] px-4 py-3 h-12 relative"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span>Filters</span>
                                    {getActiveFiltersCount() > 0 && (
                                        <Badge className="ml-1 bg-[#814193] text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5">
                                            {getActiveFiltersCount()}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-0" align="end">
                                <div className="p-6 max-h-[600px] overflow-y-auto">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold">
                                            Filters
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setShowFilters(false)
                                            }
                                            className="h-auto p-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Price Range */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium mb-3">
                                            Price range
                                        </h4>
                                        <div className="px-3">
                                            <Slider
                                                value={[0, 1000]}
                                                onValueChange={(value) =>
                                                    dispatch(
                                                        setFilters({
                                                            priceRange: {
                                                                min: value[0],
                                                                max: value[1],
                                                            },
                                                        })
                                                    )
                                                }
                                                max={1000}
                                                min={0}
                                                step={10}
                                                className="mb-3"
                                            />
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>0</span>
                                                <span>1000</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Type */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium mb-3">
                                            Property type
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                "Entire place",
                                                "Private room",
                                                "Shared room",
                                            ].map((type) => (
                                                <div
                                                    key={type}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox id={type} />
                                                    <label
                                                        htmlFor={type}
                                                        className="text-sm"
                                                    >
                                                        {type}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium mb-3">
                                            Amenities
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                "WiFi",
                                                "Kitchen",
                                                "Pool",
                                                "Parking",
                                                "Air conditioning",
                                            ].map((amenity) => (
                                                <div
                                                    key={amenity}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox id={amenity} />
                                                    <label
                                                        htmlFor={amenity}
                                                        className="text-sm"
                                                    >
                                                        {amenity}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Experiences */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="hasExperiences" />
                                            <label
                                                htmlFor="hasExperiences"
                                                className="text-base font-medium"
                                            >
                                                Free experiences
                                            </label>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <Button variant="ghost">
                                            Clear all
                                        </Button>
                                        <Button className="bg-[#814193] hover:bg-[#6d3580] text-white">
                                            Show results
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
    );
};

export default SearchBar;