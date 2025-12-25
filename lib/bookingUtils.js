export const asDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
};

export const getBookingState = (booking, now = new Date()) => {
    const checkIn = asDate(booking.check_in_date);
    const checkOut = asDate(booking.check_out_date);

    if (!checkIn || !checkOut) return "unknown";

    if (booking.checkout_status === "checked_out" || checkOut < now) {
        return "history";
    }

    if (
        now >= checkIn &&
        now < checkOut &&
        booking.checkout_status === "checked_in"
    ) {
        return "active_checked_in";
    }

    if (checkIn <= now && booking.checkout_status === "not_checked_in") {
        return "needs_checkin";
    }

    if (checkIn > now) return "upcoming";

    return "unknown";
};
