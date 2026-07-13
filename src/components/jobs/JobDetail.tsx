import type { Job, Application, Candidate, Interview } from "@/lib/mockData";
import { computeFunnelCounts, computeFunnelKpis, buildFunnelSteps } from "@/lib/funnel";
import { JobSummaryCard } from "./JobSummaryCard";
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
    <div className="space-y-8">
      {/* 求人サマリー */}
      <JobSummaryCard job={job} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* KPI */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-700">求人別 KPI</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {kpiItems.map((kpi) => (
              <div key={kpi.label} className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-400">{kpi.label}</p>
                {kpi.sub && <p className="text-[10px] text-gray-300">{kpi.sub}</p>}
                <p className="mt-1 text-2xl font-bold text-gray-800">{kpi.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ファネル（ダッシュボードと同じ8段階） */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-700">採用ファネル</h2>
          <JobFunnelCard steps={funnelSteps} />
        </section>
      </div>

      {/* 応募者一覧 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-700">
          応募者一覧
          <span className="ml-2 text-sm font-normal text-gray-400">（{rows.length} 件）</span>
        </h2>
        <JobApplicationTable rows={rows} />
      </section>
    </div>
  );
}
