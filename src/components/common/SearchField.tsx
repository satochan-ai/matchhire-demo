"use client";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  "aria-label"?: string;
  name?: string;
}

export function SearchField({ value, onChange, placeholder, "aria-label": ariaLabel, name }: SearchFieldProps) {
  const active = value.trim().length > 0;

  return (
    <div className="relative w-full md:min-w-[240px] md:flex-1">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`h-10 w-full rounded-lg border pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 ${
          active ? "border-blue-300 bg-blue-50/60" : "border-gray-200 bg-white"
        }`}
      />
    </div>
  );
}
