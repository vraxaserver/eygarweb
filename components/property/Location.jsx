import { Gift, MapPin } from "lucide-react";


export default function Location() {
    return (
        <div id="location" className="mb-8">
            <h3 className="flex items-center space-x-2 text-lg font-semibold py-5">
                <Gift className="h-7 w-7 text-amber-600" />
                <span>Where you'll be</span>
            </h3>
            <div className="bg-gray-200 rounded-lg h-64 mb-4 flex items-center justify-center">
                <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">Nokiiska, Georgia</p>
                </div>
            </div>
            <p className="text-gray-700">
                Located in the peaceful countryside of Nokiiska, Georgia, this
                tiny home offers the perfect escape from city life while still
                being accessible to local attractions and amenities.
            </p>
        </div>
    );
}
