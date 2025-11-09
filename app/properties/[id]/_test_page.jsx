"use client"
import { useGetPropertyByIdQuery } from "@/store/features/propertiesApi";
import React from "react";

const page = ({params}) => {
    const {id} = React.use(params)
    const {data: property, isLoading} = useGetPropertyByIdQuery(id)
    if(isLoading) return <>Loaind....!</>
    console.log("property: ", property)
    return (
        <>
        {property && <li>{property.title}</li>}
        </>
    );
};

export default page;
