import React from 'react'; 

const ContactDetails = ({ contactDetails }) => { 
    return ( 
        <div className="bg-white rounded-lg shadow-md p-6"> 
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                <div> 
                    <p className="font-semibold text-gray-700">Mobile Number</p> 
                    <p className="text-gray-600">{contactDetails?.mobile_number}</p> 
                </div> 
                <div> 
                    <p className="font-semibold text-gray-700">Address</p> 
                    <p className="text-gray-600">{`${contactDetails?.address_line1}, ${contactDetails?.city}, ${contactDetails?.state}`}</p> 
                </div> 
            </div> 
        </div> 
    ); 
}; 

export default ContactDetails;