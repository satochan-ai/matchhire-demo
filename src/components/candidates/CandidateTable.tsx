"use client";

import Link from "next/link";
import type { Candidate } from "@/app/matchhire/candidates/page";
import {
  CandidateStatusBadge,
  ValidStatusBadge,
} from "@/components/candidates/CandidateStatusBadge";
import { DataTableShell } from "@/components/common/DataTableShell";
import { MobileListCard } from "@/components/common/MobileListCard";

const channelLabel: Record<string, string> = {
  scout: "スカウト",
  dm: "DM",
  direct: "ダイレクト",
};

function SkillChips({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((s) => (
        <span
          key={s}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  return (
    <>
      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <DataTableShell>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
              <th scope="col" className="whitespace-nowrap px-5 py-3">候補者名</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">ステータス</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">有効応募</th>
              <th scope="col" className="px-5 py-3">スキル</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">応募経路</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">最終更新日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-5 py-3">
                  <Link
                    href={`/matchhire/candidates/${c.id}`}
                    className="rounded font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <CandidateStatusBadge status={c.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <ValidStatusBadge status={c.valid} />
                </td>
                <td className="px-5 py-3">
                  <SkillChips skills={c.skills} />
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                  {channelLabel[c.channel] ?? c.channel}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-slate-500">
                  {c.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      </div>

      {/* モバイル: カード表示 */}
      <div className="flex flex-col gap-2 p-3 md:hidden">
        {candidates.map((c) => (
          <MobileListCard
            key={c.id}
            href={`/matchhire/candidates/${c.id}`}
            aria-label={`${c.name}の候補者詳細を見る`}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-blue-600">
                {c.name}
              </span>
              <CandidateStatusBadge status={c.status} />
              <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ValidStatusBadge status={c.valid} />
              <span className="text-[11px] text-slate-400">{channelLabel[c.channel] ?? c.channel}</span>
            </div>
            <div className="mt-2">
              <SkillChips skills={c.skills} />
            </div>
            <p className="mt-2 text-right text-[11px] tabular-nums text-slate-400">{c.updatedAt}</p>
          </MobileListCard>
        ))}
      </div>
    </>
  );
}
