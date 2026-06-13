# 🤖 AI Tooling Disclosure

This document records how AI assistance was used while building this project — included openly, as the assessment brief encourages candidates to leverage modern AI tools effectively.

---

## Tool & model

| | |
| --- | --- |
| **Tool** | Claude Code — Anthropic's official CLI (used via the **VS Code extension**) |
| **Model** | Claude **Opus 4.8** (`claude-opus-4-8`) |
| **Agent structure** | Single main conversation loop — **no sub-agents or multi-agent workflows** were spawned for this build |
| **Human role** | Directed the work, reviewed output, made all product decisions, ran the app, pushed to GitHub |

---

## The prompts used (in order)

The app was built iteratively through these requests:

1. Build the Leegality frontend exercise from the PDF — "do it in a good way just like a product-based company."
2. Run the project.
3. Fix the (non-functional) navbar product search.
4. Make it available for **all countries** — language + currency per country.
5. Also translate **product titles & descriptions** into the selected language.
6. Translate **brand names** too (display-only).
7. On country switch, show a **loader** until everything is translated (no English-first flash).
8. Make the **scrollbar** look professional.
9. "How do I make my assessment stand out from other candidates?" → then: add **tests, accessibility, URL-synced filters + sort, README/screenshots, deploy config, CI**.
10. Push to GitHub (public).

---

## Tokens & cost

**Exact figures:** run `/cost` inside the Claude Code session — it prints the precise input/output/cache token counts and the computed cost for this session. That is the only authoritative source; the numbers below are the *rate card* needed to interpret it.

### Opus 4.8 rate card (per 1M tokens)

| Token type | Rate |
| --- | --- |
| Input (uncached) | $5.00 |
| Output | $25.00 |
| Prompt-cache **write** (5-min TTL) | $6.25 |
| Prompt-cache **write** (1-hour TTL) | $10.00 |
| Prompt-cache **read** | $0.50 |

> Most of a long agentic session's input tokens are **cache reads** ($0.50/1M, i.e. 10× cheaper than fresh input), so cost is dominated by **output tokens** ($25/1M) plus the occasional cache write.

### How to read your `/cost` output

```
cost ≈ (input_tokens      × $5.00
      + output_tokens     × $25.00
      + cache_read_tokens × $0.50
      + cache_write_tokens× $6.25)  ÷ 1,000,000
```

### Does the cost depend on my plan?

Yes:
- **Claude subscription (Pro / Max):** flat monthly fee — individual sessions are **not** billed per token. `/cost` still shows the *equivalent* API cost for reference.
- **API / pay-as-you-go:** metered at the rates above.

---

## Can the cost be reduced? (yes — practical levers)

1. **Batch related changes into one request.** Each of the 10+ separate prompts re-sends the growing conversation as context. Asking for, say, "i18n + currency + RTL" in one prompt costs less than three round-trips.
2. **Lower the effort/verbosity** when the task is mechanical — high reasoning effort spends more output tokens. Reserve it for genuinely hard problems.
3. **Keep prompt caching warm.** Iterating within ~5 minutes reuses cached context at $0.50/1M instead of $5/1M. Long idle gaps force fresh re-reads.
4. **Use a smaller model for simple edits.** Opus 4.8 is the most capable (and priciest at $5/$25); Sonnet 4.6 ($3/$15) or Haiku 4.5 ($1/$5) are fine for small CSS tweaks, renames, or copy changes.
5. **Scope tightly.** "Fix the scrollbar in index.css" reads less context than an open-ended "make the UI nicer."

**Was this session's cost reasonable?** For a from-scratch, production-style React app with i18n, runtime machine translation, tests, accessibility, CI, and deployment config, the token spend is proportionate to the output produced. The biggest *reducible* waste was the number of separate follow-up prompts — bundling them would have cut repeated-context cost.

---

## How AI was used effectively (the part that matters)

The brief encourages leveraging modern tools *effectively* — so here's the division of labour:

- **AI did:** scaffolding, boilerplate, the i18n dictionaries, repetitive CSS, test/CI config, and first-pass implementations from my specs.
- **I did:** chose the architecture (URL-as-source-of-truth for filters, fetch-once-filter-client-side, locale context with no library, loader-gated translation), defined every feature and edge case, reviewed and corrected the output, ran/verified the app, and made all product decisions.

The value isn't "AI wrote code" — it's using it to move fast on the mechanical parts while keeping engineering judgement where it counts. I can walk through any decision in the codebase and explain the trade-offs.
