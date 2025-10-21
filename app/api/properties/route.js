import { NextResponse } from "next/server";

// Best practice: Store the API base URL in an environment variable
const PROPERTIES_API_URL = process.env.PROPERTIES_API_URL || "http://127.0.0.1:8001/api/v1/properties/";

export async function GET(request) {
    try {
        // Fetch data from the external API endpoint
        const response = await fetch(PROPERTIES_API_URL, {
            // Optional: Revalidate data every 60 seconds.
            // Adjust the time as needed or remove for default caching behavior.
            next: { revalidate: 60 } 
        });

        // Check if the request was successful
        if (!response.ok) {
            // If not successful, throw an error with the status text
            // This will be caught by the catch block below
            throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
        }

        // Parse the JSON response from the API
        const properties = await response.json();
        console.log("properties: ", properties)
        
        // Return the fetched data
        return NextResponse.json(properties);

    } catch (error) {
        console.error("Error fetching properties:", error);

        // Check for a specific network error when the service is down
        if (error.cause && error.cause.code === "ECONNREFUSED") {
            return NextResponse.json(
                {
                    error: "Service unavailable",
                    message: "Unable to connect to the properties service.",
                },
                { status: 503 } // 503 Service Unavailable
            );
        }

        // Return a generic internal server error for all other issues
        return NextResponse.json(
            { 
                error: "Internal server error", 
                // Include the error message for easier debugging
                message: error.message 
            },
            { status: 500 }
        );
    }
}
