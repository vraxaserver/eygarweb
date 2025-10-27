import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;


// Define a service using a base URL and expected endpoints
export const experiencesApi = createApi({
    reducerPath: "experiencesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        // Example: prepareHeaders can be used to add auth tokens
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("access_token");
            if (token) {
              headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // Tag types are used for caching and invalidation.
    tagTypes: ["Experience"],
    endpoints: (builder) => ({
        // GET all experiences
        getMyExperiences: builder.query({
            query: () => "/experiences/my-experiences",
            // Provides the 'Experience' tag for the fetched list.
            // If any mutation invalidates this tag, this query will be re-fetched.
            transformResponse: (response, meta, arg) => {
                console.log("Received experiences from server:", response);
                // You can modify the response here if needed before it hits the cache
                return response.items;
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Experience",
                              id,
                          })),
                          { type: "Experience", id: "LIST" },
                      ]
                    : [{ type: "Experience", id: "LIST" }],
        }),

        getExperiences: builder.query({
            query: () => "/experiences",
            // Provides the 'Experience' tag for the fetched list.
            // If any mutation invalidates this tag, this query will be re-fetched.
            transformResponse: (response, meta, arg) => {
                console.log("Received experiences from server:", response);
                // You can modify the response here if needed before it hits the cache
                return response.items;
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Experience",
                              id,
                          })),
                          { type: "Experience", id: "LIST" },
                      ]
                    : [{ type: "Experience", id: "LIST" }],
        }),

        // GET a single experience by ID
        getExperience: builder.query({
            query: (id) => `/experiences/${id}`,
            providesTags: (result, error, id) => [{ type: "Experience", id }],
        }),

        // POST (create) a new experience
        addExperience: builder.mutation({
            query: (newExperience) => ({
                url: "/experiences",
                method: "POST",
                body: newExperience,
            }),
            // Invalidates the 'LIST' tag, forcing the getExperiences query to refetch.
            invalidatesTags: [{ type: "Experience", id: "LIST" }],
        }),

        // PUT (update) an existing experience
        updateExperience: builder.mutation({
            query: ({ id, ...updatedExperience }) => ({
                url: `/experiences/${id}`,
                method: "PUT",
                body: updatedExperience,
            }),
            // Invalidates the specific experience tag and the list tag.
            invalidatesTags: (result, error, { id }) => [
                { type: "Experience", id },
                { type: "Experience", id: "LIST" },
            ],
        }),

        // DELETE an experience
        deleteExperience: builder.mutation({
            query: (id) => ({
                url: `/experiences/${id}`,
                method: "DELETE",
            }),
            // Invalidates the specific experience tag and the list tag.
            invalidatesTags: (result, error, id) => [
                { type: "Experience", id },
                { type: "Experience", id: "LIST" },
            ],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetExperiencesQuery,
    useGetExperienceQuery,
    useGetMyExperiencesQuery,
    useAddExperienceMutation,
    useUpdateExperienceMutation,
    useDeleteExperienceMutation,
} = experiencesApi;
