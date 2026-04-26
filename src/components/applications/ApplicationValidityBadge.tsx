"use client";

export type ApplicationValidity = "有効" | "無効" | "未判定";

const validityStyles: Record<ApplicationValidity, string> = {
  有効:   "bg-green-50  text-green-700 ring-green-200",
  無効:   "bg-red-50    text-red-600   ring-red-200",
  未判定: "bg-slate-100 text-slate-500 ring-slate-200",
};

const BASE = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function ApplicationValidityBadge({ validity }: { validity: ApplicationValidity }) {
  return (
    <span className={`${BASE} ${validityStyles[validity]}`}>
      {validity}
    </span>
  );
}
