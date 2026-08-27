# MatchHire Project Instructions

## Product Boundary

MatchHire is a recruiting-support demo application for viewing candidates, jobs, applications, interviews, evaluations, recruiting funnels, and KPIs. It also provides owner analysis, rejection-reason analysis, bottleneck detection, and rule-based recruiting insights.

Keep MatchHire responsibilities separate from MatchPilot Dashboard, CRM, AI Matching, and other products. A visible screen or documented future plan does not imply production readiness.

The repository must not be treated as having production authentication, complete authorization, a secure applicant portal, ATS integrations, external recruiting-platform integrations, a production candidate database, or an actual AI API unless the implementation is explicitly verified.

## Recruiting Semantics

- Preserve the existing recruiting funnel and use the current types and calculation code as the source of truth for status names and meanings.
- Keep the distinction between scout/DM contact, opened, replied, application, valid application, document screening, interview, offer, acceptance, and joining.
- When changing application status, inspect impacts on candidate, job, application, funnel, KPI, and analytics views. Do not merge or rename statuses for visual convenience.
- Treat final hiring decisions as human decisions. Dashboard metrics and insights are supporting information, not automatic pass, reject, hire, offer, personality, or suitability decisions.

## KPI and Rule-Based Insights

Before changing a KPI or funnel calculation, confirm its source data, period, aggregation unit, numerator, denominator, status mapping, and funnel stage. Do not confuse applications, valid applications, screening passes, interviews, offers, acceptances, and joins.

`funnel.ts`, `bottleneck.ts`, and `insightEngine.ts` contain rule-based calculations and insights. Do not describe their output as an AI prediction, hiring probability, personality judgment, guaranteed recommendation, or LLM result. Do not add inferred traits or decisions that are not supported by stored data.

## Evaluation and Personal Data

Preserve the meaning and linkage of technical, communication, alignment/orientation, overall evaluation, pass/reject/hold, concerns, rejection reasons, comments, and next actions. Do not invent candidate traits, motivation, personality, ability, or cultural fit from incomplete data.

Candidate and interview data may contain personal or sensitive information. Do not copy real names, email addresses, phone numbers, addresses, resumes, career histories, salary or desired conditions, interview notes, evaluations, rejection reasons, or hiring outcomes into source code, fixtures, screenshots, logs, documentation, or sample CSV files. Do not add age, gender, nationality, health, family, beliefs, or other sensitive attributes to hiring logic unless explicitly required and separately reviewed.

Do not print interview notes, evaluation comments, concerns, or rejection reasons in bulk debug output.

## Data Sources and Repository Boundaries

The supported data-source modes are distinct:

- `mock`: demo data such as `src/lib/mockData.ts`.
- `csv`: files under `data/` accessed through the CSV repository/API.
- `sheets`: Google Apps Script and Google Sheets accessed through the Sheets repository/API.

Do not treat these modes as interchangeable sources of truth. Preserve the separation between repositories, normalization, business logic, and UI rendering. Prefer extending `src/lib/repositories/` rather than putting source-specific access in components.

When changing CSV schemas or columns, check existing data, parsers, repositories, UI, documentation, and Google Sheets mappings. Do not rename columns for presentation alone, and do not copy real candidate data into sample files.

For Sheets/GAS integration, preserve the allowed-table whitelist and server-side handling of `SHEETS_API_URL` and `SHEETS_API_KEY`. Never place keys or environment values in client code, source files, or committed documentation. Do not broaden arbitrary table access without explicit review.

## Authentication and Runtime Boundaries

Do not assume that the current repository provides login, sessions, role-based access, recruiter authorization, interviewer authorization, or secure internal-only access. Any move toward real candidate data requires a separate authentication, authorization, privacy, and security review.

Keep normal Next.js server execution distinct from the GitHub Pages static export. Check compatibility when changing Route Handlers, server-only code, data access, or environment handling.

## GitHub Pages and Deployment Safety

The GitHub Pages workflow can deploy when changes reach `main`. Treat a push or merge to `main` as a possible public release, not merely Git storage. Do not merge to `main`, push to `main`, change deployment settings, or alter the workflow unless explicitly requested.

## UI and Accessibility

Preserve the meaning and relationships of candidate, job, application, interview, evaluation, funnel, dashboard, and analytics screens. UI improvements must not change status meanings, score semantics, or funnel stages.

Maintain existing accessibility and responsive behavior, including keyboard navigation, labels, headings, contrast, and usable layouts across mobile, tablet, and desktop. Check table overflow where relevant.

## Documentation and Current Implementation

Use the current implementation, types, and repository behavior when documentation and code differ. Do not silently change behavior to match stale documentation; report the discrepancy and update documentation only when the requested change makes it materially inaccurate.

Treat future features described in README or docs—such as actual AI, production authentication, ATS integration, secure portals, or automated hiring decisions—as proposals until implemented and verified.

## Validation

Choose validation appropriate to the change:

- Funnel/KPI: status mapping, denominators, periods, aggregation units, empty data, and edge cases.
- Candidate/application: IDs, relationships, statuses, list/detail consistency, and funnel impact.
- Evaluation: score meaning, decision state, comments, and interview linkage.
- Data source: mock/CSV/Sheets behavior, normalization, fallback, and repository boundaries.
- UI: desktop/mobile/responsive behavior and accessibility.

Use available project scripts such as lint or build when appropriate. Do not assume a test or typecheck script exists, and do not report checks that were not run. For repository changes, use `git diff --check` where applicable.

## Scope and Completion Report

Make the smallest change that satisfies the request. Do not perform unrelated refactoring, broad cleanup, or dependency additions. Preserve existing user changes and never use destructive Git operations without explicit instruction.

At completion, report the relevant funnel/KPI, status, relationship, evaluation, data-source, privacy, authentication, runtime, accessibility, and deployment impacts. Also report the starting branch/HEAD, changed files, validation performed and results, final status, commit/push/deploy results if applicable, and unresolved issues. Separate verified facts from assumptions.
