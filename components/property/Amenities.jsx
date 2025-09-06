import { Gift, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Amenities = ({amenities}) => {
    return (
        <div id="amenities" className="mb-8">
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                <Gift className="h-7 w-7 text-pink-600" />
                <span>What this place offers</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 py-5">
                {amenities.map((amenity, index) => (
                    <div
                        key={index}
                        className={`flex items-center space-x-3 ${
                            !amenity.available ? "opacity-50" : ""
                        }`}
                    >
                        {amenity.icon}
                        <span
                            className={!amenity.available ? "line-through" : ""}
                        >
                            {amenity.name}
                        </span>
                        {!amenity.available && (
                            <XCircle className="w-4 h-4 text-gray-400 ml-auto" />
                        )}
                    </div>
                ))}
            </div>
            <Button variant="outline" className="mt-6">
                Show all 20 amenities
            </Button>
        </div>
    );
};

export default Amenities;
