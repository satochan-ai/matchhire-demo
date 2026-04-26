"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/matchhire/dashboard":   "ダッシュボード",
  "/matchhire/candidates":  "候補者管理",
  "/matchhire/applications": "応募管理",
  "/matchhire/owners":      "担当者分析",
  "/matchhire/jobs":        "求人管理",
  "/matchhire/ng-reasons":  "NG理由分析",
};

function resolveTitle(pathname: string): string {
  // 完全一致を優先
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // プレフィックス一致（詳細ページなど）
  for (const [key, label] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(key + "/")) return label;
  }
  return "MatchHire";
}

export function Header() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-gray-200 bg-white px-6 gap-3">
      {/* 現在ページ名 */}
      <h1 className="text-sm font-semibold text-gray-800">{title}</h1>

      {/* 右側：将来のユーザーアイコン等の置き場 */}
      <div className="ml-auto flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
          M
        </span>
      </div>
    </header>
  );
}
