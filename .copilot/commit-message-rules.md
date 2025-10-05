
# Commit Message Rules (for Copilot Agent)

## Goal
Generate and enforce clear, conventional commit messages that:
- are easy to scan in `git log`,
- link to issues/PRs when relevant,
- make releases changelog-friendly.

## Format
Use this exact structure:

<type>(<optional scope>)!: <short summary>

<optional body wrapped at ~72 cols>

<optional footer(s) for issues/PRs>

### Examples
feat(auth): add OAuth login
fix(cart)!: remove legacy coupon flow breaking API
docs(readme): update usage examples

Body example:
Explain the WHY and high-level WHAT, not every line changed.

Footer examples:
Closes: #123
Refs: #456

## Types (Conventional Commits)
- feat: a new feature
- fix: a bug fix
- docs: documentation only
- style: formatting only; no code behavior change
- refactor: neither fixes a bug nor adds a feature
- perf: performance improvement
- test: adding or updating tests
- build: build system or external dependencies
- ci: CI/CD related changes
- chore: maintenance tasks
- revert: revert a previous commit

## Imperative Mood
Title MUST use imperative mood and present tense:
✅ "add", "fix", "update"  
❌ "added", "fixed", "updates"

## Length
- Title: ≤ 50 characters, no trailing period.
- Blank line between title and body.
- Body lines: wrap around 72 chars.

## Breaking Changes
- Put `!` after type/scope **or** include in body:
  - `BREAKING CHANGE: <description>`

## Scope (optional but recommended)
Use a concise area tag (e.g., `api`, `auth`, `ui`, `infra`, `deps`).

## Linking issues
Prefer `Closes: #123` to auto-close. Use `Refs: #123` if not closing.

## Checklist (Agent must verify)
- [ ] Title matches regex (below).
- [ ] Type is in the allowed list.
- [ ] Title ≤ 50 chars.
- [ ] Body wrapped (if present).
- [ ] `!` present when breaking OR `BREAKING CHANGE:` in body.
- [ ] No file-list or stack traces in body; keep narrative.
- [ ] If PR/Issue exists, include footer.

## Regex (title)
Use this to validate just the **first line**:

^((feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9\-\/]+\))?(!)?:\s)[^\s].{0,49}$

Notes:
- allows optional scope `(scope)`
- allows optional `!` before colon for breaking
- enforces ≤ 50 chars after the type block (title itself ≤ 50)

## Agent Behaviors
- When asked to **generate**, output only the commit message text (no prose).
- When asked to **review**, list violations and propose a corrected version.
- When diffs are provided, synthesize “WHY” from context; avoid repeating file names.
- If the change mixes unrelated topics, suggest splitting commits.

## Templates

### Generate (no body)
<type>(<scope>): <summary>

### Generate (with body)
<type>(<scope>): <summary>

<why / intent – 1–3 lines>
<what changed at a high level – 1–3 lines>

<optional footer lines: Closes: #123 / Refs: #123>

### Breaking change (body form)
<type>(<scope>): <summary>

BREAKING CHANGE: <what broke and the migration path>
<optional more context>

