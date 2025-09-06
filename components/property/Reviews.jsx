import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Reviews = ({reviews}) => {
    return (
        <div id="reviews" className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
                <Star className="w-7 h-7 fill-current text-yellow-500" />
                <span className="text-xl font-semibold">4.98 · 55 reviews</span>
            </div>

            {/* Review Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm">Cleanliness</span>
                    <div className="flex items-center space-x-1">
                        <div className="w-20 h-1 bg-gray-200 rounded">
                            <div className="w-full h-1 bg-black rounded"></div>
                        </div>
                        <span className="text-sm font-semibold">5.0</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Accuracy</span>
                    <div className="flex items-center space-x-1">
                        <div className="w-20 h-1 bg-gray-200 rounded">
                            <div className="w-full h-1 bg-black rounded"></div>
                        </div>
                        <span className="text-sm font-semibold">4.9</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Communication</span>
                    <div className="flex items-center space-x-1">
                        <div className="w-20 h-1 bg-gray-200 rounded">
                            <div className="w-full h-1 bg-black rounded"></div>
                        </div>
                        <span className="text-sm font-semibold">5.0</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Location</span>
                    <div className="flex items-center space-x-1">
                        <div className="w-20 h-1 bg-gray-200 rounded">
                            <div className="w-4/5 h-1 bg-black rounded"></div>
                        </div>
                        <span className="text-sm font-semibold">4.8</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Check-in</span>
                    <div className="flex items-center space-x-1">
                        <div className="w-20 h-1 bg-gray-200 rounded">
                            <div className="w-full h-1 bg-black rounded"></div>
                        </div>
                        <span className="text-sm font-semibold">5.0</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Value</span>
                    <div className="flex items-center space-x-1">
                        <div className="w-20 h-1 bg-gray-200 rounded">
                            <div className="w-full h-1 bg-black rounded"></div>
                        </div>
                        <span className="text-sm font-semibold">4.9</span>
                    </div>
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.id}>
                        <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                                <AvatarImage src={review.avatar} />
                                <AvatarFallback>
                                    {review.author[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">
                                    {review.author}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {review.date}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>

            <Button variant="outline" className="mt-6">
                Show all 54 reviews
            </Button>
        </div>
    );
};

export default Reviews;
