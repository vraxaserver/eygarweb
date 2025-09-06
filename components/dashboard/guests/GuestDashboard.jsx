import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCard } from "@/components/dashboard/guests/BookingCard";
import { BookingDetail } from "@/components/dashboard/guests/BookingDetails";
import { Calendar, History, User } from "lucide-react";

const mockBookings = [
    {
        id: "1",
        checkIn: "2024-12-25",
        checkOut: "2024-12-30",
        guests: 4,
        totalPrice: 1250,
        status: "confirmed",
        property: {
            id: "prop1",
            name: "Luxury Mountain Cabin",
            location: "Aspen, Colorado",
            image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=500",
            rating: 4.9,
            reviews: 128,
            amenities: [
                "WiFi",
                "Parking",
                "Kitchen",
                "Hot Tub",
                "Fireplace",
                "Mountain View",
            ],
            description:
                "Experience luxury in this stunning mountain cabin featuring panoramic views, modern amenities, and cozy mountain charm. Perfect for families or groups seeking an unforgettable mountain getaway.",
            rules: [
                {
                    type: "safety",
                    title: "No Smoking",
                    description:
                        "Smoking is strictly prohibited inside the property",
                },
                {
                    type: "house",
                    title: "Pets Welcome",
                    description:
                        "Well-behaved pets are welcome with prior approval",
                },
                {
                    type: "time",
                    title: "Quiet Hours",
                    description: "Please keep noise to minimum after 10 PM",
                },
            ],
        },
        host: {
            id: "host1",
            name: "Michael Thompson",
            avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
            rating: 4.8,
            reviewCount: 89,
            memberSince: "2019",
            bio: "Outdoor enthusiast and local mountain guide. Love sharing the beauty of Aspen with guests and helping them create unforgettable memories.",
            languages: ["English", "Spanish"],
            phone: "+1 (555) 123-4567",
            email: "michael@mountaincabin.com",
            experiences: [
                {
                    id: "exp1",
                    name: "Guided Mountain Hike",
                    description:
                        "Explore hidden trails with breathtaking views. Suitable for all fitness levels.",
                    image: "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "3-4 hours",
                    maxParticipants: 6,
                    location: "Starting from cabin",
                    isEligible: true,
                    requirements: "Minimum 3 nights stay",
                },
                {
                    id: "exp2",
                    name: "Local Food Tour",
                    description:
                        "Discover Aspen's culinary gems with insider recommendations.",
                    image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "2-3 hours",
                    maxParticipants: 4,
                    location: "Downtown Aspen",
                    isEligible: true,
                    requirements: "Available for stays 5+ nights",
                },
                {
                    id: "exp3",
                    name: "Stargazing Experience",
                    description:
                        "Clear mountain skies perfect for astronomy enthusiasts.",
                    image: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "1-2 hours",
                    maxParticipants: 8,
                    location: "Cabin deck",
                    isEligible: false,
                    requirements: "Available winter months only",
                },
            ],
        },
        availableCoupons: [
            {
                id: "coupon1",
                title: "Early Bird Special",
                description:
                    "Get discount on your next booking when you book 60 days in advance.",
                code: "EARLY60",
                discountType: "percentage",
                discountValue: 15,
                expiryDate: "2025-03-31",
                isUsed: false,
                minSpend: 500,
            },
            {
                id: "coupon2",
                title: "Loyalty Reward",
                description:
                    "Thank you for being a returning guest! Enjoy this special discount.",
                code: "LOYALTY25",
                discountType: "fixed",
                discountValue: 100,
                expiryDate: "2025-02-15",
                isUsed: false,
                minSpend: 800,
            },
        ],
    },
    {
        id: "2",
        checkIn: "2025-01-15",
        checkOut: "2025-01-20",
        guests: 2,
        totalPrice: 875,
        status: "confirmed",
        property: {
            id: "prop2",
            name: "Oceanview Beach House",
            location: "Malibu, California",
            image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=500",
            rating: 4.7,
            reviews: 94,
            amenities: [
                "WiFi",
                "Pool",
                "Kitchen",
                "Beach Access",
                "Parking",
                "Air Conditioning",
            ],
            description:
                "Wake up to stunning ocean views in this modern beach house. Direct beach access, private pool, and all the amenities you need for the perfect beach vacation.",
            rules: [
                {
                    type: "safety",
                    title: "Pool Safety",
                    description:
                        "Children must be supervised around the pool area at all times",
                },
                {
                    type: "house",
                    title: "No Parties",
                    description: "Events and parties are not permitted",
                },
                {
                    type: "time",
                    title: "Beach Access Hours",
                    description: "Private beach access available 6 AM - 8 PM",
                },
            ],
        },
        host: {
            id: "host2",
            name: "Sofia Martinez",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
            rating: 4.9,
            reviewCount: 156,
            memberSince: "2018",
            bio: "Beach lover and hospitality expert. I own several properties along the coast and love helping guests experience the best of California beaches.",
            languages: ["English", "Spanish", "French"],
            phone: "+1 (555) 987-6543",
            email: "sofia@beachhouse.com",
            experiences: [
                {
                    id: "exp4",
                    name: "Surf Lesson",
                    description:
                        "Learn to surf with professional instructor on our private beach.",
                    image: "https://images.pexels.com/photos/390051/surfer-wave-sunset-the-indian-ocean-390051.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "2 hours",
                    maxParticipants: 4,
                    location: "Private beach",
                    isEligible: true,
                    requirements: "Minimum 2 nights stay",
                },
                {
                    id: "exp5",
                    name: "Beach Picnic Setup",
                    description:
                        "Romantic beach picnic with gourmet food and sunset views.",
                    image: "https://images.pexels.com/photos/1482030/pexels-photo-1482030.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "3 hours",
                    maxParticipants: 2,
                    location: "Private beach",
                    isEligible: true,
                    requirements: "Available for couples",
                },
            ],
        },
        availableCoupons: [
            {
                id: "coupon3",
                title: "Summer Special",
                description:
                    "Save on summer bookings at any of our beach properties.",
                code: "SUMMER20",
                discountType: "percentage",
                discountValue: 20,
                expiryDate: "2025-08-31",
                isUsed: false,
                minSpend: 600,
            },
        ],
    },
    {
        id: "3",
        checkIn: "2024-10-15",
        checkOut: "2024-10-18",
        guests: 3,
        totalPrice: 540,
        status: "completed",
        property: {
            id: "prop3",
            name: "Downtown Loft",
            location: "New York, NY",
            image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=500",
            rating: 4.6,
            reviews: 203,
            amenities: [
                "WiFi",
                "Kitchen",
                "Workspace",
                "Laundry",
                "Gym Access",
            ],
            description:
                "Modern loft in the heart of downtown with easy access to restaurants, shopping, and public transportation. Perfect for business travelers and city explorers.",
            rules: [
                {
                    type: "house",
                    title: "No Smoking",
                    description: "This is a non-smoking property",
                },
                {
                    type: "time",
                    title: "Building Quiet Hours",
                    description: "Building quiet hours from 10 PM to 8 AM",
                },
            ],
        },
        host: {
            id: "host3",
            name: "David Chen",
            avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
            rating: 4.7,
            reviewCount: 67,
            memberSince: "2020",
            bio: "NYC local and real estate enthusiast. I love helping visitors discover the best the city has to offer.",
            languages: ["English", "Mandarin"],
            phone: "+1 (555) 456-7890",
            email: "david@nycloft.com",
            experiences: [
                {
                    id: "exp6",
                    name: "Broadway Show Tickets",
                    description:
                        "Discounted tickets to popular Broadway shows through host connections.",
                    image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "3 hours",
                    maxParticipants: 4,
                    location: "Theater District",
                    isEligible: false,
                    requirements: "Booking must be 7+ days",
                },
            ],
        },
        availableCoupons: [],
    },
    {
        id: "4",
        checkIn: "2025-02-10",
        checkOut: "2025-02-14",
        guests: 2,
        totalPrice: 680,
        status: "confirmed",
        property: {
            id: "prop4",
            name: "Cozy City Apartment",
            location: "Portland, Oregon",
            image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500",
            rating: 4.5,
            reviews: 76,
            amenities: [
                "WiFi",
                "Kitchen",
                "Workspace",
                "Bike Storage",
                "Coffee Machine",
            ],
            description:
                "Charming apartment in Portland's vibrant downtown. Walking distance to food trucks, breweries, and cultural attractions. Perfect for exploring the city.",
            rules: [
                {
                    type: "house",
                    title: "No Smoking",
                    description:
                        "Smoking is not allowed anywhere on the property",
                },
                {
                    type: "time",
                    title: "Check-in Instructions",
                    description:
                        "Self check-in available after 3 PM using keypad",
                },
            ],
        },
        host: {
            id: "host4",
            name: "Emma Wilson",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
            rating: 4.6,
            reviewCount: 42,
            memberSince: "2021",
            bio: "Portland native who loves sharing the city's unique culture with visitors. Coffee enthusiast and local food expert.",
            languages: ["English"],
            phone: "+1 (555) 234-5678",
            email: "emma@portlandstay.com",
            experiences: [
                {
                    id: "exp7",
                    name: "Food Cart Tour",
                    description:
                        "Explore Portland's famous food cart scene with insider recommendations.",
                    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "2-3 hours",
                    maxParticipants: 4,
                    location: "Various food cart pods",
                    isEligible: true,
                    requirements: "Available for all guests",
                },
                {
                    id: "exp8",
                    name: "Brewery Walking Tour",
                    description:
                        "Visit 3 local breweries and learn about Portland's craft beer culture.",
                    image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "4 hours",
                    maxParticipants: 6,
                    location: "Downtown Portland",
                    isEligible: true,
                    requirements: "Must be 21+ years old",
                },
            ],
        },
        availableCoupons: [
            {
                id: "coupon4",
                title: "Portland Explorer",
                description:
                    "Get 10% off your next Portland booking when you book within 30 days.",
                code: "PORTLAND10",
                discountType: "percentage",
                discountValue: 10,
                expiryDate: "2025-03-15",
                isUsed: false,
                minSpend: 300,
            },
        ],
    },
    {
        id: "5",
        checkIn: "2025-09-01",
        checkOut: "2025-09-05",
        guests: 6,
        totalPrice: 1890,
        status: "confirmed",
        property: {
            id: "prop5",
            name: "Lakeside Retreat",
            location: "Lake Tahoe, Nevada",
            image: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=500",
            rating: 4.8,
            reviews: 145,
            amenities: [
                "WiFi",
                "Kitchen",
                "Hot Tub",
                "Kayaks",
                "Fire Pit",
                "Lake Access",
                "Parking",
            ],
            description:
                "Stunning lakeside retreat with private dock and panoramic mountain views. Perfect for large groups seeking adventure and relaxation by the water.",
            rules: [
                {
                    type: "safety",
                    title: "Water Safety",
                    description:
                        "Life jackets required for all water activities",
                },
                {
                    type: "house",
                    title: "Pet Policy",
                    description: "Pets allowed with $50 cleaning fee",
                },
                {
                    type: "time",
                    title: "Fire Pit Hours",
                    description: "Fire pit use permitted until 11 PM",
                },
            ],
        },
        host: {
            id: "host5",
            name: "Robert & Lisa Johnson",
            avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150",
            rating: 4.9,
            reviewCount: 234,
            memberSince: "2017",
            bio: "Retired couple who love hosting families and groups at our lakeside property. We enjoy sharing our knowledge of the area and helping guests create lasting memories.",
            languages: ["English"],
            phone: "+1 (555) 345-6789",
            email: "johnson@lakeretreat.com",
            experiences: [
                {
                    id: "exp9",
                    name: "Guided Kayak Tour",
                    description:
                        "Explore hidden coves and pristine waters with our complimentary kayaks.",
                    image: "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "2-4 hours",
                    maxParticipants: 6,
                    location: "Private dock",
                    isEligible: true,
                    requirements: "Included with booking",
                },
                {
                    id: "exp10",
                    name: "Sunset Photography Session",
                    description:
                        "Professional photographer captures your group against stunning lake sunsets.",
                    image: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "1 hour",
                    maxParticipants: 8,
                    location: "Lakeside deck",
                    isEligible: true,
                    requirements: "Available for 5+ night stays",
                },
                {
                    id: "exp11",
                    name: "Mountain Hiking Guide",
                    description:
                        "Local trail recommendations and guided hikes to scenic viewpoints.",
                    image: "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "3-5 hours",
                    maxParticipants: 6,
                    location: "Various trailheads",
                    isEligible: false,
                    requirements: "Available summer months only",
                },
            ],
        },
        availableCoupons: [
            {
                id: "coupon5",
                title: "Group Discount",
                description:
                    "Special discount for groups of 6 or more guests on future bookings.",
                code: "GROUP15",
                discountType: "percentage",
                discountValue: 15,
                expiryDate: "2025-06-30",
                isUsed: false,
                minSpend: 1000,
            },
            {
                id: "coupon6",
                title: "Return Guest Bonus",
                description:
                    "Thank you for choosing us again! Enjoy this exclusive return guest offer.",
                code: "RETURN50",
                discountType: "fixed",
                discountValue: 50,
                expiryDate: "2025-04-30",
                isUsed: false,
                minSpend: 500,
            },
        ],
    },
    {
        id: "6",
        checkIn: "2025-09-18",
        checkOut: "2025-09-21",
        guests: 2,
        totalPrice: 420,
        status: "confirmed",
        property: {
            id: "prop6",
            name: "Historic Brownstone",
            location: "Boston, Massachusetts",
            image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=500",
            rating: 4.4,
            reviews: 89,
            amenities: [
                "WiFi",
                "Kitchen",
                "Fireplace",
                "Garden",
                "Parking",
                "Historic Character",
            ],
            description:
                "Beautiful 19th-century brownstone in historic Back Bay. Experience Boston's rich history while enjoying modern comforts in this charming neighborhood.",
            rules: [
                {
                    type: "house",
                    title: "Historic Property Care",
                    description:
                        "Please treat this historic property with extra care",
                },
                {
                    type: "time",
                    title: "Neighborhood Quiet Hours",
                    description: "Residential area - quiet hours 9 PM to 8 AM",
                },
                {
                    type: "safety",
                    title: "Fireplace Usage",
                    description:
                        "Fireplace available with host approval and safety briefing",
                },
            ],
        },
        host: {
            id: "host6",
            name: "Margaret O'Sullivan",
            avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
            rating: 4.7,
            reviewCount: 78,
            memberSince: "2019",
            bio: "Boston historian and longtime resident. I love sharing the stories and hidden gems of this wonderful city with my guests.",
            languages: ["English", "Irish Gaelic"],
            phone: "+1 (555) 567-8901",
            email: "margaret@bostonbrownstone.com",
            experiences: [
                {
                    id: "exp12",
                    name: "Freedom Trail Walking Tour",
                    description:
                        "Personal guided tour of Boston's famous Freedom Trail with historical insights.",
                    image: "https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "3 hours",
                    maxParticipants: 4,
                    location: "Starting from property",
                    isEligible: true,
                    requirements: "Available for all guests",
                },
                {
                    id: "exp13",
                    name: "Tea & History Session",
                    description:
                        "Afternoon tea with stories about the brownstone and neighborhood history.",
                    image: "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=300",
                    duration: "1 hour",
                    maxParticipants: 4,
                    location: "Property garden",
                    isEligible: true,
                    requirements: "Available upon request",
                },
            ],
        },
        availableCoupons: [
            {
                id: "coupon7",
                title: "History Buff Special",
                description:
                    "Discount for guests interested in Boston's rich historical heritage.",
                code: "HISTORY20",
                discountType: "percentage",
                discountValue: 20,
                expiryDate: "2025-07-04",
                isUsed: false,
                minSpend: 400,
            },
        ],
    },
];

