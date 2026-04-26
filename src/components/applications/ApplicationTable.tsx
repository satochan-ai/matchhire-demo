"use client";

import Link from "next/link";
import { ApplicationRouteBadge } from "@/components/applications/ApplicationRouteBadge";
import { ApplicationValidityBadge } from "@/components/applications/ApplicationValidityBadge";
import { CandidateStatusBadge } from "@/components/candidates/CandidateStatusBadge";
import type { ApplicationRow as Application } from "@/app/matchhire/applications/page";

interface ApplicationTableProps {
  applications: Application[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-400">
        該当する応募が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
            <th className="px-5 py-3.5 whitespace-nowrap">応募日</th>
            <th className="px-5 py-3.5 whitespace-nowrap">候補者名</th>
            <th className="px-5 py-3.5 whitespace-nowrap">求人名</th>
            <th className="px-5 py-3.5 whitespace-nowrap">応募経路</th>
            <th className="px-5 py-3.5 whitespace-nowrap">有効応募</th>
            <th className="px-5 py-3.5 whitespace-nowrap">無効理由</th>
            <th className="px-5 py-3.5 whitespace-nowrap">ステータス</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3.5 text-slate-500 tabular-nums whitespace-nowrap">{app.appliedAt}</td>
              <td className="px-5 py-3.5 font-medium whitespace-nowrap">
                <Link
                  href={`/matchhire/candidates/${app.candidateId}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {app.candidateName}
                </Link>
              </td>
              <td className="px-5 py-3.5 text-slate-700">{app.jobTitle}</td>
              <td className="px-5 py-3.5">
                <ApplicationRouteBadge route={app.route} />
              </td>
              <td className="px-5 py-3.5">
                <ApplicationValidityBadge validity={app.validity} />
              </td>
              <td className="px-5 py-3.5 text-slate-400 text-xs">
                {app.invalidReason ?? <span className="text-slate-200">—</span>}
              </td>
              <td className="px-5 py-3.5">
                <CandidateStatusBadge status={app.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
