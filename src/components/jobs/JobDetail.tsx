import type { Job, Application, Candidate, Interview } from "@/lib/mockData";
import { computeFunnelCounts, computeFunnelKpis, buildFunnelSteps } from "@/lib/funnel";
import { JobStatusBadge, EmploymentTypeBadge } from "./JobStatusBadge";
import { JobFunnelCard } from "./JobFunnelCard";
import { JobApplicationTable, type ApplicationRow } from "./JobApplicationTable";

interface Props {
  job: Job;
  applications: Application[];
  candidates: Candidate[];
  interviews: Interview[];
}

function fmtPct(value: number): string {
  return `${Math.round(value)}%`;
}

interface KpiItem {
  label: string;
  value: string | number;
  sub?: string;
}

export function JobDetail({ job, applications, candidates, interviews }: Props) {
  // ダッシュボードと同じ共通ファネルロジックへ、この求人に紐づく応募と
  // その応募IDに紐づく面接だけを渡す（呼び出し元の jobs/[id]/page.tsx で
  // すでに job 単位に絞り込み済み）。
  const counts = computeFunnelCounts(applications, interviews);
  const kpis = computeFunnelKpis(counts);
  const funnelSteps = buildFunnelSteps(counts);

  // 表示領域の都合上、8段階すべてはカードに出さず主要な数値・率のみ抜粋する
  // （ファネルの計算自体はダッシュボードと共通のため定義は一致する）。
  const kpiItems: KpiItem[] = [
    { label: "応募数", value: counts.applied },
    { label: "有効応募数", value: counts.validApplication },
    { label: "一次面接実施数", value: counts.firstInterviewDone },
    { label: "内定数", value: counts.offered },
    { label: "有効応募率", value: fmtPct(kpis.validApplicationRate), sub: "応募→有効応募" },
    { label: "一次面接化率", value: fmtPct(kpis.firstInterviewRate), sub: "書類通過→一次面接" },
    { label: "内定率", value: fmtPct(kpis.offerRate), sub: "有効応募→内定" },
  ];

  const rows: ApplicationRow[] = applications
    .map((app) => {
      const candidate = candidates.find((c) => c.id === app.candidateId);
      if (!candidate) return null;
      return { application: app, candidate };
    })
    .filter((r): r is ApplicationRow => r !== null)
    .sort((a, b) => b.application.appliedAt.localeCompare(a.application.appliedAt));

  return (
    <div className="space-y-6">

      {/* 求人プロフィールヘッダー */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{job.department}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <JobStatusBadge status={job.status} />
            <EmploymentTypeBadge type={job.employmentType} />
          </div>
        </div>
      </div>

      {/* 2カラム：左＝基本情報 / 右＝KPI・ファネル */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 求人基本情報 */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">求人基本情報</h2>
          <div className="space-y-5">
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-gray-600">求人概要</h3>
              <p className="text-sm leading-relaxed text-gray-700">{job.description || "—"}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-600">必須条件</h3>
              {job.requirements.length === 0 ? (
                <p className="text-sm text-gray-400">—</p>
              ) : (
                <ul className="space-y-1.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" aria-hidden="true" />
                      {req}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {/* 求人別KPI（既存のファネル共通ロジックによる集計・定義を維持） */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">求人別 KPI</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {kpiItems.map((kpi) => (
                <div key={kpi.label} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-medium text-slate-400">{kpi.label}</p>
                  {kpi.sub && <p className="text-[10px] text-slate-300">{kpi.sub}</p>}
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-gray-800">{kpi.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ファネル（ダッシュボードと同じ8段階） */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">採用ファネル</h2>
            <JobFunnelCard steps={funnelSteps} />
          </section>
        </div>
      </div>

      {/* 応募者一覧（全幅） */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-baseline gap-2 border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">応募者一覧</h2>
          <span className="ml-auto text-xs text-gray-400">{rows.length} 件</span>
        </div>
        <JobApplicationTable rows={rows} />
      </section>
    </div>
  );
}
