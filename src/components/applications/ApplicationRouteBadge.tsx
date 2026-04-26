"use client";

export type ApplicationRoute = "scout" | "dm" | "direct";

const routeStyles: Record<ApplicationRoute, string> = {
  scout:  "bg-blue-50 text-blue-700",
  dm:     "bg-purple-50 text-purple-700",
  direct: "bg-gray-100 text-gray-700",
};

const routeLabel: Record<ApplicationRoute, string> = {
  scout:  "スカウト",
  dm:     "DM",
  direct: "ダイレクト",
};

export function ApplicationRouteBadge({ route }: { route: ApplicationRoute }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${routeStyles[route]}`}>
      {routeLabel[route]}
    </span>
  );
}
