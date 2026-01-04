import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PROPERTIES_API_URL = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;

// -----------------------------
// Helpers
// -----------------------------
const toCommaString = (v) => {
    if (Array.isArray(v)) {
        return v
            .filter(Boolean)
            .map((x) => String(x).trim())
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
            .join(",");
    }
    if (v === undefined || v === null) return undefined;
    const s = String(v).trim();
    return s === "" ? undefined : s;
};

const normalizeSearchParams = (params = {}) => {
    const { page = 1, _rsc, ...rest } = params; // ignore Next.js internal param

    const normalized = { page: String(page) };

    Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // Convert arrays to comma-separated strings (API expects comma lists)
        if (key === "categories" || key === "amenities") {
            const s = toCommaString(value);
            if (s) normalized[key] = s;
            return;
        }

        // Numbers -> string
        if (["guests", "min_price", "max_price"].includes(key)) {
            const num = Number(value);
            if (!Number.isNaN(num)) normalized[key] = String(num);
            return;
        }

        // Default -> trimmed string
        const s = toCommaString(value);
        if (s) normalized[key] = s;
    });

    return normalized;
};

// -----------------------------
// Base query
// -----------------------------
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: PROPERTIES_API_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
        const protectedEndpoints = new Set([
            "createProperty",
            "updateProperty",
            "deleteProperty",
            "getMyProperties",
        ]);

        if (protectedEndpoints.has(endpoint)) {
            const tokenFromStore = getState?.()?.auth?.token;
            const token =
                tokenFromStore ||
                (typeof window !== "undefined"
                    ? localStorage.getItem("access_token")
                    : null);

            if (token) headers.set("Authorization", `Bearer ${token}`);
        }

        headers.set("Accept", "application/json");
        return headers;
    },
});

export const propertiesApi = createApi({
    reducerPath: "propertiesApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Property", "PropertySearch"],
    refetchOnFocus: true,
    refetchOnReconnect: true,

    endpoints: (builder) => ({
        /**
         * UPDATED: getProperties
         * This now supports the efficient API request like:
         * /properties/search?location=Dubai&check_in=...&amenities=... etc
         */
        getProperties: builder.query({
            query: (params = {}) => ({
                url: "/properties/search",
                params: normalizeSearchParams(params),
            }),

            /**
             * If you are doing infinite scroll, this makes cache stable by filters
             * (ignoring page), and merges pages into the same cache entry.
             * If you do NOT want infinite scroll merging, remove serializeQueryArgs + merge.
             */
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const normalized = normalizeSearchParams(queryArgs);
                const { page, ...filtersWithoutPage } = normalized;

                const stable = Object.keys(filtersWithoutPage)
                    .sort()
                    .reduce((acc, k) => {
                        acc[k] = filtersWithoutPage[k];
                        return acc;
                    }, {});

                return `${endpointName}(${JSON.stringify(stable)})`;
            },

            merge: (currentCache, newData, { arg }) => {
                const page = Number(arg?.page || 1);

                // On first page, replace cache
                if (page === 1 || !currentCache?.items) {
                    return newData;
                }

                // Append unique by id
                const seen = new Set(
                    (currentCache.items || []).map((p) => p.id)
                );
                const appended = (newData.items || []).filter(
                    (p) => !seen.has(p.id)
                );

                currentCache.items.push(...appended);

                // Optional: update meta info from latest response
                currentCache.page = newData.page ?? currentCache.page;
                currentCache.total = newData.total ?? currentCache.total;
                currentCache.has_more =
                    newData.has_more ?? currentCache.has_more;
            },

            forceRefetch({ currentArg, previousArg }) {
                const a = normalizeSearchParams(currentArg);
                const b = normalizeSearchParams(previousArg);
                const { page: _pa, ...fa } = a;
                const { page: _pb, ...fb } = b;
                return JSON.stringify(fa) !== JSON.stringify(fb);
            },

            providesTags: (result) =>
                result?.items?.length
                    ? [
                          ...result.items.map(({ id }) => ({
                              type: "Property",
                              id,
                          })),
                          { type: "PropertySearch", id: "RESULT" },
                      ]
                    : [{ type: "PropertySearch", id: "RESULT" }],
        }),

        // OPTIONAL: keep a separate alias endpoint if you want
        // Otherwise you can remove this, and only use getProperties everywhere.
        searchProperties: builder.query({
            query: (params = {}) => ({
                url: "/properties/search",
                params: normalizeSearchParams(params),
            }),
            providesTags: (result) =>
                result?.items?.length
                    ? [
                          ...result.items.map(({ id }) => ({
                              type: "Property",
                              id,
                          })),
                          { type: "PropertySearch", id: "RESULT" },
                      ]
                    : [{ type: "PropertySearch", id: "RESULT" }],
        }),

        getFeaturedProperties: builder.query({
            query: () => "/properties/featured",
            providesTags: [{ type: "Property", id: "FEATURED" }],
        }),

        getPropertyById: builder.query({
            query: (id) => `/properties/${id}`,
            providesTags: (result, error, id) => [{ type: "Property", id }],
        }),

        getMyProperties: builder.query({
            query: () => "/properties/my",
            providesTags: (result) =>
                result?.items?.length
                    ? [
                          ...result.items.map(({ id }) => ({
                              type: "Property",
                              id,
                          })),
                          { type: "Property", id: "MY_PROPERTIES_LIST" },
                      ]
                    : [{ type: "Property", id: "MY_PROPERTIES_LIST" }],
        }),

        createProperty: builder.mutation({
            query: (propertyData) => ({
                url: "/properties",
                method: "POST",
                body: propertyData,
            }),
            invalidatesTags: [
                { type: "PropertySearch", id: "RESULT" },
                { type: "Property", id: "MY_PROPERTIES_LIST" },
            ],
        }),

        updateProperty: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/properties/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Property", id },
                { type: "PropertySearch", id: "RESULT" },
                { type: "Property", id: "MY_PROPERTIES_LIST" },
            ],
        }),

        deleteProperty: builder.mutation({
            query: (id) => ({
                url: `/properties/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Property", id },
                { type: "PropertySearch", id: "RESULT" },
                { type: "Property", id: "MY_PROPERTIES_LIST" },
            ],
        }),
    }),
});

export const {
    // Updated hook you asked for:
    useGetPropertiesQuery,

    // Optional alias hook:
    useSearchPropertiesQuery,

    useGetFeaturedPropertiesQuery,
    useGetPropertyByIdQuery,
    useGetMyPropertiesQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
} = propertiesApi;
