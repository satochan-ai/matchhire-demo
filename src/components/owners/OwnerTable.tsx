"use client";

import type { OwnerMetrics } from "@/lib/mockData";

interface OwnerTableProps {
  metrics: OwnerMetrics[];
}

function RateBar({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const color =
    clamped >= 40 ? "bg-green-400" :
    clamped >= 20 ? "bg-yellow-400" :
    "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      <span className="tabular-nums text-slate-700">{clamped.toFixed(1)}%</span>
    </div>
  );
}

export function OwnerTable({ metrics }: OwnerTableProps) {
  if (metrics.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-400">
        データがありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
            <th className="px-5 py-3.5 whitespace-nowrap">担当者</th>
            <th className="px-5 py-3.5 whitespace-nowrap">部門</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">送信数</th>
            <th className="px-5 py-3.5 whitespace-nowrap">開封率</th>
            <th className="px-5 py-3.5 whitespace-nowrap">返信率</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">有効応募</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">面接数</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">内定数</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">承諾数</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {metrics.map((m) => (
            <tr key={m.ownerId} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                {m.ownerName}
              </td>
              <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                {m.department}
              </td>
              <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-slate-700">
                {m.sentCount}
              </td>
              <td className="px-5 py-3.5">
                <RateBar value={m.openRate} />
              </td>
              <td className="px-5 py-3.5">
                <RateBar value={m.replyRate} />
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">
                {m.validCount}
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">
                {m.interviewCount}
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums">
                <span className={m.offerCount > 0 ? "font-semibold text-green-700" : "text-slate-400"}>
                  {m.offerCount}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums">
                <span className={m.acceptCount > 0 ? "font-semibold text-emerald-700" : "text-slate-400"}>
                  {m.acceptCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
