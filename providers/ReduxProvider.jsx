"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { LanguageProvider } from "@/lib/i18n";
import AuthProvider from "@/providers/AuthProvider";

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <LanguageProvider>{children}</LanguageProvider>
            </AuthProvider>
        </Provider>
    );
}
