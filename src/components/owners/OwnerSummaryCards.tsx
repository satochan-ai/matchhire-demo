"use client";

import type { OwnerMetrics } from "@/lib/mockData";

interface OwnerSummaryCardsProps {
  metrics: OwnerMetrics[];
}

/**
 * 担当者分析の総括サマリー。
 * 既存集計（computeOwnerMetrics）の合計だけを中立的に表示し、
 * 順位付け・評価（No.1等）は行わない。
 */
export function OwnerSummaryCards({ metrics }: OwnerSummaryCardsProps) {
  if (metrics.length === 0) return null;

  const totalValid     = metrics.reduce((sum, m) => sum + m.validCount, 0);
  const totalInterview = metrics.reduce((sum, m) => sum + m.interviewCount, 0);
  const totalOffer     = metrics.reduce((sum, m) => sum + m.offerCount, 0);

  const items = [
    { label: "担当者数",   value: metrics.length,  unit: "名" },
    { label: "有効応募合計", value: totalValid,      unit: "件" },
    { label: "面接合計",   value: totalInterview,  unit: "件" },
    { label: "内定合計",   value: totalOffer,      unit: "件" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-slate-500">{item.label}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
            {item.value}
            <span className="ml-1 text-xs font-medium text-slate-400">{item.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
