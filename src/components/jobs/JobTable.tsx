import Link from "next/link";
import type { JobMetrics } from "@/lib/mockData";
import { JobStatusBadge, EmploymentTypeBadge } from "./JobStatusBadge";

interface Props {
  rows: JobMetrics[];
}

export function JobTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        条件に一致する求人がありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
            <th className="px-5 py-3.5 whitespace-nowrap">求人名</th>
            <th className="px-5 py-3.5 whitespace-nowrap">部署</th>
            <th className="px-5 py-3.5 whitespace-nowrap">ステータス</th>
            <th className="px-5 py-3.5 whitespace-nowrap">雇用形態</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">応募数</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">有効応募</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">面接数</th>
            <th className="px-5 py-3.5 whitespace-nowrap text-right">内定数</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3.5">
                <Link
                  href={`/matchhire/jobs/${row.id}`}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {row.title}
                </Link>
              </td>
              <td className="px-5 py-3.5 text-slate-500">{row.department}</td>
              <td className="px-5 py-3.5">
                <JobStatusBadge status={row.status} />
              </td>
              <td className="px-5 py-3.5">
                <EmploymentTypeBadge type={row.employmentType} />
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">{row.applicationCount}</td>
              <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">{row.validApplicationCount}</td>
              <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">{row.interviewCount}</td>
              <td className="px-5 py-3.5 text-right tabular-nums">
                <span className={row.offerCount > 0 ? "font-semibold text-green-700" : "text-slate-400"}>
                  {row.offerCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
