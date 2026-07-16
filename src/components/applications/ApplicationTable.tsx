"use client";

import Link from "next/link";
import { ApplicationRouteBadge } from "@/components/applications/ApplicationRouteBadge";
import { CandidateStatusBadge, ValidStatusBadge } from "@/components/candidates/CandidateStatusBadge";
import { DataTableShell } from "@/components/common/DataTableShell";
import { MobileListCard } from "@/components/common/MobileListCard";
import type { ApplicationRow as Application } from "@/app/matchhire/applications/page";

interface ApplicationTableProps {
  applications: Application[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  return (
    <>
      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <DataTableShell>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
              <th scope="col" className="whitespace-nowrap px-5 py-3">候補者名</th>
              <th scope="col" className="px-5 py-3">求人名</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">ステータス</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">有効応募</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">無効理由</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">応募経路</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">応募日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr key={app.id} className="transition-colors hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-5 py-3">
                  <Link
                    href={`/matchhire/candidates/${app.candidateId}`}
                    className="rounded font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  >
                    {app.candidateName}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600">{app.jobTitle}</td>
                <td className="whitespace-nowrap px-5 py-3">
                  <CandidateStatusBadge status={app.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <ValidStatusBadge status={app.validity} />
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">
                  {app.invalidReason ?? <span className="text-slate-200">—</span>}
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <ApplicationRouteBadge route={app.route} />
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-slate-500">
                  {app.appliedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      </div>

      {/* モバイル: カード表示 */}
      <div className="flex flex-col gap-2 p-3 md:hidden">
        {applications.map((app) => (
          <MobileListCard
            key={app.id}
            href={`/matchhire/candidates/${app.candidateId}`}
            aria-label={`${app.candidateName}の応募詳細（${app.jobTitle}）を見る`}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-blue-600">
                {app.candidateName}
              </span>
              <CandidateStatusBadge status={app.status} />
              <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="mt-1 truncate text-xs text-slate-500" title={app.jobTitle}>{app.jobTitle}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ValidStatusBadge status={app.validity} />
              {app.invalidReason && (
                <span className="text-[11px] font-medium text-red-500">{app.invalidReason}</span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ApplicationRouteBadge route={app.route} />
              <span className="ml-auto tabular-nums">{app.appliedAt}</span>
            </div>
          </MobileListCard>
        ))}
      </div>
    </>
  );
}
