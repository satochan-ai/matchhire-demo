"use client";

import { useState } from "react";
import { EvaluationPreview } from "@/components/evaluations/EvaluationPreview";
import { NG_REASONS, type NgReason } from "@/lib/mockData";

export interface EvaluationFormValues {
  technicalScore: number | null;
  communicationScore: number | null;
  alignmentScore: number | null;
  overallGrade: "A" | "B" | "C" | "D" | null;
  result: "通過" | "不採用" | "保留" | null;
  ngReason: NgReason | null;
  concerns: string;
  comment: string;
  nextAction: string;
}

const EMPTY_VALUES: EvaluationFormValues = {
  technicalScore: null,
  communicationScore: null,
  alignmentScore: null,
  overallGrade: null,
  result: null,
  ngReason: null,
  concerns: "",
  comment: "",
  nextAction: "",
};

interface EvaluationFormProps {
  candidateName: string;
  jobTitle: string;
  stage: string;
  /** 既存の評価データがあれば初期値として使用する */
  initialValues?: Partial<EvaluationFormValues>;
  /** true の場合、保存機能が未実装であることを明示する（永続化しない） */
  saveDisabled?: boolean;
}

// --- スコア選択（1〜5ボタン群） ---
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
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-gray-700">{label}</legend>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 ${
                selected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// --- 選択ボタングループ（総合評価／結果／NG理由で共用） ---
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
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-gray-700">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt)}
              className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 ${
                selected
                  ? colorMap[opt] ?? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// --- テキストエリア ---
function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus-visible:ring-2"
      />
    </div>
  );
}

export function EvaluationForm({ candidateName, jobTitle, stage, initialValues, saveDisabled = true }: EvaluationFormProps) {
  const [values, setValues] = useState<EvaluationFormValues>({ ...EMPTY_VALUES, ...initialValues });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof EvaluationFormValues>(key: K, val: EvaluationFormValues[K]) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    // 永続化先（CSV書き込み / DB）が未実装のため、画面表示のみを更新する。
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // 総合評価：4段階とも同一トーン（blue系）に統一し、A〜Dの信号色による優劣表現を避ける
  const gradeColors: Record<string, string> = {
    A: "border-blue-600 bg-blue-600 text-white",
    B: "border-blue-600 bg-blue-600 text-white",
    C: "border-blue-600 bg-blue-600 text-white",
    D: "border-blue-600 bg-blue-600 text-white",
  };

  // 結果：意味の区別は残しつつ、全面塗りつぶしの強い彩度は避ける
  const resultColors: Record<string, string> = {
    通過: "border-emerald-600 bg-emerald-50 text-emerald-700",
    不採用: "border-red-400 bg-red-50 text-red-700",
    保留: "border-amber-400 bg-amber-50 text-amber-700",
  };

  // NG理由：選択時のみ控えめなredで統一（強い赤の全面塗りつぶしは避ける）
  const ngReasonColors: Record<string, string> = {};
  NG_REASONS.forEach((r) => { ngReasonColors[r] = "border-red-300 bg-red-50 text-red-700"; });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)] lg:items-start">
      {/* 左：入力フォーム */}
      <div className="space-y-4">
        {/* A. 評価スコア */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-bold text-gray-800">評価スコア</h2>
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
          </div>
        </div>

        {/* B. 面接結果 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-bold text-gray-800">面接結果</h2>
          <div className="space-y-5">
            <ButtonGroup
              label="結果"
              options={["通過", "不採用", "保留"] as const}
              value={values.result}
              onChange={(v) => {
                set("result", v);
                if (v !== "不採用") set("ngReason", null);
              }}
              colorMap={resultColors}
            />
            {values.result === "不採用" && (
              <ButtonGroup
                label="NG理由"
                options={NG_REASONS}
                value={values.ngReason}
                onChange={(v) => set("ngReason", v)}
                colorMap={ngReasonColors}
              />
            )}
          </div>
        </div>

        {/* C. コメント */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-bold text-gray-800">
            コメント
            <span className="ml-2 text-xs font-normal text-slate-400">すべて任意項目です</span>
          </h2>
          <div className="space-y-4">
            <TextArea
              id="concerns"
              label="懸念点"
              value={values.concerns}
              onChange={(v) => set("concerns", v)}
              placeholder="気になる点・リスクを入力"
            />
            <TextArea
              id="comment"
              label="評価コメント"
              value={values.comment}
              onChange={(v) => set("comment", v)}
              placeholder="面接全体を通じた評価を入力"
              rows={4}
            />
            <TextArea
              id="nextAction"
              label="次回アクション"
              value={values.nextAction}
              onChange={(v) => set("nextAction", v)}
              placeholder="次のステップ・担当者へのメモを入力"
            />
          </div>
        </div>

        {/* デモ保存操作 */}
        <div className="space-y-2">
          {saveDisabled && (
            <p className="text-xs font-medium text-amber-600">
              ※ 保存機能は準備中です。この画面での入力内容は保存されません（デモ表示）。
            </p>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              {saveDisabled ? "デモ保存" : "保存する"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {saveDisabled ? "画面表示のみ更新しました（未保存）" : "保存しました"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 右：ライブプレビュー */}
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
