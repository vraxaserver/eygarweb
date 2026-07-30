"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { getStatusColor } from "@/lib/utils";
import {
    Eye,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Calendar,
    Users,
    DollarSign,
    Mail,
    Phone,
    Send,
    X,
    ShieldCheck,
    ShieldX,
} from "lucide-react";

import {
    useHostApproveBookingMutation,
    useListHostUpcomingBookingsQuery,
} from "@/store/features/bookingApi";

/* ─────────────────── helpers ─────────────────── */

const getStatusIcon = (status) => {
    switch (status) {
        case "confirmed":
        case "booking_confirmed":
        case "host_approved":
        case "checked_in":
            return <CheckCircle className="w-3.5 h-3.5" />;
        case "pending_payment":
        case "payment_confirmed":
            return <Clock className="w-3.5 h-3.5" />;
        default:
            return <AlertCircle className="w-3.5 h-3.5" />;
    }
};

const formatMoney = (amount, currency) => {
    if (amount == null) return "—";
    const num = Number(amount);
    return `${isNaN(num) ? "0.00" : num.toFixed(2)} ${String(currency || "").toUpperCase()}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
};

/* ─────────────────── Message Dialog ─────────────────── */

function MessageGuestDialog({ booking, open, onClose }) {
    const user = booking?.user_snapshot || {};

    const email         = user.email         || null;
    const emailVerified = Boolean(user.is_email_verified);
    // phone may live in different keys depending on profile service
    const phone         = user.phone || user.phone_number || user.mobile || null;
    const phoneVerified = Boolean(user.is_phone_verified ?? (phone ? true : false));

    const guestName =
        (user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : null) ||
        user.email ||
        "Guest";

    const hasEmail  = Boolean(email);
    const hasPhone  = Boolean(phone);
    const canEmail  = hasEmail  && emailVerified;
    const canSms    = hasPhone  && phoneVerified;

    // Determine default active tab
    const defaultTab = canEmail ? "email" : canSms ? "sms" : "email";

    const [activeChannel, setActiveChannel] = useState(defaultTab);
    const [subject,   setSubject]   = useState("");
    const [message,   setMessage]   = useState("");
    const [sending,   setSending]   = useState(false);
    const [sent,      setSent]      = useState(false);
    const [sendError, setSendError] = useState("");

    // Reset state when dialog opens with a new booking
    React.useEffect(() => {
        if (open) {
            setSubject("");
            setMessage("");
            setSending(false);
            setSent(false);
            setSendError("");
            setActiveChannel(canEmail ? "email" : canSms ? "sms" : "email");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, booking?.id]);

    const handleSend = async () => {
        if (!message.trim()) return;
        setSending(true);
        setSendError("");

        try {
            if (activeChannel === "email") {
                // Open mailto – production would call an API
                const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
                window.open(mailto, "_blank");
            } else {
                // Open WhatsApp / SMS link
                const cleanPhone = phone.replace(/\D/g, "");
                const whatsapp = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
                window.open(whatsapp, "_blank");
            }
            setSent(true);
        } catch {
            setSendError("Failed to open message client. Please try manually.");
        } finally {
            setSending(false);
        }
    };

    const noneAvailable = !hasEmail && !hasPhone;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
                {/* Header */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 px-6 pt-6 pb-5 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white text-lg font-semibold flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Message Guest
                        </DialogTitle>
                    </DialogHeader>
                    {/* Guest info */}
                    <div className="flex items-center gap-3 mt-4">
                        <Avatar className="w-10 h-10 border-2 border-white/30">
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback className="bg-white/20 text-white font-bold">
                                {String(guestName)[0]?.toUpperCase() || "G"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold text-sm">{guestName}</div>
                            <div className="text-white/70 text-xs">
                                {booking?.property_snapshot?.title || "Property"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* Contact availability badges */}
                    <div className="flex flex-wrap gap-2">
                        {hasEmail && (
                            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                                emailVerified
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}>
                                {emailVerified
                                    ? <ShieldCheck className="w-3.5 h-3.5" />
                                    : <ShieldX className="w-3.5 h-3.5" />
                                }
                                <Mail className="w-3.5 h-3.5" />
                                <span>{emailVerified ? "Email verified" : "Email (unverified)"}</span>
                            </div>
                        )}
                        {hasPhone && (
                            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                                phoneVerified
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}>
                                {phoneVerified
                                    ? <ShieldCheck className="w-3.5 h-3.5" />
                                    : <ShieldX className="w-3.5 h-3.5" />
                                }
                                <Phone className="w-3.5 h-3.5" />
                                <span>{phoneVerified ? "Phone verified" : "Phone (unverified)"}</span>
                            </div>
                        )}
                        {noneAvailable && (
                            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                No contact info available
                            </div>
                        )}
                    </div>

                    {noneAvailable ? (
                        <div className="text-center py-6 text-gray-400 text-sm">
                            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p>No email or phone number is linked to this guest&apos;s account.</p>
                        </div>
                    ) : (
                        <>
                            {/* Channel tabs — only show tabs that exist */}
                            {(hasEmail && hasPhone) ? (
                                <Tabs
                                    value={activeChannel}
                                    onValueChange={setActiveChannel}
                                    className="w-full"
                                >
                                    <TabsList className="grid grid-cols-2 w-full h-9">
                                        <TabsTrigger
                                            value="email"
                                            disabled={!hasEmail}
                                            className="text-xs flex items-center gap-1.5"
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                            Email
                                            {!emailVerified && (
                                                <span className="text-amber-500 text-[10px]">(unverified)</span>
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="sms"
                                            disabled={!hasPhone}
                                            className="text-xs flex items-center gap-1.5"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            SMS / WhatsApp
                                            {!phoneVerified && (
                                                <span className="text-amber-500 text-[10px]">(unverified)</span>
                                            )}
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            ) : (
                                /* Single channel — show pill label */
                                <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full w-fit ${
                                    hasEmail
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "bg-green-50 text-green-700 border border-green-200"
                                }`}>
                                    {hasEmail
                                        ? <><Mail className="w-3.5 h-3.5" /> Email</>
                                        : <><Phone className="w-3.5 h-3.5" /> SMS / WhatsApp</>
                                    }
                                </div>
                            )}

                            {/* Recipient row */}
                            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 flex items-center gap-2">
                                <span className="font-medium text-gray-500">To:</span>
                                <span className="font-semibold text-gray-800">
                                    {activeChannel === "email" ? email : phone}
                                </span>
                            </div>

                            {/* Subject — only for email */}
                            {activeChannel === "email" && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Your upcoming stay at Eygar"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                    />
                                </div>
                            )}

                            {/* Message body */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Message
                                </label>
                                <textarea
                                    rows={activeChannel === "email" ? 5 : 4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={
                                        activeChannel === "email"
                                            ? `Hi ${user.first_name || "there"},\n\nLooking forward to hosting you…`
                                            : `Hi ${user.first_name || "there"}, this is a message from your host…`
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                />
                                <div className="flex justify-end mt-0.5">
                                    <span className={`text-[10px] ${message.length > 500 ? "text-red-500" : "text-gray-400"}`}>
                                        {message.length} chars
                                    </span>
                                </div>
                            </div>

                            {/* Warning for unverified */}
                            {activeChannel === "email" && !emailVerified && (
                                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                    <ShieldX className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>This guest&apos;s email is not verified. The message may not be delivered.</span>
                                </div>
                            )}
                            {activeChannel === "sms" && !phoneVerified && (
                                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                    <ShieldX className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>This guest&apos;s phone number is not verified. Delivery is not guaranteed.</span>
                                </div>
                            )}

                            {sendError && (
                                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    {sendError}
                                </div>
                            )}

                            {sent && (
                                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                    {activeChannel === "email"
                                        ? "Email client opened. Message sent successfully."
                                        : "WhatsApp/SMS opened. Message ready to send."}
                                </div>
                            )}
                        </>
                    )}

                    {/* Footer buttons */}
                    <div className="flex gap-2 pt-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={onClose}
                        >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Cancel
                        </Button>

                        {!noneAvailable && (
                            <Button
                                size="sm"
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={sending || !message.trim()}
                                onClick={handleSend}
                            >
                                {sending ? (
                                    <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                                ) : (
                                    <Send className="w-3.5 h-3.5 mr-1" />
                                )}
                                {activeChannel === "email" ? "Open Email" : "Open WhatsApp"}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ─────────────────── Booking Card ─────────────────── */

function BookingCard({ booking, onViewDetails, onApprove, onMessage, approving }) {
    const guestName =
        booking?.user_snapshot?.first_name ||
        booking?.user_snapshot?.email ||
        "Guest";
    const guestAvatar = booking?.user_snapshot?.avatar_url || "";
    const propertyTitle = booking?.property_snapshot?.title || "Property";
    const bookingStatus = booking?.booking_status || "unknown";
    const checkoutStatus = booking?.checkout_status || "";
    const displayStatus = checkoutStatus === "checked_in" ? "checked_in" : bookingStatus;
    const isApproved =
        bookingStatus === "host_approved" ||
        bookingStatus === "booking_confirmed" ||
        bookingStatus === "confirmed";
    const bookingId = booking?.id || booking?._id;

    // Check if the booking is "active" (for showing message button highlighted)
    const isActive =
        checkoutStatus === "checked_in" || isApproved;

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-purple-100">
                        <AvatarImage src={guestAvatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                            {String(guestName)[0]?.toUpperCase() || "G"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold text-sm text-gray-900">{guestName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[160px]">{propertyTitle}</div>
                    </div>
                </div>
                <Badge className={`flex items-center gap-1 text-xs ${getStatusColor(displayStatus)}`}>
                    {getStatusIcon(displayStatus)}
                    <span className="capitalize">{displayStatus.replace(/_/g, " ")}</span>
                </Badge>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                        <div className="text-gray-400">Check-in</div>
                        <div className="font-medium text-gray-800">{formatDate(booking.check_in_date)}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <div>
                        <div className="text-gray-400">Check-out</div>
                        <div className="font-medium text-gray-800">{formatDate(booking.check_out_date)}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                        <div className="text-gray-400">Guests</div>
                        <div className="font-medium text-gray-800">{booking.guests_count ?? "—"}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <DollarSign className="w-3.5 h-3.5 text-green-400" />
                    <div>
                        <div className="text-gray-400">Total</div>
                        <div className="font-medium text-gray-800">{formatMoney(booking.total_amount, booking.currency)}</div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
                {/* Message — highlighted for active bookings */}
                <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className={`flex-1 h-8 text-xs ${
                        isActive
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : ""
                    }`}
                    onClick={() => onMessage?.(booking)}
                >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    Message
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={() => onViewDetails?.(booking)}
                >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View
                </Button>

                {!isApproved && (
                    <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={approving}
                        onClick={() => onApprove?.(bookingId)}
                    >
                        {approving ? (
                            <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        )}
                        {approving ? "Approving..." : "Approve"}
                    </Button>
                )}
            </div>
        </div>
    );
}

/* ─────────────────── Main Tab ─────────────────── */

const TabMyBookings = ({ onViewDetails }) => {
    const { data: allBookings = [], isLoading, refetch } = useListHostUpcomingBookingsQuery(
        { limit: 100, offset: 0 }
    );
    const [hostApprove, { isLoading: approving }] = useHostApproveBookingMutation();

    // Messaging dialog state
    const [messageTarget, setMessageTarget] = useState(null); // booking object

    const activeBookings = allBookings.filter((b) => {
        const cs = b?.checkout_status || "";
        const bs = b?.booking_status || "";
        return (
            cs === "checked_in" ||
            bs === "host_approved" ||
            bs === "booking_confirmed" ||
            bs === "confirmed"
        );
    });

    const upcomingBookings = allBookings.filter((b) => {
        const bs = b?.booking_status || "";
        const cs = b?.checkout_status || "";
        return (
            cs !== "checked_in" &&
            (bs === "pending_payment" ||
                bs === "payment_confirmed" ||
                bs === "pending")
        );
    });

    const onApprove = async (bookingId) => {
        try {
            await hostApprove({ bookingId }).unwrap();
            refetch();
        } catch (e) {
            console.error("Approve failed:", e);
        }
    };

    const renderEmpty = (msg) => (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Calendar className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">{msg}</p>
        </div>
    );

    const renderGrid = (bookings) => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border rounded-xl p-4 animate-pulse bg-gray-50 h-40" />
                    ))}
                </div>
            );
        }
        if (!bookings.length) return renderEmpty("No bookings in this category.");
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                    <BookingCard
                        key={booking.id || booking._id}
                        booking={booking}
                        onViewDetails={onViewDetails}
                        onApprove={onApprove}
                        onMessage={(b) => setMessageTarget(b)}
                        approving={approving}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Active / Checked-in", value: activeBookings.length, color: "bg-green-50 text-green-700 border-green-200" },
                    { label: "Pending Approval", value: upcomingBookings.length, color: "bg-amber-50 text-amber-700 border-amber-200" },
                    { label: "Total Bookings", value: allBookings.length, color: "bg-purple-50 text-purple-700 border-purple-200" },
                ].map((s) => (
                    <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
                        <div className="text-2xl font-bold">{isLoading ? "…" : s.value}</div>
                        <div className="text-xs mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-4">
                    <TabsTrigger value="active" className="text-xs sm:text-sm">
                        Active
                        {activeBookings.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-green-600 text-white text-[10px] font-bold">
                                {activeBookings.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                        Upcoming
                        {upcomingBookings.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                                {upcomingBookings.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                        All
                        {allBookings.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                                {allBookings.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    {renderGrid(activeBookings)}
                </TabsContent>

                <TabsContent value="upcoming">
                    {renderGrid(upcomingBookings)}
                </TabsContent>

                <TabsContent value="all">
                    {renderGrid(allBookings)}
                </TabsContent>
            </Tabs>

            {/* Message Guest Dialog */}
            <MessageGuestDialog
                booking={messageTarget}
                open={Boolean(messageTarget)}
                onClose={() => setMessageTarget(null)}
            />
        </div>
    );
};

export default TabMyBookings;
