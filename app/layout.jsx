import { Montserrat, Roboto, Noto_Sans_Arabic } from "next/font/google";
import ReduxProvider from "@/providers/ReduxProvider";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import "./globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-montserrat",
});

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

const notoSansArabic = Noto_Sans_Arabic({
    subsets: ["arabic"],
    display: "swap",
    variable: "--font-arabic",
});

export const metadata = {
    title: "EYGAR - Secure Property Rentals",
    description:
        "Government-compliant property rentals with safety badges, free insurance, and unique experiences.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${montserrat.variable} ${roboto.variable} ${notoSansArabic.variable} antialiased`}
        >
            <body>
                <ReduxProvider>
                    <div className="min-h-screen">
                        <Header />

                        {/* Main Content */}
                        {children}

                        {/* Footer */}
                        <Footer />
                    </div>
                </ReduxProvider>
            </body>
        </html>
    );
}
