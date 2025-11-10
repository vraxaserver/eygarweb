import React from 'react'; 

const IdentityVerification = ({ identityVerification }) => { 
    const isVerified = identityVerification?.verification_status === 'verified'; 

    return ( 
        <div className={`rounded-lg shadow-md p-6 ${isVerified ? 'bg-green-100' : 'bg-yellow-100'}`}> 
            <h2 className={`text-xl font-semibold mb-2 ${isVerified ? 'text-green-800' : 'text-yellow-800'}`}> 
                Verification Status 
            </h2> 
            <p className={`text-lg font-bold ${isVerified ? 'text-green-700' : 'text-yellow-700'}`}> 
                {isVerified ? 'Verified' : 'Pending Verification'} 
            </p> 
        </div> 
    ); 
}; 

export default IdentityVerification;