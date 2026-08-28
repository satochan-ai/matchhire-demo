@AGENTS.md

# match-hire プロジェクトルール

詳細な採用ステータス・データ境界・評価・rule-based insight・機密情報・deployment安全ルールは
`AGENTS.md`を正本として確認する。

## Claude Codeで特に注意

- CandidateStatus・ValidStatus・JobStatus等の状態値と意味を、UI都合だけで統合・改名・変更しない。
- 採用funnel・ボトルネック・insightの現在実装はrule-basedであり、
  AI予測・AI confidence・機械学習分析として表現しない。
- mock / CSV / Google Sheets経由データを同一の正本として混同しない。
- `SHEETS_API_URL`・`SHEETS_API_KEY`等のserver-only Secretをクライアントへ公開しない。
- 候補者情報・面接評価・選考結果等の採用機密を、実データのままsample・fixture・README等へ追加しない。
- MatchPilot CRM・AI Matching・dashboard等の別repositoryと、
  status・KPI・データ定義を自動的に同一仕様だと仮定しない。
- `main` へのpush / mergeはGitHub Pagesの本番公開に影響するため、
  明示的な指示なくmainへpush・mergeしない。
