import type { Job } from "@/lib/mockData";
import { JobStatusBadge, EmploymentTypeBadge } from "./JobStatusBadge";

interface Props {
  job: Job;
}

export function JobSummaryCard({ job }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
      {/* ヘッダー行 */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{job.department}</p>
        </div>
        <div className="flex items-center gap-2">
          <JobStatusBadge status={job.status} />
          <EmploymentTypeBadge type={job.employmentType} />
        </div>
      </div>

      {/* 概要 */}
      <div>
        <h3 className="mb-1.5 text-sm font-semibold text-gray-600">求人概要</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      {/* 必須条件 */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-600">必須条件</h3>
        <ul className="space-y-1.5">
          {job.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              {req}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