export default function GuestDashboard() {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const upcomingBookings = mockBookings.filter(
        (booking) => new Date(booking.checkIn) > new Date()
    );
    const pastBookings = mockBookings.filter(
        (booking) => new Date(booking.checkOut) < new Date()
    );
    const activeBooking = mockBookings.find(
        (booking) =>
            new Date() >= new Date(booking.checkIn) &&
            new Date() <= new Date(booking.checkOut)
    );

    const handleBookingClick = (booking) => {
        setSelectedBooking(booking);
        setShowDetail(true);
    };

    const handleBackToDashboard = () => {
        setShowDetail(false);
        setSelectedBooking(null);
    };

    if (showDetail && selectedBooking) {
        return (
            <BookingDetail
                booking={selectedBooking}
                onBack={handleBackToDashboard}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-pink-600 rounded-lg p-2">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Guest Dashboard
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Welcome back, Sarah
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs
                    defaultValue={activeBooking ? "active" : "upcoming"}
                    className="w-full"
                >
                    <TabsList
                        className={`grid w-full ${
                            activeBooking ? "grid-cols-3" : "grid-cols-2"
                        } mb-8`}
                    >
                        {activeBooking && (
                            <TabsTrigger
                                value="active"
                                className="flex items-center space-x-2"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Active Booking</span>
                            </TabsTrigger>
                        )}
                        <TabsTrigger
                            value="upcoming"
                            className="flex items-center space-x-2"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Upcoming Bookings</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center space-x-2"
                        >
                            <History className="h-4 w-4" />
                            <span>Booking History</span>
                        </TabsTrigger>
                    </TabsList>

                    {activeBooking && (
                        <TabsContent value="active" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Current Stay
                                </h2>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                    Checked In
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 max-w-md">
                                <BookingCard
                                    booking={activeBooking}
                                    onClick={() =>
                                        handleBookingClick(activeBooking)
                                    }
                                    isActive={true}
                                />
                            </div>

                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-500 rounded-full p-2">
                                            <Calendar className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-800">
                                                Enjoy Your Stay!
                                            </h3>
                                            <p className="text-green-700 text-sm">
                                                You're currently checked in at{" "}
                                                {activeBooking.property.name}.
                                                Need assistance? Contact your
                                                host directly.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    <TabsContent value="upcoming" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Upcoming Trips
                            </h2>
                            <p className="text-gray-500">
                                {upcomingBookings.length} booking(s)
                            </p>
                        </div>

                        {upcomingBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No upcoming bookings
                                </h3>
                                <p className="text-gray-500">
                                    Your next adventure awaits!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onClick={() =>
                                            handleBookingClick(booking)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Booking History
                            </h2>
                            <p className="text-gray-500">
                                {pastBookings.length} booking(s)
                            </p>
                        </div>

                        {pastBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No booking history
                                </h3>
                                <p className="text-gray-500">
                                    Your travel memories will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onClick={() =>
                                            handleBookingClick(booking)
                                        }
                                        isPast={true}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
