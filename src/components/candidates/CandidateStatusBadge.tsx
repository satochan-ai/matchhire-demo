"use client";

export type CandidateStatus =
  | "応募受付"
  | "書類選考"
  | "面接"
  | "内定"
  | "承諾"
  | "入社"
  | "不採用"
  | "辞退";

export type ValidStatus = "有効" | "無効" | "未判定";

const statusStyles: Record<CandidateStatus, string> = {
  応募受付: "bg-slate-100  text-slate-600  ring-slate-300",
  書類選考: "bg-blue-50    text-blue-700   ring-blue-200",
  面接:     "bg-violet-50  text-violet-700 ring-violet-200",
  内定:     "bg-green-50   text-green-700  ring-green-200",
  承諾:     "bg-emerald-50 text-emerald-700 ring-emerald-200",
  入社:     "bg-teal-50    text-teal-700   ring-teal-200",
  不採用:   "bg-red-50     text-red-600    ring-red-200",
  辞退:     "bg-orange-50  text-orange-600 ring-orange-200",
};

const validStyles: Record<ValidStatus, string> = {
  有効:   "bg-green-50  text-green-700 ring-green-200",
  無効:   "bg-red-50    text-red-600   ring-red-200",
  未判定: "bg-slate-100 text-slate-500 ring-slate-200",
};

const BASE = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span className={`${BASE} ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function ValidStatusBadge({ status }: { status: ValidStatus }) {
  return (
    <span className={`${BASE} ${validStyles[status]}`}>
      {status}
    </span>
  );
}
