"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Home,
    Calendar,
    Users,
    Star,
    TrendingUp,
    DollarSign,
    Eye,
    Edit,
    Trash2,
    Plus,
    MessageSquare,
    Bell,
    Settings,
    BarChart3,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    Camera,
    Wifi,
    Car,
    Coffee,
    Menu,
    X,
} from "lucide-react";

export default function HostDashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const stats = [
        {
            title: "Total Earnings",
            value: "$12,450",
            change: "+12%",
            icon: <DollarSign className="w-6 h-6" />,
        },
        {
            title: "Active Listings",
            value: "8",
            change: "+2",
            icon: <Home className="w-6 h-6" />,
        },
        {
            title: "Total Bookings",
            value: "156",
            change: "+8%",
            icon: <Calendar className="w-6 h-6" />,
        },
        {
            title: "Average Rating",
            value: "4.9",
            change: "+0.1",
            icon: <Star className="w-6 h-6" />,
        },
    ];

    const properties = [
        {
            id: 1,
            title: "Cozy Tiny House in Georgia",
            location: "Nokiiska, Georgia",
            image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
            price: 67,
            rating: 4.98,
            reviews: 54,
            status: "active",
            bookings: 12,
            earnings: "$2,340",
        },
        {
            id: 2,
            title: "Modern Loft Downtown",
            location: "Atlanta, Georgia",
            image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=400",
            price: 120,
            rating: 4.85,
            reviews: 32,
            status: "active",
            bookings: 8,
            earnings: "$1,890",
        },
        {
            id: 3,
            title: "Lakeside Cabin Retreat",
            location: "Blue Ridge, Georgia",
            image: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400",
            price: 95,
            rating: 4.92,
            reviews: 28,
            status: "draft",
            bookings: 0,
            earnings: "$0",
        },
    ];

    const upcomingBookings = [
        {
            id: 1,
            guest: "Sarah Johnson",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
            property: "Cozy Tiny House",
            checkIn: "2025-01-15",
            checkOut: "2025-01-18",
            guests: 2,
            status: "confirmed",
            total: "$234",
        },
        {
            id: 2,
            guest: "Michael Chen",
            avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100",
            property: "Modern Loft Downtown",
            checkIn: "2025-01-20",
            checkOut: "2025-01-25",
            guests: 4,
            status: "pending",
            total: "$600",
        },
        {
            id: 3,
            guest: "Emma Wilson",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
            property: "Cozy Tiny House",
            checkIn: "2025-01-28",
            checkOut: "2025-02-02",
            guests: 2,
            status: "confirmed",
            total: "$335",
        },
    ];

    const ongoingBookings = [
        {
            id: 1,
            guest: "David Rodriguez",
            avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
            property: "Modern Loft Downtown",
            checkIn: "2025-01-10",
            checkOut: "2025-01-14",
            guests: 3,
            status: "checked-in",
            total: "$480",
        },
    ];

    const experiences = [
        {
            id: 1,
            title: "Georgia Wine Tasting Tour",
            location: "North Georgia Mountains",
            image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
            price: 85,
            duration: "4 hours",
            rating: 4.9,
            reviews: 23,
            status: "active",
        },
        {
            id: 2,
            title: "Hiking & Photography Workshop",
            location: "Blue Ridge Mountains",
            image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=400",
            price: 65,
            duration: "6 hours",
            rating: 4.8,
            reviews: 15,
            status: "draft",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "draft":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-orange-100 text-orange-800";
            case "checked-in":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
                return <CheckCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "checked-in":
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="hidden md:block">
                    <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800"
                    >
                        Host Dashboard
                    </Badge>
                </div>
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, Melanie!
                    </h1>
                    <p className="text-gray-600">
                        Manage your properties, bookings, and guest experiences
                        all in one place.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-4 md:p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-purple-600">
                                        {stat.icon}
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-gray-600">
                                    {stat.title}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Dashboard Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
                        <TabsTrigger
                            value="overview"
                            className="text-xs md:text-sm"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="properties"
                            className="text-xs md:text-sm"
                        >
                            Properties
                        </TabsTrigger>
                        <TabsTrigger
                            value="bookings"
                            className="text-xs md:text-sm"
                        >
                            Bookings
                        </TabsTrigger>
                        <TabsTrigger
                            value="guests"
                            className="text-xs md:text-sm"
                        >
                            Guests
                        </TabsTrigger>
                        <TabsTrigger
                            value="experiences"
                            className="text-xs md:text-sm"
                        >
                            Experiences
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="text-xs md:text-sm"
                        >
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Bookings */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">
                                        Recent Bookings
                                    </CardTitle>
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {upcomingBookings
                                        .slice(0, 3)
                                        .map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage
                                                        src={booking.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        {booking.guest[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm truncate">
                                                        {booking.guest}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {booking.property}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(
                                                            booking.checkIn
                                                        ).toLocaleDateString()}{" "}
                                                        -{" "}
                                                        {new Date(
                                                            booking.checkOut
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-sm">
                                                        {booking.total}
                                                    </div>
                                                    <Badge
                                                        className={`text-xs ${getStatusColor(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <Button className="h-20 flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
                                        <Plus className="w-6 h-6" />
                                        <span className="text-sm">
                                            Add Property
                                        </span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-20 flex-col space-y-2"
                                    >
                                        <Calendar className="w-6 h-6" />
                                        <span className="text-sm">
                                            Manage Calendar
                                        </span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-20 flex-col space-y-2"
                                    >
                                        <MessageSquare className="w-6 h-6" />
                                        <span className="text-sm">
                                            Message Guests
                                        </span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-20 flex-col space-y-2"
                                    >
                                        <BarChart3 className="w-6 h-6" />
                                        <span className="text-sm">
                                            View Analytics
                                        </span>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Performance Chart Placeholder */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Earnings Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600">
                                            Earnings chart will be displayed
                                            here
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Properties Tab */}
                    <TabsContent value="properties" className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <h2 className="text-xl font-semibold">
                                Your Properties
                            </h2>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Property
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <Card
                                    key={property.id}
                                    className="group hover:shadow-lg transition-all"
                                >
                                    <CardContent className="p-0">
                                        <div className="relative">
                                            <img
                                                src={property.image}
                                                alt={property.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <Badge
                                                className={`absolute top-3 left-3 ${getStatusColor(
                                                    property.status
                                                )}`}
                                            >
                                                {property.status}
                                            </Badge>
                                            <div className="absolute top-3 right-3 flex space-x-1">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0 text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                {property.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {property.location}
                                            </p>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                                                    <span className="text-sm font-medium">
                                                        {property.rating}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        ({property.reviews})
                                                    </span>
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    ${property.price}/night
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                                <div>
                                                    <div className="font-medium">
                                                        {property.bookings}{" "}
                                                        bookings
                                                    </div>
                                                    <div>This month</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {property.earnings}
                                                    </div>
                                                    <div>Total earnings</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Bookings Tab */}
                    <TabsContent value="bookings" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Ongoing Bookings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                        Ongoing Bookings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {ongoingBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage
                                                            src={booking.avatar}
                                                        />
                                                        <AvatarFallback>
                                                            {booking.guest[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {booking.guest}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {booking.property}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge
                                                    className={getStatusColor(
                                                        booking.status
                                                    )}
                                                >
                                                    {getStatusIcon(
                                                        booking.status
                                                    )}
                                                    <span className="ml-1">
                                                        {booking.status}
                                                    </span>
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="text-gray-600">
                                                        Check-in
                                                    </div>
                                                    <div className="font-medium">
                                                        {new Date(
                                                            booking.checkIn
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Check-out
                                                    </div>
                                                    <div className="font-medium">
                                                        {new Date(
                                                            booking.checkOut
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Guests
                                                    </div>
                                                    <div className="font-medium">
                                                        {booking.guests} guests
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Total
                                                    </div>
                                                    <div className="font-medium">
                                                        {booking.total}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <MessageSquare className="w-4 h-4 mr-1" />
                                                    Message
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Upcoming Bookings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                        Upcoming Bookings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {upcomingBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage
                                                            src={booking.avatar}
                                                        />
                                                        <AvatarFallback>
                                                            {booking.guest[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {booking.guest}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {booking.property}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge
                                                    className={getStatusColor(
                                                        booking.status
                                                    )}
                                                >
                                                    {getStatusIcon(
                                                        booking.status
                                                    )}
                                                    <span className="ml-1">
                                                        {booking.status}
                                                    </span>
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="text-gray-600">
                                                        Check-in
                                                    </div>
                                                    <div className="font-medium">
                                                        {new Date(
                                                            booking.checkIn
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Check-out
                                                    </div>
                                                    <div className="font-medium">
                                                        {new Date(
                                                            booking.checkOut
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Guests
                                                    </div>
                                                    <div className="font-medium">
                                                        {booking.guests} guests
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Total
                                                    </div>
                                                    <div className="font-medium">
                                                        {booking.total}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <MessageSquare className="w-4 h-4 mr-1" />
                                                    Message
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                                                >
                                                    Approve
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Properties Management Tab */}
                    <TabsContent value="properties" className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    Property Management
                                </h2>
                                <p className="text-gray-600">
                                    Manage your listings, pricing, and
                                    availability
                                </p>
                            </div>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Property
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <Card
                                    key={property.id}
                                    className="group hover:shadow-lg transition-all"
                                >
                                    <CardContent className="p-0">
                                        <div className="relative">
                                            <img
                                                src={property.image}
                                                alt={property.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <Badge
                                                className={`absolute top-3 left-3 ${getStatusColor(
                                                    property.status
                                                )}`}
                                            >
                                                {property.status}
                                            </Badge>
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0 text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                {property.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {property.location}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                <div>
                                                    <div className="text-gray-600">
                                                        Rating
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 fill-current text-yellow-500 mr-1" />
                                                        <span className="font-medium">
                                                            {property.rating}
                                                        </span>
                                                        <span className="text-gray-500 ml-1">
                                                            ({property.reviews})
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Price
                                                    </div>
                                                    <div className="font-semibold">
                                                        ${property.price}/night
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Bookings
                                                    </div>
                                                    <div className="font-medium">
                                                        {property.bookings} this
                                                        month
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-600">
                                                        Earnings
                                                    </div>
                                                    <div className="font-medium text-green-600">
                                                        {property.earnings}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    Calendar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Bookings Tab */}
                    <TabsContent value="bookings" className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            Booking Management
                        </h2>

                        <Tabs defaultValue="upcoming" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="upcoming">
                                    Upcoming
                                </TabsTrigger>
                                <TabsTrigger value="ongoing">
                                    Ongoing
                                </TabsTrigger>
                                <TabsTrigger value="past">Past</TabsTrigger>
                                <TabsTrigger value="cancelled">
                                    Cancelled
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="upcoming" className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <Card key={booking.id}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarImage
                                                            src={booking.avatar}
                                                        />
                                                        <AvatarFallback>
                                                            {booking.guest[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {booking.guest}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {booking.property}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(
                                                                booking.checkIn
                                                            ).toLocaleDateString()}{" "}
                                                            -{" "}
                                                            {new Date(
                                                                booking.checkOut
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <div className="font-semibold">
                                                            {booking.total}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {booking.guests}{" "}
                                                            guests
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        className={getStatusColor(
                                                            booking.status
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            booking.status
                                                        )}
                                                        <span className="ml-1">
                                                            {booking.status}
                                                        </span>
                                                    </Badge>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <MessageSquare className="w-4 h-4 mr-1" />
                                                            Message
                                                        </Button>
                                                        {booking.status ===
                                                            "pending" && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-purple-600 hover:bg-purple-700"
                                                            >
                                                                Approve
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="ongoing" className="space-y-4">
                                {ongoingBookings.map((booking) => (
                                    <Card key={booking.id}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarImage
                                                            src={booking.avatar}
                                                        />
                                                        <AvatarFallback>
                                                            {booking.guest[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {booking.guest}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {booking.property}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(
                                                                booking.checkIn
                                                            ).toLocaleDateString()}{" "}
                                                            -{" "}
                                                            {new Date(
                                                                booking.checkOut
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <div className="font-semibold">
                                                            {booking.total}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {booking.guests}{" "}
                                                            guests
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        className={getStatusColor(
                                                            booking.status
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            booking.status
                                                        )}
                                                        <span className="ml-1">
                                                            checked-in
                                                        </span>
                                                    </Badge>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <MessageSquare className="w-4 h-4 mr-1" />
                                                            Message
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Check Out
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    {/* Guests Tab */}
                    <TabsContent value="guests" className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            Guest Management
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...upcomingBookings, ...ongoingBookings].map(
                                (booking) => (
                                    <Card
                                        key={booking.id}
                                        className="hover:shadow-lg transition-shadow"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <Avatar className="w-12 h-12">
                                                    <AvatarImage
                                                        src={booking.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        {booking.guest[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold">
                                                        {booking.guest}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {booking.guests} guests
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm mb-4">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Property:
                                                    </span>
                                                    <span className="font-medium">
                                                        {booking.property}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Dates:
                                                    </span>
                                                    <span className="font-medium">
                                                        {new Date(
                                                            booking.checkIn
                                                        ).toLocaleDateString()}{" "}
                                                        -{" "}
                                                        {new Date(
                                                            booking.checkOut
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Status:
                                                    </span>
                                                    <Badge
                                                        className={`text-xs ${getStatusColor(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <MessageSquare className="w-4 h-4 mr-1" />
                                                    Message
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Profile
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            )}
                        </div>
                    </TabsContent>

                    {/* Experiences Tab */}
                    <TabsContent value="experiences" className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    Experience Management
                                </h2>
                                <p className="text-gray-600">
                                    Create and manage unique experiences for
                                    your guests
                                </p>
                            </div>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Experience
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {experiences.map((experience) => (
                                <Card
                                    key={experience.id}
                                    className="group hover:shadow-lg transition-all"
                                >
                                    <CardContent className="p-0">
                                        <div className="relative">
                                            <img
                                                src={experience.image}
                                                alt={experience.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <Badge
                                                className={`absolute top-3 left-3 ${getStatusColor(
                                                    experience.status
                                                )}`}
                                            >
                                                {experience.status}
                                            </Badge>
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-8 h-8 p-0 text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                {experience.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {experience.location}
                                            </p>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                                                    <span className="text-sm font-medium">
                                                        {experience.rating}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        ({experience.reviews})
                                                    </span>
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    ${experience.price}/person
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                                                <div className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {experience.duration}
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            Analytics & Insights
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Revenue Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <p className="text-gray-600">
                                                Revenue chart will be displayed
                                                here
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Booking Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <p className="text-gray-600">
                                                Booking trends chart will be
                                                displayed here
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">
                                        89%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Occupancy Rate
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                        4.9
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Avg Rating
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                        24h
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Response Time
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600 mb-1">
                                        92%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Guest Satisfaction
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
