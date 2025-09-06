export default function DashboardLayout({ children }) {
    return (
        // This div is the main container for the dashboard's two-column layout
        <div className="flex h-full">
            {/* Main Section */}
            {/* The children prop here will be the dashboard page itself (dashboard/page.jsx) */}
            <div className="flex-grow p-6 md:p-8">{children}</div>
        </div>
    );
}
