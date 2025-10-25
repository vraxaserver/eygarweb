import { NextResponse } from "next/server";
import { mockProperties } from "@/data/properties";


export async function GET(request) {
    
    const featuredProperties = mockProperties.items
    console.log("featuredProperties: ", featuredProperties)
    return NextResponse.json(featuredProperties);
    
}