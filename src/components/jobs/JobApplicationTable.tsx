import Link from "next/link";
import type { Application, Candidate } from "@/lib/mockData";

export interface ApplicationRow {
  application: Application;
  candidate: Candidate;
}

const CHANNEL_LABEL: Record<string, string> = {
  scout:  "スカウト",
  dm:     "DM",
  direct: "直接応募",
};

const VALIDITY_STYLE: Record<string, string> = {
  "有効":   "bg-green-50  text-green-700 ring-1 ring-inset ring-green-200",
  "無効":   "bg-red-50    text-red-600   ring-1 ring-inset ring-red-200",
  "未判定": "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200",
};

const STATUS_STYLE: Record<string, string> = {
  "応募受付": "text-slate-500",
  "書類選考": "text-blue-600",
  "面接":     "text-violet-600",
  "内定":     "text-green-600",
  "承諾":     "text-emerald-600",
  "入社":     "text-teal-600",
  "不採用":   "text-red-500",
  "辞退":     "text-orange-500",
};

interface Props {
  rows: ApplicationRow[];
}

export function JobApplicationTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">この求人への応募はありません</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
            <th className="px-5 py-3.5 whitespace-nowrap">候補者名</th>
            <th className="px-5 py-3.5 whitespace-nowrap">応募日</th>
            <th className="px-5 py-3.5 whitespace-nowrap">応募経路</th>
            <th className="px-5 py-3.5 whitespace-nowrap">有効応募</th>
            <th className="px-5 py-3.5 whitespace-nowrap">現在ステータス</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ application: app, candidate: c }) => (
            <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3.5">
                <Link
                  href={`/matchhire/candidates/${c.id}`}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {c.name}
                </Link>
              </td>
              <td className="px-5 py-3.5 tabular-nums text-slate-500">{app.appliedAt}</td>
              <td className="px-5 py-3.5 text-slate-500">
                {CHANNEL_LABEL[app.channel] ?? app.channel}
              </td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VALIDITY_STYLE[app.validity] ?? "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200"}`}>
                  {app.validity}
                </span>
              </td>
              <td className={`px-5 py-3.5 font-medium ${STATUS_STYLE[app.status] ?? "text-slate-700"}`}>
                {app.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
