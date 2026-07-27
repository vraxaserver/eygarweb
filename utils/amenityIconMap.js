// src/utils/amenityIconMap.js
import {
    Snowflake,
    Wifi,
    Laptop,
    Wind,
    Thermometer,
    WashingMachine,
    DoorOpen,
    Accessibility,
    Coffee,
    Refrigerator,
    Microwave,
    Tv,
    UtensilsCrossed,
    Dumbbell,
    Gamepad2,
    Car,
    Waves,
    Shirt,
    Flame,
    Home,
    Key,
    Shield,
    Sparkles,
    Bath,
    Bed,
    Fan,
    ChefHat,
    CircleCheckBig,
    HelpCircle,
} from "lucide-react";

/**
 * Map backend icon string or amenity name -> Lucide icon component
 */
const ICON_MAP = {
    // Basics & Electronics
    snowflake: Snowflake,
    "air conditioning": Snowflake,
    ac: Snowflake,
    wifi: Wifi,
    "free wifi": Wifi,
    internet: Wifi,
    desk: Laptop,
    "dedicated workspace": Laptop,
    workspace: Laptop,
    dryer: Wind,
    hairdryer: Wind,
    thermometer: Thermometer,
    heating: Thermometer,
    "washing-machine": WashingMachine,
    washer: WashingMachine,
    "washing machine": WashingMachine,
    tv: Tv,
    "cable tv": Tv,
    television: Tv,

    // Parking & Outdoors
    car: Car,
    parking: Car,
    "free parking": Car,
    pool: Waves,
    "swimming pool": Waves,
    "hot tub": Waves,
    hottub: Waves,
    jacuzzi: Waves,

    // Kitchen & Dining
    coffee: Coffee,
    "coffee maker": Coffee,
    kitchen: ChefHat,
    microwave: Microwave,
    fridge: Refrigerator,
    refrigerator: Refrigerator,
    dishwasher: UtensilsCrossed,
    cooking: UtensilsCrossed,
    dining: UtensilsCrossed,

    // Safety & Security
    shield: Shield,
    "safety feature": Shield,
    security: Shield,
    "fire extinguisher": Flame,
    "smoke alarm": Flame,
    "first aid kit": Shield,
    key: Key,
    "self check-in": Key,

    // Furniture & Comfort
    bed: Bed,
    bath: Bath,
    bathtub: Bath,
    shower: Bath,
    fan: Fan,
    iron: Shirt,
    gym: Dumbbell,
    "fitness center": Dumbbell,
    "door-open": DoorOpen,
    wheelchair: Accessibility,
    "pool-8-ball": Gamepad2,
};

export function resolveAmenityIcon(iconNameOrAmenityName) {
    if (!iconNameOrAmenityName) return DEFAULT_AMENITY_ICON;

    // Normalize: "Air conditioning" -> "air conditioning", "door-open" -> "door-open"
    const key = String(iconNameOrAmenityName).trim().toLowerCase();

    return ICON_MAP[key] || DEFAULT_AMENITY_ICON;
}

// Fallback icon if specific icon not found
export const DEFAULT_AMENITY_ICON = CircleCheckBig;
