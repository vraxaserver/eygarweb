import React from 'react'; 

const HostHeader = ({ userInfo }) => { 
    return ( 
        <div className="bg-white rounded-lg shadow-md p-6 text-center"> 
            <img 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-200" 
                src={userInfo?.avatar} 
                alt={`${userInfo?.first_name} ${userInfo?.last_name}`} 
            /> 
            <h1 className="text-2xl font-bold text-gray-800">{`${userInfo?.first_name} ${userInfo?.last_name}`}</h1> 
            <p className="text-gray-600">{userInfo?.email}</p> 
        </div> 
    ); 
}; 

export default HostHeader;