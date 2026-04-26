import { notFound } from "next/navigation";
import { CandidateDetail, type CandidateDetailData } from "@/components/candidates/CandidateDetail";
import {
  candidates,
  applications,
  interviews,
  contacts,
  jobs,
} from "@/lib/mockData";

function buildDetailData(id: string): CandidateDetailData | null {
  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) return null;

  // 最初の応募を選考情報として使用（複数ある場合は最新）
  const candidateApps = applications
    .filter((a) => a.candidateId === id)
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  const primaryApp = candidateApps[0];

  const application = primaryApp
    ? {
        appliedAt:      primaryApp.appliedAt,
        documentResult: primaryApp.documentResult,
        interviewStage: primaryApp.interviewStage,
        hasOffer:       primaryApp.hasOffer,
      }
    : {
        appliedAt:      "—",
        documentResult: "未実施" as const,
        interviewStage: "未着手",
        hasOffer:       false,
      };

  // 面接履歴：この候補者に関連する interviews
  const candidateInterviews = interviews
    .filter((i) => i.candidateId === id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((i) => ({
      date:        i.date,
      interviewer: i.interviewer,
      result:      i.result,
      comment:     i.comment,
    }));

  // 接触履歴
  const candidateContacts = contacts
    .filter((c) => c.candidateId === id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((c) => ({
      date:    c.date,
      channel: c.channel,
      opened:  c.opened,
      replied: c.replied,
    }));

  return {
    basic: {
      name:    candidate.name,
      skills:  candidate.skills,
      bio:     candidate.bio,
      channel: candidate.channel,
      status:  candidate.status,
      valid:   candidate.valid,
    },
    application,
    interviews: candidateInterviews,
    contacts:   candidateContacts,
  };
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = buildDetailData(id);
  if (!data) notFound();
  return <CandidateDetail data={data} />;
}

// 未使用変数を防ぐためのダミー参照（jobs は将来の求人表示で使用予定）
void jobs;
