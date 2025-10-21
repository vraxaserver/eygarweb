"use client";
import { Globe, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useSelector, useDispatch } from "react-redux";
import {
    selectIsAuthenticated,
    selectCurrentUser,
    selectCurrentRole,
    updateRole
} from "@/store/slices/authSlice";
import { useLogoutUserMutation } from "@/store/features/authApi";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLanguage, useTranslation } from "@/lib/i18n";

export default function Header() {
    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);
    const role = useSelector(selectCurrentRole);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [logoutUser] = useLogoutUserMutation();

    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
        } catch (error) {
            // Even if the API call fails, we still logout locally
            console.error("Logout error:", error);
        } finally {
            // dispatch(logout());
            setShowUserMenu(false);
            router.push("/");
        }
    };

    const handleLogin = () => {
        router.push("/login");
    };

    const handleSignup = () => {
        router.push("/signup");
    };

    const goToDashboard = () => {
        setShowUserMenu(false);
        router.push("/dashboard");
    }

    const becomeAVendor = () => {
        setShowUserMenu(false);
        router.push("/become-a-vendor");
    }

    const SwitchToTraveller = () => {
        setShowUserMenu(false);
        dispatch(updateRole("guest"));
        router.push("/");
    }

    const goToSettings = () => {
        setShowUserMenu(false);
        router.push("/settings");
    }

    const handleLanguageChange = (newLanguage) => {
        changeLanguage(newLanguage);
    };

    return (
        <header className="sticky top-0 z-50 bg-background border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/images/logo.png"
                                alt={"EYGAR Logo"}
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/properties"
                            className="text-foreground hover:text-primary"
                        >
                            Places to Stay "{role}"
                        </Link>
                    </nav>

                    {/* Right side controls */}
                    <div className="flex items-center space-x-4">
                        {role !== "host" && (
                            <Link
                                href="/become-a-host"
                                className="text-foreground hover:text-primary"
                            >
                                {t("nav.becomeHost")}
                            </Link>
                        )}

                        {role === "host" && (
                            <Link
                                href="/"
                                className="text-foreground hover:text-primary"
                                onClick={SwitchToTraveller}
                            >
                                Switch to Traveller
                            </Link>
                        )}

                        {/* Language selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hidden sm:flex"
                                >
                                    <Globe className="h-4 w-4 mr-2" />
                                    {language === "ar" ? "ع" : "EN"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() => handleLanguageChange("en")}
                                >
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleLanguageChange("ar")}
                                >
                                    العربية
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* User menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center space-x-2 bg-transparent"
                                >
                                    <Menu className="h-4 w-4" />
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <>
                                    {!isAuthenticated ? (
                                        <>
                                            <DropdownMenuItem
                                                onClick={handleSignup}
                                            >
                                                Signup
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={handleLogin}
                                            >
                                                Login
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <p className="p-2 bg-gray-400">
                                                {currentUser?.email}
                                            </p>
                                            <DropdownMenuItem>
                                                <Link href="/bookings">
                                                    My Bookings
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <button onClick={goToDashboard}>
                                                    Dashboard
                                                </button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <button onClick={goToSettings}>
                                                    Settings
                                                </button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <button onClick={becomeAVendor}>
                                                    Become A Vendor
                                                </button>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    {role !== "host" && (
                                        <DropdownMenuItem>
                                            <Link href="/become-a-host">
                                                Become a host
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {role !== "vendor" && (
                                        <DropdownMenuItem>
                                            <Link href="/become-a-vendor">
                                                Become a vendor
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem>Help</DropdownMenuItem>
                                </>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
