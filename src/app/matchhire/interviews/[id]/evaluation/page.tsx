import Link from "next/link";
import { EvaluationForm } from "@/components/evaluations/EvaluationForm";
import { NotFoundState } from "@/components/common/NotFoundState";
import { fetchInterviews } from "@/lib/repositories/interviewsRepository";
import { fetchApplications } from "@/lib/repositories/applicationsRepository";
import { fetchCandidates } from "@/lib/repositories/candidatesRepository";
import { fetchJobs } from "@/lib/repositories/jobsRepository";
import { fetchEvaluations, selectEvaluationForInterview } from "@/lib/repositories/evaluationsRepository";
import { warnReferentialIntegrity } from "@/lib/dataIntegrity";
import { interviews as mockInterviews } from "@/lib/mockData";

/** 静的エクスポート用：mockData の全面接 ID を事前生成 */
export function generateStaticParams() {
  return mockInterviews.map((i) => ({ id: i.id }));
}

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [interviews, applications, candidates, jobs, evaluations] = await Promise.all([
    fetchInterviews(),
    fetchApplications(),
    fetchCandidates(),
    fetchJobs(),
    fetchEvaluations(),
  ]);

  // データソース（mock/csv/sheets）を問わず、取得済みテーブルの参照整合性を
  // 開発環境でのみ検証する（重複評価の検知もここに含まれる）。
  warnReferentialIntegrity({ candidates, applications, interviews, evaluations, jobs });

  const interview = interviews.find((i) => i.id === id);

  if (!interview) {
    return (
      <NotFoundState
        title="面接情報が見つかりません"
        message={`ID「${id}」に該当する面接は存在しません。削除されたか、URLが正しくない可能性があります。`}
        backHref="/matchhire/candidates"
        backLabel="候補者一覧に戻る"
      />
    );
  }

  const application = applications.find((a) => a.id === interview.applicationId);
  const candidate = candidates.find((c) => c.id === interview.candidateId);
  const job = application ? jobs.find((j) => j.id === application.jobId) : undefined;
  const existingEvaluation = selectEvaluationForInterview(evaluations, interview.id);

  const candidateName = candidate?.name ?? "不明な候補者";
  const jobTitle = job?.title ?? "不明な求人";
  const stage = application?.interviewStage || "面接";

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/matchhire/candidates"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            候補者一覧
          </Link>
          <span className="text-gray-300">/</span>
          {candidate ? (
            <Link
              href={`/matchhire/candidates/${candidate.id}`}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {candidateName}
            </Link>
          ) : (
            <span className="text-sm text-gray-400">{candidateName}</span>
          )}
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">面接評価入力</h1>
        </div>

        {/* サブタイトル */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            <span><span className="font-medium text-gray-400">候補者：</span>{candidateName}</span>
            <span><span className="font-medium text-gray-400">求人：</span>{jobTitle}</span>
            <span><span className="font-medium text-gray-400">ステージ：</span>{stage}</span>
            <span><span className="font-medium text-gray-400">面接日：</span>{interview.date}</span>
            <span><span className="font-medium text-gray-400">面接官：</span>{interview.interviewer}</span>
          </div>
        </div>

        {/* フォーム本体 */}
        <EvaluationForm
          candidateName={candidateName}
          jobTitle={jobTitle}
          stage={stage}
          initialValues={
            existingEvaluation
              ? {
                  technicalScore: existingEvaluation.technicalScore,
                  communicationScore: existingEvaluation.communicationScore,
                  alignmentScore: existingEvaluation.alignmentScore,
                  overallGrade: existingEvaluation.overallGrade,
                  result: existingEvaluation.result,
                  ngReason: existingEvaluation.ngReason,
                  concerns: existingEvaluation.concerns,
                  comment: existingEvaluation.comment,
                  nextAction: existingEvaluation.nextAction,
                }
              : undefined
          }
        />

      </div>
    </div>
  );
}
