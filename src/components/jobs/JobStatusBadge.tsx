import type { JobStatus, EmploymentType } from "@/lib/mockData";

const STATUS_STYLE: Record<JobStatus, string> = {
  "募集中": "bg-green-100 text-green-700",
  "停止":   "bg-gray-100  text-gray-500",
  "充足":   "bg-blue-100  text-blue-700",
};

const EMPLOYMENT_STYLE: Record<EmploymentType, string> = {
  "正社員":   "bg-purple-100 text-purple-700",
  "契約社員": "bg-orange-100 text-orange-700",
  "業務委託": "bg-teal-100   text-teal-700",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

export function EmploymentTypeBadge({ type }: { type: EmploymentType }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${EMPLOYMENT_STYLE[type]}`}>
      {type}
    </span>
  );
}
