import { Gift, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";


export default function MeetHost() {
    return (
        <div className="mb-8">
            <h3 className="flex items-center space-x-2 text-lg font-semibold py-5">
                <Gift className="h-7 w-7 text-emerald-600" />
                <span>Meet your host</span>
            </h3>
            <Card className="bg-white">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100" />
                            <AvatarFallback>MA</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold text-lg">Melanie</div>
                            <div className="text-sm text-gray-600">Host</div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1" />
                                    <span>54 Reviews</span>
                                </div>
                                <span>•</span>
                                <span>4 Years hosting</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                            <div className="font-semibold">4.9</div>
                            <div className="text-sm text-gray-600">Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">54</div>
                            <div className="text-sm text-gray-600">Reviews</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">4</div>
                            <div className="text-sm text-gray-600">
                                Years hosting
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                        I'm passionate about providing unique and memorable
                        experiences for my guests. I love sharing the beauty of
                        our local area and ensuring everyone feels welcome and
                        comfortable.
                    </p>
                    <Button variant="outline">Contact host</Button>
                </CardContent>
            </Card>
        </div>
    );
}
