"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CandidateStatusBadge,
  ValidStatusBadge,
  type CandidateStatus,
  type ValidStatus,
} from "@/components/candidates/CandidateStatusBadge";
import { CandidateStatusUpdate } from "@/components/candidates/CandidateStatusUpdate";
import { CandidateTimeline, type InterviewRecord, type ContactRecord } from "@/components/candidates/CandidateTimeline";
import { DataTableShell } from "@/components/common/DataTableShell";
import { MobileListCard } from "@/components/common/MobileListCard";

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
  updatedAt: string;
}

export interface ApplicationInfo {
  appliedAt: string;
  jobTitle: string;
  documentResult: "通過" | "不通過" | "審査中" | "未実施";
  interviewStage: string;
  hasOffer: boolean;
}

export interface CandidateApplicationRow {
  id: string;
  jobId: string;
  jobTitle: string;
  status: CandidateStatus;
  validity: ValidStatus;
  invalidReason: string | null;
  channel: "scout" | "dm" | "direct";
  appliedAt: string;
}

export interface CandidateDetailData {
  basic: BasicInfo;
  application: ApplicationInfo;
  applications: CandidateApplicationRow[];
  interviews: InterviewRecord[];
  contacts: ContactRecord[];
}

interface CandidateDetailProps {
  data: CandidateDetailData;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-gray-100 py-2.5 last:border-0">
      <span className="w-24 shrink-0 pt-0.5 text-xs font-medium text-gray-400">{label}</span>
      <div className="min-w-0 flex-1 text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function CandidateDetail({ data }: CandidateDetailProps) {
  const [currentStatus, setCurrentStatus] = useState<CandidateStatus>(data.basic.status);
  const { basic, application, applications } = data;

  // 応募状況サマリー：候補者に紐づく応募の単純集計のみ（既存フィールドをそのまま数える）
  const totalApps = applications.length;
  const validApps = applications.filter((a) => a.validity === "有効").length;
  // 内定数は求人一覧の computeJobMetrics と同じ定義（内定・承諾・入社）で単純集計する
  const offerApps = applications.filter(
    (a) => a.status === "内定" || a.status === "承諾" || a.status === "入社"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* 戻る導線 */}
        <Link
          href="/matchhire/candidates"
          className="inline-flex items-center gap-1 rounded text-sm text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          候補者一覧へ戻る
        </Link>

        {/* プロフィールヘッダー */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{basic.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {channelLabel[basic.channel] ?? basic.channel} 経由
                <span className="mx-2 text-gray-300">·</span>
                最終更新 <span className="tabular-nums">{basic.updatedAt}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <CandidateStatusBadge status={currentStatus} />
              <ValidStatusBadge status={basic.valid} />
            </div>
          </div>
        </div>

        {/* 2カラム：左＝基本情報・サマリー / 右＝選考状況・履歴 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">

            {/* 基本情報・スキル */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">基本情報</h2>
              <Row label="スキル">
                {basic.skills.length === 0 ? (
                  <span className="text-gray-400">—</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {basic.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </Row>
              <Row label="経歴">
                <span className="leading-relaxed">{basic.bio || "—"}</span>
              </Row>
              <Row label="応募経路">
                <span>{channelLabel[basic.channel] ?? basic.channel}</span>
              </Row>
              <Row label="最終更新日">
                <span className="tabular-nums">{basic.updatedAt}</span>
              </Row>
            </div>

            {/* 応募状況サマリー（単純集計・控えめサイズ） */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">応募状況</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "応募総数", value: totalApps, color: "text-gray-900" },
                  { label: "有効応募", value: validApps, color: "text-green-700" },
                  { label: "内定数", value: offerApps, color: offerApps > 0 ? "text-green-700" : "text-gray-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                    <p className="text-[11px] text-slate-400">{item.label}</p>
                    <p className={`mt-0.5 text-xl font-bold tabular-nums ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* 現在の選考状況（最新応募・既存項目を維持） */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">現在の選考状況（最新応募）</h2>
              <Row label="応募求人">
                <span className="font-medium text-gray-800">{application.jobTitle}</span>
              </Row>
              <Row label="応募日">
                <span className="tabular-nums">{application.appliedAt}</span>
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
              {/* ステータス更新（既存のデモ機能を維持） */}
              <CandidateStatusUpdate
                currentStatus={currentStatus}
                onUpdate={setCurrentStatus}
                demoMode
              />
            </div>
          </div>
        </div>

        {/* 応募履歴一覧（全幅） */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-baseline gap-2 border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">応募履歴</h2>
            <span className="ml-auto text-xs text-gray-400">{applications.length} 件</span>
          </div>

          {applications.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">応募履歴はありません</p>
          ) : (
            <>
              {/* PC: テーブル表示 */}
              <div className="hidden md:block">
                <DataTableShell>
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500">
                      <th scope="col" className="px-5 py-3">求人名</th>
                      <th scope="col" className="whitespace-nowrap px-5 py-3">応募ステータス</th>
                      <th scope="col" className="whitespace-nowrap px-5 py-3">有効応募</th>
                      <th scope="col" className="whitespace-nowrap px-5 py-3">無効理由</th>
                      <th scope="col" className="whitespace-nowrap px-5 py-3">応募経路</th>
                      <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">応募日</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-5 py-3">
                          <Link
                            href={`/matchhire/jobs/${app.jobId}`}
                            className="rounded font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                          >
                            {app.jobTitle}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <CandidateStatusBadge status={app.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <ValidStatusBadge status={app.validity} />
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-400">
                          {app.invalidReason ?? <span className="text-slate-200">—</span>}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                          {channelLabel[app.channel] ?? app.channel}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-slate-500">
                          {app.appliedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTableShell>
              </div>

              {/* モバイル: カード表示 */}
              <div className="flex flex-col gap-2 p-3 md:hidden">
                {applications.map((app) => (
                  <MobileListCard
                    key={app.id}
                    href={`/matchhire/jobs/${app.jobId}`}
                    aria-label={`${app.jobTitle}の求人詳細を見る`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-blue-600" title={app.jobTitle}>
                        {app.jobTitle}
                      </span>
                      <CandidateStatusBadge status={app.status} />
                      <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <ValidStatusBadge status={app.validity} />
                      <span className="text-[11px] text-slate-400">{channelLabel[app.channel] ?? app.channel}</span>
                    </div>
                    {app.invalidReason && (
                      <p className="mt-2 text-[11px] font-medium text-red-500">{app.invalidReason}</p>
                    )}
                    <p className="mt-2 text-right text-[11px] tabular-nums text-slate-400">{app.appliedAt}</p>
                  </MobileListCard>
                ))}
              </div>
            </>
          )}
        </section>

        {/* 面接履歴・接触履歴（既存表示を維持） */}
        <CandidateTimeline interviews={data.interviews} contacts={data.contacts} />

      </div>
    </div>
  );
}
