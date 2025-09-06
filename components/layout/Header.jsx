"use client";

import React, { useState, useEffect } from "react";
import { Globe, Menu, User, LogOut, Settings, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLanguage, useTranslation } from "@/lib/i18n";

export default function Header({ profile }) {
    const router = useRouter();
    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();

    const handleLogin = () => {
        router.push("/auth/login");
    };

    const handleSignup = () => {
        router.push("/auth/signup");
    };

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
                                style={{ width: "100%", height: "auto" }}
                            />
                        </Link>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/properties"
                            className="text-foreground hover:text-primary"
                        >
                            {t("nav.placesToStay")}
                        </Link>
                        <Link
                            href="/experiences"
                            className="text-foreground hover:text-primary"
                        >
                            {t("nav.experiences")}
                        </Link>
                        <Link
                            href="/search_by_image"
                            className="text-foreground hover:text-primary"
                        >
                            {t("nav.place_by_image")}
                        </Link>
                    </nav>

                    {/* Right side controls */}
                    <div className="flex items-center space-x-4">
                        {profile === "host" ? (
                            <Link
                                href="/become-a-traveller"
                                className="text-foreground hover:text-primary"
                            >
                                Become a traveller
                            </Link>
                        ) : (
                            <Link
                                href="/become-a-host"
                                className="text-foreground hover:text-primary"
                            >
                                {t("nav.becomeHost")}
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
                                    <DropdownMenuItem onClick={handleSignup}>
                                        {t("auth.signup")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogin}>
                                        {t("auth.login")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogin}>
                                       <Link href="/bookings">My Bookings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => router.push("/host")}
                                    >
                                        {t("nav.becomeHost")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {t("nav.helpCenter")}
                                    </DropdownMenuItem>
                                </>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
