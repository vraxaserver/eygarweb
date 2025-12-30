"use client";

import React from "react";
import { useListBookingsQuery } from "@/store/features/bookingApi";

const Page = () => {
    const { data, isLoading, isFetching, isError, error, refetch } =
        useListBookingsQuery(undefined, {
            refetchOnFocus: false,
            refetchOnReconnect: true,
        });

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <h1>{JSON.stringify(error)}</h1>;
    }

    return (
        <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Page;
