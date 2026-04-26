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
  応募受付: "bg-gray-100 text-gray-700",
  書類選考: "bg-blue-100 text-blue-700",
  面接: "bg-purple-100 text-purple-700",
  内定: "bg-green-100 text-green-700",
  承諾: "bg-emerald-100 text-emerald-700",
  入社: "bg-teal-100 text-teal-700",
  不採用: "bg-red-100 text-red-600",
  辞退: "bg-orange-100 text-orange-600",
};

const validStyles: Record<ValidStatus, string> = {
  有効: "bg-green-100 text-green-700",
  無効: "bg-red-100 text-red-600",
  未判定: "bg-gray-100 text-gray-500",
};

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function ValidStatusBadge({ status }: { status: ValidStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${validStyles[status]}`}>
      {status}
    </span>
  );
}
