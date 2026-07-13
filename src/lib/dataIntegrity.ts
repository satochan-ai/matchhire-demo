/**
 * dataIntegrity.ts
 *
 * mock / CSV / Sheets いずれのデータソースでも、テーブル間の参照整合性
 * （存在しない candidateId / applicationId / interviewId / jobId / ownerId を
 * 参照していないか）を検証する軽量なバリデーション関数。
 *
 * 不整合を検出しても画面をクラッシュさせない。開発環境でのみ console.warn に
 * 対象テーブルと ID を出力し、本番ビルドでは何もしない。
 */

import type { RawData } from "@/lib/mockData";

export interface IntegrityWarning {
  table: string;
  id: string;
  reason: string;
}

/**
 * RawData の参照整合性を検証し、警告の配列を返す。
 * データを書き換えたりフィルタしたりはしない（副作用なし・検証専用）。
 */
export function validateReferentialIntegrity(data: RawData): IntegrityWarning[] {
  const warnings: IntegrityWarning[] = [];

  const candidateIds = new Set((data.candidates ?? []).map((c) => c.id));
  const jobIds = new Set((data.jobs ?? []).map((j) => j.id));
  const ownerIds = new Set((data.owners ?? []).map((o) => o.id));
  const applicationIds = new Set((data.applications ?? []).map((a) => a.id));
  const interviewIds = new Set((data.interviews ?? []).map((i) => i.id));

  (data.applications ?? []).forEach((a) => {
    if (candidateIds.size > 0 && !candidateIds.has(a.candidateId)) {
      warnings.push({ table: "applications", id: a.id, reason: `存在しない candidateId を参照: ${a.candidateId}` });
    }
    if (jobIds.size > 0 && !jobIds.has(a.jobId)) {
      warnings.push({ table: "applications", id: a.id, reason: `存在しない jobId を参照: ${a.jobId}` });
    }
    if (ownerIds.size > 0 && !ownerIds.has(a.ownerId)) {
      warnings.push({ table: "applications", id: a.id, reason: `存在しない ownerId を参照: ${a.ownerId}` });
    }
  });

  // applicationId → Application 本体の逆引き（面接・評価との突合用）
  const applicationById = new Map((data.applications ?? []).map((a) => [a.id, a]));
  const interviewById = new Map((data.interviews ?? []).map((i) => [i.id, i]));

  // ── 面接整合性 ──
  (data.interviews ?? []).forEach((i) => {
    if (applicationIds.size > 0 && !applicationIds.has(i.applicationId)) {
      warnings.push({ table: "interviews", id: i.id, reason: `存在しない applicationId を参照: ${i.applicationId}` });
    }
    if (candidateIds.size > 0 && !candidateIds.has(i.candidateId)) {
      warnings.push({ table: "interviews", id: i.id, reason: `存在しない candidateId を参照: ${i.candidateId}` });
    }
    const app = applicationById.get(i.applicationId);
    if (app && app.candidateId !== i.candidateId) {
      warnings.push({
        table: "interviews",
        id: i.id,
        reason: `candidateId(${i.candidateId}) が参照先 application(${i.applicationId}) の candidateId(${app.candidateId}) と一致しません`,
      });
    }
  });

  // ── 評価整合性 ──
  (data.evaluations ?? []).forEach((e) => {
    if (interviewIds.size > 0 && !interviewIds.has(e.interviewId)) {
      warnings.push({ table: "evaluations", id: e.id, reason: `存在しない interviewId を参照: ${e.interviewId}` });
    }
    if (applicationIds.size > 0 && !applicationIds.has(e.applicationId)) {
      warnings.push({ table: "evaluations", id: e.id, reason: `存在しない applicationId を参照: ${e.applicationId}` });
    }
    if (candidateIds.size > 0 && !candidateIds.has(e.candidateId)) {
      warnings.push({ table: "evaluations", id: e.id, reason: `存在しない candidateId を参照: ${e.candidateId}` });
    }

    const app = applicationById.get(e.applicationId);
    if (app && app.candidateId !== e.candidateId) {
      warnings.push({
        table: "evaluations",
        id: e.id,
        reason: `candidateId(${e.candidateId}) が参照先 application(${e.applicationId}) の candidateId(${app.candidateId}) と一致しません`,
      });
    }

    const interview = interviewById.get(e.interviewId);
    if (interview) {
      if (interview.applicationId !== e.applicationId) {
        warnings.push({
          table: "evaluations",
          id: e.id,
          reason: `applicationId(${e.applicationId}) が参照先 interview(${e.interviewId}) の applicationId(${interview.applicationId}) と一致しません`,
        });
      }
      if (interview.candidateId !== e.candidateId) {
        warnings.push({
          table: "evaluations",
          id: e.id,
          reason: `candidateId(${e.candidateId}) が参照先 interview(${e.interviewId}) の candidateId(${interview.candidateId}) と一致しません`,
        });
      }
    }
  });

  (data.contacts ?? []).forEach((c) => {
    if (candidateIds.size > 0 && !candidateIds.has(c.candidateId)) {
      warnings.push({ table: "contacts", id: c.id, reason: `存在しない candidateId を参照: ${c.candidateId}` });
    }
    if (ownerIds.size > 0 && !ownerIds.has(c.ownerId)) {
      warnings.push({ table: "contacts", id: c.id, reason: `存在しない ownerId を参照: ${c.ownerId}` });
    }
  });

  // ── 重複評価（同一 interviewId に複数の evaluation） ──
  const evaluationsByInterviewId = new Map<string, string[]>();
  (data.evaluations ?? []).forEach((e) => {
    const ids = evaluationsByInterviewId.get(e.interviewId) ?? [];
    ids.push(e.id);
    evaluationsByInterviewId.set(e.interviewId, ids);
  });
  evaluationsByInterviewId.forEach((evaluationIds, interviewId) => {
    if (evaluationIds.length > 1) {
      warnings.push({
        table: "evaluations",
        id: evaluationIds.join(","),
        reason: `interviewId(${interviewId}) に対して評価が ${evaluationIds.length} 件重複しています（配列末尾を採用）`,
      });
    }
  });

  return warnings;
}

/**
 * validateReferentialIntegrity() を実行し、開発環境でのみ console.warn に出力する。
 * データフェッチ後のフックから呼び出す想定（副作用: console.warn のみ）。
 */
export function warnReferentialIntegrity(data: RawData): void {
  if (process.env.NODE_ENV === "production") return;

  const warnings = validateReferentialIntegrity(data);
  if (warnings.length === 0) return;

  console.warn(
    `[dataIntegrity] 参照整合性の不整合を ${warnings.length} 件検出しました:`,
    warnings
  );
}
