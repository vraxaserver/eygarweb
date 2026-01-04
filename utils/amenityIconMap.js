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
    HelpCircle,
} from "lucide-react";

/**
 * Map backend icon string -> Lucide icon component
 * Supports values like:
 * "Snowflake", "wifi", "door-open", "washing-machine", etc.
 */
const ICON_MAP = {
    // basics
    snowflake: Snowflake,
    wifi: Wifi,
    desk: Laptop, // "Dedicated workspace"
    dryer: Wind, // closest generic icon; change if you prefer another
    thermometer: Thermometer,
    "washing-machine": WashingMachine,

    // accessibility
    wheelchair: Accessibility,
    "door-open": DoorOpen,

    // kitchen
    coffee: Coffee,
    dishwasher: UtensilsCrossed, // lucide doesn't have Dishwasher; use best match
    kitchen: UtensilsCrossed,
    microwave: Microwave,
    fridge: Refrigerator,

    // entertainment
    "pool-8-ball": Gamepad2, // lucide doesn't have 8-ball; use best match
    tv: Tv,
};

export function resolveAmenityIcon(iconName) {
    if (!iconName) return null;

    // Normalize: "Snowflake" -> "snowflake", "door-open" -> "door-open"
    const key = String(iconName).trim().toLowerCase();

    return ICON_MAP[key] || null;
}

// Optional fallback icon if not found
export const DEFAULT_AMENITY_ICON = HelpCircle;
