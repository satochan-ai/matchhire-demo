import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchJobs }         from "@/lib/repositories/jobsRepository";
import { fetchApplications } from "@/lib/repositories/applicationsRepository";
import { fetchCandidates }   from "@/lib/repositories/candidatesRepository";
import { fetchInterviews }   from "@/lib/repositories/interviewsRepository";
import { JobDetail } from "@/components/jobs/JobDetail";
import { jobs as mockJobs } from "@/lib/mockData";

interface Props {
  params: Promise<{ id: string }>;
}

/** 静的エクスポート用：mockData の全求人 ID を事前生成 */
export function generateStaticParams() {
  return mockJobs.map((j) => ({ id: j.id }));
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;

  // 全テーブルを並列フェッチ（Server Component なので直接 repository を呼ぶ）
  const [jobs, allApplications, candidates, allInterviews] = await Promise.all([
    fetchJobs(),
    fetchApplications(),
    fetchCandidates(),
    fetchInterviews(),
  ]);

  const job = jobs.find((j) => j.id === id);
  if (!job) notFound();

  const jobApplications = allApplications.filter((a) => a.jobId === id);
  const appIds          = new Set(jobApplications.map((a) => a.id));
  const jobInterviews   = allInterviews.filter((i) => appIds.has(i.applicationId));

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* 戻る導線 */}
        <Link
          href="/matchhire/jobs"
          className="inline-flex items-center gap-1 rounded text-sm text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          求人一覧へ戻る
        </Link>

        <JobDetail
          job={job}
          applications={jobApplications}
          candidates={candidates}
          interviews={jobInterviews}
        />
      </div>
    </div>
  );
}
