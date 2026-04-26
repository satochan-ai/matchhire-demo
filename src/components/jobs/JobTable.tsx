import Link from "next/link";
import type { JobMetrics } from "@/lib/mockData";
import { JobStatusBadge, EmploymentTypeBadge } from "./JobStatusBadge";

interface Props {
  rows: JobMetrics[];
}

export function JobTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        条件に一致する求人がありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
            <th className="pb-3 pr-4">求人名</th>
            <th className="pb-3 pr-4">部署</th>
            <th className="pb-3 pr-4">ステータス</th>
            <th className="pb-3 pr-4">雇用形態</th>
            <th className="pb-3 pr-4 text-right">応募数</th>
            <th className="pb-3 pr-4 text-right">有効応募</th>
            <th className="pb-3 pr-4 text-right">面接数</th>
            <th className="pb-3 text-right">内定数</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4">
                  <Link
                    href={`/matchhire/jobs/${row.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {row.title}
                  </Link>
                </td>
              <td className="py-3 pr-4 text-gray-500">{row.department}</td>
              <td className="py-3 pr-4">
                <JobStatusBadge status={row.status} />
              </td>
              <td className="py-3 pr-4">
                <EmploymentTypeBadge type={row.employmentType} />
              </td>
              <td className="py-3 pr-4 text-right text-gray-700">{row.applicationCount}</td>
              <td className="py-3 pr-4 text-right text-gray-700">{row.validApplicationCount}</td>
              <td className="py-3 pr-4 text-right text-gray-700">{row.interviewCount}</td>
              <td className="py-3 text-right text-gray-700">{row.offerCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
