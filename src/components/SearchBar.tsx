"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

const SearchIcon = ({ color = "currentColor", className }: { color?: string; className?: string }) => (
  <svg className={className ?? "icon"} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"
      fill={color}
    />
  </svg>
);

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/sites?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchIcon color="var(--color-text-grey)" className="search-icon-abs" />
    </form>
  );
}

export function HeroSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/sites?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="hero-search-box" onSubmit={handleSubmit}>
      <input
        type="text"
        className="hero-search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="hero-search-btn" aria-label="Search heritage sites">
        <SearchIcon color="var(--color-white)" />
      </button>
    </form>
  );
}
