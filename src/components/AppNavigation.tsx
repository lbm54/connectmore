"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarSpacer,
  NavbarDivider,
} from "@/components/catalyst/navbar";

import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Logo from "./logo";
import { Input } from "./ui/input";

// Types for tags
interface Tag {
  tag_id: string;
  tag_name: string;
}

// Icons for navigation with theme colors
function HomeIcon({
  className = "",
  isActive = false,
}: {
  className?: string;
  isActive?: boolean;
}) {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
        clipRule="evenodd"
        fill={isActive ? "#8b5cf6" : "#06b6d4"}
      />
    </svg>
  );
}

function EventsIcon({
  className = "",
  isActive = false,
}: {
  className?: string;
  isActive?: boolean;
}) {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2ZM4.75 5.5c-.69 0-1.25.56-1.25 1.25v8.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-8.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
        clipRule="evenodd"
        fill={isActive ? "#8b5cf6" : "#10b981"}
      />
    </svg>
  );
}

function OrganizersIcon({
  className = "",
  isActive = false,
}: {
  className?: string;
  isActive?: boolean;
}) {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"
        fill={isActive ? "#8b5cf6" : "#ec4899"}
      />
    </svg>
  );
}

function VenuesIcon({
  className = "",
  isActive = false,
}: {
  className?: string;
  isActive?: boolean;
}) {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 0 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .757.433l.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        clipRule="evenodd"
        fill={isActive ? "#8b5cf6" : "#ff6b35"}
      />
    </svg>
  );
}

// function SettingsIcon({
//   className = "",
//   isActive = false,
// }: {
//   className?: string;
//   isActive?: boolean;
// }) {
//   return (
//     <svg
//       data-slot="icon"
//       viewBox="0 0 20 20"
//       aria-hidden="true"
//       className={className}
//     >
//       <path
//         fillRule="evenodd"
//         d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587L8.34 1.804ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
//         clipRule="evenodd"
//         fill={isActive ? "#8b5cf6" : "#ffd600"}
//       />
//     </svg>
//   );
// }

// function SearchIcon() {
//   return (
//     <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
//       <path
//         fillRule="evenodd"
//         d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );
// }

function CalendarIcon({
  className = "",
  isActive = false,
}: {
  className?: string;
  isActive?: boolean;
}) {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2ZM4.75 5.5c-.69 0-1.25.56-1.25 1.25v8.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-8.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
        clipRule="evenodd"
        fill={isActive ? "#8b5cf6" : "#0ea5e9"}
      />
    </svg>
  );
}

