"use client";

import type { NgReasonCount } from "@/lib/mockData";

interface NgReasonTableProps {
  data: NgReasonCount[];
  total: number;
}

export function NgReasonTable({ data, total }: NgReasonTableProps) {
  const active = data.filter((d) => d.count > 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-400">
        該当する不採用データがありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">NG理由</th>
            <th className="px-4 py-3 text-right">件数</th>
            <th className="px-4 py-3">割合</th>
            <th className="px-4 py-3 w-40">構成比</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {active.map((row, i) => (
            <tr key={row.reason} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    {i + 1}
                  </span>
                  {row.reason}
                </span>
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-700">
                {row.count}
              </td>
              <td className="px-4 py-3 tabular-nums text-gray-600">
                {row.rate.toFixed(1)}%
              </td>
              <td className="px-4 py-3">
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-blue-400 transition-all"
                    style={{ width: `${row.rate}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
          {/* 合計行 */}
          <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold">
            <td className="px-4 py-3 text-gray-700">合計</td>
            <td className="px-4 py-3 text-right tabular-nums text-gray-700">{total}</td>
            <td className="px-4 py-3 text-gray-500">100%</td>
            <td className="px-4 py-3" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
