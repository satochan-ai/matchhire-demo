"use client";

import type { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 p-4 md:flex-row md:flex-wrap md:items-center">
      {children}
    </div>
  );
}
