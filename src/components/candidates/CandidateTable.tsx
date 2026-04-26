"use client";

import Link from "next/link";
import type { Candidate } from "@/app/matchhire/candidates/page";
import {
  CandidateStatusBadge,
  ValidStatusBadge,
} from "@/components/candidates/CandidateStatusBadge";

const channelLabel: Record<string, string> = {
  scout: "スカウト",
  dm: "DM",
  direct: "ダイレクト",
};

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        該当する候補者が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">氏名</th>
            <th className="px-4 py-3">スキル</th>
            <th className="px-4 py-3">応募経路</th>
            <th className="px-4 py-3">ステータス</th>
            <th className="px-4 py-3">有効応募</th>
            <th className="px-4 py-3">最終更新日</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {candidates.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/matchhire/candidates/${c.id}`}
                  className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                >
                  {c.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {channelLabel[c.channel] ?? c.channel}
              </td>
              <td className="px-4 py-3">
                <CandidateStatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3">
                <ValidStatusBadge status={c.valid} />
              </td>
              <td className="px-4 py-3 text-gray-500">{c.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
