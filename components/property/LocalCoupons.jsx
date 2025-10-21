import { Gift } from 'lucide-react';
import { CouponCard } from '@/components/property/CouponCard'; // Adjust path if needed


export const LocalCoupons = ({coupons}) => {
    return (
        <div className="space-y-8">
            
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                <Gift className="h-7 w-7 text-indigo-600" />
                <span>Exclusive Coupons</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {coupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                ))}
            </div>

            <p className="text-sm text-gray-500 mt-4">
                These exclusive coupons are available to our guests. Use the provided codes
                or present your booking confirmation to redeem these offers.
            </p>
        </div>
    );
};
