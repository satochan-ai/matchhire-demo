import { CandidateDetail, type CandidateDetailData } from "@/components/candidates/CandidateDetail";
import { NotFoundState } from "@/components/common/NotFoundState";
import { fetchCandidates } from "@/lib/repositories/candidatesRepository";
import { fetchApplications } from "@/lib/repositories/applicationsRepository";
import { fetchInterviews } from "@/lib/repositories/interviewsRepository";
import { fetchContacts } from "@/lib/repositories/contactsRepository";
import { fetchJobs } from "@/lib/repositories/jobsRepository";
import { candidates as mockCandidates } from "@/lib/mockData";

/** 静的エクスポート用：mockData の全候補者 ID を事前生成 */
export function generateStaticParams() {
  return mockCandidates.map((c) => ({ id: c.id }));
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // データソース（mock / csv / sheets）を意識せず、Repository 経由で取得する
  const [candidates, applications, interviews, contacts, jobs] = await Promise.all([
    fetchCandidates(),
    fetchApplications(),
    fetchInterviews(),
    fetchContacts(),
    fetchJobs(),
  ]);

  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <NotFoundState
        title="候補者が見つかりません"
        message={`ID「${id}」に該当する候補者は存在しません。削除されたか、URLが正しくない可能性があります。`}
        backHref="/matchhire/candidates"
        backLabel="候補者一覧へ戻る"
      />
    );
  }

  // 最新の応募を選考情報として使用
  const candidateApps = applications
    .filter((a) => a.candidateId === id)
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  const primaryApp = candidateApps[0];
  const primaryJob = primaryApp ? jobs.find((j) => j.id === primaryApp.jobId) : undefined;

  // 応募履歴一覧（既存joinと同じ方法で求人名を解決する）
  const applicationRows: CandidateDetailData["applications"] = candidateApps.map((app) => {
    const job = jobs.find((j) => j.id === app.jobId);
    return {
      id:            app.id,
      jobId:         app.jobId,
      jobTitle:      job?.title ?? "不明な求人",
      status:        app.status,
      validity:      app.validity,
      invalidReason: app.invalidReason,
      channel:       app.channel,
      appliedAt:     app.appliedAt,
    };
  });

  const application: CandidateDetailData["application"] = primaryApp
    ? {
        appliedAt:      primaryApp.appliedAt,
        jobTitle:       primaryJob?.title ?? "不明な求人",
        documentResult: primaryApp.documentResult,
        interviewStage: primaryApp.interviewStage,
        hasOffer:       primaryApp.hasOffer,
      }
    : {
        appliedAt:      "—",
        jobTitle:       "—",
        documentResult: "未実施" as const,
        interviewStage: "未着手",
        hasOffer:       false,
      };

  const candidateInterviews = interviews
    .filter((i) => i.candidateId === id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((i) => ({
      id:          i.id,
      date:        i.date,
      interviewer: i.interviewer,
      result:      i.result,
      comment:     i.comment,
    }));

  const candidateContacts = contacts
    .filter((c) => c.candidateId === id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((c) => ({
      date:    c.date,
      channel: c.channel,
      opened:  c.opened,
      replied: c.replied,
    }));

  const data: CandidateDetailData = {
    basic: {
      name:      candidate.name,
      skills:    candidate.skills,
      bio:       candidate.bio,
      channel:   candidate.channel,
      status:    candidate.status,
      valid:     candidate.valid,
      updatedAt: candidate.updatedAt,
    },
    application,
    applications: applicationRows,
    interviews:   candidateInterviews,
    contacts:     candidateContacts,
  };

  return <CandidateDetail data={data} />;
}
