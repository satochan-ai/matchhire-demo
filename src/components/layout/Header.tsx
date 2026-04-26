"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE;

const MODE_LABEL: Record<string, string> = {
  csv:    "CSV PRODUCTION",
  sheets: "SHEETS MODE",
};

const MODE_STYLE: Record<string, string> = {
  csv:    "bg-green-100 text-green-700 border border-green-200",
  sheets: "bg-purple-100 text-purple-700 border border-purple-200",
};

function DataModeBadge() {
  const label = MODE_LABEL[DATA_SOURCE ?? ""] ?? "DEMO MODE";
  const style = MODE_STYLE[DATA_SOURCE ?? ""] ?? "bg-amber-100 text-amber-700 border border-amber-200";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${style}`}>
      {label}
    </span>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/matchhire/dashboard":    "ダッシュボード",
  "/matchhire/candidates":   "候補者管理",
  "/matchhire/applications": "応募管理",
  "/matchhire/owners":       "担当者分析",
  "/matchhire/jobs":         "求人管理",
  "/matchhire/ng-reasons":   "NG理由分析",
};

function resolveTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [key, label] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(key + "/")) return label;
  }
  return "MatchHire";
}

/** モバイルナビ用（サイドバーと同じリンクを短縮ラベルで横並び） */
const MOBILE_NAV: { label: string; href: string }[] = [
  { label: "ダッシュボード", href: "/matchhire/dashboard" },
  { label: "候補者",         href: "/matchhire/candidates" },
  { label: "応募",           href: "/matchhire/applications" },
  { label: "担当者",         href: "/matchhire/owners" },
  { label: "求人",           href: "/matchhire/jobs" },
  { label: "NG理由",         href: "/matchhire/ng-reasons" },
];

export function Header() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <>
      {/* ───── メインヘッダー ───── */}
      <header className="flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-4 gap-2 shadow-sm md:px-6 md:gap-3">
        {/* モバイル：MatchHireロゴを表示（サイドバーが隠れるため） */}
        <span className="text-sm font-bold tracking-wide text-slate-800 md:hidden">
          Match<span className="text-blue-500">Hire</span>
        </span>
        <span className="hidden text-slate-300 md:block select-none">|</span>

        {/* 現在ページ名 */}
        <h1 className="text-sm font-semibold text-slate-800 truncate">{title}</h1>
        <span className="text-slate-300 select-none">|</span>
        <span className="hidden text-xs text-slate-400 sm:block">
          スカウトから入社までを見える化
        </span>

        {/* 右側：データモードバッジ + ユーザーアイコン */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <DataModeBadge />
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
            M
          </span>
        </div>
      </header>

      {/* ───── モバイル専用ナビ（md以上は非表示） ───── */}
      <nav className="md:hidden overflow-x-auto border-b border-slate-100 bg-white px-3 scrollbar-hide">
        <ul className="flex gap-1 py-2">
          {MOBILE_NAV.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className={`inline-block rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
