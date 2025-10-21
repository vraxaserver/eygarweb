import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {getStatusColor} from "@/lib/utils"
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

const TabMyProperty = ({properties, setShowAddModal}) => {
    const user = useSelector(selectCurrentUser);
    console.log("user: ", user);

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold">Your Properties</h2>
                <Button onClick={setShowAddModal} className="bg-purple-500 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Property
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.items.map((property) => (
                    <PropertyCard key={property.id} property={property} currentUserId={user.eygar_host.id} />
                ))}
            </div>
        </>
    );
};

export default TabMyProperty;
