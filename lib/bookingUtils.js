export const asDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
};

export const isWithinCheckInWindow = (booking, now = new Date()) => {
    if (!booking) return false;
    const checkIn = asDate(booking.check_in_date);
    const checkOut = asDate(booking.check_out_date);
    if (!checkIn || !checkOut) return false;

    // Start of check-in day (00:00:00)
    const startOfCheckIn = new Date(checkIn);
    startOfCheckIn.setHours(0, 0, 0, 0);

    // End of check-out day (23:59:59)
    const endOfCheckOut = new Date(checkOut);
    endOfCheckOut.setHours(23, 59, 59, 999);

    return now >= startOfCheckIn && now <= endOfCheckOut;
};

export const getBookingState = (booking, now = new Date()) => {
    const checkIn = asDate(booking.check_in_date);
    const checkOut = asDate(booking.check_out_date);

    if (!checkIn || !checkOut) return "unknown";

    if (booking.checkout_status === "checked_out" || checkOut < now) {
        return "history";
    }

    if (booking.checkout_status === "checked_in") {
        return "active_checked_in";
    }

    if (isWithinCheckInWindow(booking, now) && booking.checkout_status !== "checked_in") {
        return "needs_checkin";
    }

    if (checkIn > now) return "upcoming";

    return "unknown";
};
