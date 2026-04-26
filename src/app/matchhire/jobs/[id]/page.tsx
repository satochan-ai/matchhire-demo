import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchJobs }         from "@/lib/repositories/jobsRepository";
import { fetchApplications } from "@/lib/repositories/applicationsRepository";
import { fetchCandidates }   from "@/lib/repositories/candidatesRepository";
import { fetchInterviews }   from "@/lib/repositories/interviewsRepository";
import { JobDetail } from "@/components/jobs/JobDetail";

interface Props {
  params: Promise<{ id: string }>;
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

        {/* パンくず */}
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/matchhire/jobs" className="hover:text-blue-600 hover:underline">
            求人管理
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{job.title}</span>
        </nav>

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
