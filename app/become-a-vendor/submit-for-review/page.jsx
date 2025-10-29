"use client";

import { useForm } from "react-hook-form";
import { useSubmitForReviewMutation } from "@/store/features/vendorProfileApi";
import { updateRole } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const SubmitForReviewPage = () => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [submitForReview, { isLoading }] = useSubmitForReviewMutation();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await submitForReview(data).unwrap();
            // Redirect to a pending page or dashboard
            dispatch(updateRole("vendor"));
            router.push("/dashboard?status=pending");
        } catch (error) {
            console.error("Failed to submit for review:", error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Submit for Review</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="additional_notes">Additional Notes</label>
                    <textarea
                        id="additional_notes"
                        {...register("additional_notes")}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        id="terms_accepted"
                        type="checkbox"
                        {...register("terms_accepted", { required: true })}
                        className="mr-2"
                    />
                    <label htmlFor="terms_accepted">
                        I accept the terms and conditions.
                    </label>
                    {errors.terms_accepted && (
                        <span className="text-red-500 ml-4">
                            This is required
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    <input
                        id="privacy_policy_accepted"
                        type="checkbox"
                        {...register("privacy_policy_accepted", {
                            required: true,
                        })}
                        className="mr-2"
                    />
                    <label htmlFor="privacy_policy_accepted">
                        I accept the privacy policy.
                    </label>
                    {errors.privacy_policy_accepted && (
                        <span className="text-red-500 ml-4">
                            This is required
                        </span>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                >
                    {isLoading ? "Submitting..." : "Submit for Review"}
                </button>
            </form>
        </div>
    );
};

export default SubmitForReviewPage;
