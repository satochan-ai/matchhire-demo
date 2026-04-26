import Link from "next/link";
import type { Application, Candidate } from "@/lib/mockData";

export interface ApplicationRow {
  application: Application;
  candidate: Candidate;
}

const CHANNEL_LABEL: Record<string, string> = {
  scout: "スカウト",
  dm:    "DM",
  direct: "直接応募",
};

const VALIDITY_STYLE: Record<string, string> = {
  "有効":   "bg-green-100 text-green-700",
  "無効":   "bg-red-100   text-red-600",
  "未判定": "bg-gray-100  text-gray-500",
};

const STATUS_STYLE: Record<string, string> = {
  "応募受付": "text-gray-500",
  "書類選考": "text-blue-600",
  "面接":     "text-indigo-600",
  "内定":     "text-green-600",
  "承諾":     "text-green-700",
  "入社":     "text-emerald-700",
  "不採用":   "text-red-500",
  "辞退":     "text-orange-500",
};

interface Props {
  rows: ApplicationRow[];
}

export function JobApplicationTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">この求人への応募はありません</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
            <th className="pb-3 pr-4">候補者名</th>
            <th className="pb-3 pr-4">応募日</th>
            <th className="pb-3 pr-4">応募経路</th>
            <th className="pb-3 pr-4">有効応募</th>
            <th className="pb-3">現在ステータス</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map(({ application: app, candidate: c }) => (
            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4">
                <Link
                  href={`/matchhire/candidates/${c.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {c.name}
                </Link>
              </td>
              <td className="py-3 pr-4 text-gray-500">{app.appliedAt}</td>
              <td className="py-3 pr-4 text-gray-500">
                {CHANNEL_LABEL[app.channel] ?? app.channel}
              </td>
              <td className="py-3 pr-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VALIDITY_STYLE[app.validity] ?? "bg-gray-100 text-gray-500"}`}>
                  {app.validity}
                </span>
              </td>
              <td className={`py-3 font-medium ${STATUS_STYLE[app.status] ?? "text-gray-700"}`}>
                {app.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
