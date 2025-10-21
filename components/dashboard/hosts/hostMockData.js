import { Home, Calendar, Star, DollarSign, MessageSquare, Bell, Settings } from "lucide-react";

export const stats = [
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

export const properties = [
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

export const upcomingBookings = [
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

export const ongoingBookings = [
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

export const experiences = [
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
