// this is now a **server** component
import CalendarPageClient from "@/features/events/components/CalendarPageClient";

export default function CalendarPage() {
  return <CalendarPageClient daysAhead={365} />;
}
