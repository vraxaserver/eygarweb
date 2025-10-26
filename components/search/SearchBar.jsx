'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, X, MapPin, Calendar as CalendarIcon, ChevronDown, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { setFilters, setSearchQuery } from '@/store/slices/searchSlice';
import { useGetCategoriesQuery } from '@/store/features/categoryApi';
import LocationSearch from '@/components/LocationSearch';
import { useRouter } from "next/navigation";

const PROPERTIES_API_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL

const SearchBar = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const reduxFilters = useSelector((state) => state.search.filters);
    // const reduxSearchQuery = useSelector((state) => state.search.searchQuery);
    const reduxSearch = useSelector((state) => state.search);

    // const [searchQueryLocal, setSearchQueryLocal] = useState(reduxSearchQuery || "");
    const [location, setLocation] = useState({name: "", city: "", lat: null, lon: null, error: ""});
    const [checkInDate, setCheckInDate] = useState(reduxFilters.checkIn ? new Date(reduxFilters.checkIn) : undefined);
    const [checkOutDate, setCheckOutDate] = useState(reduxFilters.checkOut ? new Date(reduxFilters.checkOut) : undefined);
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isCheckInCalendarOpen, setIsCheckInCalendarOpen] = useState(false);
    const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [adults, setAdults] = useState(reduxFilters.guests?.adults || 0);
    const [children, setChildren] = useState(reduxFilters.guests?.children || 0);
    const [selectedCategory, setSelectedCategory] = useState("");
    
    // Filter states
    const [priceRange, setPriceRange] = useState(reduxFilters.priceRange || [0, 1000]);
    const [propertyTypes, setPropertyTypes] = useState(reduxFilters.propertyType ? [reduxFilters.propertyType] : []);
    const [placeTypes, setPlaceTypes] = useState(reduxFilters.placeType ? [reduxFilters.placeType] : []);
    const [amenities, setAmenities] = useState(reduxFilters.amenities || []);
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [categories, setCategories] = useState(reduxFilters.categories || []);
    const [categoryList, setCategoryList] = useState([])
    const [hasExperiences, setHasExperiences] = useState(false);
    const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);

    const totalGuests = adults + children;

    // Fetch amenities from API
    useEffect(() => {
        const fetchAmenities = async () => {
            setIsLoadingAmenities(true);
            try {
                const response = await fetch(`${PROPERTIES_API_URL}/amenities`);
                if (response.ok) {
                    const data = await response.json();
                    setAmenitiesList(data);
                } else {
                    console.error('Failed to fetch amenities');
                }
            } catch (error) {
                console.error('Error fetching amenities:', error);
            } finally {
                setIsLoadingAmenities(false);
            }
        };

        fetchAmenities();
    }, []);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${PROPERTIES_API_URL}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategoryList(data);
                } else {
                    console.error('Failed to fetch amenities');
                }
            } catch (error) {
                console.error('Error fetching amenities:', error);
            }                       
            
        };

        fetchCategories();

    }, []);

    const handleSearch = () => {
        // Update Redux state with search query
        // dispatch(setSearchQuery(searchQueryLocal));

        // Build filter object
        const filterData = {
            
            checkIn: checkInDate ? checkInDate.toISOString().split('T')[0] : null,
            checkOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : null,
            guests: {
                adults: adults,
                children: children,
            },
            priceRange: priceRange,
            propertyType: propertyTypes,
            placeType: placeTypes,
            amenities: amenities,
            category: selectedCategory,
            min_price: priceRange[0],
            max_price: priceRange[1],
            has_experiences: hasExperiences,
        };

        // Update Redux filters
        dispatch(setFilters(filterData));

        setShowFilters(false);
        // router.push("/properties/")
    };

    const formatDate = (date) => {
        if (!date) return 'Add date';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
        if (hasExperiences) count++;
        if (propertyTypes.length > 0) count++;
        if (amenities.length > 0) count++;
        if (categories.length > 0) count++;
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
        setSelectedCategory('');
        
        // Clear Redux state
        dispatch(setSearchQuery(""));
        dispatch(setLocation({}))
        dispatch(setFilters({
            checkIn: null,
            checkOut: null,
            guests: {
                adults: 0,
                children: 0,
            },
            priceRange: [0, 1000],
            propertyTypes: [],
            placeTypes: [],
            amenities: [],
            category: '',
            min_price: 0,
            max_price: 1000,
            has_experiences: false,
        }));
    };

    const handlePropertyTypeChange = (type, checked) => {
        if (checked) {
            setPropertyTypes([...propertyTypes, type]);
        } else {
            setPropertyTypes(propertyTypes.filter(t => t !== type));
        }
    };

    const handlePlaceTypeChange = (type, checked) => {
        if (checked) {
            setPlaceTypes([...placeTypes, type]);
        } else {
            setPlaceTypes(placeTypes.filter(t => t !== type));
        }
    };

    const handleAmenityChange = (amenityId, checked) => {
        if (checked) {
            setAmenities([...amenities, amenityId]);
        } else {
            setAmenities(amenities.filter(id => id !== amenityId));
        }
    };

    const handleShowResults = () => {
        handleSearch();
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsCategoryDropdownOpen(false);
    };

    const getCategoryLabel = () => {
        const category = categories.find(cat => cat.slug === selectedCategory);
        return category ? category.name : "Any type";
    };

    return (
        <div className="border-b border-gray-200 bg-gray-100 sticky z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full shadow-lg pr-3">
                        <div className="flex-1 px-6 py-3">
                            {/* <Input
                                placeholder="Search Destinations"
                                value={searchQueryLocal}
                                onChange={(e) => setSearchQueryLocal(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="border-0 focus-visible:ring-0 text-sm font-medium"
                            /> */}
                            <LocationSearch />
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
                                        disabled={(date) => date < new Date()}
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
                                            setIsCheckOutCalendarOpen(false);
                                        }}
                                        disabled={(date) =>
                                            date < new Date() ||
                                            (checkInDate && date <= checkInDate)
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
                                                    ? `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`
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
                                                <div className="font-medium">Adults</div>
                                                <div className="text-sm text-gray-600">Age 13+</div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() => setAdults(Math.max(0, adults - 1))}
                                                    disabled={adults <= 0}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center">{adults}</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() => setAdults(adults + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">Children</div>
                                                <div className="text-sm text-gray-600">Ages 2-12</div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() => setChildren(Math.max(0, children - 1))}
                                                    disabled={children <= 0}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center">{children}</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-8 h-8 rounded-full p-0"
                                                    onClick={() => setChildren(children + 1)}
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
                            <Popover
                                open={isCategoryDropdownOpen}
                                onOpenChange={setIsCategoryDropdownOpen}
                            >
                                <PopoverTrigger asChild>
                                    <button className="px-6 py-3 text-left hover:bg-gray-50 rounded-none flex items-center space-x-2">
                                        <div>
                                            <div className="text-xs font-semibold text-gray-900">
                                                Categories
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {getCategoryLabel()}
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
                                                onClick={() => handleCategorySelect(category.slug)}
                                                className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-md transition-colors ${
                                                    selectedCategory === category.slug
                                                        ? 'bg-purple-50 text-purple-700 font-medium'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Button
                            onClick={handleSearch}
                            className="bg-[#814193] hover:bg-[#6d3580] text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors p-0"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>

                    <Popover open={showFilters} onOpenChange={setShowFilters}>
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
                                    <h3 className="text-lg font-semibold">Filters</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFilters(false)}
                                        className="h-auto p-1"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="text-base font-medium mb-3">Price range</h4>
                                    <div className="px-3">
                                        <Slider
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            max={1000}
                                            min={0}
                                            step={10}
                                            className="mb-3"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div className="mb-6">
                                    <h4 className="text-base font-medium mb-3">Place type</h4>
                                    <div className="space-y-3">
                                        {["entire_place", "private_room", "shared_room"].map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={type}
                                                    checked={placeTypes.includes(type)}
                                                    onCheckedChange={(checked) =>
                                                        handlePlaceTypeChange(type, checked)
                                                    }
                                                />
                                                <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                                                    {type.replace('_', ' ')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div className="mb-6">
                                    <h4 className="text-base font-medium mb-3">Property type</h4>
                                    <div className="space-y-3">
                                        {["house", "apartment", "guest_house", "hotel"].map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={type}
                                                    checked={propertyTypes.includes(type)}
                                                    onCheckedChange={(checked) =>
                                                        handlePropertyTypeChange(type, checked)
                                                    }
                                                />
                                                <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                                                    {type.replace('_', ' ')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mb-6">
                                    <h4 className="text-base font-medium mb-3">Amenities</h4>
                                    {isLoadingAmenities ? (
                                        <div className="text-sm text-gray-500">Loading amenities...</div>
                                    ) : amenitiesList.length > 0 ? (
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                            {amenitiesList.map((amenity) => (
                                                <div key={amenity.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`amenity-${amenity.id}`}
                                                        checked={amenities.includes(amenity.id)}
                                                        onCheckedChange={(checked) =>
                                                            handleAmenityChange(amenity.id, checked)
                                                        }
                                                    />
                                                    <label 
                                                        htmlFor={`amenity-${amenity.id}`} 
                                                        className="text-sm cursor-pointer"
                                                    >
                                                        {amenity.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No amenities available</div>
                                    )}
                                </div>

                                {/* Experiences */}
                                <div className="mb-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="hasExperiences"
                                            checked={hasExperiences}
                                            onCheckedChange={setHasExperiences}
                                        />
                                        <label htmlFor="hasExperiences" className="text-base font-medium cursor-pointer">
                                            Free experiences
                                        </label>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <Button variant="ghost" onClick={clearAllFilters}>
                                        Clear all
                                    </Button>
                                    <Button
                                        className="bg-[#814193] hover:bg-[#6d3580] text-white"
                                        onClick={handleShowResults}
                                    >
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
