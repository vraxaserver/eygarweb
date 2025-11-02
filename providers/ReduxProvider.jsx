"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { LanguageProvider } from "@/lib/i18n";
import AuthProvider from "@/providers/AuthProvider";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <GoogleMapsProvider>
                <LanguageProvider>{children}</LanguageProvider>
                </GoogleMapsProvider>
            </AuthProvider>
        </Provider>
    );
}
