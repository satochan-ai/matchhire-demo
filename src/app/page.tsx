"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * ルートページ → /matchhire/dashboard へリダイレクト。
 *
 * サーバーサイドの redirect() は静的エクスポート時に basePath と
 * 組み合わさった場合の挙動が不安定なため、クライアントサイドで実施する。
 * basePath が設定されている場合も useRouter が自動的に解決する。
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/matchhire/dashboard");
  }, [router]);

  // リダイレクト中は何も表示しない（一瞬で遷移するため）
  return null;
}
