"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, UploadCloud, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepProgressIndicator from "@/components/become-a-host/StepProgressIndicator";
import Link from "next/link";


export default function CreateHostProfilePage() {
    const router = useRouter();
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [avatarFile, setAvatarFile] = useState();
    const [avatarPreview, setAvatarPreview] = useState();

    const handleAvatarChange = () => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
        }
    };

    const handleSubmit = () => {
        e.preventDefault();
        // In a real app, you would upload the avatar and save the profile data to your backend.
        console.log({ headline, bio, avatarFile });
        // Navigate to the next step
        router.push("/verify-identity");
    };

    // Create a preview URL when the avatar file changes
    useEffect(() => {
        if (!avatarFile) {
            setAvatarPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(avatarFile);
        setAvatarPreview(objectUrl);

        // Free memory when the component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [avatarFile]);

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Step Progress Indicator */}
                <StepProgressIndicator />
                {/* Main Content */}
                <main className="bg-slate-50 min-h-screen flex justify-center p-4">
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Create Your Host Profile
                            </h1>
                            <p className="text-gray-500 mt-2 mb-8">
                                This information will be visible to guests
                                to help them get to know you.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-8"
                            >
                                {/* Avatar Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Photo
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center">
                                            {avatarPreview ? (
                                                <Image
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-12 w-12 text-slate-400" />
                                            )}
                                        </div>
                                        <label
                                            htmlFor="avatar-upload"
                                            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                                        >
                                            <span>Upload a photo</span>
                                            <input
                                                id="avatar-upload"
                                                name="avatar-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/png, image/jpeg"
                                                onChange={
                                                    handleAvatarChange
                                                }
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Profile Headline */}
                                <div>
                                    <label
                                        htmlFor="headline"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Profile Headline
                                    </label>
                                    <input
                                        type="text"
                                        name="headline"
                                        id="headline"
                                        value={headline}
                                        onChange={(e) =>
                                            setHeadline(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="e.g., Avid traveler, foodie, and local guide"
                                        maxLength={60}
                                    />
                                </div>

                                {/* Bio Section */}
                                <div>
                                    <label
                                        htmlFor="bio"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        About You
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={4}
                                        value={bio}
                                        onChange={(e) =>
                                            setBio(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Tell guests a little about yourself, your hobbies, or what you love about your city."
                                        maxLength={500}
                                    />
                                    <p className="mt-2 text-xs text-gray-500 text-right">
                                        {bio.length} / 500
                                    </p>
                                </div>

                                {/* Submission Button */}
                                <div className="text-right">
                                    <Link
                                        href={"/become-a-host/verify-identity"}
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                        
                                    >
                                        Save and Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                </main>
            </div>

            <Footer />
        </>
    );
}
