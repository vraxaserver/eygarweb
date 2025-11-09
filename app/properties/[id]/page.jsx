"use client";

import React, { useState, useEffect, useRef } from "react";
import ImageGallery from "@/components/property/ImageGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Heart,
    Share,
    Star,
    Users,
    Bed,
    Bath,
    Wifi,
    Car,
    Tv,
    Coffee,
    Utensils,
    AirVent,
    Waves,
    Dumbbell,
    MapPin,
    Shield,
    Calendar as CalendarIcon,
    Home,
    ChevronDown,
    Minus,
    Plus,
    Gift,
} from "lucide-react";

import { LocalCoupons } from "@/components/property/LocalCoupons";
import FreeExperiences from "@/components/property/FreeExperiences";

import {
    mockCoupons,
} from "@/data/properties";

import Location from "@/components/property/Location";
import MeetHost from "@/components/property/MeetHost";
import Reviews from "@/components/property/Reviews";
import Amenities from "@/components/property/Amenities";

import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useGetPropertyByIdQuery } from "@/store/features/propertiesApi";

export default function PropertyDetails({ params }) {
    const { id } = React.use(params);
    const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id);

    const [checkInDate, setCheckInDate] = useState(undefined);
    const [checkOutDate, setCheckOutDate] = useState(undefined);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [isCheckInCalendarOpen, setIsCheckInCalendarOpen] = useState(false);
    const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);
    const [showStickyNav, setShowStickyNav] = useState(false);
    const photoSectionRef = useRef(null);

    // Calculate number of nights and total price
    const calculateNights = () => {
        if (checkInDate && checkOutDate) {
            const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
        return 0;
    };

    const nights = calculateNights();
    const pricePerNight = property ? property.price_per_night / 100 : 0;
    const cleaningFee = 25; // This can also be fetched from property data if available
    const serviceFee = 51; // This can also be fetched from property data if available
    const subtotal = nights * pricePerNight;
    const totalBeforeTaxes = subtotal + cleaningFee + serviceFee;

    const totalGuests = adults + children;
    const maxGuests = property ? property.max_guests : 2;

    const formatDate = (date) => {
        if (!date) return "Add date";
        return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            if (photoSectionRef.current) {
                const photoSectionBottom =
                    photoSectionRef.current.offsetTop +
                    photoSectionRef.current.offsetHeight;
                const scrollPosition = window.scrollY + 80; // Account for header height

                setShowStickyNav(scrollPosition >= photoSectionBottom);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 140; // Account for both headers
            const elementPosition = element.offsetTop - headerOffset;
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth",
            });
        }
    };

    // This is mock data, will be replaced if your API provides it.
    const amenities = [
        { icon: <Wifi className="w-6 h-6" />, name: "Wifi", available: true },
        {
            icon: <Car className="w-6 h-6" />,
            name: "Free parking on premises",
            available: true,
        },
        { icon: <Tv className="w-6 h-6" />, name: "TV", available: true },
        {
            icon: <AirVent className="w-6 h-6" />,
            name: "Air conditioning",
            available: false,
        },
        {
            icon: <Coffee className="w-6 h-6" />,
            name: "Kitchen",
            available: true,
        },
        { icon: <Waves className="w-6 h-6" />, name: "Pool", available: true },
        {
            icon: <Dumbbell className="w-6 h-6" />,
            name: "Gym",
            available: false,
        },
        {
            icon: <Utensils className="w-6 h-6" />,
            name: "BBQ grill",
            available: true,
        },
    ];

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const router = useRouter();

    const handleReserve = () => {
        if (isAuthenticated) {
            // Proceed to the actual checkout page
            router.push(`/checkout/${id}`);
        } else {
            // Redirect to login, passing the current page as the 'from' param
            router.push(`/login?from=/properties/${id}`);
        }
    };

    if (isLoading) {
        return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">Loading...</div>;
    }

    if (isError || !property) {
        return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">Error loading property details.</div>;
    }

    return (
        <div>
            {/* Sticky Navigation */}
            <div
                className={`fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40 transition-transform duration-300 ${
                    showStickyNav ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 py-4">
                        <button
                            onClick={() => scrollToSection("photos")}
                            className="text-sm font-medium text-gray-900 hover:text-gray-600 pb-2 border-b-2 border-transparent hover:border-gray-300"
                        >
                            Photos
                        </button>
                        <button
                            onClick={() => scrollToSection("amenities")}
                            className="text-sm font-medium text-gray-900 hover:text-gray-600 pb-2 border-b-2 border-transparent hover:border-gray-300"
                        >
                            Amenities
                        </button>
                        <button
                            onClick={() => scrollToSection("reviews")}
                            className="text-sm font-medium text-gray-900 hover:text-gray-600 pb-2 border-b-2 border-transparent hover:border-gray-300"
                        >
                            Reviews
                        </button>
                        <button
                            onClick={() => scrollToSection("location")}
                            className="text-sm font-medium text-gray-900 hover:text-gray-600 pb-2 border-b-2 border-transparent hover:border-gray-300"
                        >
                            Location
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Property Title */}
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {property.title}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <Share className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Heart className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 fill-current text-black mr-1" />
                            <span className="font-semibold text-black">
                                {property.average_rating.toFixed(2)}
                            </span>
                        </div>
                        <span>•</span>
                        <button className="underline">{property.total_reviews} reviews</button>
                        <span>•</span>
                        <button className="underline">{`${property.location.city}, ${property.location.country}`}</button>
                    </div>
                </div>

                {/* Image Gallery */}
                <ImageGallery ref={photoSectionRef} images={property.images} />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2">
                        {/* Property Info */}
                        <div className="mb-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {`${property.property_type} hosted by ${property.host_name}`}
                                    </h2>
                                    <div className="flex items-center space-x-4 text-gray-600">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1" />
                                            <span>{property.max_guests} guests</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Bed className="w-4 h-4 mr-1" />
                                            <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Bath className="w-4 h-4 mr-1" />
                                            <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={property.host_avatar || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{property.host_name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                            <Separator className="mb-6" />

                            {/* Host Highlights */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start space-x-3">
                                    <Home className="w-6 h-6 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">
                                            {property.place_type === 'entire_place' ? 'Entire home' : 'Private room'}
                                        </h3>
                                        <p className="text-gray-600">
                                            You'll have the {property.property_type} to yourself.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="w-6 h-6 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">
                                            Enhanced Clean
                                        </h3>
                                        <p className="text-gray-600">
                                            This host has committed to a 5-step enhanced cleaning process.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CalendarIcon className="w-6 h-6 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">
                                            Self check-in
                                        </h3>
                                        <p className="text-gray-600">
                                            Check yourself in with the lockbox.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Separator className="mb-6" />

                            {/* Description */}
                            <div className="mb-8">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {property.description || "Our cozy tiny house is the perfect retreat for couples or solo travelers looking for a peaceful getaway. Nestled in the beautiful Georgia countryside, this charming home offers all the amenities you need for a comfortable stay while being surrounded by nature."}
                                </p>
                                <Button
                                    variant="ghost"
                                    className="p-0 h-auto font-semibold underline"
                                >
                                    Show more
                                </Button>
                            </div>
                            <Separator className="mb-6" />
                        </div>

                        <LocalCoupons coupons={mockCoupons} />
                        <Separator className="my-10" />
                        {property.experiences && <>
                            <FreeExperiences experiences={property.experiences} />
                            <Separator className="my-10" />
                        </>}
                        

                        {/* Amenities */}
                        <Amenities amenities={amenities} />
                        <Separator className="mb-8" />

                        {/* Calendar */}
                        <div className="mb-10">
                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                <Gift className="h-7 w-7 text-cyan-600" />
                                <span>Select check-in date</span>
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Add your travel dates for exact pricing
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={setCheckInDate}
                                    className="rounded-md border w-full"
                                    disabled={(date) => date < new Date()}
                                />
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={setCheckOutDate}
                                    className="rounded-md border w-full"
                                    disabled={(date) =>
                                        date < new Date() ||
                                        (checkInDate && date <= checkInDate)
                                    }
                                />
                            </div>
                        </div>
                        <Separator className="mb-8" />
                        
                        {/* Reviews */}
                        {property.reviews && <>
                            <Reviews reviews={property.reviews} />
                            <Separator className="mb-8" />
                        </>}
                        

                        {/* Location */}
                        <Location location={property.location} />
                        <Separator className="mb-8" />

                        {/* Host */}
                        <MeetHost host_id={property.host_id} />
                        <Separator className="mb-8" />

                        {/* Things to Know */}
                        <div>
                            <h2 className="text-xl font-semibold mb-6">
                                Things to know
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3">
                                        House rules
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>Check-in: 3:00 PM - 9:00 PM</li>
                                        <li>Checkout: 11:00 AM</li>
                                        <li>{property.max_guests} guests maximum</li>
                                        <li>No smoking</li>
                                        <li>No pets</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3">
                                        Safety & property
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>Smoke alarm</li>
                                        <li>Carbon monoxide alarm</li>
                                        <li>Fire extinguisher</li>
                                        <li>First aid kit</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3">
                                        Cancellation policy
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>Free cancellation for 48 hours</li>
                                        <li>
                                            Review the Host's full cancellation
                                            policy which applies even if you
                                            cancel for illness or disruptions
                                            caused by COVID-19.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <Card
                            className={`sticky transition-all duration-300 ${
                                showStickyNav ? "top-32" : "top-24"
                            }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-baseline space-x-1 mb-4">
                                    <span className="text-2xl font-semibold">
                                        ${pricePerNight}
                                    </span>
                                    <span className="text-gray-600">night</span>
                                </div>

                                <div className="border rounded-lg mb-4">
                                    <div className="grid grid-cols-2">
                                        <Popover
                                            open={isCheckInCalendarOpen}
                                            onOpenChange={
                                                setIsCheckInCalendarOpen
                                            }
                                        >
                                            <PopoverTrigger asChild>
                                                <div className="p-3 border-r cursor-pointer hover:bg-gray-50">
                                                    <div className="text-xs font-semibold">
                                                        CHECK-IN
                                                    </div>
                                                    <div className="text-sm">
                                                        {formatDate(
                                                            checkInDate
                                                        )}
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={checkInDate}
                                                    onSelect={(date) => {
                                                        setCheckInDate(date);
                                                        setIsCheckInCalendarOpen(
                                                            false
                                                        );
                                                        if (
                                                            checkOutDate &&
                                                            date &&
                                                            date >= checkOutDate
                                                        ) {
                                                            setCheckOutDate(
                                                                undefined
                                                            );
                                                        }
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover
                                            open={isCheckOutCalendarOpen}
                                            onOpenChange={
                                                setIsCheckOutCalendarOpen
                                            }
                                        >
                                            <PopoverTrigger asChild>
                                                <div className="p-3 cursor-pointer hover:bg-gray-50">
                                                    <div className="text-xs font-semibold">
                                                        CHECK-OUT
                                                    </div>
                                                    <div className="text-sm">
                                                        {formatDate(
                                                            checkOutDate
                                                        )}
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
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
                                    <Popover
                                        open={isGuestDropdownOpen}
                                        onOpenChange={setIsGuestDropdownOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <div className="p-3 border-t cursor-pointer hover:bg-gray-50 flex justify-between items-center">
                                                <div>
                                                    <div className="text-xs font-semibold">
                                                        GUESTS
                                                    </div>
                                                    <div className="text-sm">
                                                        {totalGuests} guest
                                                        {totalGuests !== 1
                                                            ? "s"
                                                            : ""}
                                                        {infants > 0 &&
                                                            `, ${infants} infant${
                                                                infants !== 1
                                                                    ? "s"
                                                                    : ""
                                                            }`}
                                                        {pets > 0 &&
                                                            `, ${pets} pet${
                                                                pets !== 1
                                                                    ? "s"
                                                                    : ""
                                                            }`}
                                                    </div>
                                                </div>
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
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
                                                                        1,
                                                                        adults -
                                                                            1
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                adults <= 1
                                                            }
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
                                                                    Math.min(
                                                                        maxGuests -
                                                                            children,
                                                                        adults +
                                                                            1
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                totalGuests >=
                                                                maxGuests
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
                                                                        children -
                                                                            1
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                children <= 0
                                                            }
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
                                                                    Math.min(
                                                                        maxGuests -
                                                                            adults,
                                                                        children +
                                                                            1
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                totalGuests >=
                                                                maxGuests
                                                            }
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-medium">
                                                            Infants
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Under 2
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-8 h-8 rounded-full p-0"
                                                            onClick={() =>
                                                                setInfants(
                                                                    Math.max(
                                                                        0,
                                                                        infants -
                                                                            1
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                infants <= 0
                                                            }
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center">
                                                            {infants}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-8 h-8 rounded-full p-0"
                                                            onClick={() =>
                                                                setInfants(
                                                                    infants + 1
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
                                                            Pets
                                                        </div>
                                                        <div className="text-sm text-gray-600 underline cursor-pointer">
                                                            Bringing a service
                                                            animal?
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-8 h-8 rounded-full p-0"
                                                            onClick={() =>
                                                                setPets(
                                                                    Math.max(
                                                                        0,
                                                                        pets - 1
                                                                    )
                                                                )
                                                            }
                                                            disabled={pets <= 0}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center">
                                                            {pets}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-8 h-8 rounded-full p-0"
                                                            onClick={() =>
                                                                setPets(
                                                                    pets + 1
                                                                )
                                                            }
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {totalGuests > maxGuests && (
                                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                                        This place has a maximum
                                                        of {maxGuests} guests,
                                                        not including infants.
                                                        If you're bringing more
                                                        than 2 pets, please let
                                                        your host know.
                                                    </div>
                                                )}

                                                <div className="flex justify-end pt-2">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setIsGuestDropdownOpen(
                                                                false
                                                            )
                                                        }
                                                        className="underline"
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 mb-4" onClick={handleReserve}>
                                    Reserve
                                </Button>

                                <div className="text-center text-sm text-gray-600 mb-4">
                                    You won't be charged yet
                                </div>

                                {nights > 0 && (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="underline">
                                                ${pricePerNight.toFixed(2)} x {nights}{" "}
                                                night{nights !== 1 ? "s" : ""}
                                            </span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="underline">
                                                Cleaning fee
                                            </span>
                                            <span>${cleaningFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="underline">
                                                Service fee
                                            </span>
                                            <span>${serviceFee.toFixed(2)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total before taxes</span>
                                            <span>${totalBeforeTaxes.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
