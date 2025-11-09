"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
    Menu,
    User,
    X,
    LogIn,
    LogOut,
    Grid,
    Settings,
    Home,
    Building2,
    Globe,
    HelpCircle,
    Star,
} from "lucide-react"; // example icons
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
    selectIsAuthenticated,
    selectCurrentUser,
    selectCurrentRole,
    updateRole,
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
    const [logoutUser] = useLogoutUserMutation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();
    const itemHover = { x: 4, transition: { type: 'spring', stiffness: 300 } };

    const pathname = usePathname();

    const links = [
        { href: "/", label: t("nav.home"), icon: <Home size={18} /> },
        {
            href: "/properties",
            label: t("nav.placesToStay"),
            icon: <Building2 size={18} />,
        },
    ];

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsMobileMenuOpen(false);
            router.push("/");
        }
    };

    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
    };

    const handleLogin = () => router.push("/login");
    const handleSignup = () => router.push("/signup");
    const goToDashboard = () => router.push("/dashboard");
    const goToSettings = () => router.push("/settings");
    const becomeAVendor = () => router.push("/become-a-vendor");
    const SwitchToTraveller = () => {
        dispatch(updateRole("guest"));
        router.push("/");
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
                                alt="EYGAR Logo"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        {links.map(({ href, label, icon }) => {
                            const isActive = pathname === href;

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`relative flex items-center gap-2 pb-1 transition-all ${
                                        isActive
                                            ? "text-primary font-semibold border-b-2 border-primary"
                                            : "text-foreground hover:text-primary"
                                    }`}
                                >
                                    <motion.span
                                        initial={{ rotate: 0 }}
                                        whileHover={{ rotate: 10 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                        className="text-primary"
                                    >
                                        {icon}
                                    </motion.span>
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </div>
                    {/* Desktop Right Controls */}
                    <div className="hidden md:flex items-center space-x-4">
                        {role !== "host" && (
                            <Link
                                href="/become-a-host"
                                className="text-foreground hover:text-primary"
                            >
                                {t("nav.becomeHost")}
                            </Link>
                        )}

                        {role === "host" && (
                            <button
                                onClick={SwitchToTraveller}
                                className="text-foreground hover:text-primary"
                            >
                                Switch to Traveller
                            </button>
                        )}

                        {/* Language selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center"
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
                                    className="flex items-center space-x-2"
                                >
                                    <Menu className="h-4 w-4" />
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {!isAuthenticated ? (
                                    <>
                                        <DropdownMenuItem
                                            onClick={handleSignup}
                                        >
                                            Signup
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogin}>
                                            Login
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <p className="p-2 text-sm text-gray-600 bg-purple-500 text-white py-2">
                                            {currentUser?.email}
                                        </p>
                                        <DropdownMenuItem
                                            onClick={goToDashboard}
                                        >
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={goToSettings}
                                        >
                                            Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={becomeAVendor}
                                        >
                                            Become A Vendor
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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Slide-in Menu */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>

                    <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform animate-slide-in">
                        <div className="flex items-center justify-between p-4 border-b">
                            <Image
                                src="/images/logo.png"
                                alt="EYGAR Logo"
                                width={100}
                                height={32}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="flex flex-col p-4 space-y-3">
                            {!isAuthenticated ? (
                                <>
                                    <button
                                        onClick={handleSignup}
                                        className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                        aria-label="Signup"
                                    >
                                        <motion.span
                                            whileHover={itemHover}
                                            className="flex-shrink-0"
                                        >
                                            <User className="h-5 w-5 text-gray-600" />
                                        </motion.span>
                                        <span className="text-left">
                                            {t?.("nav.signup") ?? "Signup"}
                                        </span>
                                    </button>

                                    <button
                                        onClick={handleLogin}
                                        className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                        aria-label="Login"
                                    >
                                        <motion.span
                                            whileHover={itemHover}
                                            className="flex-shrink-0"
                                        >
                                            <LogIn className="h-5 w-5 text-gray-600" />
                                        </motion.span>
                                        <span className="text-left">
                                            {t?.("nav.login") ?? "Login"}
                                        </span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-600 mb-2 break-words">
                                        {currentUser?.email}
                                    </span>

                                    <button
                                        onClick={goToDashboard}
                                        className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <motion.span
                                            whileHover={itemHover}
                                            className="flex-shrink-0"
                                        >
                                            <Grid className="h-5 w-5 text-gray-600" />
                                        </motion.span>
                                        <span className="text-left">
                                            Dashboard
                                        </span>
                                    </button>

                                    <button
                                        onClick={goToSettings}
                                        className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <motion.span
                                            whileHover={itemHover}
                                            className="flex-shrink-0"
                                        >
                                            <Settings className="h-5 w-5 text-gray-600" />
                                        </motion.span>
                                        <span className="text-left">
                                            Settings
                                        </span>
                                    </button>

                                    <button
                                        onClick={becomeAVendor}
                                        className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <motion.span
                                            whileHover={itemHover}
                                            className="flex-shrink-0"
                                        >
                                            <Star className="h-5 w-5 text-gray-600" />
                                        </motion.span>
                                        <span className="text-left">
                                            Become A Vendor
                                        </span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <motion.span
                                            whileHover={itemHover}
                                            className="flex-shrink-0"
                                        >
                                            <LogOut className="h-5 w-5 text-gray-600" />
                                        </motion.span>
                                        <span className="text-left">
                                            Logout
                                        </span>
                                    </button>
                                </>
                            )}

                            <hr />

                            <Link
                                href="/properties"
                                className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <motion.span
                                    whileHover={itemHover}
                                    className="flex-shrink-0"
                                >
                                    <Building2 className="h-5 w-5 text-gray-600" />
                                </motion.span>
                                <span>
                                    {t?.("nav.placesToStay") ??
                                        "Places to stay"}
                                </span>
                            </Link>

                            {role === "host" ? (
                                <button
                                    onClick={SwitchToTraveller}
                                    className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                >
                                    <motion.span
                                        whileHover={itemHover}
                                        className="flex-shrink-0"
                                    >
                                        <Home className="h-5 w-5 text-gray-600" />
                                    </motion.span>
                                    <span className="text-left">
                                        Switch to Traveller
                                    </span>
                                </button>
                            ) : (
                                <Link
                                    href="/become-a-host"
                                    className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                >
                                    <motion.span
                                        whileHover={itemHover}
                                        className="flex-shrink-0"
                                    >
                                        <Star className="h-5 w-5 text-gray-600" />
                                    </motion.span>
                                    <span>Become a Host</span>
                                </Link>
                            )}

                            <button
                                onClick={() =>
                                    handleLanguageChange(
                                        language === "en" ? "ar" : "en"
                                    )
                                }
                                className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <motion.span
                                    whileHover={itemHover}
                                    className="flex-shrink-0"
                                >
                                    <Globe className="h-5 w-5 text-gray-600" />
                                </motion.span>
                                <span>
                                    {language === "ar" ? "English" : "العربية"}
                                </span>
                            </button>

                            <Link
                                href="/help"
                                className="w-full flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <motion.span
                                    whileHover={itemHover}
                                    className="flex-shrink-0"
                                >
                                    <HelpCircle className="h-5 w-5 text-gray-600" />
                                </motion.span>
                                <span>Help</span>
                            </Link>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
}

/* Tailwind animation */
<style jsx global>{`
    @keyframes slide-in {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease-out forwards;
    }
`}</style>;
