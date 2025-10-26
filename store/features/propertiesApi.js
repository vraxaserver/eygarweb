import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PROPERTIES_API_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;

// Base query with conditional authentication
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: PROPERTIES_API_URL,
    prepareHeaders: (headers, { endpoint }) => {
        // Endpoints requiring authentication (mutations and protected queries)
        const protectedEndpoints = [
            "createProperty",
            "updateProperty",
            "deleteProperty",
            "getMyProperties", // Added new protected query
        ];

        if (protectedEndpoints.includes(endpoint)) {
            // Get token from Redux state
            // const token = getState().auth?.token;
            const token = localStorage.getItem("access_token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        }

        headers.set("Content-Type", "application/json");
        return headers;
    },
});

export const propertiesApi = createApi({
    reducerPath: "propertiesApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Property"],
    endpoints: (builder) => ({
        // Public endpoints - No authentication required
        getProperties: builder.query({
            query: (params = {}) => {
                const { page = 1, ...filters } = params;
                console.log("=============params inside rtk query=============")
                console.log(params)

                // Build query string from filters
                const queryParams = new URLSearchParams();
                queryParams.append("page", page);

                // Add other filters to query params
                Object.keys(filters).forEach((key) => {
                    if (
                        filters[key] !== undefined &&
                        filters[key] !== null &&
                        filters[key] !== ""
                    ) {
                        queryParams.append(key, filters[key]);
                    }
                });
                console.log(queryParams.toString())
                return `/properties/search?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.items.map(({ id }) => ({
                              type: "Property",
                              id,
                          })),
                          { type: "Property", id: "LIST" },
                      ]
                    : [{ type: "Property", id: "LIST" }],
        }),
        getFeaturedProperties: builder.query({
            query: () => "/properties/featured",
            providesTags: [{ type: "Property", id: "FEATURED" }],
        }),
        getPropertyById: builder.query({
            query: (id) => `/properties/${id}`,
            providesTags: (result, error, id) => [{ type: "Property", id }],
        }),

        // Protected endpoints - Authentication required

        // Get properties owned by the current authenticated user
        getMyProperties: builder.query({
            query: () => "/properties/my",
            providesTags: (result) =>
                result
                    ? [
                          ...result.items.map(({ id }) => ({
                              type: "Property",
                              id,
                          })),
                          { type: "Property", id: "MY_PROPERTIES_LIST" }, // Unique tag for user's list
                      ]
                    : [{ type: "Property", id: "MY_PROPERTIES_LIST" }],
        }),

        // Only authenticated hosts can create properties
        createProperty: builder.mutation({
            query: (propertyData) => ({
                url: "/properties",
                method: "POST",
                body: propertyData,
            }),
            invalidatesTags: [
                { type: "Property", id: "LIST" },
                { type: "Property", id: "MY_PROPERTIES_LIST" },
            ], // Also invalidate user's list
        }),

        // Only property owner can update
        updateProperty: builder.mutation({
            query: ({ id, ...propertyData }) => ({
                url: `/properties/${id}`,
                method: "PATCH",
                body: propertyData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Property", id },
                { type: "Property", id: "LIST" },
                { type: "Property", id: "MY_PROPERTIES_LIST" }, // Also invalidate user's list
            ],
        }),

        // Only property owner can delete
        deleteProperty: builder.mutation({
            query: (id) => ({
                url: `/properties/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Property", id },
                { type: "Property", id: "LIST" },
                { type: "Property", id: "MY_PROPERTIES_LIST" }, // Also invalidate user's list
            ],
        }),
    }),
});

export const {
    useGetPropertiesQuery,
    useGetFeaturedPropertiesQuery,
    useGetPropertyByIdQuery,
    useGetMyPropertiesQuery, // New hook export
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
} = propertiesApi;
