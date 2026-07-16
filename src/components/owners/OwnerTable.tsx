"use client";

import { DataTableShell } from "@/components/common/DataTableShell";
import type { OwnerMetrics } from "@/lib/mockData";

interface OwnerTableProps {
  metrics: OwnerMetrics[];
}

/** 率の表示。バーは大小の目安で、数値を必ず併記する（色による評価はしない） */
function RateBar({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 shrink-0 rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${clamped}%` }} />
      </div>
      <span className="tabular-nums text-slate-700">{clamped.toFixed(1)}%</span>
    </div>
  );
}

/** モバイルカード内の指標1マス */
function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-800">{value}</dd>
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
    <>
      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <DataTableShell>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
              <th scope="col" className="whitespace-nowrap px-5 py-3.5">担当者</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5">部門</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5 text-right">送信数</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5">開封率</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5">返信率</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5 text-right">有効応募</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5 text-right">面接数</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5 text-right">内定数</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3.5 text-right">承諾数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {metrics.map((m) => (
              <tr key={m.ownerId} className="transition-colors hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-800">
                  {m.ownerName}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
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
                <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">
                  {m.offerCount}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">
                  {m.acceptCount}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      </div>

      {/* モバイル: カード表示（詳細ページが無いためリンクにはしない） */}
      <div className="flex flex-col gap-2 p-3 md:hidden">
        {metrics.map((m) => (
          <div key={m.ownerId} className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="break-words text-sm font-semibold text-slate-800">{m.ownerName}</span>
              <span className="text-xs text-slate-400">{m.department}</span>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2">
              <MetricCell label="送信数"   value={`${m.sentCount}件`} />
              <MetricCell label="開封率"   value={`${m.openRate.toFixed(1)}%`} />
              <MetricCell label="返信率"   value={`${m.replyRate.toFixed(1)}%`} />
              <MetricCell label="有効応募" value={`${m.validCount}件`} />
              <MetricCell label="面接数"   value={`${m.interviewCount}件`} />
              <MetricCell label="内定数"   value={`${m.offerCount}件`} />
              <MetricCell label="承諾数"   value={`${m.acceptCount}件`} />
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
