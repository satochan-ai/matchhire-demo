"use client";

export type ApplicationRoute = "scout" | "dm" | "direct";

const routeStyles: Record<ApplicationRoute, string> = {
  scout:  "bg-blue-50   text-blue-700   ring-blue-200",
  dm:     "bg-violet-50 text-violet-700 ring-violet-200",
  direct: "bg-slate-100 text-slate-600  ring-slate-300",
};

const routeLabel: Record<ApplicationRoute, string> = {
  scout:  "スカウト",
  dm:     "DM",
  direct: "ダイレクト",
};

const BASE = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function ApplicationRouteBadge({ route }: { route: ApplicationRoute }) {
  return (
    <span className={`${BASE} ${routeStyles[route]}`}>
      {routeLabel[route]}
    </span>
  );
}
