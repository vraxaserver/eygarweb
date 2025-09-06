import { Percent, Calendar, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CouponCard({ coupon }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isExpiringSoon = () => {
        const expiryDate = new Date(coupon.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
            (expiryDate - today) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 7;
    };

    return (
        <Card className="relative overflow-hidden border-l-4 border-l-orange-400 hover:shadow-md transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-400 to-orange-500 rounded-bl-full opacity-10" />

            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                            <Gift className="h-5 w-5 text-orange-500" />
                            <h4 className="font-semibold text-gray-900">
                                {coupon.title}
                            </h4>
                        </div>
                        {isExpiringSoon() && (
                            <Badge variant="destructive" className="text-xs">
                                Expires Soon
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm text-gray-600">
                        {coupon.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Percent className="h-4 w-4 text-orange-500" />
                            <span className="font-bold text-lg text-orange-600">
                                {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}% OFF`
                                    : `$${coupon.discountValue} OFF`}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Valid until</p>
                            <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span className="text-xs font-medium">
                                    {formatDate(coupon.expiryDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                            className="w-full"
                            variant={coupon.isUsed ? "secondary" : "default"}
                            disabled={coupon.isUsed}
                        >
                            {coupon.isUsed
                                ? "Already Used"
                                : `Apply Coupon: ${coupon.code}`}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
