"use client";
import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, LogOut, ListVideo, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigationProps {
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  session: any;
  handleSignOut: () => void;
}

export function Navigation({
  currentView,
  setCurrentView,
  handleSearch,
  searchInputRef,
  search,
  setSearch,
  session,
  handleSignOut,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const topRoutes: Record<string, string> = {
    home: "Home",
    tvshows: "TV Shows",
  };

  const dropdownRoutes: Record<string, { label: string; icon: React.ReactNode }> = {
    watchlist: {
      label: "My List",
      icon: <ListVideo className="w-4 h-4 mr-2" />,
    },
    favorites: {
      label: "Favorites",
      icon: <Star className="w-4 h-4 mr-2 text-yellow-400" />,
    },
  };

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 px-4 md:px-12 py-3 ${
        scrolled ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto text-white">
        {/* Left Section */}
        <div className="flex items-center space-x-10">
          <h1
            className="text-2xl font-black text-red-600 tracking-wide cursor-pointer"
            onClick={() => router.push("/")}
          >
            NETFLIX
          </h1>
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            {Object.entries(topRoutes).map(([route, label]) => (
              <button
                key={route}
                onClick={() => {
                  setCurrentView(route);
                  router.push(`/${route}`);
                }}
                className={`relative transition text-gray-400 hover:text-white ${
                  currentView === route ? "text-white font-semibold" : ""
                }`}
              >
                <span>{label}</span>
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-red-600 transition-all duration-300 ${
                    currentView === route ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6 relative">
          {/* Search */}
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <Search className="text-white w-5 h-5" />
            </button>
          ) : (
            <form onSubmit={handleSearch} className="relative w-64 transition-all duration-300 ease-in-out">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Titles, people, genres"
                value={search}
                autoFocus
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => setShowSearch(false)}
                className="w-full pl-4 pr-4 py-2 bg-white/10 text-white placeholder-gray-300 rounded-md border border-transparent focus:outline-none focus:ring-1 focus:ring-red-600 text-sm bg-black"
              />
            </form>
          )}

          {/* Profile Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
              <ChevronDown className="w-4 h-4 text-white" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-gray-700 rounded-lg shadow-xl py-3 text-sm">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-gray-300 font-semibold">{session?.user?.name || "User"}</p>
                  <p className="text-gray-500 text-xs">Logged in as</p>
                </div>

                {/* Dropdown Navigation Links */}
                {Object.entries(dropdownRoutes).map(([route, { label, icon }]) => (
                  <button
                    key={route}
                    onClick={() => {
                      setCurrentView(route);
                      setShowDropdown(false);
                      router.push(`/${route}`);
                    }}
                    className="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition"
                  >
                    {icon}
                    {label}
                  </button>
                ))}

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
