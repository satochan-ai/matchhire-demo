"use client";

import {
  EvaluationScoreBadge,
  EvaluationGradeBadge,
  EvaluationResultBadge,
} from "@/components/evaluations/EvaluationScoreBadge";
import type { EvaluationFormValues } from "@/components/evaluations/EvaluationForm";

interface EvaluationPreviewProps {
  values: EvaluationFormValues;
  candidateName: string;
  jobTitle: string;
  stage: string;
}

function PreviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-gray-100 py-2.5 last:border-0">
      <span className="w-32 shrink-0 text-xs font-medium text-gray-400 pt-0.5">{label}</span>
      <div className="flex-1 text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function EvaluationPreview({
  values,
  candidateName,
  jobTitle,
  stage,
}: EvaluationPreviewProps) {
  return (
    <div className="space-y-4">
      {/* 面接情報 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          面接情報
        </h2>
        <PreviewRow label="候補者">{candidateName}</PreviewRow>
        <PreviewRow label="求人">{jobTitle}</PreviewRow>
        <PreviewRow label="面接ステージ">{stage}</PreviewRow>
      </div>

      {/* スコアプレビュー */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          スコアプレビュー
        </h2>
        <PreviewRow label="技術評価">
          <EvaluationScoreBadge score={values.technicalScore} />
        </PreviewRow>
        <PreviewRow label="コミュニケーション">
          <EvaluationScoreBadge score={values.communicationScore} />
        </PreviewRow>
        <PreviewRow label="志向性一致">
          <EvaluationScoreBadge score={values.alignmentScore} />
        </PreviewRow>
        <PreviewRow label="総合評価">
          <EvaluationGradeBadge grade={values.overallGrade} />
        </PreviewRow>
        <PreviewRow label="結果">
          <EvaluationResultBadge result={values.result} />
        </PreviewRow>
      </div>

      {/* コメントプレビュー */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          コメントプレビュー
        </h2>
        <PreviewRow label="懸念点">
          {values.concerns ? (
            <span className="leading-relaxed">{values.concerns}</span>
          ) : (
            <span className="text-gray-300">未入力</span>
          )}
        </PreviewRow>
        <PreviewRow label="評価コメント">
          {values.comment ? (
            <span className="leading-relaxed">{values.comment}</span>
          ) : (
            <span className="text-gray-300">未入力</span>
          )}
        </PreviewRow>
        <PreviewRow label="次回アクション">
          {values.nextAction ? (
            <span className="leading-relaxed">{values.nextAction}</span>
          ) : (
            <span className="text-gray-300">未入力</span>
          )}
        </PreviewRow>
      </div>
    </div>
  );
}
