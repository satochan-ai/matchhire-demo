"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface MobileListCardProps {
  href: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** モバイル一覧カードの外形（枠・タップ領域）だけを共通化する薄いラッパー。中身は各画面が組み立てる */
export function MobileListCard({ href, children, "aria-label": ariaLabel }: MobileListCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="block min-h-[44px] rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
    >
      {children}
    </Link>
  );
}
