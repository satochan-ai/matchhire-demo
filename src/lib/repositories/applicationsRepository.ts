import { applications as mockApplications, type Application } from "@/lib/mockData";
import { getDataSource } from "@/lib/dataSource";
import { emptyToNull, toBoolean } from "@/lib/repositories/utils";

interface SheetsApplicationRow {
  id: string;
  applied_at: string;
  candidate_id: string;
  job_id: string;
  owner_id: string;
  channel: string;
  validity: string;
  invalid_reason: string;
  status: string;
  document_result: string;
  interview_stage: string;
  has_offer: string | boolean;
}

function normalize(row: SheetsApplicationRow): Application {
  return {
    id:             row.id,
    appliedAt:      row.applied_at,
    candidateId:    row.candidate_id,
    jobId:          row.job_id,
    ownerId:        row.owner_id,
    channel:        row.channel        as Application["channel"],
    validity:       row.validity       as Application["validity"],
    invalidReason:  emptyToNull(row.invalid_reason),
    status:         row.status         as Application["status"],
    documentResult: row.document_result as Application["documentResult"],
    interviewStage: row.interview_stage ?? "",
    hasOffer:       toBoolean(row.has_offer),
  };
}

async function fetchFromEndpoint(endpoint: string): Promise<Application[]> {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`applications の取得に失敗しました（HTTP ${res.status}）`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  if (!Array.isArray(json.rows)) throw new Error("レスポンス形式が不正です");
  return (json.rows as SheetsApplicationRow[]).map(normalize);
}

export async function fetchApplications(): Promise<Application[]> {
  const source = getDataSource();
  if (source === "mock")   return Promise.resolve(mockApplications);
  if (source === "csv")    return fetchFromEndpoint("/api/csv/applications");
  return fetchFromEndpoint("/api/sheets/applications");
}
