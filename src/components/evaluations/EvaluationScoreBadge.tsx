"use client";

// --- スコアバッジ（1〜5）---
const scoreColors: Record<number, string> = {
  1: "bg-red-50 text-red-600",
  2: "bg-orange-50 text-orange-600",
  3: "bg-amber-50 text-amber-700",
  4: "bg-blue-50 text-blue-700",
  5: "bg-emerald-50 text-emerald-700",
};

export function EvaluationScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-400">
        未入力
      </span>
    );
  }
  return (
    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${scoreColors[score] ?? "bg-gray-100 text-gray-500"}`}>
      {"★".repeat(score)}{"☆".repeat(5 - score)} {score}
    </span>
  );
}

// --- 総合評価バッジ（A/B/C/D）---
const gradeColors: Record<string, string> = {
  A: "bg-emerald-50 text-emerald-700",
  B: "bg-blue-50 text-blue-700",
  C: "bg-amber-50 text-amber-700",
  D: "bg-red-50 text-red-600",
};

export function EvaluationGradeBadge({ grade }: { grade: string | null }) {
  if (!grade) {
    return (
      <span className="inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-400">
        未入力
      </span>
    );
  }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${gradeColors[grade] ?? "bg-gray-100 text-gray-500"}`}>
      {grade}
    </span>
  );
}

// --- 結果バッジ（通過/不採用/保留）---
const resultColors: Record<string, string> = {
  通過: "bg-emerald-50 text-emerald-700",
  不採用: "bg-red-50 text-red-600",
  保留: "bg-amber-50 text-amber-700",
};

export function EvaluationResultBadge({ result }: { result: string | null }) {
  if (!result) {
    return (
      <span className="inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-400">
        未入力
      </span>
    );
  }
  return (
    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${resultColors[result] ?? "bg-gray-100 text-gray-500"}`}>
      {result}
    </span>
  );
}