function MapIcon({
  className = "",
  isActive = false,
}: {
  className?: string;
  isActive?: boolean;
}) {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8.157 2.175a1.5 1.5 0 0 0-1.147 0l-4.084 1.69A1.5 1.5 0 0 0 2 5.251v10.877a1.5 1.5 0 0 0 2.074 1.386l3.51-1.452 4.26 1.763a1.5 1.5 0 0 0 1.146 0l4.083-1.69A1.5 1.5 0 0 0 18 14.749V3.874a1.5 1.5 0 0 0-2.073-1.386L12.417 3.94 8.157 2.175ZM7.58 5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 7.58 5Zm4.84 0a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
        fill={isActive ? "#8b5cf6" : "#ff1744"}
      />
    </svg>
  );
}

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Tags state
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Temporary filter state for the modal
  const [tempFilters, setTempFilters] = useState({
    date: searchParams.get("date") || "all",
    tags: searchParams.get("tags") || "",
  });

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const tags = await response.json();
          setAvailableTags(tags);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Initialize selected tags from URL params
  useEffect(() => {
    const urlTags = searchParams.get("tags");
    if (urlTags) {
      setSelectedTags(urlTags.split(",").filter((tag) => tag.trim()));
    }
  }, [searchParams]);

  // Handle clicks outside tag dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node) &&
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);

      // Create new URLSearchParams
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      // If we're not on events page, navigate there with search params
      if (pathname !== "/events") {
        router.push(`/events?${params.toString()}`);
      } else {
        // If we're on events page, update URL with new search params
        router.replace(`/events?${params.toString()}`);
      }
    },
    [searchParams, pathname, router]
  );

  const handleTempFilterChange = useCallback(
    (filterType: string, value: string) => {
      setTempFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    },
    []
  );

  const addTag = useCallback(
    (tagName: string) => {
      if (!selectedTags.includes(tagName)) {
        const newTags = [...selectedTags, tagName];
        setSelectedTags(newTags);
        setTempFilters((prev) => ({
          ...prev,
          tags: newTags.join(","),
        }));
      }
      setTagSearchTerm("");
      setShowTagDropdown(false);
    },
    [selectedTags]
  );

  const removeTag = useCallback(
    (tagName: string) => {
      const newTags = selectedTags.filter((tag) => tag !== tagName);
      setSelectedTags(newTags);
      setTempFilters((prev) => ({
        ...prev,
        tags: newTags.join(","),
      }));
    },
    [selectedTags]
  );

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.tag_name.toLowerCase().includes(tagSearchTerm.toLowerCase()) &&
      !selectedTags.includes(tag.tag_name)
  );

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Apply all temp filters
    Object.entries(tempFilters).forEach(([key, value]) => {
      if (value && value !== "all" && value.trim() !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Navigate to events page with filters
    if (pathname !== "/events") {
      router.push(`/events?${params.toString()}`);
    } else {
      router.replace(`/events?${params.toString()}`);
    }

    setShowFilterModal(false);
  }, [tempFilters, searchParams, pathname, router]);

  const resetTempFilters = useCallback(() => {
    const urlTags = searchParams.get("tags");
    const tags = urlTags ? urlTags.split(",").filter((tag) => tag.trim()) : [];

    setTempFilters({
      date: searchParams.get("date") || "all",
      tags: urlTags || "",
    });
    setSelectedTags(tags);
  }, [searchParams]);

  return (
    <Navbar className="dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white">
      <NavbarSection>
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          {/* try h‑10 (40 px) or h‑12 (48 px) */}
          <Logo className="h-20 w-auto" />
        </Link>

        <NavbarDivider />

        {/* Main Navigation */}
        <NavbarItem href="/home" current={pathname === "/home"}>
          <HomeIcon isActive={pathname === "/home"} />
          Home
        </NavbarItem>

        <NavbarItem href="/events" current={pathname === "/events"}>
          <EventsIcon isActive={pathname === "/events"} />
          Events
        </NavbarItem>

        <NavbarItem href="/organizers" current={pathname === "/organizers"}>
          <OrganizersIcon isActive={pathname === "/organizers"} />
          Organizers
        </NavbarItem>

        <NavbarItem href="/venues" current={pathname === "/venues"}>
          <VenuesIcon isActive={pathname === "/venues"} />
          Venues
        </NavbarItem>

        {/* <NavbarItem href="/settings" current={pathname === "/settings"}>
          <SettingsIcon isActive={pathname === "/settings"} />
          Settings
        </NavbarItem> */}
      </NavbarSection>

      <NavbarSpacer />

      <NavbarSection>
        {/* Search and Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64 text-cyan-400 dark:text-purple-400 bg-zinc-800/50 dark:bg-zinc-900/50 border-2 border-cyan-500/60 dark:border-purple-500/60 focus-visible:border-cyan-400 dark:focus-visible:border-purple-400 hover:border-cyan-400/80 dark:hover:border-purple-400/80 placeholder:text-cyan-400/70 dark:placeholder:text-purple-400/70 shadow-lg shadow-cyan-500/20 dark:shadow-purple-500/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Filter Icon Button */}
          <button
            onClick={() => {
              resetTempFilters();
              setShowFilterModal(true);
            }}
            className="p-1.5 rounded transition-colors duration-300"
            title="Filter events"
            style={{ color: "#10b981" }} // electric-green as default
          >
            <svg
              className="w-4 h-4 drop-shadow-lg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{
                filter: "drop-shadow(0 0 4px currentColor)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ec4899"; // electric-pink on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#10b981"; // back to electric-green
              }}
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <NavbarDivider />

        {/* View Options */}
        <NavbarItem href="/calendar">
          <CalendarIcon isActive={pathname === "/calendar"} />
          Calendar
        </NavbarItem>

        <NavbarItem href="/map">
          <MapIcon isActive={pathname === "/map"} />
          Map
        </NavbarItem>

        <NavbarDivider />

        {/* Auth */}
        <SignedOut>
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </NavbarSection>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg max-w-md w-full mx-4 border-2 border-electric-cyan/20">
            <h3 className="text-lg font-semibold mb-4 text-gradient-primary">
              Filter Events
            </h3>

            <div className="space-y-4">
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-electric-blue">
                  Date
                </label>
                <select
                  value={tempFilters.date}
                  onChange={(e) =>
                    handleTempFilterChange("date", e.target.value)
                  }
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-700 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              {/* Tag Filter - Autocomplete */}
              <div>
                <label className="block text-sm font-medium mb-2 text-electric-green">
                  Tags
                </label>

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-electric-pink/20 text-electric-pink text-xs rounded-full border border-electric-pink/30"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-electric-red transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag Input with Dropdown */}
                <div className="relative" ref={tagDropdownRef}>
                  <input
                    ref={tagInputRef}
                    type="text"
                    placeholder="Search and select tags..."
                    value={tagSearchTerm}
                    onChange={(e) => {
                      setTagSearchTerm(e.target.value);
                      setShowTagDropdown(true);
                    }}
                    onFocus={() => setShowTagDropdown(true)}
                    className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-700 focus:border-electric-pink focus:ring-1 focus:ring-electric-pink"
                  />

                  {/* Dropdown */}
                  {showTagDropdown && filteredTags.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                      {filteredTags.slice(0, 10).map((tag) => (
                        <button
                          key={tag.tag_id}
                          onClick={() => addTag(tag.tag_name)}
                          className="w-full text-left px-3 py-2 hover:bg-electric-cyan/10 dark:hover:bg-electric-purple/10 text-sm border-b border-surface-200 dark:border-surface-600 last:border-b-0"
                        >
                          {tag.tag_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </Navbar>
  );
}

export function AppSidebar() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      {/* User Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
          Account
        </h3>
        <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
          <div>Welcome back!</div>
          <div className="text-xs">Not signed in</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg">
            Create Event
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg">
            My Events
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg">
            Favorites
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
          Recent Activity
        </h3>
        <div className="text-sm text-surface-600 dark:text-surface-400">
          No recent activity
        </div>
      </div>
    </div>
  );
}

export function AppFooter() {
  return (
    <footer className="mt-auto bg-surface-900 dark:bg-surface-900 border-t-2 border-electric-cyan/20 dark:border-electric-purple/20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gradient-primary">
              ConnectMore
            </h3>
            <p className="text-sm text-surface-200 leading-relaxed">
              Bringing communities together through amazing events and
              meaningful connections.
            </p>
            <div className="text-sm text-surface-200 ">
              <div className="mb-1">Right Path Programming, LLC</div>
              <div className="mb-1">3532 Savannah Park Lane</div>
              <div>Birmingham, Alabama 35216</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-electric-cyan">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/events"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <a
                  href="/organizers"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Event Organizers
                </a>
              </li>
              <li>
                <a
                  href="/venues"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Find Venues
                </a>
              </li>
              <li>
                <a
                  href="/calendar"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Event Calendar
                </a>
              </li>
              <li>
                <a
                  href="/map"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Event Map
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-electric-pink">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/help"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:rightpathprogramming@gmail.com"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-electric-orange">
              Connect & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="pt-2">
              <h5 className="text-sm font-medium text-electric-yellow mb-3">
                Follow Us
              </h5>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a
                  href="https://facebook.com/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-blue/30 hover:border-electric-blue transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-blue group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Twitter/X */}
                <a
                  href="https://twitter.com/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-cyan/30 hover:border-electric-cyan transition-all duration-300 hover:shadow-lg hover:shadow-electric-cyan/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-cyan group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-pink/30 hover:border-electric-pink transition-all duration-300 hover:shadow-lg hover:shadow-electric-pink/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-pink group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.33-1.291C4.239 14.885 3.76 13.623 3.76 12.207c0-1.415.479-2.678 1.36-3.489.88-.81 2.031-1.299 3.329-1.299 1.297 0 2.448.49 3.33 1.299.88.81 1.36 2.074 1.36 3.489 0 1.416-.48 2.678-1.36 3.48-.882.811-2.033 1.301-3.33 1.301zm7.83-1.734c-.297.341-.65.613-1.047.805-.396.193-.826.289-1.29.289-.463 0-.894-.096-1.29-.289-.397-.192-.75-.464-1.047-.805-.297-.34-.531-.743-.7-1.211-.169-.467-.254-.972-.254-1.515 0-.543.085-1.048.254-1.515.169-.468.403-.871.7-1.211.297-.341.65-.613 1.047-.805.396-.193.827-.289 1.29-.289.464 0 .894.096 1.29.289.397.192.75.464 1.047.805.297.34.531.743.7 1.211.169.467.254.972.254 1.515 0 .543-.085 1.048-.254 1.515-.169.468-.403.871-.7 1.211z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-green/30 hover:border-electric-green transition-all duration-300 hover:shadow-lg hover:shadow-electric-green/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-green group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/rightpathprogramming"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-yellow/30 hover:border-electric-yellow transition-all duration-300 hover:shadow-lg hover:shadow-electric-yellow/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-yellow group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-electric-cyan/10 dark:border-electric-purple/10">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-surface-400 dark:text-surface-500">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Right Path Programming, LLC. All
              rights reserved.
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="/accessibility"
                className="hover:text-electric-green transition-colors duration-300"
              >
                Accessibility
              </a>
              <a
                href="/sitemap"
                className="hover:text-electric-green transition-colors duration-300"
              >
                Sitemap
              </a>
              <a
                href="/status"
                className="hover:text-electric-green transition-colors duration-300"
              >
                System Status
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
