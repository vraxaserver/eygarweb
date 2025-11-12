"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation } from "@/store/features/hostProfileApi"; // 1. IMPORT THE HOOK
import {
    User,
    Shield,
    Bell,
    CreditCard,
    Camera,
    Loader2,
    AlertCircle,
} from "lucide-react";

export default function UserSettingsPage() {
    const user = useSelector(selectCurrentUser);
    console.log("user: ", user)

    // 2. INSTANTIATE THE HOOK
    // It provides the trigger function, loading state, and error state.
    const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

    const [activeTab, setActiveTab] = useState("profile");

    // State for the profile form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [submitError, setSubmitError] = useState("");

    const avatarInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setAvatarPreview(user.avatar_url || "");
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // 3. UPDATE THE SUBMIT HANDLER
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(""); // Clear previous errors

        // Create a FormData object to send file and text data together
        const formData = new FormData();
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        try {
            // Call the mutation and use .unwrap() to handle promises
            await updateProfile(formData).unwrap();
            // Optional: Show a success message/toast
            alert("Profile updated successfully!");
        } catch (err) {
            // The error object from RTK Query contains details from the API response
            const errorMessage =
                err.data?.detail ||
                "An unexpected error occurred. Please try again.";
            setSubmitError(errorMessage);
            console.error("Failed to update profile:", err);
        }
    };

    const sidebarNavItems = [
        {
            key: "profile",
            label: "Profile",
            icon: <User className="w-4 h-4 mr-2" />,
        },
        {
            key: "security",
            label: "Security",
            icon: <Shield className="w-4 h-4 mr-2" />,
        },
        {
            key: "notifications",
            label: "Notifications",
            icon: <Bell className="w-4 h-4 mr-2" />,
        },
        {
            key: "payment",
            label: "Payment Methods",
            icon: <CreditCard className="w-4 h-4 mr-2" />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Account Settings
                    </h1>
                    <p className="text-gray-600">
                        Manage your profile, security, and notification
                        preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <nav className="space-y-1">
                            {sidebarNavItems.map((item) => (
                                <Button
                                    key={item.key}
                                    variant={
                                        activeTab === item.key
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className={`w-full justify-start ${
                                        activeTab === item.key
                                            ? "bg-gray-200 font-semibold"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab(item.key)}
                                >
                                    {item.icon}
                                    {item.label}
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <main className="md:col-span-3">
                        {activeTab === "profile" && (
                            <Card>
                                <form onSubmit={handleProfileSubmit}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Profile Information
                                        </CardTitle>
                                        <CardDescription>
                                            Update your personal details here.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center space-x-6">
                                            <Avatar className="w-20 h-20">
                                                <AvatarImage
                                                    src={avatarPreview}
                                                />
                                                <AvatarFallback>
                                                    {(user?.first_name?.[0] ||
                                                        "") +
                                                        (user?.last_name?.[0] ||
                                                            "") ||
                                                        user?.email?.[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-x-2">
                                                <input
                                                    type="file"
                                                    ref={avatarInputRef}
                                                    className="sr-only"
                                                    accept="image/png, image/jpeg"
                                                    onChange={
                                                        handleAvatarChange
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        avatarInputRef.current?.click()
                                                    }
                                                >
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    Change
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => {
                                                        setAvatarPreview(
                                                            user.avatar || ""
                                                        );
                                                        setAvatarFile(null);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">
                                                    First Name
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    value={firstName}
                                                    onChange={(e) =>
                                                        setFirstName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter your first name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">
                                                    Last Name
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={(e) =>
                                                        setLastName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter your last name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={user?.email || ""}
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500">
                                                Your email address cannot be
                                                changed.
                                            </p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        {/* 4. ADD ERROR DISPLAY */}
                                        {submitError && (
                                            <div className="text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                {submitError}
                                            </div>
                                        )}
                                        <Button
                                            type="submit"
                                            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto ml-auto"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        )}
                        {/* Other tabs remain unchanged */}
                    </main>
                </div>
            </div>
        </div>
    );
}
