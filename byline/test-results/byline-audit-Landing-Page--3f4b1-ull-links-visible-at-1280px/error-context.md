# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: byline-audit.spec.ts >> Landing Page >> navbar: full links visible at 1280px
- Location: scripts\byline-audit.spec.ts:38:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e5]:
    - link "byline" [ref=e7] [cursor=pointer]:
      - /url: "#"
      - generic [ref=e10]: byline
    - navigation [ref=e18]:
      - link "demo" [ref=e19] [cursor=pointer]:
        - /url: "#demo"
      - link "features" [ref=e20] [cursor=pointer]:
        - /url: "#features"
      - link "docs" [ref=e21] [cursor=pointer]:
        - /url: "#docs"
      - link "pricing" [ref=e22] [cursor=pointer]:
        - /url: "#pricing"
      - link "github" [ref=e23] [cursor=pointer]:
        - /url: https://github.com/sahil/byline
    - generic [ref=e24]:
      - link "desk" [ref=e25] [cursor=pointer]:
        - /url: "#dashboard"
      - link "Read Docs" [ref=e27] [cursor=pointer]:
        - /url: "#docs"
        - img [ref=e28]
        - generic [ref=e31]: Read Docs
      - button "Toggle theme" [ref=e32] [cursor=pointer]:
        - img [ref=e33]
  - generic:
    - generic:
      - generic: editorial control room
      - generic:
        - link "demo":
          - /url: "#demo"
          - generic: demo
        - link "features":
          - /url: "#features"
          - generic: features
        - link "docs":
          - /url: "#docs"
          - generic: docs
        - link "pricing":
          - /url: "#pricing"
          - generic: pricing
        - link "github":
          - /url: https://github.com/sahil/byline
          - generic: github
      - generic:
        - link "open desk":
          - /url: "#dashboard"
        - link "Read Docs":
          - /url: "#docs"
          - img
          - generic: Read Docs
  - generic [ref=e37]:
    - generic [ref=e38]:
      - generic [ref=e42]: multi-agent content engine for builders who ship in public
      - generic [ref=e43]: <> open source
      - heading "Stop choosing between shipping the work and being seen for it." [level=1] [ref=e44]:
        - generic [ref=e45]: Stop choosing between
        - generic [ref=e46]: shipping the work
        - generic [ref=e47]: and being seen for it.
      - paragraph [ref=e48]: "One milestone. Five specialized AI agents run in parallel: a strategist, four platform writers, and a critic that keeps your voice intact before anything ships to LinkedIn, X, Reddit, or Threads."
      - generic [ref=e49]:
        - link "Read the Docs" [ref=e50] [cursor=pointer]:
          - /url: "#docs"
          - generic [ref=e51]: Read the Docs
        - link "Star on GitHub" [ref=e52] [cursor=pointer]:
          - /url: https://github.com/sahil/byline
          - img [ref=e53]
          - generic [ref=e55]: Star on GitHub
      - generic [ref=e56]:
        - generic [ref=e57]:
          - img [ref=e58]
          - generic [ref=e60]: open source
        - generic [ref=e61]:
          - img [ref=e62]
          - generic [ref=e66]: self-hostable
        - generic [ref=e67]:
          - img [ref=e68]
          - generic [ref=e80]: langgraph + claude
        - generic [ref=e81]:
          - img [ref=e82]
          - generic [ref=e89]: composio
    - generic [ref=e91]:
      - generic [ref=e96]: byline - zsh
      - generic [ref=e97]:
        - generic [ref=e98]:
          - generic [ref=e100]: "# byline - log a milestone"
          - generic [ref=e102]: $ byline log "shipped semantic search on fltrd.tech using pgvector"
          - generic [ref=e104]: "-> Strategist: post-worthy - angle: \"the caching problem nobody talks about\""
          - generic [ref=e106]: "-> Writing for: linkedin - x - r/webdev - threads"
          - generic [ref=e108]: v 4 drafts ready - critic score 8.6/10 - awaiting review
        - generic [ref=e110]: $ byline
  - generic [ref=e113]:
    - generic [ref=e114]: The Problem
    - heading "Building in public shouldn't be a second job." [level=2] [ref=e115]
    - paragraph [ref=e116]: You ship. You forget to post. Or you post the same thing everywhere and get buried.
    - generic [ref=e117]:
      - generic [ref=e118]:
        - img [ref=e119]
        - generic [ref=e126]:
          - generic [ref=e127]: The memory gap
          - generic [ref=e128]: Every social media tool forgets your project context the moment you close the tab. You re-explain fltrd.tech in every prompt.
      - generic [ref=e129]:
        - img [ref=e130]
        - generic [ref=e134]:
          - generic [ref=e135]: Voice decay
          - generic [ref=e136]: AI rewrites strip your personality. Posts start sounding like a press release about your own project. You sound like everyone else.
      - generic [ref=e137]:
        - img [ref=e138]
        - generic [ref=e143]:
          - generic [ref=e144]: Format fatigue
          - generic [ref=e145]: LinkedIn storytelling, X threads, Reddit depth, Threads casual — the same update needs a different frame four times. Nobody does all four.
      - generic [ref=e146]:
        - img [ref=e147]
        - generic [ref=e149]:
          - generic [ref=e150]: The Reddit trap
          - generic [ref=e151]: Self-promo blindness gets you removed before you've said anything useful. Reddit needs a genuinely different approach, not just shorter copy.
  - generic [ref=e153]:
    - generic [ref=e154]: How It Works
    - heading "One signal in. Four platform-native posts out." [level=2] [ref=e155]
    - paragraph [ref=e156]: A LangGraph pipeline runs five specialized agents in sequence. You just type what you shipped.
    - generic [ref=e157]:
      - generic [ref=e158]:
        - generic [ref=e159]: "01"
        - img [ref=e160]
        - generic [ref=e163]: You log a milestone
      - img [ref=e167]
      - generic [ref=e169]:
        - generic [ref=e170]: "02"
        - img [ref=e171]
        - generic [ref=e175]: Project memory retrieves context
      - img [ref=e179]
      - generic [ref=e181]:
        - generic [ref=e182]: "03"
        - img [ref=e183]
        - generic [ref=e186]: Strategist agent decides angle
        - generic [ref=e187]: Is it post-worthy? What story?
      - img [ref=e191]
      - generic [ref=e193]:
        - generic [ref=e194]: "04"
        - img [ref=e195]
        - generic [ref=e198]: Platform writers draft
        - generic [ref=e199]:
          - generic [ref=e200]: in
          - generic [ref=e201]: 𝕏
          - generic [ref=e202]: r/
          - generic [ref=e203]: Th
      - img [ref=e207]
      - generic [ref=e209]:
        - generic [ref=e210]: "05"
        - img [ref=e211]
        - generic [ref=e214]: Critic scores & you approve
    - paragraph [ref=e215]: "Phase 3: Composio posts automatically via MCP. No OAuth hell — Composio handles LinkedIn, X, and Reddit connections in minutes."
  - generic [ref=e217]:
    - generic [ref=e218]: Features
    - heading "A wire room for everything you ship." [level=2] [ref=e219]
    - paragraph [ref=e220]: All the context, none of the copy-paste.
    - generic [ref=e221]:
      - generic [ref=e222]:
        - generic [ref=e223]: Memory Layer
        - img [ref=e225]
        - generic [ref=e229]: Persistent project memory
        - paragraph [ref=e230]: pgvector store of all your projects — stacks, milestones, metrics. Every draft draws on real context, not a blank slate.
      - generic [ref=e231]:
        - generic [ref=e232]: Voice Profile
        - img [ref=e234]
        - generic [ref=e240]: Your voice, not AI voice
        - paragraph [ref=e241]: Feed it 10 of your old posts. It learns your open structure, what you'd never say, how long your paragraphs run. Critic flags generic phrasing.
      - generic [ref=e242]:
        - generic [ref=e243]: Distribution
        - generic [ref=e244]: One milestone. Four formats.
        - generic [ref=e245]:
          - generic [ref=e246]:
            - img [ref=e248]
            - paragraph [ref=e251]: "Shipped semantic search on fltrd.tech using pgvector. The part nobody talks about: caching the right queries before users feel the lag."
          - generic [ref=e252]:
            - img [ref=e254]
            - paragraph [ref=e257]: postgres → pgvector → shipped. skipped the dedicated vector db. turns out you didn't need it.
          - generic [ref=e258]:
            - img [ref=e260]
            - paragraph [ref=e267]: Built semantic search without a vector service — what I wish I knew about pgvector indexing (no promo, just the caveats)
          - generic [ref=e268]:
            - img [ref=e270]
            - paragraph [ref=e272]: added semantic search to fltrd.tech lol. pgvector is genuinely underrated. fast as hell.
        - paragraph [ref=e273]: Not copy-paste — each one is genuinely reframed for the platform.
      - generic [ref=e274]:
        - generic [ref=e275]: Strategy
        - img [ref=e277]
        - generic [ref=e280]: Strategist agent
        - paragraph [ref=e281]: Decides whether something is even worth posting, what angle, which platforms. Not every commit needs a LinkedIn post.
      - generic [ref=e282]:
        - generic [ref=e283]: Quality
        - img [ref=e285]
        - generic [ref=e288]: Critic agent
        - paragraph [ref=e289]: Scores every draft 1–10. Checks voice match. For Reddit, checks if it reads as self-promo — if so, rewrites the framing.
      - generic [ref=e290]:
        - generic [ref=e291]: Ingestion
        - img [ref=e293]
        - generic [ref=e296]: Capture from anywhere
        - paragraph [ref=e297]: Dashboard quick-capture, voice note via Whisper, or GitHub webhook — auto-detects releases and significant PRs. Or just type what you shipped.
        - generic [ref=e303]:
          - generic [ref=e304]: $ byline log "added waitlist to fltrd.tech, 47 signups in 6h"
          - text: ✓ logged · strategist queued
  - generic [ref=e306]:
    - generic [ref=e307]: Demo
    - heading "Type a milestone. See four drafts. Approve and ship." [level=2] [ref=e308]
    - paragraph [ref=e309]: A LangGraph pipeline that runs in seconds. Edit any draft, approve, and Composio handles the posting — no OAuth setup on your end.
    - generic [ref=e310]:
      - generic [ref=e316]: byline · the wire · localhost:3000
      - generic [ref=e317]:
        - generic [ref=e318]:
          - generic [ref=e319]: The Wire
          - generic [ref=e320]:
            - generic [ref=e321]: Log a milestone
            - textbox [ref=e322]: Shipped semantic search on fltrd.tech using pgvector. Took 3 days. The tricky part was chunking strategy, not the embeddings.
          - generic [ref=e324]:
            - generic [ref=e325]: Project
            - generic [ref=e326]:
              - generic [ref=e327]: fltrd.tech
              - img [ref=e328]
          - generic [ref=e330]:
            - generic [ref=e331]: Narrative arc
            - generic [ref=e332]:
              - generic [ref=e333]: build in public
              - img [ref=e334]
          - button "Publish" [ref=e337] [cursor=pointer]:
            - generic [ref=e338]: Publish
            - img [ref=e339]
        - generic [ref=e343]:
          - generic [ref=e345]: The Desk
          - generic [ref=e346]:
            - button "LinkedIn" [ref=e347] [cursor=pointer]
            - button "X" [ref=e348] [cursor=pointer]
            - button "Reddit" [ref=e349] [cursor=pointer]
            - button "Threads" [ref=e350] [cursor=pointer]
          - generic [ref=e352]:
            - generic [ref=e353]:
              - generic [ref=e355]: S
              - generic [ref=e356]:
                - generic [ref=e357]: Sahil· just now
                - generic [ref=e358]:
                  - img [ref=e360]
                  - generic [ref=e363]: LinkedIn
            - generic [ref=e364]:
              - paragraph [ref=e365]: Spent 3 days on semantic search and the embeddings were the easiest part.
              - paragraph [ref=e366]: It was the chunking strategy that kept breaking.
              - paragraph [ref=e367]: "Here's what finally worked on fltrd.tech: → chunk size > model choice → 15% overlap for technical content → pgvector cosine sim is fast enough for prod"
            - generic [ref=e368]:
              - generic [ref=e369]: ★ 8.4/10
              - generic [ref=e370]: · voice match ✓
              - generic [ref=e371]: · no AI slop detected ✓
          - generic [ref=e372]:
            - button "Edit" [ref=e373] [cursor=pointer]
            - button "Approve & Ship" [ref=e374] [cursor=pointer]
          - generic [ref=e375]:
            - generic [ref=e378]: "Composio connected:"
            - generic [ref=e379]:
              - img [ref=e381]
              - img [ref=e385]
              - img [ref=e389]
    - paragraph [ref=e396]: Try typing your own milestone in the left panel, then hit Publish →
  - generic [ref=e398]:
    - generic [ref=e399]: Integrations
    - heading "No OAuth hell. Composio handles the hard part." [level=2] [ref=e400]
    - paragraph [ref=e401]: Composio's MCP servers connect your AI agents to LinkedIn, X, and Reddit in minutes — no custom OAuth flows, no API key juggling.
    - img [ref=e402]:
      - generic [ref=e419] [cursor=pointer]:
        - img [ref=e423]
        - generic [ref=e426]: LinkedIn
      - generic [ref=e427] [cursor=pointer]:
        - img [ref=e431]
        - generic [ref=e434]: X
      - generic [ref=e435] [cursor=pointer]:
        - img [ref=e439]
        - generic [ref=e446]: Reddit
      - generic [ref=e447] [cursor=pointer]:
        - img [ref=e451]
        - generic [ref=e453]: Threads
      - generic [ref=e454] [cursor=pointer]:
        - generic [ref=e457]: Composio
        - generic [ref=e458]: MCP
    - generic [ref=e459]:
      - generic [ref=e460]:
        - generic [ref=e461]: ✓
        - generic [ref=e462]: "LinkedIn: post, comment, article"
      - generic [ref=e463]:
        - generic [ref=e464]: ✓
        - generic [ref=e465]: "X: tweet, thread, reply"
      - generic [ref=e466]:
        - generic [ref=e467]: ✓
        - generic [ref=e468]: "Reddit: post to subreddit, choose flair"
    - paragraph [ref=e469]: "Threads posts via Meta Graph API directly. Composio MCP deprecation notice: using the stable HTTP endpoint. Fully self-hostable."
  - generic [ref=e471]:
    - generic [ref=e472]: Pricing
    - heading "Start free. Always." [level=2] [ref=e473]
    - generic [ref=e474]:
      - generic [ref=e475]:
        - generic [ref=e476]: Most Popular
        - generic [ref=e477]: Self-hosted
        - generic [ref=e479]: $0
        - generic [ref=e480]: forever · MIT license
        - generic [ref=e482]:
          - generic [ref=e483]:
            - img [ref=e484]
            - generic [ref=e486]: Full LangGraph pipeline
          - generic [ref=e487]:
            - img [ref=e488]
            - generic [ref=e490]: All 5 agents (strategist, 4 writers, critic)
          - generic [ref=e491]:
            - img [ref=e492]
            - generic [ref=e494]: pgvector project memory
          - generic [ref=e495]:
            - img [ref=e496]
            - generic [ref=e498]: Composio MCP integration
          - generic [ref=e499]:
            - img [ref=e500]
            - generic [ref=e502]: GitHub & voice note ingestion
          - generic [ref=e503]:
            - img [ref=e504]
            - generic [ref=e506]: Unlimited bylines
        - link "Clone on GitHub" [ref=e507] [cursor=pointer]:
          - /url: https://github.com/sahil/byline
          - img [ref=e508]
          - generic [ref=e510]: Clone on GitHub
      - generic [ref=e511]:
        - generic [ref=e512]: Coming Soon
        - generic [ref=e513]: Cloud
        - generic [ref=e515]: Coming soon
        - generic [ref=e516]: Coming soon
        - generic [ref=e518]:
          - generic [ref=e519]:
            - img [ref=e520]
            - generic [ref=e522]: Everything in self-hosted
          - generic [ref=e523]:
            - img [ref=e524]
            - generic [ref=e526]: No setup required
          - generic [ref=e527]:
            - img [ref=e528]
            - generic [ref=e530]: Managed Composio credentials
          - generic [ref=e531]:
            - img [ref=e532]
            - generic [ref=e534]: Team workspace
          - generic [ref=e535]:
            - img [ref=e536]
            - generic [ref=e538]: Post analytics + feedback loop
        - link "View Roadmap" [ref=e539] [cursor=pointer]:
          - /url: "#docs"
          - generic [ref=e540]: View Roadmap
    - paragraph [ref=e541]: Byline is MIT licensed. The hosted version will be optional and will never replace the self-hosted option.
  - generic [ref=e543]:
    - generic [ref=e545]:
      - img [ref=e547]
      - img [ref=e550]:
        - generic [ref=e551]: BYLINE
    - heading "Ready to stop choosing?" [level=2] [ref=e552]
    - paragraph [ref=e553]: Open source. Self-hostable. Built in public, for builders who build in public.
    - generic [ref=e554]:
      - link "Read the Docs" [ref=e555] [cursor=pointer]:
        - /url: "#docs"
        - generic [ref=e556]: Read the Docs
      - link "Star on GitHub" [ref=e557] [cursor=pointer]:
        - /url: https://github.com/sahil/byline
        - img [ref=e558]
        - generic [ref=e560]: Star on GitHub
    - generic [ref=e562]:
      - generic [ref=e563]:
        - img [ref=e564]
        - generic [ref=e567]: git clone https://github.com/sahil/byline...
      - button [ref=e568] [cursor=pointer]:
        - img [ref=e569]
    - generic [ref=e573]:
      - generic [ref=e574]:
        - generic [ref=e575]: "4"
        - generic [ref=e576]: platforms
      - generic [ref=e578]:
        - generic [ref=e579]: "5"
        - generic [ref=e580]: agents
      - generic [ref=e582]:
        - generic [ref=e583]: MIT
        - generic [ref=e584]: license
      - generic [ref=e586]:
        - generic [ref=e587]: "0"
        - generic [ref=e588]: lock-in
    - link "★ View source on GitHub → github.com/sahil/byline" [ref=e589] [cursor=pointer]:
      - /url: https://github.com/sahil/byline
      - generic [ref=e590]: ★
      - generic [ref=e591]: View source on GitHub
      - generic [ref=e592]: →
      - generic [ref=e593]: github.com/sahil/byline
  - contentinfo [ref=e594]:
    - generic [ref=e596]:
      - generic [ref=e597]:
        - generic [ref=e598]:
          - generic [ref=e602] [cursor=pointer]: byline
          - paragraph [ref=e610]: Your byline. Everywhere you ship.
        - generic [ref=e611]:
          - generic [ref=e612]: Product
          - generic [ref=e613]:
            - link "GitHub" [ref=e614] [cursor=pointer]:
              - /url: https://github.com/sahil/byline
              - generic [ref=e615]: GitHub
              - img [ref=e616]
            - link "Docs" [ref=e619] [cursor=pointer]:
              - /url: "#docs"
              - generic [ref=e620]: Docs
              - img [ref=e621]
            - link "The Desk" [ref=e624] [cursor=pointer]:
              - /url: "#dashboard"
              - generic [ref=e625]: The Desk
              - img [ref=e626]
            - link "Pricing" [ref=e629] [cursor=pointer]:
              - /url: "#pricing"
              - generic [ref=e630]: Pricing
              - img [ref=e631]
      - generic [ref=e634]:
        - generic [ref=e635]:
          - generic [ref=e636]:
            - img [ref=e637]
            - text: MIT licensed
          - link "github.com/sahil/byline" [ref=e639] [cursor=pointer]:
            - /url: https://github.com/sahil/byline
            - img [ref=e640]
            - text: github.com/sahil/byline
        - generic [ref=e642]: Built in public by Sahil.
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const BASE_URL = process.env.BYLINE_URL || 'http://localhost:5174';
  4   | 
  5   | // ─── HELPERS ────────────────────────────────────────────────────────────────
  6   | 
  7   | async function noBlueAccent(page: Page) {
  8   |   const blueEls = await page.evaluate(() => {
  9   |     const all = Array.from(document.querySelectorAll('*'));
  10  |     const blues = ['rgb(59, 130, 246)', 'rgb(37, 99, 235)', 'rgb(29, 78, 216)', 'rgb(96, 165, 250)', 'rgb(99, 102, 241)'];
  11  |     return all
  12  |       .filter(el => {
  13  |         const platform = el.closest('[data-platform="linkedin"]');
  14  |         if (platform) return false;
  15  |         const style = window.getComputedStyle(el);
  16  |         return blues.some(b =>
  17  |           style.backgroundColor === b ||
  18  |           style.borderColor === b ||
  19  |           style.color === b ||
  20  |           style.borderLeftColor === b
  21  |         );
  22  |       })
  23  |       .map(el => ({
  24  |         tag: el.tagName,
  25  |         class: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
  26  |         text: el.textContent?.slice(0, 40),
  27  |         bg: window.getComputedStyle(el).backgroundColor,
  28  |         color: window.getComputedStyle(el).color,
  29  |       }));
  30  |   });
  31  |   return blueEls;
  32  | }
  33  | 
  34  | // ─── LANDING PAGE TESTS ─────────────────────────────────────────────────────
  35  | 
  36  | test.describe('Landing Page', () => {
  37  | 
  38  |   test('navbar: full links visible at 1280px', async ({ page }) => {
  39  |     await page.setViewportSize({ width: 1280, height: 800 });
  40  |     await page.goto(BASE_URL);
> 41  |     await page.waitForLoadState('networkidle');
      |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  42  |     for (const link of ['demo', 'features', 'docs', 'pricing', 'github']) {
  43  |       await expect(page.locator(`nav a:has-text("${link}")`).first()).toBeVisible();
  44  |     }
  45  |   });
  46  | 
  47  |   test('navbar: hamburger appears and works at 375px', async ({ page }) => {
  48  |     await page.setViewportSize({ width: 375, height: 812 });
  49  |     await page.goto(BASE_URL);
  50  |     await page.waitForLoadState('networkidle');
  51  |     const hamburger = page.locator('[aria-label="menu"], button[data-mobile-menu], .hamburger, [aria-label="open menu"], [aria-label="Open menu"]');
  52  |     const hasHamburger = await hamburger.count() > 0;
  53  |     if (hasHamburger) {
  54  |       await hamburger.first().click();
  55  |       await page.waitForTimeout(600);
  56  |       // Check if ANY link with 'features' text is now visible on the page
  57  |       const allFeatureLinks = await page.locator('a').filter({ hasText: /^features$/i }).all();
  58  |       const anyVisible = await Promise.any(
  59  |         allFeatureLinks.map(l => l.isVisible().then(v => { if (!v) throw new Error('hidden'); return true; }))
  60  |       ).catch(() => false);
  61  |       expect(anyVisible, 'A "features" link should become visible after clicking hamburger').toBe(true);
  62  |     } else {
  63  |       // No hamburger — links should be visible directly
  64  |       const allFeatureLinks = await page.locator('a').filter({ hasText: /^features$/i }).all();
  65  |       const anyVisible = await Promise.any(
  66  |         allFeatureLinks.map(l => l.isVisible().then(v => { if (!v) throw new Error('hidden'); return true; }))
  67  |       ).catch(() => false);
  68  |       expect(anyVisible, 'A "features" link should be visible on the page').toBe(true);
  69  |     }
  70  |   });
  71  | 
  72  |   test('navbar: dark mode toggle is NOT between two CTA buttons', async ({ page }) => {
  73  |     await page.setViewportSize({ width: 1280, height: 800 });
  74  |     await page.goto(BASE_URL);
  75  |     await page.waitForLoadState('networkidle');
  76  |     const toggleBox = await page.locator('[aria-label="Toggle theme"]').boundingBox();
  77  |     const dashBox = await page.locator('a:has-text("dashboard"), button:has-text("dashboard"), a:has-text("desk"), button:has-text("desk")').first().boundingBox();
  78  |     const readDocsBox = await page.locator('a:has-text("read docs"), button:has-text("read docs")').first().boundingBox();
  79  |     if (toggleBox && dashBox && readDocsBox) {
  80  |       const toggleIsAfterDash = toggleBox.x > dashBox.x;
  81  |       const toggleIsBeforeReadDocs = toggleBox.x < readDocsBox.x;
  82  |       expect(
  83  |         toggleIsAfterDash && toggleIsBeforeReadDocs,
  84  |         'Dark mode toggle should NOT be sandwiched between dashboard and read docs'
  85  |       ).toBe(false);
  86  |     }
  87  |   });
  88  | 
  89  |   test('hero: no large gap between CTA buttons and trust badges', async ({ page }) => {
  90  |     await page.setViewportSize({ width: 1280, height: 800 });
  91  |     await page.goto(BASE_URL);
  92  |     await page.waitForLoadState('networkidle');
  93  |     const ctaBox = await page.locator('a:has-text("Read the Docs"), button:has-text("Read the Docs"), a:has-text("read the docs")').first().boundingBox();
  94  |     const badgeBox = await page.locator('text=Self-hostable').first().boundingBox();
  95  |     if (ctaBox && badgeBox) {
  96  |       const gap = badgeBox.y - (ctaBox.y + ctaBox.height);
  97  |       expect(gap, `Gap between CTA and trust badges is ${gap}px — should be ≤ 40px`).toBeLessThanOrEqual(40);
  98  |     }
  99  |   });
  100 | 
  101 |   test('problem section: label tight to headline (≤ 16px gap)', async ({ page }) => {
  102 |     await page.setViewportSize({ width: 1280, height: 800 });
  103 |     await page.goto(BASE_URL);
  104 |     await page.waitForLoadState('networkidle');
  105 |     // Scroll to problem section
  106 |     await page.evaluate(() => {
  107 |       const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent?.includes('The Problem') && e.children.length === 0);
  108 |       el?.scrollIntoView();
  109 |     });
  110 |     const label = await page.locator('text=The Problem').first().boundingBox();
  111 |     const headline = await page.locator('text=Building in public').first().boundingBox();
  112 |     if (label && headline) {
  113 |       const gap = headline.y - (label.y + label.height);
  114 |       expect(gap, `"The Problem" label has ${gap}px gap to headline — should be ≤ 16px`).toBeLessThanOrEqual(16);
  115 |     }
  116 |   });
  117 | 
  118 |   test('problem section: all 4 cards same height', async ({ page }) => {
  119 |     await page.setViewportSize({ width: 1280, height: 800 });
  120 |     await page.goto(BASE_URL);
  121 |     await page.waitForLoadState('networkidle');
  122 |     const cards = page.locator('[data-problem-card], .problem-card');
  123 |     const count = await cards.count();
  124 |     if (count === 4) {
  125 |       const heights = await Promise.all(
  126 |         Array.from({ length: 4 }, (_, i) => cards.nth(i).boundingBox().then(b => b?.height ?? 0))
  127 |       );
  128 |       const max = Math.max(...heights);
  129 |       const min = Math.min(...heights);
  130 |       expect(max - min, `Problem cards differ in height by ${max - min}px — should be ≤ 2px`).toBeLessThanOrEqual(2);
  131 |     }
  132 |   });
  133 | 
  134 | });
  135 | 
  136 | // ─── DASHBOARD TESTS ─────────────────────────────────────────────────────────
  137 | 
  138 | test.describe('Dashboard', () => {
  139 | 
  140 |   test.beforeEach(async ({ page }) => {
  141 |     await page.goto(`${BASE_URL}/#dashboard`);
```