# Dar El Zokora — website directions

Three complete, bilingual redesigns of darelzokora.com (Dr. Osama Ghattas's centre), built around
the client's one structural ask: **two sections, adults and kids, stressed everywhere**. Arabic is the
default (RTL); English is one tap away and remembered per browser (`localStorage["dz-lang"]`).

Live: <https://band-agents.github.io/darelzokora-directions/> (public repo
`band-agents/darelzokora-directions`, `npm run deploy:pages` force-pushes the build to `gh-pages`).

## Run

    npm run dev            # http://localhost:5197 (launch.json: "darelzokora-directions")
    npm run typecheck
    npm run build          # dist/ for Pages
    npm run build:single   # dist-single/index.html, one self-contained file
    npm run deploy:pages

## Routes (hash, so it works on Pages and as a single file)

`#` overview board · `#bubble` `#split` `#sticker` home · `/adults` `/kids` world hubs ·
`/s/<serviceId>` service · `/book[/adults|/kids|/s/<id>]` booking · `/doctor` `/branches` `/articles`.
The switcher at the bottom keeps the page when changing direction.

## Where things live

- `src/content/index.ts`: **all copy**, as `{ar, en}` pairs. 16 services (8 per world), concerns,
  ages, journeys, FAQ, reviews, branches, articles. Lines marked `// ours` were written by us and
  need Dr. Osama's review. Only claims checkable on the live site are used.
- `src/ui/`: shared markup (`z-*` classes), used by all three directions.
  `Shell.tsx` (page switch), `chrome.tsx` (header with the Adults/Kids switch, phone tab bar,
  world wipe, footer), `sections.tsx`, `Booking.tsx` (world-first wizard), `pages.tsx`, `base.css`.
- `src/directions/{Bubble,Split,Sticker}.tsx` + `.css`: each direction's home, world hub and skin
  (`.bu`, `.sp`, `.st` on the root). Each exports its `SKIN` (colours passed into Remotion).
- `src/remotion/heroes.tsx`: the three hero films and the world art. `src/overview/`: the board.

## Rules that bit before

- **World colour is data, not classes.** `data-world` on the root, `data-w` on any element, map
  `--a-*`/`--k-*` to `--accent`, `--accent-ink`, `--soft`, `--soft2`, `--on` (base.css).
- **Logical properties only** (inline/block, start/end); one stylesheet serves both directions.
- **Remotion Player inside an RTL page must sit in `dir="ltr"`**, or it shows a sliver
  (LivePlayer does this).
- Seamless loops: scene period 100 frames, the last scene is phase-aligned (`LAST_PHASE`);
  `HERO_FRAMES = SCENE*3 + LAST - TRANS*3`. The WebGL transitions are not used.
- Arabic headings get more leading and no letter-spacing (base.css, `[lang="ar"]`).
- Never gate content on an animation finishing (no `AnimatePresence mode="wait"`).
- Booking is a *request* the centre confirms by phone; times are placeholders.

## Open with the client

Which direction; Dr. Osama's review of `// ours` copy (kids pages especially); real branch hours;
where booking requests go; the WhatsApp number the current site links (not used yet); consent to
quote Google reviews; real photos. Remotion's company licence may apply to a commercial site.
