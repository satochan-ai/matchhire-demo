import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MatchHire",
  description: "採用プロセス管理ツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
