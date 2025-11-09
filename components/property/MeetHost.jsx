'use client';

import Link from 'next/link';
import { Gift, Star, Phone, MapPin, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGetHostProfileQuery } from '@/store/features/profileApi';

export default function MeetHost({ host_id }) {
  const { data: host, isLoading, error } = useGetHostProfileQuery(host_id);

  if (isLoading) return <div className="py-8 text-center">Loading…</div>;
  if (error) return <div className="py-8 text-center text-red-600">Failed to load host</div>;
  if (!host) return null;

  const user = host.user_info ?? {};
  const business = host.business_profile ?? {};
  const contact = host.contact_details ?? {};

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email;
  const businessName = business.business_name || null;
  const address = [contact.address_line1, contact.address_line2, contact.city, contact.state, contact.country]
    .filter(Boolean)
    .join(', ');
  const phone = contact.mobile_number || null;
  const email = user.email || null;

  // Google Maps search link (use address)
  const mapsQuery = address || businessName || '';
  const mapsUrl = mapsQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}` : '#';

  return (
    <section className="mb-8">
      <h3 className="flex items-center gap-3 text-lg font-semibold py-5">
        <Gift className="h-7 w-7 text-emerald-600 flex-shrink-0" />
        <span>Meet your host</span>
      </h3>

      <Card className="bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Avatar + basic */}
            <div className="flex-shrink-0">
              <Avatar className="w-20 h-20">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={fullName} />
                ) : (
                  <AvatarFallback>{(user.first_name || user.email || 'H').slice(0,2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{fullName}</div>
                  {businessName && <div className="text-sm text-gray-600">{businessName}</div>}
                </div>

                {/* Meta (only show if relevant) */}
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  {/* Replace these with real values if available in your API */}
                  <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>4.9</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-sm text-gray-600">54 reviews</span>
                  </div>
                </div>
              </div>

              {/* Short bio */}
              <p className="mt-3 text-sm text-gray-700">
                {business.business_description || "Passionate about providing memorable experiences and making guests feel at home."}
              </p>

              {/* Contact + address block */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
                {/* Email */}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-sm text-gray-700 rounded-md px-2 py-2 hover:bg-gray-50 transition-colors"
                    aria-label="Email host"
                  >
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{email}</span>
                  </a>
                )}

                {/* Phone */}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 text-sm text-gray-700 rounded-md px-2 py-2 hover:bg-gray-50 transition-colors"
                    aria-label="Call host"
                  >
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{phone}</span>
                  </a>
                )}

                {/* Address / Map */}
                {mapsQuery && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-700 rounded-md px-2 py-2 hover:bg-gray-50 transition-colors"
                    aria-label="Open address in Google Maps"
                  >
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{address || businessName}</span>
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-3">
                {email && (
                  <Button asChild>
                    <a href={`mailto:${email}`} className="inline-flex items-center gap-2">
                      Contact host
                    </a>
                  </Button>
                )}

                {phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${phone}`} className="inline-flex items-center gap-2">
                      Call
                    </a>
                  </Button>
                )}

                <Link href={`/hosts/${host.id}`} className="inline-block">
                  <Button variant="ghost">View profile</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
