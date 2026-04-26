"use client";

import {
  CandidateStatusBadge,
  ValidStatusBadge,
  type CandidateStatus,
  type ValidStatus,
} from "@/components/candidates/CandidateStatusBadge";
import { CandidateStatusUpdate } from "@/components/candidates/CandidateStatusUpdate";

const channelLabel: Record<string, string> = {
  scout: "スカウト",
  dm: "DM",
  direct: "ダイレクト",
};

const docResultStyles: Record<string, string> = {
  通過: "bg-green-100 text-green-700",
  不通過: "bg-red-100 text-red-600",
  審査中: "bg-yellow-100 text-yellow-700",
  未実施: "bg-gray-100 text-gray-500",
};

export interface BasicInfo {
  name: string;
  skills: string[];
  bio: string;
  channel: "scout" | "dm" | "direct";
  status: CandidateStatus;
  valid: ValidStatus;
}

export interface ApplicationInfo {
  appliedAt: string;
  documentResult: "通過" | "不通過" | "審査中" | "未実施";
  interviewStage: string;
  hasOffer: boolean;
}

interface CandidateInfoCardProps {
  basic: BasicInfo;
  application: ApplicationInfo;
  /** 外部から管理される現在ステータス（useState連携用） */
  currentStatus?: CandidateStatus;
  /** ステータス更新コールバック */
  onStatusUpdate?: (newStatus: CandidateStatus) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="w-28 shrink-0 text-xs font-medium text-gray-400 pt-0.5">{label}</span>
      <div className="flex-1 text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function CandidateInfoCard({
  basic,
  application,
  currentStatus,
  onStatusUpdate,
}: CandidateInfoCardProps) {
  const displayStatus = currentStatus ?? basic.status;
  return (
    <div className="space-y-4">
      {/* ① 基本情報 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">① 基本情報</h2>
        <Row label="氏名">
          <span className="font-semibold text-gray-800 text-base">{basic.name}</span>
        </Row>
        <Row label="スキル">
          <div className="flex flex-wrap gap-1">
            {basic.skills.map((s) => (
              <span key={s} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                {s}
              </span>
            ))}
          </div>
        </Row>
        <Row label="経歴">
          <span className="leading-relaxed">{basic.bio}</span>
        </Row>
        <Row label="応募経路">
          <span>{channelLabel[basic.channel] ?? basic.channel}</span>
        </Row>
        <Row label="ステータス">
          <CandidateStatusBadge status={displayStatus} />
        </Row>
        <Row label="有効応募">
          <ValidStatusBadge status={basic.valid} />
        </Row>
        {/* ステータス更新UI */}
        {onStatusUpdate && (
          <CandidateStatusUpdate
            currentStatus={displayStatus}
            onUpdate={onStatusUpdate}
          />
        )}
      </div>

      {/* ② 応募・選考情報 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">② 応募・選考情報</h2>
        <Row label="応募日">
          <span>{application.appliedAt}</span>
        </Row>
        <Row label="書類結果">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${docResultStyles[application.documentResult]}`}>
            {application.documentResult}
          </span>
        </Row>
        <Row label="面接ステージ">
          <span>{application.interviewStage}</span>
        </Row>
        <Row label="内定">
          {application.hasOffer ? (
            <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">あり</span>
          ) : (
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">なし</span>
          )}
        </Row>
      </div>
    </div>
  );
}
