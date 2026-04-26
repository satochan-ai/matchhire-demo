import type { JobStatus, EmploymentType } from "@/lib/mockData";

const STATUS_STYLE: Record<JobStatus, string> = {
  "募集中": "bg-green-50   text-green-700  ring-green-200",
  "停止":   "bg-slate-100  text-slate-500  ring-slate-200",
  "充足":   "bg-blue-50    text-blue-700   ring-blue-200",
};

const EMPLOYMENT_STYLE: Record<EmploymentType, string> = {
  "正社員":   "bg-violet-50 text-violet-700 ring-violet-200",
  "契約社員": "bg-orange-50 text-orange-700 ring-orange-200",
  "業務委託": "bg-teal-50   text-teal-700   ring-teal-200",
};

const BASE = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`${BASE} ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

export function EmploymentTypeBadge({ type }: { type: EmploymentType }) {
  return (
    <span className={`${BASE} ${EMPLOYMENT_STYLE[type]}`}>
      {type}
    </span>
  );
}
