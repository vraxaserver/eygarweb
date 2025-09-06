"use client"

import { Provider } from "react-redux"
import { store } from "@/store"
import { LanguageProvider } from "@/lib/i18n"

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <LanguageProvider>{children}</LanguageProvider>
        </Provider>
    )
}