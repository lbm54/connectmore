// this is now a **server** component
import MapPageClient from "@/features/events/components/MapPageClient";

export default function MapPage() {
  return <MapPageClient daysAhead={365} />;
} 