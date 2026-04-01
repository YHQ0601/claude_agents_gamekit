# Contributing To Claude Agents GameKit

Thanks for contributing.

This repository is not just a set of prompts. It is a reusable Claude Code workflow scaffold. That means contributions should improve one or more of these properties without weakening the others:

- portability across host repositories
- explicit workflow structure
- clean separation of docs and runtime state
- safe placeholder asset replacement
- repeatable validation and smoke coverage

## Contribution Priorities

The most valuable contributions usually fall into one of these groups:

- better agent or command ergonomics
- stronger schema and script validation
- broader engine support
- clearer documentation
- safer asset contract patterns
- better verification flows

The least valuable contributions are usually the flashy ones:

- adding many new agents without narrow responsibilities
- adding hidden state or implicit behavior
- shipping demo runtime state inside the clean template
- hardcoding one engine's assumptions into the shared workflow

## Project Principles

Please align changes with these principles.

### 1. Main session stays in charge

The template is built around a star topology. The main session orchestrates, and subagents report back. Avoid changes that encourage uncontrolled peer-to-peer agent coordination.

### 2. Split by context pollution

New roles should exist only when they isolate a genuinely noisy or high-value class of work. Do not add a role just because it sounds organizationally complete.

### 3. Human docs and machine state are different

- Human docs belong in `.claude-gamekit/project/docs/`
- Structured runtime state belongs in `.claude-gamekit/project/artifacts/`
- Reusable toolkit logic belongs in `.claude-gamekit/core/`

Do not blur these boundaries casually.

### 4. Keep the template clean

Do not commit preloaded demo tasks as active runtime state.

Good examples belong in:

- `.claude-gamekit/core/tests/fixtures/`
- documentation
- optional future examples that are clearly isolated

They should not live as if they were the current project state.

### 5. Contracts matter

When changing asset workflow behavior, preserve the Asset ABI philosophy. Placeholder assets should remain replaceable. Gameplay code should not be encouraged to depend on temporary asset names or fragile hierarchy details.

## Before You Open A Change

Run:

```powershell
npm --prefix .claude-gamekit/core run validate
npm --prefix .claude-gamekit/core run test
```

If your change touches executable entrypoints under `.claude-gamekit/core/scripts/`, make sure the smoke suite still covers the behavior or extend it.

## If You Add Or Change An Agent

Also update:

- `.claude/agents/<agent>.md`
- `.claude-gamekit/core/scripts/validate/template-rules.mjs`
- `.claude-gamekit/core/tests/fixtures/agent-contracts.json`
- any related docs

If the new role introduces a new executable workflow shape, add smoke coverage where appropriate.

## If You Add Or Change A Command

Also update:

- `.claude/commands/<command>.md`
- validation logic if required
- docs that explain the command and where it fits in the workflow

## If You Add Or Change A Script

Also update:

- smoke coverage in `.claude-gamekit/core/tests/`
- schema fixtures if the script reads or writes structured artifacts
- any docs that describe how the script is used

The expectation is that executable toolkit entrypoints remain runnable from a clean shell.

## If You Add Or Change A Schema

Also update:

- fixture data under `.claude-gamekit/core/tests/fixtures/`
- validation rules if the schema should be enforced automatically
- docs that explain the artifact meaning

## Pull Request Guidance

A strong PR for this repository usually makes these things easy to answer:

- What problem does this solve?
- Why is this the right layer for the change?
- Does it make the template clearer, safer, or more reusable?
- What tests or smoke coverage prove it?
- Does it keep the clean template principle intact?

## Style Guidance

- Prefer explicit behavior over clever behavior.
- Prefer narrow changes over sweeping magical ones.
- Prefer portable directory assumptions over host-project takeover.
- Prefer documented contracts over implied conventions.

## If You Want To Help But Are Not Sure Where

Good starter areas:

- docs clarity
- README improvements
- engine adapter notes
- better fixtures
- better smoke coverage
- issue examples or workflow examples that do not pollute the clean template

If the repository keeps feeling more understandable, more restartable, and more trustworthy after your change, that is usually a good sign.
