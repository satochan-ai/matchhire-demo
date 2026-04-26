"use client";

import { useState } from "react";
import Link from "next/link";
import { CandidateInfoCard, type BasicInfo, type ApplicationInfo } from "@/components/candidates/CandidateInfoCard";
import { CandidateTimeline, type InterviewRecord, type ContactRecord } from "@/components/candidates/CandidateTimeline";
import type { CandidateStatus } from "@/components/candidates/CandidateStatusBadge";

export interface CandidateDetailData {
  basic: BasicInfo;
  application: ApplicationInfo;
  interviews: InterviewRecord[];
  contacts: ContactRecord[];
}

interface CandidateDetailProps {
  data: CandidateDetailData;
}

export function CandidateDetail({ data }: CandidateDetailProps) {
  const [currentStatus, setCurrentStatus] = useState<CandidateStatus>(data.basic.status);

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
          <h1 className="text-xl font-bold text-gray-900">{data.basic.name}</h1>
        </div>

        {/* 2カラム */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 左：基本情報 + 応募・選考情報 */}
          <CandidateInfoCard
            basic={data.basic}
            application={data.application}
            currentStatus={currentStatus}
            onStatusUpdate={setCurrentStatus}
          />

          {/* 右：面接履歴 + 接触履歴 */}
          <CandidateTimeline interviews={data.interviews} contacts={data.contacts} />
        </div>

      </div>
    </div>
  );
}
