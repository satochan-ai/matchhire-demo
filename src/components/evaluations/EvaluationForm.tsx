"use client";

import { useState } from "react";
import { EvaluationPreview } from "@/components/evaluations/EvaluationPreview";

export interface EvaluationFormValues {
  technicalScore: number | null;
  communicationScore: number | null;
  alignmentScore: number | null;
  overallGrade: "A" | "B" | "C" | "D" | null;
  result: "通過" | "不採用" | "保留" | null;
  concerns: string;
  comment: string;
  nextAction: string;
}

const INITIAL_VALUES: EvaluationFormValues = {
  technicalScore: null,
  communicationScore: null,
  alignmentScore: null,
  overallGrade: null,
  result: null,
  concerns: "",
  comment: "",
  nextAction: "",
};

interface EvaluationFormProps {
  candidateName: string;
  jobTitle: string;
  stage: string;
}

// --- スコア選択（1〜5ラジオ）---
function ScoreSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
              value === n
                ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-500"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- 選択ボタングループ ---
function ButtonGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  colorMap,
}: {
  label: string;
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  colorMap: Record<string, string>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-all ${
              value === opt
                ? colorMap[opt] ?? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- テキストエリア ---
function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
      />
    </div>
  );
}

export function EvaluationForm({ candidateName, jobTitle, stage }: EvaluationFormProps) {
  const [values, setValues] = useState<EvaluationFormValues>(INITIAL_VALUES);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof EvaluationFormValues>(key: K, val: EvaluationFormValues[K]) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const gradeColors: Record<string, string> = {
    A: "border-green-500 bg-green-500 text-white",
    B: "border-blue-500 bg-blue-500 text-white",
    C: "border-yellow-500 bg-yellow-500 text-white",
    D: "border-red-500 bg-red-500 text-white",
  };

  const resultColors: Record<string, string> = {
    通過: "border-green-500 bg-green-500 text-white",
    不採用: "border-red-500 bg-red-500 text-white",
    保留: "border-yellow-500 bg-yellow-500 text-white",
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 左：入力フォーム */}
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            評価スコア
          </h2>
          <div className="space-y-5">
            <ScoreSelector
              label="技術評価"
              value={values.technicalScore}
              onChange={(v) => set("technicalScore", v)}
            />
            <ScoreSelector
              label="コミュニケーション評価"
              value={values.communicationScore}
              onChange={(v) => set("communicationScore", v)}
            />
            <ScoreSelector
              label="志向性一致"
              value={values.alignmentScore}
              onChange={(v) => set("alignmentScore", v)}
            />
            <ButtonGroup
              label="総合評価"
              options={["A", "B", "C", "D"] as const}
              value={values.overallGrade}
              onChange={(v) => set("overallGrade", v)}
              colorMap={gradeColors}
            />
            <ButtonGroup
              label="結果"
              options={["通過", "不採用", "保留"] as const}
              value={values.result}
              onChange={(v) => set("result", v)}
              colorMap={resultColors}
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            コメント
          </h2>
          <div className="space-y-4">
            <TextArea
              label="懸念点"
              value={values.concerns}
              onChange={(v) => set("concerns", v)}
              placeholder="気になる点・リスクを入力"
            />
            <TextArea
              label="評価コメント"
              value={values.comment}
              onChange={(v) => set("comment", v)}
              placeholder="面接全体を通じた評価を入力"
              rows={4}
            />
            <TextArea
              label="次回アクション"
              value={values.nextAction}
              onChange={(v) => set("nextAction", v)}
              placeholder="次のステップ・担当者へのメモを入力"
            />
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            保存する
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              保存しました
            </span>
          )}
        </div>
      </div>

      {/* 右：プレビュー */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <EvaluationPreview
          values={values}
          candidateName={candidateName}
          jobTitle={jobTitle}
          stage={stage}
        />
      </div>
    </div>
  );
}
