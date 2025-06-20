export const dynamic = 'force-dynamic';

// this is now a **server** component
import HomePageClient from "@/features/events/components/HomePageClient";

export default function HomePage() {
  return <HomePageClient daysAhead={365} />;
}
