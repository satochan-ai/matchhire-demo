# MatchHire Project指示

## Productの境界

MatchHireは、candidate、job、application、interview、evaluation、採用funnel、KPIを確認するための採用支援demo applicationである。owner analysis、rejection-reason analysis、bottleneck detection、rule-based recruiting insightも提供する。

MatchHireの責務をMatchPilot Dashboard、CRM、AI Matching、その他の製品から分離すること。表示される画面や文書化された将来計画は、Production readyであることを意味しない。

実装を明示的に確認しない限り、このrepositoryにProduction authentication、完全なauthorization、安全な応募者portal、ATS integration、外部recruiting platform integration、Production candidate database、実際のAI APIがあると扱わないこと。

## 採用業務の意味

- 既存のrecruiting funnelを維持し、status名と意味のsource of truthとしてcurrent typesとcalculation codeを使うこと。
- scout/DM contact、opened、replied、application、valid application、document screening、interview、offer、acceptance、joiningを区別すること。
- application statusを変更する場合は、candidate、job、application、funnel、KPI、analytics viewへの影響を確認すること。見た目の都合でstatusを統合・改名しないこと。
- 最終的な採用判断は人間が行うものとして扱うこと。Dashboard metricとinsightは補助情報であり、pass、reject、hire、offer、personality、suitabilityを自動決定するものではない。

## KPIとrule-based insight

KPIまたはfunnel計算を変更する前に、source data、period、aggregation unit、numerator、denominator、status mapping、funnel stageを確認すること。application、valid application、screening pass、interview、offer、acceptance、joinを混同しないこと。

`funnel.ts`、`bottleneck.ts`、`insightEngine.ts`にはrule-based calculationとinsightがある。その出力をAI prediction、hiring probability、personality judgment、guaranteed recommendation、LLM resultとして説明しないこと。保存dataに根拠のない推測された特性や判断を追加しないこと。

## Evaluationと個人情報

technical、communication、alignment/orientation、overall evaluation、pass/reject/hold、concerns、rejection reasons、comments、next actionsの意味と関連を維持すること。不完全なdataからcandidateの特性、motivation、personality、ability、cultural fitを作り出さないこと。

candidateとinterview dataには個人情報やsensitive informationが含まれる場合がある。実名、email address、phone number、住所、resume、career history、給与や希望条件、interview note、evaluation、rejection reason、hiring outcomeをsource code、fixture、screenshot、log、documentation、sample CSVへコピーしないこと。明示的な要件と別途reviewがない限り、年齢、性別、国籍、健康、家族、信条等のsensitive attributeをhiring logicへ追加しないこと。

interview note、evaluation comment、concern、rejection reasonをbulk debug outputへ出力しないこと。

## Data sourceとrepositoryの境界

対応するdata-source modeは別物である。

- `mock`: demo data such as `src/lib/mockData.ts`.
- `csv`: files under `data/` accessed through the CSV repository/API.
- `sheets`: Google Apps Script and Google Sheets accessed through the Sheets repository/API.

これらのmodeを交換可能なsource of truthとして扱わないこと。repository、normalization、business logic、UI renderingの分離を維持すること。source-specific accessをcomponentに置くより、`src/lib/repositories/`の拡張を優先すること。

CSV schemaやcolumnを変更する場合は、既存data、parser、repository、UI、documentation、Google Sheets mappingを確認すること。表示だけを理由にcolumnを改名せず、実candidate dataをsample fileへコピーしないこと。

For Sheets/GAS integration, preserve the allowed-table whitelist and server-side handling of `SHEETS_API_URL` and `SHEETS_API_KEY`. Never place keys or environment values in client code, source files, or committed documentation. Do not broaden arbitrary table access without explicit review.

## Authenticationとruntimeの境界

Do not assume that the current repository provides login, sessions, role-based access, recruiter authorization, interviewer authorization, or secure internal-only access. Any move toward real candidate data requires a separate authentication, authorization, privacy, and security review.

Keep normal Next.js server execution distinct from the GitHub Pages static export. Check compatibility when changing Route Handlers, server-only code, data access, or environment handling.

## GitHub Pagesとdeploymentの安全

The GitHub Pages workflow can deploy when changes reach `main`. Treat a push or merge to `main` as a possible public release, not merely Git storage. Do not merge to `main`, push to `main`, change deployment settings, or alter the workflow unless explicitly requested.

## UIとaccessibility

Preserve the meaning and relationships of candidate, job, application, interview, evaluation, funnel, dashboard, and analytics screens. UI improvements must not change status meanings, score semantics, or funnel stages.

Maintain existing accessibility and responsive behavior, including keyboard navigation, labels, headings, contrast, and usable layouts across mobile, tablet, and desktop. Check table overflow where relevant.

## Documentationとcurrent implementation

Use the current implementation, types, and repository behavior when documentation and code differ. Do not silently change behavior to match stale documentation; report the discrepancy and update documentation only when the requested change makes it materially inaccurate.

Treat future features described in README or docs—such as actual AI, production authentication, ATS integration, secure portals, or automated hiring decisions—as proposals until implemented and verified.

## validation

Choose validation appropriate to the change:

- Funnel/KPI: status mapping, denominators, periods, aggregation units, empty data, and edge cases.
- Candidate/application: IDs, relationships, statuses, list/detail consistency, and funnel impact.
- Evaluation: score meaning, decision state, comments, and interview linkage.
- Data source: mock/CSV/Sheets behavior, normalization, fallback, and repository boundaries.
- UI: desktop/mobile/responsive behavior and accessibility.

Use available project scripts such as lint or build when appropriate. Do not assume a test or typecheck script exists, and do not report checks that were not run. For repository changes, use `git diff --check` where applicable.

## 範囲と完了報告

Make the smallest change that satisfies the request. Do not perform unrelated refactoring, broad cleanup, or dependency additions. Preserve existing user changes and never use destructive Git operations without explicit instruction.

At completion, report the relevant funnel/KPI, status, relationship, evaluation, data-source, privacy, authentication, runtime, accessibility, and deployment impacts. Also report the starting branch/HEAD, changed files, validation performed and results, final status, commit/push/deploy results if applicable, and unresolved issues. Separate verified facts from assumptions.
