"use client"
import { Button } from "@/components/ui/button"
import { Shield, Award, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n"

const SafetySection = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full bg-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Safety Features */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-[#814193]" />
            <span className="text-sm font-medium text-[#814193]">{t("home.safety_section_badge")}</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("home.safety_section_title")}</h2>

          <p className="text-gray-600 mb-8">{t("home.safety_section_desc")}</p>

          <div className="space-y-6">
            {[
              {
                icon: <Shield className="h-4 w-4 text-green-600" />,
                bg: "bg-green-100",
                title: "Safety Certified",
                desc: "All properties undergo rigorous safety inspections.",
              },
              {
                icon: <Award className="h-4 w-4 text-blue-600" />,
                bg: "bg-blue-100",
                title: "Government Compliant",
                desc: "Verified compliance with local regulations and standards.",
              },
              {
                icon: <Shield className="h-4 w-4 text-purple-600" />,
                bg: "bg-purple-100",
                title: "Free Insurance",
                desc: "Comprehensive coverage for your peace of mind.",
              },
              {
                icon: <Users className="h-4 w-4 text-orange-600" />,
                bg: "bg-orange-100",
                title: "Trusted Hosts",
                desc: "Background-verified hosts with excellent ratings.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4 mt-8">
            <Button className="bg-[#814193] hover:bg-[#6d3580] text-white">{t("nav.findSafeProperty")}</Button>
            <Button variant="outline">{t("nav.becomeHost")}</Button>
          </div>
        </div>

        {/* Right Side - Safety Image */}
        <div className="relative">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg"
              alt="Premium Villa in Dubai"
              className="w-full h-full object-cover"
            />

            {/* Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-green-500 text-white text-xs">Safety Certified</Badge>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#814193]">99.8%</div>
                  <div className="text-xs text-gray-600">Safety Rating</div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900">Premium Villa in Dubai</h4>
              <p className="text-xs text-gray-600">Government Compliant • Free Insurance Included</p>
            </div>

            {/* 24/7 Badge */}
            <div className="absolute top-6 right-6 bg-[#814193] text-white px-3 py-2 rounded-lg text-center">
              <div className="text-lg font-bold">24/7</div>
              <div className="text-xs">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SafetySection
