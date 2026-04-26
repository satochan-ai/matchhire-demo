import { evaluations as mockEvaluations, type Evaluation } from "@/lib/mockData";
import { getDataSource } from "@/lib/dataSource";
import { emptyToNull, toNumber } from "@/lib/repositories/utils";

interface SheetsEvaluationRow {
  id: string;
  interview_id: string;
  application_id: string;
  candidate_id: string;
  technical_score: string | number;
  communication_score: string | number;
  alignment_score: string | number;
  overall_grade: string;
  result: string;
  ng_reason: string;
  concerns: string;
  comment: string;
  next_action: string;
}

function normalize(row: SheetsEvaluationRow): Evaluation {
  const ngReason = emptyToNull(row.ng_reason);
  const grade    = emptyToNull(row.overall_grade);
  const result   = emptyToNull(row.result);
  const tScore   = toNumber(row.technical_score);
  const cScore   = toNumber(row.communication_score);
  const aScore   = toNumber(row.alignment_score);

  return {
    id:                 row.id,
    interviewId:        row.interview_id,
    applicationId:      row.application_id,
    candidateId:        row.candidate_id,
    technicalScore:     tScore === 0 ? null : tScore,
    communicationScore: cScore === 0 ? null : cScore,
    alignmentScore:     aScore === 0 ? null : aScore,
    overallGrade:       grade  as Evaluation["overallGrade"],
    result:             result as Evaluation["result"],
    ngReason:           ngReason as Evaluation["ngReason"],
    concerns:           row.concerns    ?? "",
    comment:            row.comment     ?? "",
    nextAction:         row.next_action ?? "",
  };
}

async function fetchFromEndpoint(endpoint: string): Promise<Evaluation[]> {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`evaluations の取得に失敗しました（HTTP ${res.status}）`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  if (!Array.isArray(json.rows)) throw new Error("レスポンス形式が不正です");
  return (json.rows as SheetsEvaluationRow[]).map(normalize);
}

export async function fetchEvaluations(): Promise<Evaluation[]> {
  const source = getDataSource();
  if (source === "mock")   return Promise.resolve(mockEvaluations);
  if (source === "csv")    return fetchFromEndpoint("/api/csv/evaluations");
  return fetchFromEndpoint("/api/sheets/evaluations");
}
