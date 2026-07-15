import Link from "next/link";
import type { JobMetrics } from "@/lib/mockData";
import { JobStatusBadge, EmploymentTypeBadge } from "./JobStatusBadge";
import { DataTableShell } from "@/components/common/DataTableShell";
import { MobileListCard } from "@/components/common/MobileListCard";

interface Props {
  rows: JobMetrics[];
}

/** 内定数の既存強調（>0 は緑・太字、0 は淡色）を共通利用する */
function OfferCount({ count }: { count: number }) {
  return (
    <span className={count > 0 ? "font-semibold text-green-700" : "text-slate-400"}>
      {count}
    </span>
  );
}

export function JobTable({ rows }: Props) {
  return (
    <>
      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <DataTableShell>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
              <th scope="col" className="px-5 py-3">求人名</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">ステータス</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">応募数</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">有効応募</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">面接数</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">内定数</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">部署</th>
              <th scope="col" className="whitespace-nowrap px-5 py-3">雇用形態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-5 py-3">
                  <Link
                    href={`/matchhire/jobs/${row.id}`}
                    className="rounded font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <JobStatusBadge status={row.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-slate-700">{row.applicationCount}</td>
                <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-slate-700">{row.validApplicationCount}</td>
                <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-slate-700">{row.interviewCount}</td>
                <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">
                  <OfferCount count={row.offerCount} />
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">{row.department}</td>
                <td className="whitespace-nowrap px-5 py-3">
                  <EmploymentTypeBadge type={row.employmentType} />
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      </div>

      {/* モバイル: カード表示 */}
      <div className="flex flex-col gap-2 p-3 md:hidden">
        {rows.map((row) => (
          <MobileListCard
            key={row.id}
            href={`/matchhire/jobs/${row.id}`}
            aria-label={`${row.title}の求人詳細を見る`}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-blue-600" title={row.title}>
                {row.title}
              </span>
              <JobStatusBadge status={row.status} />
              <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-slate-50 px-2 py-1.5">
              {[
                { label: "応募", value: <span className="text-slate-700">{row.applicationCount}</span> },
                { label: "有効", value: <span className="text-slate-700">{row.validApplicationCount}</span> },
                { label: "面接", value: <span className="text-slate-700">{row.interviewCount}</span> },
                { label: "内定", value: <OfferCount count={row.offerCount} /> },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-[10px] text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span>{row.department}</span>
              <span className="ml-auto">
                <EmploymentTypeBadge type={row.employmentType} />
              </span>
            </div>
          </MobileListCard>
        ))}
      </div>
    </>
  );
}
