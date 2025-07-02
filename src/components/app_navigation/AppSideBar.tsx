"use client";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, EventsIcon, OrganizersIcon, VenuesIcon, CalendarIcon, MapIcon } from "@/components/app_navigation/AppIcons"; // Adjust the import path as necessary

export function AppSidebar() {
    const pathname = usePathname();
  
    return (
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-1">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50 mb-4">
            Navigation
          </h3>
          
          <Link
            href="/home"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/home"
                ? "bg-electric-cyan/20 text-electric-cyan"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <HomeIcon isActive={pathname === "/home"} className="w-5 h-5" />
            Home
          </Link>
  
          <Link
            href="/events"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/events"
                ? "bg-electric-green/20 text-electric-green"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <EventsIcon isActive={pathname === "/events"} className="w-5 h-5" />
            Events
          </Link>
  
          <Link
            href="/organizers"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/organizers"
                ? "bg-electric-pink/20 text-electric-pink"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <OrganizersIcon isActive={pathname === "/organizers"} className="w-5 h-5" />
            Organizers
          </Link>
  
          <Link
            href="/venues"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/venues"
                ? "bg-electric-orange/20 text-electric-orange"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <VenuesIcon isActive={pathname === "/venues"} className="w-5 h-5" />
            Venues
          </Link>
  
          {/* Divider */}
          <div className="my-4 border-t border-surface-200 dark:border-surface-700" />
  
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50 mb-4">
            View Options
          </h3>
  
          <Link
            href="/calendar"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/calendar"
                ? "bg-electric-blue/20 text-electric-blue"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <CalendarIcon isActive={pathname === "/calendar"} className="w-5 h-5" />
            Calendar
          </Link>
  
          <Link
            href="/map"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/map"
                ? "bg-electric-red/20 text-electric-red"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <MapIcon isActive={pathname === "/map"} className="w-5 h-5" />
            Map
          </Link>
        </div>
  
        {/* Authentication Section at Bottom */}
        <div className="border-t border-surface-200 dark:border-surface-700 p-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="w-full rounded-lg bg-gradient-to-r from-electric-cyan via-electric-purple to-electric-pink px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton />
              <span className="text-sm text-surface-600 dark:text-surface-400">Account</span>
            </div>
          </SignedIn>
        </div>
      </div>
    );
  }