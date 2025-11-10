import React from 'react'; 

const UserInfo = ({ userInfo }) => { 
    return ( 
        <div className="bg-white rounded-lg shadow-md p-6"> 
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About {userInfo?.first_name}</h2> 
            <p className="text-gray-700">A dedicated and verified host committed to providing the best experience.</p> 
        </div> 
    ); 
}; 

export default UserInfo;