"use client"; 

import { useGetHostProfileQuery } from "@/store/features/profileApi"; 
import React from "react"; 
import HostHeader from "./components/HostHeader"; 
import UserInfo from "./components/UserInfo"; 
import BusinessProfile from "./components/BusinessProfile"; 
import IdentityVerification from "./components/IdentityVerification"; 
import ContactDetails from "./components/ContactDetails"; 

const Page = ({ params }) => { 
    const { host_id } = React.use(params); 
    const { data: host, isLoading, error } = useGetHostProfileQuery(host_id); 

    if (isLoading) return <div className="text-center p-8">Loading.....!</div>; 

    return ( 
        <div className="bg-gray-50 min-h-screen"> 
            <div className="container mx-auto p-4 sm:p-6 lg:p-8"> 
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
                    <div className="lg:col-span-1 space-y-8"> 
                        <HostHeader userInfo={host?.user_info} /> 
                        <IdentityVerification identityVerification={host?.identity_verification} /> 
                    </div> 
                    <div className="lg:col-span-2 space-y-8"> 
                        <UserInfo userInfo={host?.user_info} /> 
                        <BusinessProfile businessProfile={host?.business_profile} /> 
                        <ContactDetails contactDetails={host?.contact_details} /> 
                    </div> 
                </div> 
            </div> 
        </div> 
    ); 
}; 

export default Page;
