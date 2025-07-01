"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef, Suspense } from "react";
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
import {
  HomeIcon,
  EventsIcon,
  OrganizersIcon,
  VenuesIcon,
  CalendarIcon,
  MapIcon,
  // HamburgerIcon,
  SearchIcon,
  FilterIcon,
  CloseIcon,
} from "@/components/AppIcons";
import MobileLogo from "./mobile_logo";

// Types for tags
interface Tag {
  tag_id: string;
  tag_name: string;
}

// Create an internal navbar component that uses useSearchParams
function AppNavbarInternal() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mobile state
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Existing state
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

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileSearch(false);
  }, [pathname]);

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
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Navbar className="dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white">
          <NavbarSection>
            {/* Logo */}
            <Link href="/home" className="flex items-center">
              {/* Mobile Logo - Image */}
              <MobileLogo className="h-12 w-auto lg:hidden" />

              {/* Desktop Logo - SVG */}
              <Logo className="hidden lg:block h-12 w-auto" />
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
                style={{ color: "#10b981" }}
              >
                <FilterIcon className="w-4 h-4 drop-shadow-lg" />
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
        </Navbar>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Logo - Left aligned, constrained width */}
            <div className="flex-shrink-0 w-24">
              <Link href="/home" className="flex items-center">
                <MobileLogo className="h-8 w-auto max-w-24" />
              </Link>
            </div>

            {/* Mobile Actions - Right aligned */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                style={{ color: showMobileSearch ? "#06b6d4" : undefined }}
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Filter Button */}
              <button
                onClick={() => {
                  resetTempFilters();
                  setShowFilterModal(true);
                }}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                style={{ color: "#10b981" }}
              >
                <FilterIcon className="w-5 h-5" />
              </button>

              {/* User Button */}
              <div className="ml-1">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar - Slides down */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showMobileSearch
                ? "max-h-20 opacity-100 mt-3"
                : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <Input
              type="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full text-cyan-400 dark:text-purple-400 bg-zinc-50 dark:bg-zinc-800 border-2 border-cyan-500/60 dark:border-purple-500/60 focus-visible:border-cyan-400 dark:focus-visible:border-purple-400 hover:border-cyan-400/80 dark:hover:border-purple-400/80 placeholder:text-cyan-400/70 dark:placeholder:text-purple-400/70 shadow-lg shadow-cyan-500/20 dark:shadow-purple-500/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85%] bg-white dark:bg-zinc-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
              
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              <Link
                href="/home"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/home"
                    ? "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <HomeIcon isActive={pathname === "/home"} className="w-5 h-5" />
                Home
              </Link>

              <Link
                href="/events"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/events"
                    ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <EventsIcon
                  isActive={pathname === "/events"}
                  className="w-5 h-5"
                />
                Events
              </Link>

              <Link
                href="/organizers"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/organizers"
                    ? "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <OrganizersIcon
                  isActive={pathname === "/organizers"}
                  className="w-5 h-5"
                />
                Organizers
              </Link>

              <Link
                href="/venues"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/venues"
                    ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <VenuesIcon
                  isActive={pathname === "/venues"}
                  className="w-5 h-5"
                />
                Venues
              </Link>

              <div className="my-4 border-t border-zinc-200 dark:border-zinc-700" />

              <Link
                href="/calendar"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/calendar"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <CalendarIcon
                  isActive={pathname === "/calendar"}
                  className="w-5 h-5"
                />
                Calendar View
              </Link>

              <Link
                href="/map"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/map"
                    ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <MapIcon isActive={pathname === "/map"} className="w-5 h-5" />
                Map View
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Filter Modal - Same for both mobile and desktop */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
    </>
  );
}

// Create a fallback component for when Suspense is loading
function AppNavbarFallback() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Fallback */}
      <div className="hidden lg:block">
        <Navbar className="dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white">
          <NavbarSection>
            <Link href="/home" className="flex items-center">
              <Logo className="h-20 w-auto" />
            </Link>
            <NavbarDivider />
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
            <NavbarItem href="/calendar" current={pathname === "/calendar"}>
              <CalendarIcon isActive={pathname === "/calendar"} />
              Calendar
            </NavbarItem>
            <NavbarItem href="/map" current={pathname === "/map"}>
              <MapIcon isActive={pathname === "/map"} />
              Map
            </NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-gradient-to-r from-electric-cyan via-electric-purple to-electric-pink px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </NavbarSection>
        </Navbar>
      </div>

      {/* Mobile Fallback */}
      <div className="lg:hidden">
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0 w-24">
              <Link href="/home" className="flex items-center">
                <MobileLogo className="h-8 w-auto max-w-24" />
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="p-2 text-zinc-600 dark:text-zinc-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Export the wrapped component
export function AppNavbar() {
  return (
    <Suspense fallback={<AppNavbarFallback />}>
      <AppNavbarInternal />
    </Suspense>
  );
}
