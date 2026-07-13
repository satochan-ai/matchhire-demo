"use client";

import { useState } from "react";
import type { CandidateStatus } from "@/components/candidates/CandidateStatusBadge";

export const STATUS_OPTIONS: CandidateStatus[] = [
  "応募受付",
  "書類選考",
  "面接",
  "内定",
  "承諾",
  "入社",
  "不採用",
  "辞退",
];

// ステータスに対応するセレクトの色クラス
const optionColors: Record<CandidateStatus, string> = {
  応募受付: "text-gray-700",
  書類選考: "text-blue-700",
  面接:    "text-purple-700",
  内定:    "text-green-700",
  承諾:    "text-emerald-700",
  入社:    "text-teal-700",
  不採用:  "text-red-600",
  辞退:    "text-orange-600",
};

interface CandidateStatusUpdateProps {
  currentStatus: CandidateStatus;
  onUpdate: (newStatus: CandidateStatus) => void;
  /** true の場合、実際には保存されないデモ操作であることを明示する */
  demoMode?: boolean;
}

export function CandidateStatusUpdate({
  currentStatus,
  onUpdate,
  demoMode = false,
}: CandidateStatusUpdateProps) {
  const [selected, setSelected] = useState<CandidateStatus>(currentStatus);
  const [saved, setSaved] = useState(false);

  // 親から currentStatus が変わった場合に追随
  // （同一ページ内で外部からリセットされるケースに対応）
  const isDirty = selected !== currentStatus;

  const handleUpdate = () => {
    onUpdate(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-xs font-medium text-gray-400">ステータスを変更</p>
        {demoMode && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            デモ表示（保存されません）
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selected}
          onChange={(e) => {
            setSaved(false);
            setSelected(e.target.value as CandidateStatus);
          }}
          className={`rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 ${optionColors[selected]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className={optionColors[s]}>
              {s}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={!isDirty}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
            isDirty
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {demoMode ? "更新する（デモ）" : "更新する"}
        </button>

        {saved && (
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {demoMode ? "画面表示のみ更新しました（未保存）" : "更新しました"}
          </span>
        )}
      </div>
    </div>
  );
}
