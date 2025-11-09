import { CheckCircle, Info, Copy, Scissors } from 'lucide-react';
import Image from 'next/image';

// Simple function to copy the code to the clipboard
const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You can replace this with a more subtle toast notification
    alert(`Coupon code "${code}" copied to clipboard!`);
};

export const CouponCard = ({ coupon }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex overflow-hidden border h-48">
            {/* Left Side: Image & Discount */}
            <div className="flex flex-col w-2/5">
                {/* Image Section (Top Half) */}
                <div className="relative w-full h-1/2">
                    <Image
                        src={coupon?.service?.image}
                        alt={`Promotional image for ${coupon.company}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
                        className="object-cover"
                    />
                </div>

                {/* Discount Section (Bottom Half) */}
                <div className="flex flex-col items-center justify-center flex-grow bg-slate-50 text-center p-2">
                    <h5 className="text-3xl font-extrabold text-red-500">
                        {coupon.discountValue} {coupon.discountType == 'percentage' && '%'}
                    </h5>
                    <span className="text-xs font-semibold text-slate-600 uppercase">Off</span>                    
                </div>
            </div>

            {/* Dashed Separator with Scissors Icon */}
            <div className="relative flex-shrink-0">
                <div 
                    className="absolute top-0 bottom-0 w-px bg-center" 
                    style={{
                        backgroundImage: `linear-gradient(to bottom, #d1d5db 60%, transparent 40%)`,
                        backgroundSize: '1px 10px',
                        backgroundRepeat: 'repeat-y'
                    }}
                ></div>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 bg-white flex items-center justify-center rounded-full border">
                    <Scissors className="h-4 w-4 text-slate-400 transform -rotate-90" />
                </div>
            </div>

            {/* Right Side: Information */}
            <div className="p-4 flex flex-col flex-grow w-3/5">
                <h4 className="text-base font-bold text-slate-800 mb-2 leading-tight">{coupon.title}</h4>
                
                <div className="space-y-1.5 text-xs text-slate-500 mb-3 flex-grow overflow-y-auto">
                    <div className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                        <span><strong>Eligibility:</strong> {coupon.eligibility}</span>
                    </div>
                    <div className="flex items-start">
                        <Info className="h-3.5 w-3.5 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                        <span><strong>Terms:</strong> {coupon.terms}</span>
                    </div>
                </div>

                <div className="mt-auto pt-2 border-t border-dashed">
                    <div className="flex items-center justify-between bg-slate-100 rounded-md p-1.5">
                        <span className="font-mono text-sm tracking-wider text-slate-700 ml-1">{coupon.code}</span>
                        <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-800 font-semibold text-xs px-2 py-1 rounded transition-colors"
                            title="Copy code"
                        >
                            <Copy className="h-3 w-3" />
                            <span>COPY</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
