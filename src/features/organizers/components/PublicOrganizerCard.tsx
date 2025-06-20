import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Phone, ExternalLink, MapPin } from 'lucide-react';

type PublicOrganizerCardProps = {
  organizer: {
    id: number;
    name: string;
    image_url?: string;
    website_url?: string;
    contact_phone?: string;
    city?: string;
    state?: string;
    events_url?: string;
  };
};

export default function PublicOrganizerCard({ organizer }: PublicOrganizerCardProps) {
  const location = [organizer.city, organizer.state].filter(Boolean).join(', ');

  return (
    <Card className="h-full bg-surface-800 border-surface-700 hover:border-primary-500 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {organizer.image_url && (
            <img
              src={organizer.image_url}
              alt={organizer.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-surface-600"
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl text-surface-50 mb-2">{organizer.name}</CardTitle>
            {location && (
              <div className="flex items-center gap-2 text-sm text-surface-300">
                <MapPin className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {organizer.contact_phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-electric-green" />
            <a 
              href={`tel:${organizer.contact_phone}`}
              className="text-secondary-400 hover:text-secondary-300 transition-colors"
            >
              {organizer.contact_phone}
            </a>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          {organizer.website_url && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="w-full bg-surface-700 border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-surface-50 transition-all"
            >
              <a href={organizer.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                Website
              </a>
            </Button>
          )}
          
          {organizer.events_url && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="w-full bg-surface-700 border-secondary-600 text-secondary-400 hover:bg-secondary-600 hover:text-surface-50 transition-all"
            >
              <a href={organizer.events_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Events
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 