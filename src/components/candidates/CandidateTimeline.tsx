"use client";

export interface InterviewRecord {
  date: string;
  interviewer: string;
  result: "通過" | "不採用" | "保留" | "未確定";
  comment: string;
}

export interface ContactRecord {
  date: string;
  channel: "scout" | "dm";
  opened: boolean;
  replied: boolean;
}

interface CandidateTimelineProps {
  interviews: InterviewRecord[];
  contacts: ContactRecord[];
}

const interviewResultStyles: Record<InterviewRecord["result"], string> = {
  通過: "bg-green-100 text-green-700",
  不採用: "bg-red-100 text-red-600",
  保留: "bg-yellow-100 text-yellow-700",
  未確定: "bg-gray-100 text-gray-500",
};

const channelLabel: Record<string, string> = { scout: "スカウト", dm: "DM" };

function TimelineDot({ color }: { color: string }) {
  return (
    <div className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-white shadow ${color}`} />
  );
}

export function CandidateTimeline({ interviews, contacts }: CandidateTimelineProps) {
  return (
    <div className="space-y-4">
      {/* ③ 面接履歴 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">③ 面接履歴</h2>
        {interviews.length === 0 ? (
          <p className="text-sm text-gray-400">面接履歴はありません</p>
        ) : (
          <ol className="relative border-l border-gray-200 ml-1.5 space-y-6">
            {interviews.map((iv, i) => (
              <li key={i} className="pl-5">
                <div className="absolute -left-1.5">
                  <TimelineDot color="bg-purple-400" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">{iv.date}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${interviewResultStyles[iv.result]}`}>
                    {iv.result}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  面接官：{iv.interviewer}
                </p>
                {iv.comment && (
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{iv.comment}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* ④ 接触履歴 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">④ 接触履歴</h2>
        {contacts.length === 0 ? (
          <p className="text-sm text-gray-400">接触履歴はありません</p>
        ) : (
          <ol className="relative border-l border-gray-200 ml-1.5 space-y-6">
            {contacts.map((ct, i) => (
              <li key={i} className="pl-5">
                <div className="absolute -left-1.5">
                  <TimelineDot color="bg-blue-400" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">{ct.date}</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {channelLabel[ct.channel]}
                  </span>
                </div>
                <div className="mt-1.5 flex gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ct.opened ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                    {ct.opened ? "開封済" : "未開封"}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ct.replied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                    {ct.replied ? "返信あり" : "返信なし"}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
