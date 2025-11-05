import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PROPERTIES_API_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;

// Define a service using a base URL and expected endpoints
export const vendorServiceApi = createApi({
    reducerPath: "vendorServiceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: PROPERTIES_API_URL,
        // Prepare headers to include the authentication token
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token; // Assuming your token is stored in the auth slice
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // Define tags for caching and invalidation
    tagTypes: ["Service"],
    endpoints: (builder) => ({
        // Endpoint for listing all vendor services
        getServices: builder.query({
            query: () => "/vendors/services/",
            // Provides a 'Service' tag to the cached data
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Service", id })),
                          { type: "Service", id: "LIST" },
                      ]
                    : [{ type: "Service", id: "LIST" }],
        }),

        // Endpoint for adding a new vendor service
        addService: builder.mutation({
            query: (newService) => ({
                url: "/vendors/services/",
                method: "POST",
                body: newService,
            }),
            // Invalidates the 'Service' list tag to trigger a refetch
            invalidatesTags: [{ type: "Service", id: "LIST" }],
        }),

        // Endpoint for listing the logged-in user's vendor services
        getMyServices: builder.query({
            query: () => "/vendors/services/my",
            // Provides a 'Service' tag to the cached data for the logged-in user
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Service", id })),
                          { type: "Service", id: "MY_LIST" },
                      ]
                    : [{ type: "Service", id: "MY_LIST" }],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetServicesQuery,
    useAddServiceMutation,
    useGetMyServicesQuery,
} = vendorServiceApi;
