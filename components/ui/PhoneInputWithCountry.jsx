"use client";

import React from "react";

const GCC_COUNTRIES = [
    { code: "+974", flag: "🇶🇦", name: "Qatar (+974)" },
    { code: "+971", flag: "🇦🇪", name: "UAE (+971)" },
    { code: "+965", flag: "🇰🇼", name: "Kuwait (+965)" },
    { code: "+966", flag: "🇸🇦", name: "Saudi Arabia (+966)" },
    { code: "+968", flag: "🇴🇲", name: "Oman (+968)" },
    { code: "+973", flag: "🇧🇭", name: "Bahrain (+973)" },
];

export default function PhoneInputWithCountry({
    countryCode = "+974",
    onCountryCodeChange,
    value = "",
    onChange,
    placeholder = "Enter Phone Number (e.g. 55123456 - max 15 digits)",
    name = "phone",
    id = "phone",
    disabled = false,
    className = "",
}) {
    return (
        <div className={`flex rounded-md shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 ${className}`}>
            <select
                value={countryCode}
                onChange={(e) => onCountryCodeChange && onCountryCodeChange(e.target.value)}
                disabled={disabled}
                className="px-3 py-2 bg-gray-50 border-r border-gray-300 rounded-l-md text-sm text-gray-700 font-medium focus:outline-none cursor-pointer"
            >
                {GCC_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                    </option>
                ))}
            </select>
            <input
                type="tel"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                maxLength={15}
                className="flex-1 block w-full px-3 py-2 rounded-r-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-100"
            />
        </div>
    );
}
