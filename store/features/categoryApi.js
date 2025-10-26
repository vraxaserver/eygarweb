import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const PROPERTIES_API_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;

// Define a single API slice for the 'category' service
export const categoryApi = createApi({
  // The reducerPath is a unique key that identifies this API slice
  reducerPath: 'categoryApi',

  // All requests will be prefixed with this URL
  baseQuery: fetchBaseQuery({
    baseUrl: PROPERTIES_API_URL,
  }),

  // Optional: Define tag types for caching and automatic refetching
  tagTypes: ['Category'],

  // Define the endpoints for the API
  endpoints: (builder) => ({
    // 1. Query: Get all categories
    getCategories: builder.query({
      // The query function returns the endpoint path, which is appended to the baseUrl
      query: () => '/categories',
      // Provide a tag for this list query, which will be used for invalidation
      providesTags: (result) =>
        result
          ? [
              // Provides a tag for the list of categories
              ...result.map(({ id }) => ({ type: 'Category', id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    // 2. Query: Get a single category by ID
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // 3. Mutation: Create a new category (POST request)
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        // fetchBaseQuery will automatically serialize the body to JSON
        body: newCategory,
      }),
      // Invalidate the 'LIST' tag to trigger a refetch of all categories
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    // 4. Mutation: Update an existing category (PUT or PATCH request)
    updateCategory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/categories/${id}`,
        method: 'PUT', // or 'PATCH'
        body: patch,
      }),
      // Invalidate both the specific item and the list to ensure all views are up-to-date
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    
    // 5. Mutation: Delete a category (DELETE request)
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      // Invalidate both the specific item and the list
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

// Auto-generated hooks for use in React components
// The naming convention is 'use' + endpoint name + ('Query' or 'Mutation')
export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;