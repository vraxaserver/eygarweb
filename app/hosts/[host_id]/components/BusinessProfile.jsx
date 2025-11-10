import React from 'react'; 

const BusinessProfile = ({ businessProfile }) => { 
    return ( 
        <div className="bg-white rounded-lg shadow-md p-6"> 
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Details</h2> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                <div> 
                    <p className="font-semibold text-gray-700">Business Name</p> 
                    <p className="text-gray-600">{businessProfile?.business_name}</p> 
                </div> 
                <div> 
                    <p className="font-semibold text-gray-700">Business Type</p> 
                    <p className="text-gray-600">{businessProfile?.business_type}</p> 
                </div> 
                <div> 
                    <p className="font-semibold text-gray-700">License Number</p> 
                    <p className="text-gray-600">{businessProfile?.license_number}</p> 
                </div> 
                <div> 
                    <p className="font-semibold text-gray-700">Address</p> 
                    <p className="text-gray-600">{`${businessProfile?.business_address_line1}, ${businessProfile?.business_city}, ${businessProfile?.business_state}`}</p> 
                </div> 
            </div> 
        </div> 
    ); 
}; 

export default BusinessProfile;