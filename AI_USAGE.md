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

## Development log

The application was delivered in iterative phases, each driven by a clear objective:

| # | Phase | Objective | Outcome |
| --- | --- | --- | --- |
| 1 | **Foundation** | Implement the Product Listing & Detail application per the assessment specification, to a production standard. | React + Vite app: combined filtering, pagination, routing, loading/error/empty states. |
| 2 | **Verification** | Run the application and confirm behaviour against the brief. | Dev server validated; flows verified end-to-end. |
| 3 | **Defect fix** | Make the header search a functional control (it was previously a static placeholder). | Search wired to shared filter state; works from any route. |
| 4 | **Internationalisation** | Support multiple countries — UI language and localised currency per region. | 10 countries / 9 languages, `Intl`-based currency conversion, RTL support. |
| 5 | **Content localisation** | Localise the catalogue content (titles, descriptions), not just the UI chrome. | Runtime machine translation with caching and fail-soft fallback. |
| 6 | **Content localisation (cont.)** | Extend translation to brand names (display layer only). | Brands translated for display; original value retained as the filter key. |
| 7 | **UX refinement** | Eliminate the English-first flash on language switch. | Render gated behind a loader until the visible page is fully translated. |
| 8 | **Visual polish** | Replace default scrollbars with a refined, cross-browser treatment. | Slim, hover-reactive scrollbars (WebKit + Firefox). |
| 9 | **Differentiation** | Raise the submission above a baseline implementation. | Added unit/integration **tests**, **accessibility**, **URL-synced filters + sort**, a showcase **README** with screenshots, **deploy config**, and **CI**. |
| 10 | **Delivery** | Publish the work for review. | Public GitHub repository with green CI. |

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
