"use client";

import { useForm } from "react-hook-form";
import { useUpdateCompanyDetailsMutation } from "@/store/features/vendorProfileApi";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";

// It's good practice to have a visual indicator for multi-step forms.
// If you don't have this component, you can remove it or create a simple one.
// const StepProgressIndicator = () => (
//     <div className="w-full max-w-2xl mb-8">
//         {/* A placeholder for your progress bar */}
//         <div className="bg-gray-200 rounded-full h-2.5">
//             <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
//         </div>
//     </div>
// );

export default function CompanyDetailsPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [updateCompanyDetails, { isLoading }] = useUpdateCompanyDetailsMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await updateCompanyDetails(data).unwrap();
            // Navigate to the next step on success
            router.push("/become-a-vendor/service-area");
        } catch (error) {
            // The console.error is kept for debugging, but you might want to show a toast notification here
            console.error("Failed to update company details:", error);
        }
    };
    
    // Reusable class strings for inputs to keep the JSX clean
    const inputClass = (hasError) => 
        `w-full px-4 py-2 mt-2 border rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            hasError ? 'border-red-400' : 'border-gray-300'
        }`;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* <StepProgressIndicator /> */}

            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="p-8 bg-white border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Tell Us About Your Business
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    This information will appear on your public vendor profile.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-8 space-y-6">
                            {/* Company Name Field */}
                            <div>
                                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                                    Company Name *
                                </label>
                                <input
                                    id="company_name"
                                    {...register("company_name", { required: "Company name is required." })}
                                    className={inputClass(errors.company_name)}
                                    placeholder="e.g., Pro Event Planners Inc."
                                />
                                {errors.company_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.company_name.message}
                                    </p>
                                )}
                            </div>

                            {/* Company Description Field */}
                            <div>
                                <label htmlFor="company_description" className="block text-sm font-medium text-gray-700">
                                    Company Description *
                                </label>
                                <textarea
                                    id="company_description"
                                    rows="4"
                                    {...register("company_description", { required: "A description is required." })}
                                    className={inputClass(errors.company_description)}
                                    placeholder="Describe your company, your services, and what makes you unique."
                                />
                                {errors.company_description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.company_description.message}
                                    </p>
                                )}
                            </div>

                            {/* Website Field */}
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                    Website (Optional)
                                </label>
                                <input
                                    id="website"
                                    type="url"
                                    {...register("website")}
                                    className={inputClass(errors.website)}
                                    placeholder="https://www.example.com"
                                />
                            </div>
                        </div>
                        
                        {/* Form Footer & Submit Button */}
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Save and Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
