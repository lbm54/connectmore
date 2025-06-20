import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Car, 
  Wifi, 
  Coffee, 
  Monitor 
} from 'lucide-react';

type PublicVenueCardProps = {
  venue: {
    id: number;
    name: string;
    description?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    email?: string;
    website_url?: string;
    capacity?: number;
    image_url?: string;
    parking_available?: boolean;
    wheelchair_accessible?: boolean;
    wifi_available?: boolean;
    catering_available?: boolean;
    av_equipment_available?: boolean;
    eventCount?: number;
  };
};

export default function PublicVenueCard({ venue }: PublicVenueCardProps) {
  const address = [venue.address_line1, venue.city, venue.state, venue.zip]
    .filter(Boolean)
    .join(', ');

  const amenities = [
    venue.parking_available && { icon: Car, label: 'Parking', color: 'text-electric-blue' },
    venue.wifi_available && { icon: Wifi, label: 'WiFi', color: 'text-electric-green' },
    venue.catering_available && { icon: Coffee, label: 'Catering', color: 'text-electric-orange' },
    venue.av_equipment_available && { icon: Monitor, label: 'A/V Equipment', color: 'text-electric-pink' },
  ].filter(Boolean);

  return (
    <Card className="h-full flex flex-col bg-surface-800 border-surface-700 hover:border-primary-500 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {venue.image_url && (
            <img
              src={venue.image_url}
              alt={venue.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-surface-600"
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl leading-tight text-surface-50 mb-2">{venue.name}</CardTitle>
            {address && (
              <div className="flex items-center gap-2 text-sm text-surface-300">
                <MapPin className="w-4 h-4 flex-shrink-0 text-secondary-500" />
                <span className="line-clamp-2">{address}</span>
              </div>
            )}
          </div>
        </div>
        
        {venue.description && (
          <p className="text-sm text-surface-400 line-clamp-3 mt-3 leading-relaxed">
            {venue.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col space-y-4">
        {/* Capacity */}
        {venue.capacity && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-surface-300">
              Capacity: <span className="text-surface-50 font-medium">{venue.capacity.toLocaleString()}</span>
            </span>
          </div>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => {
              const IconComponent = amenity.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface-700 border border-surface-600 rounded-md text-xs"
                >
                  <IconComponent className={`w-3 h-3 ${amenity.color}`} />
                  <span className="text-surface-200">{amenity.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3">
          {venue.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-secondary-500" />
              <a 
                href={`tel:${venue.phone}`}
                className="text-secondary-400 hover:text-secondary-300 transition-colors"
              >
                {venue.phone}
              </a>
            </div>
          )}
          
          {venue.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-secondary-500" />
              <a 
                href={`mailto:${venue.email}`}
                className="text-secondary-400 hover:text-secondary-300 transition-colors truncate"
              >
                {venue.email}
              </a>
            </div>
          )}
        </div>

        {/* Website Button */}
        {venue.website_url && (
          <div className="mt-auto pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="w-full bg-surface-700 border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-surface-50 transition-all"
            >
              <a href={venue.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 