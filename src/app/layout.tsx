// src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/theme.css";
import { StackedLayout } from "@/components/catalyst/stacked-layout";
import { AppFooter, AppNavbar, AppSidebar } from "@/components/AppNavigation";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryProvider } from "@/lib/reactQuery";

export const metadata: Metadata = {
  title: "ConnectMore",
  description: "Connect with your community through amazing events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body>
          <ReactQueryProvider>
            <StackedLayout navbar={<AppNavbar />} sidebar={<AppSidebar />} footer={<AppFooter />}>
              {children}
            </StackedLayout>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
