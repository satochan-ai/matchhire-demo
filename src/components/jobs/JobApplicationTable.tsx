import Link from "next/link";
import type { Application, Candidate } from "@/lib/mockData";
import { CandidateStatusBadge, ValidStatusBadge } from "@/components/candidates/CandidateStatusBadge";
import { DataTableShell } from "@/components/common/DataTableShell";
import { MobileListCard } from "@/components/common/MobileListCard";

export interface ApplicationRow {
  application: Application;
  candidate: Candidate;
}

const CHANNEL_LABEL: Record<string, string> = {
  scout:  "スカウト",
  dm:     "DM",
  direct: "直接応募",
};

interface Props {
  rows: ApplicationRow[];
}

export function JobApplicationTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-slate-400">この求人への応募はありません</p>
    );
  }

  return (
    <>
      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <DataTableShell>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
              <th scope="col" className="whitespace-nowrap px-5 py-3">候補者名</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">応募ステータス</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">有効応募</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">無効理由</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">応募経路</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">応募日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ application: app, candidate: c }) => (
              <tr key={app.id} className="transition-colors hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-5 py-3">
                  <Link
                    href={`/matchhire/candidates/${c.id}`}
                    className="rounded font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <CandidateStatusBadge status={app.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <ValidStatusBadge status={app.validity} />
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">
                  {app.invalidReason ?? <span className="text-slate-200">—</span>}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                  {CHANNEL_LABEL[app.channel] ?? app.channel}
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
        {rows.map(({ application: app, candidate: c }) => (
          <MobileListCard
            key={app.id}
            href={`/matchhire/candidates/${c.id}`}
            aria-label={`${c.name}の候補者詳細を見る`}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-blue-600" title={c.name}>
                {c.name}
              </span>
              <CandidateStatusBadge status={app.status} />
              <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ValidStatusBadge status={app.validity} />
              <span className="text-[11px] text-slate-400">{CHANNEL_LABEL[app.channel] ?? app.channel}</span>
            </div>
            {app.invalidReason && (
              <p className="mt-2 text-[11px] font-medium text-red-500">{app.invalidReason}</p>
            )}
            <p className="mt-2 text-right text-[11px] tabular-nums text-slate-400">{app.appliedAt}</p>
          </MobileListCard>
        ))}
      </div>
    </>
  );
}
