"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n"

const PopularDestinationsSection = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-blue-50 py-12">
      <div className="container mx-auto px-4 mb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t("home.PopularDestinations_title")}</h2>
            <p className="text-gray-600">{t("home.PopularDestinations_desc")}</p>
          </div>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center w-full sm:w-auto"
          >
            View All →
          </Button>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dubai - Large Card */}
          <div className="lg:row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer">
            <div className="relative h-64 md:h-80 lg:h-full">
              <img
                src="https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg"
                alt="Dubai"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Popular Badge */}
              <Badge className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full">
                {t("home.popular")}
              </Badge>

              {/* Content */}
              <div
                className="absolute bottom-6 left-6 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                <h3 className="text-2xl font-bold mb-1">Dubai</h3>
                <p className="text-sm opacity-90 mb-2">United Arab Emirates</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm">
                  <span>1247 properties</span>
                  <span className="hidden sm:inline">•</span>
                  <span>From $89/night</span>
                </div>
              </div>
            </div>
          </div>

          {/* Abu Dhabi */}
          <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
            <div className="relative h-48 sm:h-56">
              <img
                src="https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg"
                alt="Abu Dhabi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <Badge className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full">
                {t("home.popular")}
              </Badge>
              <div
                className="absolute bottom-4 left-4 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-1">Abu Dhabi</h3>
                <p className="text-sm opacity-90">United Arab Emirates</p>
              </div>
            </div>
          </div>

          {/* Sharjah */}
          <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
            <div className="relative h-48 sm:h-56">
              <img
                src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg"
                alt="Sharjah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <Badge className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full">
                {t("home.popular")}
              </Badge>
              <div
                className="absolute bottom-4 left-4 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-1">Sharjah</h3>
                <p className="text-sm opacity-90">United Arab Emirates</p>
              </div>
            </div>
          </div>

          {/* Ras Al Khaimah */}
          <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
            <div className="relative h-48 sm:h-56">
              <img
                src="https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg"
                alt="Ras Al Khaimah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div
                className="absolute bottom-4 left-4 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-1">Ras Al Khaimah</h3>
                <p className="text-sm opacity-90">United Arab Emirates</p>
              </div>
            </div>
          </div>

          {/* Fujairah */}
          <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
            <div className="relative h-48 sm:h-56">
              <img
                src="https://images.pexels.com/photos/1320831/pexels-photo-1320831.jpeg"
                alt="Fujairah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <Badge className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full">
                {t("home.popular")}
              </Badge>
              <div
                className="absolute bottom-4 left-4 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-1">Fujairah</h3>
                <p className="text-sm opacity-90">United Arab Emirates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopularDestinationsSection
