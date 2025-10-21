export const mockProperties = {
    items: [
        {
            id: 1,
            title: "Private Room in Downtown Apartment",
            description:
                "Beautiful private room in the heart of the city with modern amenities and great access to public transportation.",
            property_type: "private-room",
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            price_per_night: 55,
            currency: "USD",
            location: {
                address: "123 Main Street",
                city: "New York",
                country: "United States",
                coordinates: {
                    lat: 40.7128,
                    lng: -74.006,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/7747514/pexels-photo-7747514.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/8083547/pexels-photo-8083547.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/5461590/pexels-photo-5461590.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchen", "Air conditioning", "Heating"],
            host: {
                id: "host-1",
                name: "Sarah Johnson",
                avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
                joinedDate: "2020-01-15",
                verificationBadges: ["Email", "Phone", "Government ID"],
                languages: ["English", "Spanish"],
                responseRate: 98,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.8,
            reviewCount: 127,
            safetyBadges: [
                "Enhanced Clean",
                "Self Check-in",
                "Carbon Monoxide Alarm",
            ],
            hasInsurance: true,
            coupons: [],
            experiences: [],
            availability: [],
            rules: ["No smoking", "No parties", "Check-in after 3 PM"],
            createdAt: "2023-01-15T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z",
        },
        {
            id: 2,
            title: "River Laune in Main st Killorglin Co Kerry",
            description:
                "Stunning riverside house with beautiful views and modern amenities.",
            property_type: "entire-home",
            bedrooms: 5,
            beds: 5,
            bathrooms: 3,
            maxGuests: 10,
            price_per_night: 750,
            currency: "USD",
            location: {
                address: "Main Street",
                city: "Killorglin",
                country: "Ireland",
                coordinates: {
                    lat: 52.1091,
                    lng: -9.7803,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/221024/pexels-photo-221024.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchen", "Parking", "Garden", "River access"],
            host: {
                id: "host-2",
                name: "Michael O'Connor",
                avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
                joinedDate: "2019-03-20",
                verificationBadges: ["Email", "Phone", "Government ID"],
                languages: ["English", "Irish"],
                responseRate: 95,
                responseTime: "within a few hours",
                isSuperhost: false,
            },
            rating: 4.9,
            reviewCount: 203,
            safetyBadges: ["Enhanced Clean", "Smoke Alarm", "First Aid Kit"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
            availability: [],
            rules: [
                "No smoking indoors",
                "Quiet hours 10 PM - 8 AM",
                "Maximum 10 guests",
            ],
            createdAt: "2023-03-20T00:00:00Z",
            updatedAt: "2024-01-20T00:00:00Z",
        },
        {
            id: 3,
            title: "Historic and Stunning, Large Castle",
            description:
                "Experience royal living in this magnificent historic castle with modern comforts.",
            property_type: "entire-place",
            bedrooms: 6,
            beds: 8,
            bathrooms: 4,
            maxGuests: 12,
            price_per_night: 640.44,
            currency: "USD",
            location: {
                address: "Castle Hill",
                city: "Edinburgh",
                country: "Scotland",
                coordinates: {
                    lat: 55.9533,
                    lng: -3.1883,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/1769393/pexels-photo-1769393.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/9946430/pexels-photo-9946430.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/9946429/pexels-photo-9946429.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/7031706/pexels-photo-7031706.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/7031719/pexels-photo-7031719.jpeg",
                },
            ],
            amenities: [
                "WiFi",
                "Fireplace",
                "Garden",
                "Historical significance",
                "Parking",
            ],
            host: {
                id: "host-3",
                name: "Lord William Edinburgh",
                avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
                joinedDate: "2018-06-10",
                verificationBadges: [
                    "Email",
                    "Phone",
                    "Government ID",
                    "Heritage Property",
                ],
                languages: ["English", "French", "German"],
                responseRate: 99,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.9,
            reviewCount: 89,
            safetyBadges: [
                "Enhanced Clean",
                "Historic Property",
                "Professional Management",
            ],
            hasInsurance: true,
            coupons: [],
            experiences: [],
            availability: [],
            rules: [
                "No smoking",
                "Respect historical artifacts",
                "Guided tour required",
            ],
            createdAt: "2023-06-10T00:00:00Z",
            updatedAt: "2024-01-10T00:00:00Z",
        },
        {
            id: 4,
            title: "Lux Loft Apartment Nr City Center",
            description:
                "Modern luxury loft apartment near city center with premium amenities.",
            property_type: "entire-place",
            bedrooms: 2,
            beds: 2,
            bathrooms: 2,
            maxGuests: 4,
            price_per_night: 989.78,
            currency: "USD",
            location: {
                address: "456 Downtown Ave",
                city: "Los Angeles",
                country: "United States",
                coordinates: {
                    lat: 34.0522,
                    lng: -118.2437,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
                },
            ],
            amenities: [
                "WiFi",
                "Kitchen",
                "Air conditioning",
                "City view",
                "Gym access",
            ],
            host: {
                id: "host-4",
                name: "Alexandra Chen",
                avatar: "https://images.pexels.com/photos/1819483/pexels-photo-1819483.jpeg",
                joinedDate: "2021-02-14",
                verificationBadges: ["Email", "Phone", "Government ID"],
                languages: ["English", "Mandarin"],
                responseRate: 97,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.7,
            reviewCount: 156,
            safetyBadges: ["Enhanced Clean", "Self Check-in", "Smoke Alarm"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
            availability: [],
            rules: ["No smoking", "No pets", "Check-in after 4 PM"],
            createdAt: "2023-02-14T00:00:00Z",
            updatedAt: "2024-01-14T00:00:00Z",
        },
        {
            id: 5,
            title: "Historic Georgian Lakeside Manor",
            description:
                "Spectacular Georgian manor overlooking pristine lake with luxury amenities.",
            property_type: "entire-home",
            bedrooms: 3,
            beds: 4,
            bathrooms: 2,
            maxGuests: 6,
            price_per_night: 756.89,
            currency: "USD",
            location: {
                address: "Lakeside Drive",
                city: "Georgian Bay",
                country: "Canada",
                coordinates: {
                    lat: 44.7678,
                    lng: -80.4678,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/208821/pexels-photo-208821.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/210552/pexels-photo-210552.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/261181/pexels-photo-261181.jpeg",
                },
            ],
            amenities: [
                "WiFi",
                "Kitchen",
                "Fireplace",
                "Lake access",
                "Private dock",
            ],
            host: {
                id: "host-5",
                name: "Robert MacLeod",
                avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
                joinedDate: "2019-08-12",
                verificationBadges: ["Email", "Phone", "Government ID"],
                languages: ["English", "French"],
                responseRate: 96,
                responseTime: "within a few hours",
                isSuperhost: true,
            },
            rating: 4.8,
            reviewCount: 92,
            safetyBadges: ["Enhanced Clean", "Lake Safety", "First Aid Kit"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
            availability: [],
            rules: ["No smoking", "Lake safety rules apply", "Respect nature"],
            createdAt: "2023-08-12T00:00:00Z",
            updatedAt: "2024-01-12T00:00:00Z",
        },
        {
            id: 6,
            title: "Adorable townhouse near MFL Station",
            description:
                "Charming townhouse with easy access to public transportation and local attractions.",
            property_type: "shared-room",
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            price_per_night: 550,
            currency: "USD",
            location: {
                address: "789 Transit Avenue",
                city: "Philadelphia",
                country: "United States",
                coordinates: {
                    lat: 39.9526,
                    lng: -75.1652,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/221016/pexels-photo-221016.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6782476/pexels-photo-6782476.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/7061662/pexels-photo-7061662.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6758774/pexels-photo-6758774.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6969824/pexels-photo-6969824.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchen", "Near transit", "Shared spaces"],
            host: {
                id: "host-6",
                name: "Emily Rodriguez",
                avatar: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg",
                joinedDate: "2022-04-18",
                verificationBadges: ["Email", "Phone"],
                languages: ["English", "Spanish"],
                responseRate: 94,
                responseTime: "within a day",
                isSuperhost: false,
            },
            rating: 4.6,
            reviewCount: 78,
            safetyBadges: ["Enhanced Clean", "Smoke Alarm"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
            availability: [],
            rules: [
                "Shared common areas",
                "Quiet hours 10 PM - 7 AM",
                "Clean up after use",
            ],
            createdAt: "2023-04-18T00:00:00Z",
            updatedAt: "2024-01-18T00:00:00Z",
        },
        {
            id: 7,
            title: "Chic Urban Loft with Skyline Views",
            description:
                "A stunning and spacious loft in the heart of the city, offering breathtaking skyline views from floor-to-ceiling windows. Perfect for a stylish city getaway.",
            property_type: "entire-loft",
            bedrooms: 1,
            beds: 1,
            bathrooms: 2,
            maxGuests: 3,
            price_per_night: 280,
            currency: "USD",
            location: {
                address: "123 Highline Park",
                city: "New York",
                country: "United States",
                coordinates: {
                    lat: 40.7128,
                    lng: -74.006,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/6434622/pexels-photo-6434622.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6284228/pexels-photo-6284228.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6489094/pexels-photo-6489094.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6434633/pexels-photo-6434633.jpeg",
                },
            ],
            amenities: [
                "WiFi",
                "Kitchen",
                "Elevator",
                "Air conditioning",
                "Gym",
            ],
            host: {
                id: "host-7",
                name: "Jessica Chen",
                avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
                joinedDate: "2021-08-10",
                verificationBadges: ["Email", "Phone", "ID"],
                languages: ["English", "Mandarin"],
                responseRate: 100,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.92,
            reviewCount: 155,
            safetyBadges: ["Enhanced Clean", "Carbon Monoxide Alarm"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 8,
            title: "Cozy Mountain Cabin Retreat",
            description:
                "Escape to this charming and rustic cabin nestled in the woods. Features a wood-burning stove and a large deck perfect for morning coffee.",
            property_type: "entire-cabin",
            bedrooms: 2,
            beds: 3,
            bathrooms: 1,
            maxGuests: 4,
            price_per_night: 195,
            currency: "CAD",
            location: {
                address: "45 Forest Trail",
                city: "Banff",
                country: "Canada",
                coordinates: {
                    lat: 51.1784,
                    lng: -115.5708,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/1878413/pexels-photo-1878413.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/584302/pexels-photo-584302.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/2088282/pexels-photo-2088282.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/262405/pexels-photo-262405.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/7245473/pexels-photo-7245473.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchen", "Indoor Fireplace", "Free parking"],
            host: {
                id: "host-8",
                name: "David Miller",
                avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
                joinedDate: "2020-11-05",
                verificationBadges: ["Email", "Phone"],
                languages: ["English"],
                responseRate: 98,
                responseTime: "within a few hours",
                isSuperhost: true,
            },
            rating: 4.88,
            reviewCount: 210,
            safetyBadges: ["Smoke Alarm", "First Aid Kit"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 9,
            title: "Serene Beachfront Villa with Private Pool",
            description:
                "An exquisite villa with direct beach access and a private infinity pool. Wake up to the sound of waves in this tropical paradise.",
            property_type: "entire-villa",
            bedrooms: 3,
            beds: 3,
            bathrooms: 3,
            maxGuests: 6,
            price_per_night: 450,
            currency: "USD",
            location: {
                address: "78 Ocean Drive",
                city: "Phuket",
                country: "Thailand",
                coordinates: {
                    lat: 7.8804,
                    lng: 98.3923,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg",
                },
            ],
            amenities: [
                "WiFi",
                "Kitchen",
                "Pool",
                "Air conditioning",
                "Beach access",
            ],
            host: {
                id: "host-9",
                name: "Sunan",
                avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
                joinedDate: "2019-03-12",
                verificationBadges: ["Email", "Phone", "ID"],
                languages: ["Thai", "English"],
                responseRate: 99,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.95,
            reviewCount: 180,
            safetyBadges: ["Enhanced Clean"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 10,
            title: "Historic Parisian Flat near the Louvre",
            description:
                "Live like a Parisian in this charming apartment with classic architectural details, a romantic balcony, and walking distance to the Louvre.",
            property_type: "entire-apartment",
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            price_per_night: 210,
            currency: "EUR",
            location: {
                address: "15 Rue de Rivoli",
                city: "Paris",
                country: "France",
                coordinates: {
                    lat: 48.8566,
                    lng: 2.3522,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6782434/pexels-photo-6782434.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6782352/pexels-photo-6782352.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6434617/pexels-photo-6434617.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/2029722/pexels-photo-2029722.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchen", "Elevator", "Washer", "Balcony"],
            host: {
                id: "host-10",
                name: "Amélie Dubois",
                avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
                joinedDate: "2022-01-20",
                verificationBadges: ["Email", "Phone"],
                languages: ["French", "English"],
                responseRate: 95,
                responseTime: "within a few hours",
                isSuperhost: false,
            },
            rating: 4.81,
            reviewCount: 95,
            safetyBadges: ["Smoke Alarm", "Carbon Monoxide Alarm"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 11,
            title: "Trendy Shoreditch Studio for Creatives",
            description:
                "A stylish and compact studio apartment in the heart of London's creative hub, Shoreditch. Surrounded by street art, cafes, and boutiques.",
            property_type: "private-studio",
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            price_per_night: 140,
            currency: "GBP",
            location: {
                address: "70 Rivington Street",
                city: "London",
                country: "United Kingdom",
                coordinates: {
                    lat: 51.5072,
                    lng: -0.1276,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/271649/pexels-photo-271649.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchenette", "Dedicated workspace"],
            host: {
                id: "host-11",
                name: "Oliver Smith",
                avatar: "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg",
                joinedDate: "2023-02-15",
                verificationBadges: ["Email", "Phone", "ID"],
                languages: ["English"],
                responseRate: 100,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.9,
            reviewCount: 112,
            safetyBadges: ["Enhanced Clean"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 12,
            title: "Spacious Family Home with Garden Oasis",
            description:
                "A beautiful and modern home perfect for families, featuring a large private garden, BBQ, and plenty of space for everyone to relax.",
            property_type: "entire-house",
            bedrooms: 4,
            beds: 5,
            bathrooms: 2,
            maxGuests: 8,
            price_per_night: 320,
            currency: "AUD",
            location: {
                address: "25 Bondi Road",
                city: "Sydney",
                country: "Australia",
                coordinates: {
                    lat: -33.8688,
                    lng: 151.2093,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/2029731/pexels-photo-2029731.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchen", "Pool", "Free parking", "BBQ grill"],
            host: {
                id: "host-12",
                name: "Chloe Williams",
                avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
                joinedDate: "2018-09-01",
                verificationBadges: ["Email", "Phone"],
                languages: ["English"],
                responseRate: 97,
                responseTime: "within a few hours",
                isSuperhost: false,
            },
            rating: 4.85,
            reviewCount: 130,
            safetyBadges: ["Smoke Alarm"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 13,
            title: "Minimalist Japanese Apt in Shinjuku",
            description:
                "Experience tranquility in this minimalist apartment, designed with Japanese aesthetics. Close to the vibrant Shinjuku Gyoen National Garden.",
            property_type: "entire-apartment",
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            maxGuests: 3,
            price_per_night: 180,
            currency: "JPY",
            location: {
                address: "1-1 Naitomachi, Shinjuku City",
                city: "Tokyo",
                country: "Japan",
                coordinates: {
                    lat: 35.6909,
                    lng: 139.7004,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/2086938/pexels-photo-2086938.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/305827/pexels-photo-305827.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/271648/pexels-photo-271648.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/2283279/pexels-photo-2283279.jpeg",
                },
            ],
            amenities: [
                "WiFi",
                "Kitchenette",
                "Air conditioning",
                "Pocket WiFi",
            ],
            host: {
                id: "host-13",
                name: "Kenji Tanaka",
                avatar: "https://images.pexels.com/photos/1197132/pexels-photo-1197132.jpeg",
                joinedDate: "2021-05-22",
                verificationBadges: ["Email", "Phone", "ID"],
                languages: ["Japanese", "English"],
                responseRate: 100,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.94,
            reviewCount: 240,
            safetyBadges: ["Enhanced Clean", "Smoke Alarm"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 14,
            title: "Unique Houseboat on Amsterdam Canal",
            description:
                "Live on the water in this beautifully converted houseboat. Enjoy stunning canal views and watch the boats go by from your private deck.",
            property_type: "entire-boat",
            bedrooms: 2,
            beds: 2,
            bathrooms: 1,
            maxGuests: 4,
            price_per_night: 250,
            currency: "EUR",
            location: {
                address: "Prinsengracht 263",
                city: "Amsterdam",
                country: "Netherlands",
                coordinates: {
                    lat: 52.3702,
                    lng: 4.8952,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/7319106/pexels-photo-7319106.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/259599/pexels-photo-259599.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/5929/boat-reflection-water-canal.jpg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/164786/pexels-photo-164786.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/745263/pexels-photo-745263.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchen", "Heating", "Patio"],
            host: {
                id: "host-14",
                name: "Anja Van Der Berg",
                avatar: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
                joinedDate: "2019-07-11",
                verificationBadges: ["Email", "Phone"],
                languages: ["Dutch", "English", "German"],
                responseRate: 99,
                responseTime: "within a few hours",
                isSuperhost: true,
            },
            rating: 4.89,
            reviewCount: 175,
            safetyBadges: ["Smoke Alarm"],
            hasInsurance: false,
            coupons: [],
            experiences: [],
        },
        {
            id: 15,
            title: "Stargazing Dome House in the Desert",
            description:
                "A unique geodesic dome with a large window perfect for stargazing. A tranquil and minimalist escape in the high desert, close to the national park.",
            property_type: "entire-dome",
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            price_per_night: 225,
            currency: "USD",
            location: {
                address: "8 Milky Way",
                city: "Joshua Tree",
                country: "United States",
                coordinates: {
                    lat: 34.1347,
                    lng: -116.313,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/8039641/pexels-photo-8039641.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/7162534/pexels-photo-7162534.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/7245347/pexels-photo-7245347.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6625126/pexels-photo-6625126.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg",
                },
            ],
            amenities: ["WiFi", "Kitchenette", "Air conditioning", "Hot tub"],
            host: {
                id: "host-15",
                name: "Luna & Kai",
                avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
                joinedDate: "2022-06-30",
                verificationBadges: ["Email", "Phone", "ID"],
                languages: ["English"],
                responseRate: 100,
                responseTime: "within an hour",
                isSuperhost: true,
            },
            rating: 4.98,
            reviewCount: 310,
            safetyBadges: ["Enhanced Clean"],
            hasInsurance: true,
            coupons: [],
            experiences: [],
        },
        {
            id: 16,
            title: "Authentic Riad with Courtyard Pool",
            description:
                "Experience traditional Moroccan hospitality in this beautiful Riad. Features a stunning central courtyard with a plunge pool and intricate tilework.",
            property_type: "private-room-in-riad",
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            maxGuests: 2,
            price_per_night: 95,
            currency: "MAD",
            location: {
                address: "22 Derb Lalla Azzouna",
                city: "Marrakech",
                country: "Morocco",
                coordinates: {
                    lat: 31.6295,
                    lng: -7.9811,
                },
            },
            images: [
                {
                    image_url:
                        "https://images.pexels.com/photos/3932953/pexels-photo-3932953.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/6122340/pexels-photo-6122340.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/3310694/pexels-photo-3310694.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/3550443/pexels-photo-3550443.jpeg",
                },
                {
                    image_url:
                        "https://images.pexels.com/photos/3894380/pexels-photo-3894380.jpeg",
                },
            ],
            amenities: ["WiFi", "Pool", "Air conditioning", "Free breakfast"],
            host: {
                id: "host-16",
                name: "Fatima Al-Fassi",
                avatar: "https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg",
                joinedDate: "2017-10-15",
                verificationBadges: ["Email", "Phone"],
                languages: ["Arabic", "French", "English"],
                responseRate: 99,
                responseTime: "within a few hours",
                isSuperhost: true,
            },
            rating: 4.91,
            reviewCount: 420,
            safetyBadges: ["Enhanced Clean"],
            hasInsurance: false,
            coupons: [],
            experiences: [],
        },
    ],
};

export const mockExperiences = [
    {
        id: 1,
        title: "Traditional Arabic Cooking Class",
        requirements: "3 days booking",
        location: "Dubai",
        duration: "3 hours",
        participants: "6-10 guests",
        rating: 4.9,
        image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg",
        host: "Hosted by Fatima Al-Zahra",
        category: "Cultural",
    },
    {
        id: 2,
        title: "Desert Safari Photography Tour",
        requirements: "7 days booking",
        location: "Dubai",
        duration: "4 hours",
        participants: "4-8 guests",
        rating: 4.8,
        image: "https://images.pexels.com/photos/1571442/pexels-photo-1571442.jpeg",
        host: "Hosted by Ahmed Hassan",
        category: "Nature",
    },
    {
        id: 4,
        title: "Rooftop Yoga at Sunrise",
        requirements: "4 days booking",
        location: "Dubai",
        duration: "1.5 hours",
        participants: "8-15 guests",
        rating: 4.7,
        image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg",
        host: "Hosted by Sarah Johnson",
        category: "Wellness",
    },
    {
        id: 5,
        title: "Local Market Food Tour",
        requirements: "7 days booking",
        location: "Dubai",
        duration: "3 hours",
        participants: "6-10 guests",
        rating: 4.7,
        image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
        host: "Hosted by Omar Abdullah",
        category: "Food",
    },
    {
        id: 6,
        title: "Arabic Calligraphy Workshop",
        requirements: "7 days booking",
        location: "Dubai",
        duration: "2.5 hours",
        participants: "4-8 guests",
        rating: 4.6,
        image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
        host: "Hosted by Khalid Al-Rashid",
        category: "Arts",
    },
    {
        id: 7,
        title: "Traditional Music & Dance Evening",
        requirements: "7 days booking",
        location: "Dubai",
        duration: "3 hours",
        participants: "15-30 guests",
        rating: 4.8,
        image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
        host: "Hosted by Mariam Al-Mahmoud",
        category: "Cultural",
    },
];

export const mockCoupons = [
    {
        id: 1,
        title: "20% Off Your Next 5 Rides",
        company: "Uber",
        image: "https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg", // Use a photographic image
        discount: "20%",
        code: "RENTAL20",
        terms: "Cannot be combined with other offers.",
        eligibility: "Minimum 2-night booking required.",
    },
    {
        id: 2,
        title: "$15 Off Local Restaurant Orders",
        company: "Local Eats",
        image: "https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg",
        discount: "$15",
        code: "EATSDEAL",
        terms: "Valid on delivery/pickup orders over $50.",
        eligibility: "Available for all confirmed guests.",
    },
    {
        id: 3,
        title: "Buy One, Get One Free City Tour",
        company: "City Tours Co.",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
        discount: "BOGO",
        code: "TOURBOGO",
        terms: "Must book 24 hours in advance.",
        eligibility: "Valid for walking tours on weekdays.",
    },
    {
        id: 4,
        title: "Complimentary Drink at The Sky Lounge",
        company: "Sky Lounge",
        image: "https://images.pexels.com/photos/5473935/pexels-photo-5473935.jpeg",
        discount: "FREE",
        code: "DRINKUP",
        terms: "Limit one per person, 21+ with ID.",
        eligibility: "Present your booking confirmation.",
    },
];
