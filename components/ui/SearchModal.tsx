"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { X, Search, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  mobile?: boolean;
  inline?: boolean;
}

export function SearchModal({
  isOpen,
  onClose,
  mobile = false,
  inline = false,
}: SearchModalProps) {
  // useRef for debounce timer — no re-renders
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // useRef for input element (uncontrolled) — no re-render on every keystroke
  const inputRef = useRef<HTMLInputElement>(null);
  // Only ONE piece of state: whether input has content (drives the arrow button visibility)
  const [hasValue, setHasValue] = useState(false);
  const router = useRouter();

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = useCallback(() => {
    const value = inputRef.current?.value ?? "";

    // Update arrow button visibility (single boolean — cheap)
    setHasValue(value.trim().length > 0);

    // Debounce the search API call using ref, not state
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed) {
        console.log("Debounced search term:", trimmed);
        // TODO: Add elasticsearch fetch here
      }
    }, 300);
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const value = inputRef.current?.value.trim();
      if (!value) return;
      router.push(`/${value}`);
      onClose();
      if (inputRef.current) inputRef.current.value = "";
      setHasValue(false);
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSubmit();
    },
    [onClose, handleSubmit]
  );

  const searchInput = (
    <form onSubmit={handleSubmit} className="relative max-w-xs">
      {/* Search icon */}
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        aria-hidden
      />

      {/* Uncontrolled input — no value prop, no re-render per keystroke */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search by username or Token ID..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={!mobile && !inline}
        className={[
          "w-full rounded-full border py-2 pr-10 pl-10 text-base",
          "bg-white text-slate-950 placeholder-slate-500",
          "dark:bg-slate-950/95 dark:text-white dark:placeholder-slate-400",
          "border-slate-300/80 dark:border-slate-800",
          "outline-0 transition-all duration-150",
          inline ? "max-w-sm" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {/* Enter / submit arrow button — visible only when input has content */}
      <button
        type="submit"
        aria-label="Submit search"
        className={[
          "absolute top-1/2 right-3 -translate-y-1/2",
          "flex items-center justify-center",
          "h-8 w-8 rounded-full",
          "bg-blue-600 text-white",
          "transition-all duration-150",
          "hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none dark:focus:ring-offset-slate-950",
          hasValue
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-75 opacity-0",
        ].join(" ")}
      >
        <CornerDownLeft size={12} strokeWidth={2.5} />
      </button>
    </form>
  );

  // ── Inline / mobile variant ──────────────────────────────────────────────
  if (mobile || inline) {
    return <div className="w-full">{searchInput}</div>;
  }

  if (!isOpen) return null;

  // ── Modal variant ────────────────────────────────────────────────────────
  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      <div
        className="animate-in zoom-in-95 relative w-full max-w-md rounded-2xl p-6 shadow-2xl duration-200"
        style={{
          backgroundColor: "#18191D",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close search"
          className="absolute top-4 right-4 rounded-full p-2 text-[#6B7280] transition-colors hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/20 focus:outline-none"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Search Identity
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Search by username or Token ID
          </p>
        </div>

        {/* Search input (with built-in arrow submit button) */}
        {searchInput}

        {/* Hint */}
        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
          Press{" "}
          <kbd className="rounded border border-slate-200/70 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            Enter
          </kbd>{" "}
          or click{" "}
          <span className="inline-flex items-center gap-0.5 text-blue-500">
            <CornerDownLeft size={10} />
          </span>{" "}
          to search
        </p>
      </div>
    </div>
  );
}
