import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {getStatusColor} from "@/lib/utils"
import { useCreatePropertyMutation, useGetMyPropertiesQuery } from "@/store/features/propertiesApi";
import PropertyCard from "@/components/properties/PropertyCard"
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";

import {
    Star,
    Eye,
    Edit,
    Trash2,
    Plus,
    MapPin
} from "lucide-react";

const TabMyProperty = ({setShowAddModal}) => {
    const user = useSelector(selectCurrentUser);
    const {data: properties, isLoading} = useGetMyPropertiesQuery()
    console.log("user: ", user);
    console.log("properties: ", properties);

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-5">
                <h2 className="text-xl font-semibold">Your Properties</h2>
                <Button onClick={setShowAddModal} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Property
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading your properties...</div>
            ) : properties?.items?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.items.map((property) => (
                        <PropertyCard key={property.id} property={property} currentUserId={user?.eygar_host?.id} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg bg-white p-6">
                    <p className="mb-4 text-base">You have not listed any properties yet.</p>
                    <Button onClick={setShowAddModal} className="bg-primary hover:bg-primary/90">
                        List Your First Property
                    </Button>
                </div>
            )}
        </>
    );
};

export default TabMyProperty;
