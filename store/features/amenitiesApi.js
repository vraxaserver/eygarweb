// src/store/features/amenitiesApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Amenities RTK Query API
 * Base URL: http://127.0.0.1:8001/api/v1
 * Endpoint: GET /amenities/
 */
export const amenitiesApi = createApi({
    reducerPath: "amenitiesApi",
    baseQuery: fetchBaseQuery({
        baseUrl:
            process.env.NEXT_PUBLIC_AMENITIES_API_URL ||
            "http://127.0.0.1:8001/api/v1",
        prepareHeaders: (headers, { getState }) => {
            headers.set("Accept", "application/json");

            // If your API requires auth, uncomment:
            // const token = getState().auth?.token;
            // if (token) headers.set("authorization", `Bearer ${token}`);

            return headers;
        },
    }),
    tagTypes: ["Amenity"],
    endpoints: (builder) => ({
        /**
         * Get all amenities
         * GET /amenities/
         */
        getAmenities: builder.query({
            query: () => ({
                url: "/amenities/",
                method: "GET",
            }),
            providesTags: (result) =>
                result?.length
                    ? [
                          ...result.map((a) => ({
                              type: "Amenity",
                              id: a.id ?? a.uuid ?? a.slug ?? a.name,
                          })),
                          { type: "Amenity", id: "LIST" },
                      ]
                    : [{ type: "Amenity", id: "LIST" }],
        }),

        /**
         * (Optional) Get single amenity by id
         * GET /amenities/:id/
         * Uncomment if your backend supports it
         */
        // getAmenityById: builder.query({
        //     query: (id) => ({
        //         url: `/amenities/${id}/`,
        //         method: "GET",
        //     }),
        //     providesTags: (_res, _err, id) => [{ type: "Amenity", id }],
        // }),
    }),
});

export const {
    useGetAmenitiesQuery,
    // useGetAmenityByIdQuery,
} = amenitiesApi;
