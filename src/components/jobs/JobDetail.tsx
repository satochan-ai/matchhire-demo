import type { Job, Application, Candidate, Interview } from "@/lib/mockData";
import { JobSummaryCard } from "./JobSummaryCard";
import { JobFunnelCard } from "./JobFunnelCard";
import { JobApplicationTable, type ApplicationRow } from "./JobApplicationTable";

interface Props {
  job: Job;
  applications: Application[];
  candidates: Candidate[];
  interviews: Interview[];
}

function pct(num: number, den: number): string {
  if (den === 0) return "—";
  return `${Math.round((num / den) * 100)}%`;
}

interface KpiItem {
  label: string;
  value: string | number;
  sub?: string;
}

export function JobDetail({ job, applications, candidates, interviews }: Props) {
  const appIds = new Set(applications.map((a) => a.id));

  const applicationCount      = applications.length;
  const validApplicationCount = applications.filter((a) => a.validity === "有効").length;
  const interviewCount        = interviews.filter((i) => appIds.has(i.applicationId)).length;
  const offerCount            = applications.filter(
    (a) => a.status === "内定" || a.status === "承諾" || a.status === "入社"
  ).length;

  const kpis: KpiItem[] = [
    { label: "応募数",       value: applicationCount },
    { label: "有効応募数",   value: validApplicationCount },
    { label: "面接数",       value: interviewCount },
    { label: "内定数",       value: offerCount },
    { label: "有効応募率",   value: pct(validApplicationCount, applicationCount),  sub: "応募→有効" },
    { label: "面接化率",     value: pct(interviewCount,        validApplicationCount), sub: "有効→面接" },
    { label: "内定率",       value: pct(offerCount,            interviewCount),     sub: "面接→内定" },
  ];

  const funnelSteps = [
    { label: "応募",     count: applicationCount },
    { label: "有効応募", count: validApplicationCount },
    { label: "面接",     count: interviewCount },
    { label: "内定",     count: offerCount },
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
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-400">{kpi.label}</p>
                {kpi.sub && <p className="text-[10px] text-gray-300">{kpi.sub}</p>}
                <p className="mt-1 text-2xl font-bold text-gray-800">{kpi.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ファネル */}
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
