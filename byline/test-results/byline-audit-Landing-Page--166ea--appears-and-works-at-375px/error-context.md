# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: byline-audit.spec.ts >> Landing Page >> navbar: hamburger appears and works at 375px
- Location: scripts\byline-audit.spec.ts:47:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[aria-label="menu"], button[data-mobile-menu], .hamburger, [aria-label="open menu"], [aria-label="Open menu"]').first()
    - locator resolved to <button aria-label="Open menu">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e5]:
    - link "byline" [ref=e7] [cursor=pointer]:
      - /url: "#"
      - generic [ref=e10]: byline
    - generic [ref=e18]:
      - button "Toggle theme" [ref=e19] [cursor=pointer]:
        - img [ref=e20]
      - link "dashboard" [ref=e22] [cursor=pointer]:
        - /url: "#dashboard"
      - link "read docs" [ref=e23] [cursor=pointer]:
        - /url: "#docs"
        - generic [ref=e24]: read docs
    - button "Open menu" [ref=e26] [cursor=pointer]
  - generic:
    - link "demo":
      - /url: "#demo"
    - link "features":
      - /url: "#features"
    - link "docs":
      - /url: "#docs"
    - link "pricing":
      - /url: "#pricing"
    - link "github":
      - /url: https://github.com/sahil/byline
    - generic:
      - link "★ 847":
        - /url: https://github.com/sahil/byline
        - generic: ★ 847
  - generic [ref=e33]:
    - generic [ref=e34]:
      - generic [ref=e38]: Your byline. Everywhere you ship.
      - heading "Your byline. Everywhere you ship." [level=1] [ref=e39]:
        - generic [ref=e40]: Your byline.
        - generic [ref=e41]: Everywhere you ship.
      - paragraph [ref=e42]: One milestone. Five specialized agents. Your voice — published natively across LinkedIn, X, Reddit, and Threads.
      - paragraph [ref=e43]: Or connect your GitHub — Byline watches your commits and surfaces drafts before you even think to post.
      - generic [ref=e44]:
        - link "Read the Docs" [ref=e45] [cursor=pointer]:
          - /url: "#docs"
          - generic [ref=e46]: Read the Docs
        - link "Star on GitHub" [ref=e47] [cursor=pointer]:
          - /url: https://github.com/sahil/byline
          - img [ref=e48]
          - generic [ref=e50]: Star on GitHub
      - generic [ref=e51]:
        - generic [ref=e52]: Self-hostable
        - generic [ref=e53]: ·
        - generic [ref=e54]: LangGraph + Claude
        - generic [ref=e55]: ·
        - generic [ref=e56]: Composio-powered distribution
    - generic [ref=e58]:
      - generic [ref=e63]: byline — zsh
      - generic [ref=e64]:
        - generic [ref=e65]:
          - generic [ref=e67]: "# byline — log a milestone"
          - generic [ref=e69]: $ byline log "shipped semantic search on fltrd.tech using pgvector"
          - generic [ref=e71]: "→ Strategist: post-worthy · angle: \"the caching problem nobody talks about\""
          - generic [ref=e73]: "→ Writing for: linkedin · x · r/webdev · threads"
          - generic [ref=e75]: ✓ 4 drafts ready · critic score 8.6/10 · awaiting review
        - generic [ref=e77]: $ byline
  - generic [ref=e80]:
    - generic [ref=e81]: The Problem
    - heading "Building in public shouldn't be a second job." [level=2] [ref=e82]
    - paragraph [ref=e83]: You ship. You forget to post. Or you post the same thing everywhere and get buried.
    - generic [ref=e84]:
      - generic [ref=e85]:
        - img [ref=e86]
        - generic [ref=e93]:
          - generic [ref=e94]: The memory gap
          - generic [ref=e95]: Every social media tool forgets your project context the moment you close the tab. You re-explain fltrd.tech in every prompt.
      - generic [ref=e96]:
        - img [ref=e97]
        - generic [ref=e101]:
          - generic [ref=e102]: Voice decay
          - generic [ref=e103]: AI rewrites strip your personality. Posts start sounding like a press release about your own project. You sound like everyone else.
      - generic [ref=e104]:
        - img [ref=e105]
        - generic [ref=e110]:
          - generic [ref=e111]: Format fatigue
          - generic [ref=e112]: LinkedIn storytelling, X threads, Reddit depth, Threads casual — the same update needs a different frame four times. Nobody does all four.
      - generic [ref=e113]:
        - img [ref=e114]
        - generic [ref=e116]:
          - generic [ref=e117]: The Reddit trap
          - generic [ref=e118]: Self-promo blindness gets you removed before you've said anything useful. Reddit needs a genuinely different approach, not just shorter copy.
  - generic [ref=e120]:
    - generic [ref=e121]: How It Works
    - heading "One signal in. Four platform-native posts out." [level=2] [ref=e122]
    - paragraph [ref=e123]: A LangGraph pipeline runs five specialized agents in sequence. You just type what you shipped.
    - generic [ref=e124]:
      - generic [ref=e125]:
        - generic [ref=e126]: "01"
        - img [ref=e127]
        - generic [ref=e130]: You log a milestone
        - generic [ref=e131]: "or: GitHub commit · voice note · CLI"
      - generic [ref=e132]:
        - generic [ref=e133]: "02"
        - img [ref=e134]
        - generic [ref=e138]: Project memory retrieves context
      - generic [ref=e139]:
        - generic [ref=e140]: "03"
        - img [ref=e141]
        - generic [ref=e144]: Strategist agent decides angle
        - generic [ref=e145]: Is it post-worthy? What story?
      - generic [ref=e146]:
        - generic [ref=e147]: "04"
        - img [ref=e148]
        - generic [ref=e151]: Platform writers draft
        - generic [ref=e152]:
          - generic [ref=e153]: in
          - generic [ref=e154]: 𝕏
          - generic [ref=e155]: r/
          - generic [ref=e156]: Th
      - generic [ref=e157]:
        - generic [ref=e158]: "05"
        - img [ref=e159]
        - generic [ref=e162]: Critic scores & you approve
    - paragraph [ref=e163]: "Phase 3: Composio posts automatically via MCP. No OAuth hell — Composio handles LinkedIn, X, and Reddit connections in minutes."
  - generic [ref=e165]:
    - generic [ref=e166]: Features
    - heading "A wire room for everything you ship." [level=2] [ref=e167]
    - paragraph [ref=e168]: All the context, none of the copy-paste.
    - generic [ref=e169]:
      - generic [ref=e171]:
        - generic [ref=e172]: MEMORY LAYER
        - img [ref=e173]
        - generic [ref=e177]:
          - generic [ref=e178]: Persistent project memory
          - paragraph [ref=e179]: pgvector store of all your projects — stacks, milestones, metrics. Every draft draws on real context, not a blank slate.
      - generic [ref=e181]:
        - generic [ref=e182]: VOICE PROFILE
        - img [ref=e183]
        - generic [ref=e189]:
          - generic [ref=e190]: Your voice, not AI voice
          - paragraph [ref=e191]: Feed it 10 of your old posts. It learns your opener structure, what you'd never say, how long your paragraphs run. Critic flags generic phrasing.
      - generic [ref=e193]:
        - generic [ref=e194]:
          - generic [ref=e195]: DISTRIBUTION
          - generic [ref=e196]: platform preview
        - generic [ref=e197]: One milestone. Four native formats.
        - generic [ref=e198]:
          - button "LinkedIn" [ref=e199] [cursor=pointer]
          - button "X" [ref=e200] [cursor=pointer]
          - button "Reddit" [ref=e201] [cursor=pointer]
          - button "Threads" [ref=e202] [cursor=pointer]
        - generic [ref=e203]:
          - img [ref=e205]
          - paragraph [ref=e208]: "Shipped semantic search on fltrd.tech using pgvector. The part nobody talks about: caching the right queries before users feel the lag."
        - generic [ref=e209]:
          - generic [ref=e210]:
            - img [ref=e212]
            - paragraph [ref=e215]: "Shipped semantic search on fltrd.tech using pgvector. The part nobody talks about: caching the right queries before users feel the lag."
          - generic [ref=e216]:
            - img [ref=e218]
            - paragraph [ref=e221]: postgres → pgvector → shipped. skipped the dedicated vector db. turns out you didn't need it.
          - generic [ref=e222]:
            - img [ref=e224]
            - paragraph [ref=e231]: Built semantic search without a vector service — what I wish I knew about pgvector indexing (no promo, just the caveats)
          - generic [ref=e232]:
            - img [ref=e234]
            - paragraph [ref=e236]: added semantic search to fltrd.tech lol. pgvector is genuinely underrated. fast as hell.
        - generic [ref=e237]:
          - paragraph [ref=e238]: Genuinely reframed, not copy-paste
          - generic [ref=e239]: via Composio
      - generic [ref=e241]:
        - generic [ref=e242]: STRATEGY
        - img [ref=e243]
        - generic [ref=e246]:
          - generic [ref=e247]: Strategist agent
          - paragraph [ref=e248]: Decides whether something is even worth posting, what angle, which platforms. Not every commit needs a LinkedIn post.
      - generic [ref=e250]:
        - generic [ref=e251]: QUALITY
        - img [ref=e252]
        - generic [ref=e255]:
          - generic [ref=e256]: Critic agent
          - paragraph [ref=e257]: Scores every draft 1–10 across clarity, voice match, hook strength, and platform fit. For Reddit, checks if it reads as self-promo — if so, rewrites the framing.
      - generic [ref=e259]:
        - generic [ref=e260]: INGESTION
        - img [ref=e261]
        - generic [ref=e264]:
          - generic [ref=e265]: Capture from anywhere
          - paragraph [ref=e266]: Dashboard quick-capture, voice note via Whisper, or GitHub webhook — auto-detects releases and significant PRs. Or just type what you shipped.
        - generic [ref=e272]:
          - generic [ref=e273]:
            - text: $ byline log
            - generic [ref=e274]: "\"added waitlist to fltrd.tech, 47 signups in 6h\""
          - text: ✓ logged · strategist queued
  - generic [ref=e276]:
    - generic [ref=e277]: Demo
    - heading "Type a milestone. See the pipeline run. Approve and ship." [level=2] [ref=e278]
    - paragraph [ref=e279]: A LangGraph pipeline runs in seconds. Edit any draft, approve, and Composio handles the posting — no OAuth setup on your end.
    - generic [ref=e280]:
      - generic [ref=e286]: byline · the wire · localhost:3000
      - generic [ref=e288]:
        - generic [ref=e290]: The Desk
        - generic [ref=e291]:
          - button "LinkedIn" [ref=e292] [cursor=pointer]
          - button "X" [ref=e293] [cursor=pointer]
          - button "Reddit" [ref=e294] [cursor=pointer]
          - button "Threads" [ref=e295] [cursor=pointer]
        - generic [ref=e297]:
          - generic [ref=e298]:
            - generic [ref=e300]: S
            - generic [ref=e301]:
              - generic [ref=e302]: Sahil· just now
              - generic [ref=e303]:
                - img [ref=e305]
                - generic [ref=e308]: LinkedIn
          - generic [ref=e309]:
            - paragraph [ref=e310]: Spent 3 days on semantic search and the embeddings were the easiest part.
            - paragraph [ref=e311]: It was the chunking strategy that kept breaking.
            - paragraph [ref=e312]: "Here's what finally worked on fltrd.tech: → chunk size > model choice → 15% overlap for technical content → pgvector cosine sim is fast enough for prod"
          - generic [ref=e313]:
            - generic [ref=e314]: ★ 8.4/10
            - generic [ref=e315]: · voice match ✓
            - generic [ref=e316]: · no AI slop detected ✓
        - generic [ref=e317]:
          - button "Edit" [ref=e318] [cursor=pointer]
          - button "Approve & Ship" [ref=e319] [cursor=pointer]
        - generic [ref=e320]:
          - generic [ref=e323]: Composio connected
          - generic [ref=e324]:
            - img [ref=e326]
            - img [ref=e330]
            - img [ref=e334]
            - img [ref=e342]
    - paragraph [ref=e344]: Try typing your own milestone in the left panel, then hit Publish →
  - generic [ref=e346]:
    - generic [ref=e347]: Integrations
    - heading "No OAuth hell. Composio handles the hard part." [level=2] [ref=e348]
    - paragraph [ref=e349]: Composio's MCP servers connect your AI agents to LinkedIn, X, and Reddit in minutes — no custom OAuth flows, no API key juggling.
    - img [ref=e350]:
      - generic [ref=e367] [cursor=pointer]:
        - img [ref=e371]
        - generic [ref=e374]: LinkedIn
      - generic [ref=e375] [cursor=pointer]:
        - img [ref=e379]
        - generic [ref=e382]: X
      - generic [ref=e383] [cursor=pointer]:
        - img [ref=e387]
        - generic [ref=e394]: Reddit
      - generic [ref=e395] [cursor=pointer]:
        - img [ref=e399]
        - generic [ref=e401]: Threads
      - generic [ref=e402] [cursor=pointer]:
        - generic [ref=e405]: Composio
        - generic [ref=e406]: MCP
    - generic [ref=e407]:
      - generic [ref=e408]:
        - generic [ref=e409]: ✓
        - generic [ref=e410]: "LinkedIn: post, comment, article"
      - generic [ref=e411]:
        - generic [ref=e412]: ✓
        - generic [ref=e413]: "X: tweet, thread, reply"
      - generic [ref=e414]:
        - generic [ref=e415]: ✓
        - generic [ref=e416]: "Reddit: post to subreddit, choose flair"
    - paragraph [ref=e417]: "Threads posts via Meta Graph API directly. Composio MCP deprecation notice: using the stable HTTP endpoint. Fully self-hostable."
  - generic [ref=e419]:
    - generic [ref=e420]: PEOPLE WHO ACTUALLY SHIP, TALKING.
    - heading "For builders who build in public." [level=2] [ref=e421]
    - generic [ref=e422]:
      - generic [ref=e423]:
        - paragraph [ref=e425]: "\"First tool that actually remembers what fltrd.tech is. I stopped re-explaining my own project in every prompt.\""
        - generic [ref=e426]:
          - generic [ref=e428]: RK
          - generic [ref=e429]:
            - generic [ref=e430]:
              - text: Rohan K.
              - generic [ref=e431]: · founder
            - generic [ref=e432]: "@rohan_builds"
          - img [ref=e434]
      - generic [ref=e437]:
        - paragraph [ref=e439]: "\"The Reddit writer saved me. My first three posts got removed for promo. Byline reframed them as problem posts and they actually got upvoted.\""
        - generic [ref=e440]:
          - generic [ref=e442]: MS
          - generic [ref=e443]:
            - generic [ref=e444]:
              - text: Meera S.
              - generic [ref=e445]: · indie hacker
            - generic [ref=e446]: "@meeraships"
          - img [ref=e448]
      - generic [ref=e455]:
        - paragraph [ref=e457]: "\"The critic agent flagged 'excited to announce' in my own draft. Earned my trust immediately.\""
        - generic [ref=e458]:
          - generic [ref=e460]: DP
          - generic [ref=e461]:
            - generic [ref=e462]:
              - text: Dev P.
              - generic [ref=e463]: · student-founder
            - generic [ref=e464]: "@devbuilds"
          - img [ref=e466]
  - generic [ref=e470]:
    - generic [ref=e471]: Pricing
    - heading "Start free. Always." [level=2] [ref=e472]
    - generic [ref=e473]:
      - generic [ref=e474]:
        - generic [ref=e475]: ★ recommended
        - generic [ref=e476]: Self-hosted
        - generic [ref=e478]: $0
        - generic [ref=e479]: forever · MIT license
        - generic [ref=e481]:
          - generic [ref=e482]:
            - generic [ref=e483]: ✓
            - generic [ref=e484]: Full LangGraph pipeline
          - generic [ref=e485]:
            - generic [ref=e486]: ✓
            - generic [ref=e487]: All 5 agents (strategist, 4 writers, critic)
          - generic [ref=e488]:
            - generic [ref=e489]: ✓
            - generic [ref=e490]: pgvector project memory
          - generic [ref=e491]:
            - generic [ref=e492]: ✓
            - generic [ref=e493]: Composio MCP integration
          - generic [ref=e494]:
            - generic [ref=e495]: ✓
            - generic [ref=e496]: GitHub & voice note ingestion
          - generic [ref=e497]:
            - generic [ref=e498]: ✓
            - generic [ref=e499]: Unlimited bylines
        - link "Clone on GitHub" [ref=e500] [cursor=pointer]:
          - /url: https://github.com/sahil/byline
          - img [ref=e501]
          - generic [ref=e503]: Clone on GitHub
      - generic [ref=e504]:
        - generic [ref=e505]: Coming Soon
        - generic [ref=e506]: Cloud
        - generic [ref=e507]:
          - generic [ref=e508]: ~$9
          - generic [ref=e509]: /mo
        - generic [ref=e510]: estimated · early access
        - generic [ref=e512]:
          - generic [ref=e513]:
            - generic [ref=e514]: ✓
            - generic [ref=e515]: Everything in self-hosted
          - generic [ref=e516]:
            - generic [ref=e517]: ✓
            - generic [ref=e518]: No setup required
          - generic [ref=e519]:
            - generic [ref=e520]: ✓
            - generic [ref=e521]: Managed Composio credentials
          - generic [ref=e522]:
            - generic [ref=e523]: ✓
            - generic [ref=e524]: Team workspace
          - generic [ref=e525]:
            - generic [ref=e526]: ✓
            - generic [ref=e527]: Post analytics + feedback loop
        - link "View Roadmap" [ref=e528] [cursor=pointer]:
          - /url: "#docs"
          - generic [ref=e529]: View Roadmap
    - paragraph [ref=e530]: Byline is MIT licensed. The hosted version will be optional and will never replace the self-hosted option.
  - generic [ref=e532]:
    - generic [ref=e533]: Get Started
    - heading "Stop choosing between shipping and being visible." [level=2] [ref=e534]
    - paragraph [ref=e535]: Open source. Self-hostable. Built in public, for builders who build in public.
    - generic [ref=e537]:
      - generic [ref=e538]:
        - generic [ref=e539]: $
        - generic [ref=e540]: git clone https://github.com/sahil/byline.git
      - button [ref=e541] [cursor=pointer]:
        - img [ref=e542]
    - paragraph [ref=e545]: 4 platforms · 5 agents · MIT license · 0 lock-in
    - link "★ View source on GitHub → github.com/sahil/byline" [ref=e546] [cursor=pointer]:
      - /url: https://github.com/sahil/byline
      - generic [ref=e547]: ★
      - generic [ref=e548]: View source on GitHub →
      - generic [ref=e549]: github.com/sahil/byline
  - generic [ref=e551]:
    - generic [ref=e553]:
      - generic [ref=e554]: operational
      - generic [ref=e556]: /
      - generic [ref=e557]: 47 commits
      - generic [ref=e558]: /
      - generic [ref=e559]: 16 contributors
      - generic [ref=e560]: /
      - generic [ref=e561]: 5 active agents
      - generic [ref=e562]: /
      - generic [ref=e563]: 99.8% uptime
      - generic [ref=e564]: /
      - generic [ref=e565]: v1.0.0
    - generic [ref=e566]:
      - generic [ref=e567]:
        - generic [ref=e570] [cursor=pointer]: byline
        - paragraph [ref=e579]: Narrative infrastructure for builders who ship.
        - generic [ref=e580]: GitHub → Memory → Narrative → Publish
        - generic [ref=e581]:
          - generic [ref=e582]: • LangGraph
          - generic [ref=e583]: • Claude
          - generic [ref=e584]: • MCP
          - generic [ref=e585]: • Self Hosted
          - generic [ref=e586]: • MIT Licensed
      - generic [ref=e587]:
        - generic [ref=e588]:
          - generic [ref=e589]: Product
          - link "How it Works" [ref=e590] [cursor=pointer]:
            - /url: "#demo"
          - link "Docs" [ref=e591] [cursor=pointer]:
            - /url: "#docs"
          - link "Changelog" [ref=e592] [cursor=pointer]:
            - /url: "#changelog"
        - generic [ref=e593]:
          - generic [ref=e594]: Open Source
          - link "GitHub" [ref=e595] [cursor=pointer]:
            - /url: https://github.com/sahil/byline
          - link "Self-host Guide" [ref=e596] [cursor=pointer]:
            - /url: "#docs/self-host"
          - link "AGENTS.md" [ref=e597] [cursor=pointer]:
            - /url: https://github.com/sahil/byline/blob/main/AGENTS.md
        - generic [ref=e598]:
          - generic [ref=e599]: Community
          - link "X / Twitter" [ref=e600] [cursor=pointer]:
            - /url: https://x.com
          - link "Discord" [ref=e601] [cursor=pointer]:
            - /url: "#discord"
          - link "Contact" [ref=e602] [cursor=pointer]:
            - /url: "#contact"
    - generic [ref=e603]:
      - generic [ref=e604]:
        - generic [ref=e605]: Built by Sahil Sharma
        - generic [ref=e606]: ·
        - generic [ref=e607]: MIT Licensed
        - generic [ref=e608]: ·
        - generic [ref=e609]: Open Source
        - generic [ref=e610]: ·
        - generic [ref=e611]: Self Hosted
      - generic [ref=e612]:
        - generic [ref=e613]: 47 commits
        - generic [ref=e614]: ·
        - generic [ref=e615]: 16 contributors
        - generic [ref=e616]: ·
        - generic [ref=e617]: v1.0.0
        - generic [ref=e618]: ·
        - generic [ref=e619]: "2026"
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
  41  |     await page.waitForLoadState('networkidle');
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
> 54  |       await hamburger.first().click();
      |                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  77  |     const dashBox = await page.locator('a:has-text("dashboard"), button:has-text("dashboard")').first().boundingBox();
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
  142 |     await page.waitForLoadState('networkidle');
  143 |     // Dismiss onboarding if present
  144 |     const skip = page.locator('button:has-text("Skip all"), button:has-text("Skip")');
  145 |     if (await skip.count() > 0) {
  146 |       await skip.first().click();
  147 |       await page.waitForTimeout(300);
  148 |     }
  149 |   });
  150 | 
  151 |   test('dashboard page has dark background', async ({ page }) => {
  152 |     // Check body or root background is dark
  153 |     const bodyBg = await page.evaluate(() => {
  154 |       return window.getComputedStyle(document.body).backgroundColor;
```