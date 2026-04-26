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
      <div className="flex items-center justify-center py-16 text-sm text-slate-400">
        該当する候補者が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
            <th className="px-5 py-3.5 whitespace-nowrap">氏名</th>
            <th className="px-5 py-3.5 whitespace-nowrap">スキル</th>
            <th className="px-5 py-3.5 whitespace-nowrap">応募経路</th>
            <th className="px-5 py-3.5 whitespace-nowrap">ステータス</th>
            <th className="px-5 py-3.5 whitespace-nowrap">有効応募</th>
            <th className="px-5 py-3.5 whitespace-nowrap">最終更新日</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {candidates.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3.5 font-medium">
                <Link
                  href={`/matchhire/candidates/${c.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {c.name}
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3.5 text-slate-500">
                {channelLabel[c.channel] ?? c.channel}
              </td>
              <td className="px-5 py-3.5">
                <CandidateStatusBadge status={c.status} />
              </td>
              <td className="px-5 py-3.5">
                <ValidStatusBadge status={c.valid} />
              </td>
              <td className="px-5 py-3.5 text-slate-400 tabular-nums">{c.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
