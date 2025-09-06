"use client"

import { createContext, useContext, useState, useEffect } from "react"

const translations = {
    en: {
        // Navigation
        "nav.placesToStay": "Places to stay",
        "nav.experiences": "Experiences",
        "nav.place_by_image": "Places by Image",
        "nav.becomeHost": "Become A Host",
        "nav.findSafeProperty": "Find Safe Properties",
        "nav.helpCenter": "Help Center",

        // Home page
        "home.featured_section_title": "Featured Properties",
        "home.safety_section_badge": "Safety First",
        "home.safety_section_title": "Your Safety is Our Priority",
        "home.safety_section_desc": "Experience worry-free travel with our comprehensive safety measures, government compliance, and free insurance coverage for every booking.",
        "home.PopularDestinations_title": "Popular Destinations",
        "home.PopularDestinations_desc": "Explore the most loved destinations by travelers",
        "home.popular": "Popular",
        "home.safety_certified_host_section_title": "Safety-Certified Hosts",
        "home.unique_experience_section_title": "Unique Experiences",
        "home.unique_experience_section_desc": "Discover free local experiences offered by our hosts.",

        // Authentication
        "auth.login": "Log in",
        "auth.signup": "Sign up",
        "auth.logout": "Log out",
        "auth.email": "Email",
        "auth.password": "Password",
        "auth.name": "Full Name",
        "auth.confirmPassword": "Confirm Password",
        "auth.loginTitle": "Welcome back to EYGAR",
        "auth.signupTitle": "Join EYGAR",
        "auth.loginSubtitle": "Sign in to your account to continue",
        "auth.signupSubtitle": "Create your account to get started",
        "auth.forgotPassword": "Forgot password?",
        "auth.noAccount": "Don't have an account?",
        "auth.hasAccount": "Already have an account?",
        "auth.signupLink": "Sign up",
        "auth.loginLink": "Log in",

        // Search
        "search.destination": "Search Destinations",
        "search.destinationPlaceholder": "Where are you going?",
        "search.checkIn": "Check-In",
        "search.checkOut": "Checkout",
        "search.guests": "Guests",
        "search.categories": "Categories",
        "search.filters": "Filters",
        "search.addDates": "Add dates",
        "search.allCategories": "All categories",
        "search.searchButton": "Search",
        "search.adults": "Adults",
        "search.children": "Children",
        "search.pets": "Pets",
        "search.adultsDesc": "Ages 13 or above",
        "search.childrenDesc": "Ages 2-12",
        "search.petsDesc": "Bringing a service animal?",

        // Property
        "property.night": "night",
        "property.guests": "guests",
        "property.bedrooms": "bedrooms",
        "property.bathrooms": "bathrooms",
        "property.safetyBadge": "Safety Verified",
        "property.freeExperience": "Free Experience",
        "property.localCoupons": "Local Coupons",
        "property.bookNow": "Reserve",
        "property.viewDetails": "View Details",

        // Host Dashboard
        "host.dashboard": "Host Dashboard",
        "host.overview": "Overview",
        "host.properties": "Properties",
        "host.bookings": "Bookings",
        "host.calendar": "Calendar",
        "host.earnings": "Earnings",
        "host.experiences": "Experiences",
        "host.welcomeBack": "Welcome back",
        "host.todayActivity": "Here's what's happening with your properties today.",
        "host.addProperty": "Add New Property",
        "host.totalProperties": "Total Properties",
        "host.activeBookings": "Active Bookings",
        "host.monthlyEarnings": "Monthly Earnings",
        "host.averageRating": "Average Rating",

        // Common
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
        "common.cancel": "Cancel",
        "common.save": "Save",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.view": "View",
        "common.add": "Add",
        "common.search": "Search",
        "common.filter": "Filter",
        "common.sort": "Sort",
        "common.showMap": "Show map",
        "common.accountSettings": "Account settings",
        "common.favorites": "Favorites",
    },
    ar: {
        // Navigation
        "nav.placesToStay": "أماكن الإقامة",
        "nav.experiences": "أماكن حسب التجارب",
        "nav.place_by_image": "أماكن حسب الصورة",
        "nav.becomeHost": "كن مضيفاً",
        "nav.findSafeProperty": "البحث عن عقارات آمنة",
        "nav.helpCenter": "مركز المساعدة",

        // Home page
        "home.featured_section_title": "العقارات المميزة",
        "home.safety_section_badge": "السلامة أولاً",
        "home.safety_section_title": "سلامتك هي أولويتنا",
        "home.safety_section_desc": "استمتع بسفر خالٍ من القلق بفضل تدابير السلامة الشاملة لدينا، والامتثال الحكومي، والتغطية التأمينية المجانية لكل حجز.",
        "home.PopularDestinations_title": "الوجهات الأكثر شعبية",
        "home.PopularDestinations_desc": "استكشف الوجهات الأكثر حبًا لدى المسافرين ",
        "home.popular": "شائع",
        "home.safety_certified_host_section_title": "المضيفون المعتمدون للسلامة",
        "home.unique_experience_section_title": "تجارب فريدة",
        "home.unique_experience_section_desc": "اكتشف التجارب المحلية المجانية التي يقدمها مضيفونا.",

        // Authentication
        "auth.login": "تسجيل الدخول",
        "auth.signup": "إنشاء حساب",
        "auth.logout": "تسجيل الخروج",
        "auth.email": "البريد الإلكتروني",
        "auth.password": "كلمة المرور",
        "auth.name": "الاسم الكامل",
        "auth.confirmPassword": "تأكيد كلمة المرور",
        "auth.loginTitle": "مرحباً بعودتك إلى إيجار",
        "auth.signupTitle": "انضم إلى إيجار",
        "auth.loginSubtitle": "سجل دخولك إلى حسابك للمتابعة",
        "auth.signupSubtitle": "أنشئ حسابك للبدء",
        "auth.forgotPassword": "نسيت كلمة المرور؟",
        "auth.noAccount": "ليس لديك حساب؟",
        "auth.hasAccount": "لديك حساب بالفعل؟",
        "auth.signupLink": "إنشاء حساب",
        "auth.loginLink": "تسجيل الدخول",

        // Search
        "search.destination": "البحث عن الوجهات",
        "search.destinationPlaceholder": "إلى أين تذهب؟",
        "search.checkIn": "تسجيل الوصول",
        "search.checkOut": "تسجيل المغادرة",
        "search.guests": "الضيوف",
        "search.categories": "الفئات",
        "search.filters": "المرشحات",
        "search.addDates": "إضافة تواريخ",
        "search.allCategories": "جميع الفئات",
        "search.searchButton": "بحث",
        "search.adults": "البالغون",
        "search.children": "الأطفال",
        "search.pets": "الحيوانات الأليفة",
        "search.adultsDesc": "أعمار 13 سنة فما فوق",
        "search.childrenDesc": "أعمار 2-12 سنة",
        "search.petsDesc": "تحضر حيوان خدمة؟",

        // Property
        "property.night": "ليلة",
        "property.guests": "ضيوف",
        "property.bedrooms": "غرف نوم",
        "property.bathrooms": "حمامات",
        "property.safetyBadge": "معتمد الأمان",
        "property.freeExperience": "تجربة مجانية",
        "property.localCoupons": "كوبونات محلية",
        "property.bookNow": "احجز",
        "property.viewDetails": "عرض التفاصيل",

        // Host Dashboard
        "host.dashboard": "لوحة المضيف",
        "host.overview": "نظرة عامة",
        "host.properties": "العقارات",
        "host.bookings": "الحجوزات",
        "host.calendar": "التقويم",
        "host.earnings": "الأرباح",
        "host.experiences": "التجارب",
        "host.welcomeBack": "مرحباً بعودتك",
        "host.todayActivity": "إليك ما يحدث مع عقاراتك اليوم.",
        "host.addProperty": "إضافة عقار جديد",
        "host.totalProperties": "إجمالي العقارات",
        "host.activeBookings": "الحجوزات النشطة",
        "host.monthlyEarnings": "الأرباح الشهرية",
        "host.averageRating": "متوسط التقييم",

        // Common
        "common.loading": "جاري التحميل...",
        "common.error": "خطأ",
        "common.success": "نجح",
        "common.cancel": "إلغاء",
        "common.save": "حفظ",
        "common.edit": "تعديل",
        "common.delete": "حذف",
        "common.view": "عرض",
        "common.add": "إضافة",
        "common.search": "بحث",
        "common.filter": "تصفية",
        "common.sort": "ترتيب",
        "common.showMap": "عرض الخريطة",
        "common.accountSettings": "إعدادات الحساب",
        "common.favorites": "المفضلة",
    },
}

const LanguageContext = createContext()

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}

export const useTranslation = () => {
    const { language } = useLanguage()

    const t = (key, fallback = key) => {
        return translations[language]?.[key] || translations.en[key] || fallback
    }

    return { t }
}

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en")
    const [isRTL, setIsRTL] = useState(false)

    useEffect(() => {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem("eygar-language") || "en"
        setLanguage(savedLanguage)
        setIsRTL(savedLanguage === "ar")

        // Update document direction and language
        document.documentElement.lang = savedLanguage
        document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
    }, [])

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage)
        setIsRTL(newLanguage === "ar")
        localStorage.setItem("eygar-language", newLanguage)

        // Update document direction and language
        document.documentElement.lang = newLanguage
        document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
    }

    return <LanguageContext.Provider value={{ language, isRTL, changeLanguage }}>{children}</LanguageContext.Provider>
}
