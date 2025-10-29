"use client";

import { useForm } from "react-hook-form";
import { useUpdateCompanyDetailsMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";

const CompanyDetailsPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [updateCompanyDetails, { isLoading }] =
        useUpdateCompanyDetailsMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await updateCompanyDetails(data).unwrap();
            router.push("/become-a-vendor/service-area");
        } catch (error) {
            console.error("Failed to update company details:", error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Company Details</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="company_name">Company Name</label>
                    <input
                        id="company_name"
                        {...register("company_name", { required: true })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.company_name && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="company_description">
                        Company Description
                    </label>
                    <textarea
                        id="company_description"
                        {...register("company_description", { required: true })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.company_description && (
                        <span className="text-red-500">
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="website">Website</label>
                    <input
                        id="website"
                        type="url"
                        {...register("website")}
                        className="w-full p-2 border rounded"
                    />
                </div>
                {/* Assuming vendor_profile is associated on the backend */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                    {isLoading ? "Saving..." : "Save and Continue"}
                </button>
            </form>
        </div>
    );
};

export default CompanyDetailsPage;
