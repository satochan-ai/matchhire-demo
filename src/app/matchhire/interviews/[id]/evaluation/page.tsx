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
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl space-y-5 md:space-y-6">

        {/* ═════ 戻る導線 ═════ */}
        {candidate ? (
          <Link
            href={`/matchhire/candidates/${candidate.id}`}
            className="inline-flex items-center gap-1 rounded text-sm text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            候補者詳細へ戻る
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/matchhire/candidates"
              className="flex items-center gap-1 rounded text-sm text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              候補者一覧
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-400">{candidateName}</span>
          </div>
        )}

        {/* ═════ ページヘッダー ═════ */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">面接評価入力</h1>
          <p className="mt-1 text-sm text-slate-500">面接結果と評価コメントを記録します</p>
        </div>

        {/* ═════ 面接サマリー ═════ */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <dt className="text-xs font-medium text-slate-400">候補者</dt>
              <dd className="mt-0.5 break-words text-sm font-semibold text-slate-800">
                {candidate ? (
                  <Link
                    href={`/matchhire/candidates/${candidate.id}`}
                    className="rounded text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  >
                    {candidateName}
                  </Link>
                ) : (
                  candidateName
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">求人</dt>
              <dd className="mt-0.5 break-words text-sm font-semibold text-slate-800">{jobTitle}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">面接ステージ</dt>
              <dd className="mt-0.5 break-words text-sm font-semibold text-slate-800">{stage}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">面接日</dt>
              <dd className="mt-0.5 tabular-nums text-sm font-semibold text-slate-800">{interview.date}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">面接官</dt>
              <dd className="mt-0.5 break-words text-sm font-semibold text-slate-800">{interview.interviewer}</dd>
            </div>
          </dl>
        </section>

        {/* ═════ 評価フォーム＋ライブプレビュー＋デモ保存操作 ═════ */}
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
