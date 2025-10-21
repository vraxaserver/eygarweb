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
  Upload,
} from "lucide-react";

import { LocalCoupons } from "@/components/property/LocalCoupons";
import FreeExperiences from "@/components/property/FreeExperiences";
import Location from "@/components/property/Location";
import MeetHost from "@/components/property/MeetHost";
import Reviews from "@/components/property/Reviews";
import Amenities from "@/components/property/Amenities";

import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

import { mockCoupons, mockExperiences } from "@/data/properties";

export default function PropertyDetailsClient({ property }) {
  console.log("property: ", property)
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

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };

  const nights = calculateNights();
  const pricePerNight = property.price_per_night;
  const cleaningFee = property.cleaning_fee;
  const serviceFee = property.service_fee;
  const subtotal = nights * pricePerNight;
  const totalBeforeTaxes = subtotal + cleaningFee + serviceFee;
  const totalGuests = adults + children;
  const maxGuests = property.max_guests;

  const formatDate = (date) => {
    if (!date) return "Add date";
    return date.toLocaleDateString("en-US", {
      month: "short",
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
        const scrollPosition = window.scrollY + 80;

        setShowStickyNav(scrollPosition >= photoSectionBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const handleReserve = () => {
    if (isAuthenticated) {
      router.push(`/checkout/${property.id}`);
    } else {
      router.push(`/login?from=/properties/${property.id}`);
    }
  };

  const images = property.images;
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
    { icon: <Coffee className="w-6 h-6" />, name: "Kitchen", available: true },
    { icon: <Waves className="w-6 h-6" />, name: "Pool", available: true },
    { icon: <Dumbbell className="w-6 h-6" />, name: "Gym", available: false },
    {
      icon: <Utensils className="w-6 h-6" />,
      name: "BBQ grill",
      available: true,
    },
  ];
  const reviews = [
    {
      id: 1,
      author: "Sarah",
      avatar: "...",
      date: "October 2024",
      rating: 5,
      comment: "Amazing stay!...",
    },
    {
      id: 2,
      author: "Michael",
      avatar: "...",
      date: "September 2024",
      rating: 5,
      comment: "Great experience!...",
    },
  ];

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
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Photos
            </button>
            <button
              onClick={() => scrollToSection("amenities")}
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Amenities
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Location
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            {property.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-current text-black mr-1" />
                <span className="font-semibold">{property.average_rating}</span>
              </div>
              <span>•</span>
              <button className="underline hover:text-gray-600">
                {property.total_reviews} reviews
              </button>
              <span>•</span>
              <button className="underline hover:text-gray-600">
                {property.location.city}, {property.location.country}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg hover:bg-gray-100"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg hover:bg-gray-100"
              >
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery ref={photoSectionRef} images={images} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="pb-8 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    {property.property_type} hosted by{" "}
                    {property.host_name || "Host"}
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>{property.max_guests} guests</span>
                    <span>•</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>•</span>
                    <span>{property.beds || property.bedrooms} beds</span>
                    <span>•</span>
                    <span>{property.bathrooms} baths</span>
                  </div>
                </div>
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={`http://127.0.0.1:8000${property.host_avatar}`}
                  />
                  <AvatarFallback>
                    {property.host_name?.charAt(0) || "H"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Property Highlights */}
            <div className="py-8 space-y-6 border-b">
              <div className="flex items-start space-x-4">
                <Home className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Entire {property.property_type.toLowerCase()}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    You'll have the {property.property_type.toLowerCase()} to
                    yourself
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Enhanced Clean
                  </h3>
                  <p className="text-gray-600 text-sm">
                    This host is committed to enhanced cleaning process
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CalendarIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Free cancellation before check-in
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get a full refund if you change your mind
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold underline mt-4"
              >
                Show more
              </Button>
            </div>

            {/* Local Coupons */}
            <div className="py-8 border-b">
              <LocalCoupons coupons={mockCoupons} />
            </div>

            {/* Free Experiences */}
            <div className="py-8 border-b">
              <FreeExperiences experiences={mockExperiences} />
            </div>

            {/* Amenities */}
            <div id="amenities" className="py-8 border-b">
              <Amenities amenities={amenities} />
            </div>

            {/* Reviews */}
            <div id="reviews" className="py-8 border-b">
              <Reviews reviews={reviews} />
            </div>

            {/* Location */}
            <div id="location" className="py-8 border-b">
              <Location />
            </div>

            {/* Meet the Host */}
            <div className="py-8">
              <MeetHost
                hostName={property.host_name}
                hostAvatar={property.host_avatar}
                hostJoinDate={property.host_join_date}
              />
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div
              className={`sticky transition-all duration-300 ${
                showStickyNav ? "top-32" : "top-24"
              }`}
            >
              <Card className="shadow-xl border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="flex items-baseline space-x-1 mb-6">
                    <span className="text-2xl font-semibold">
                      ${property.price_per_night}
                    </span>
                    <span className="text-gray-600">night</span>
                  </div>

                  {/* Date and Guest Selectors */}
                  <div className="border border-gray-400 rounded-lg mb-4">
                    {/* Check-in and Check-out */}
                    <div className="grid grid-cols-2">
                      <Popover
                        open={isCheckInCalendarOpen}
                        onOpenChange={setIsCheckInCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <button className="text-left p-3 border-r border-b border-gray-400 hover:bg-gray-50 rounded-tl-lg">
                            <div className="text-xs font-semibold uppercase">
                              Check-in
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(checkInDate)}
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
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

                      <Popover
                        open={isCheckOutCalendarOpen}
                        onOpenChange={setIsCheckOutCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <button className="text-left p-3 border-b border-gray-400 hover:bg-gray-50 rounded-tr-lg">
                            <div className="text-xs font-semibold uppercase">
                              Checkout
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(checkOutDate)}
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={(date) => {
                              setCheckOutDate(date);
                              setIsCheckOutCalendarOpen(false);
                            }}
                            disabled={(date) =>
                              date < (checkInDate || new Date())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Guests Selector */}
                    <Popover
                      open={isGuestDropdownOpen}
                      onOpenChange={setIsGuestDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-b-lg flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold uppercase">
                              Guests
                            </div>
                            <div className="text-sm text-gray-600">
                              {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
                              {(infants > 0 || pets > 0) && (
                                <span>
                                  {infants > 0 && `, ${infants} infant${infants !== 1 ? "s" : ""}`}
                                  {pets > 0 && `, ${pets} pet${pets !== 1 ? "s" : ""}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96" align="end">
                        <div className="space-y-4">
                          {/* Adults */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">Adults</div>
                              <div className="text-sm text-gray-600">
                                Age 13+
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() =>
                                  setAdults(Math.max(1, adults - 1))
                                }
                                disabled={adults <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{adults}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() =>
                                  setAdults(Math.min(maxGuests, adults + 1))
                                }
                                disabled={totalGuests >= maxGuests}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">Children</div>
                              <div className="text-sm text-gray-600">
                                Ages 2-12
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() =>
                                  setChildren(Math.max(0, children - 1))
                                }
                                disabled={children <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">
                                {children}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() => setChildren(children + 1)}
                                disabled={totalGuests >= maxGuests}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Infants */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">Infants</div>
                              <div className="text-sm text-gray-600">
                                Under 2
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() =>
                                  setInfants(Math.max(0, infants - 1))
                                }
                                disabled={infants <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{infants}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() => setInfants(infants + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Pets */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">Pets</div>
                              <div className="text-sm text-gray-600">
                                Bringing a service animal?
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() => setPets(Math.max(0, pets - 1))}
                                disabled={pets <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{pets}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={() => setPets(pets + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {totalGuests >= maxGuests && (
                            <p className="text-sm text-gray-600">
                              This place has a maximum of {maxGuests} guests,
                              not including infants.
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Reserve Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg mb-4"
                    size="lg"
                    onClick={handleReserve}
                  >
                    Reserve
                  </Button>

                  <p className="text-center text-sm text-gray-600 mb-6">
                    You won't be charged yet
                  </p>

                  {/* Price Breakdown */}
                  {nights > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="underline">
                          ${pricePerNight} × {nights} night
                          {nights !== 1 ? "s" : ""}
                        </span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="underline">Cleaning fee</span>
                        <span>${cleaningFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="underline">Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between font-semibold">
                        <span>Total before taxes</span>
                        <span>${totalBeforeTaxes}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Report listing */}
              <div className="mt-6 text-center">
                <Button variant="link" className="text-gray-600 underline">
                  <span className="flex items-center">
                    <Upload className="w-4 h-4 mr-1" />
                    Report this listing
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}