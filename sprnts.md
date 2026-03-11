# PostCanvas — Sprint Plan

> **Sprint Duration:** 1 week each
> **Team:** Solo developer (SAIF-EDDINE)
> **Capacity:** ~20 hours/week
> **Story Points:** 1 SP ≈ 2 hours of work → ~10 SP per sprint
> **Start Date:** TBD

---

## Sprint Overview

| Sprint | Theme | Phase | SP |
|---|---|---|---|
| 1 | Project Setup + Auth | MVP | 10 |
| 2 | Canvas Editor (Core) | MVP | 10 |
| 3 | Multi-Layer Text + Styling | MVP | 10 |
| 4 | Templates Engine | MVP | 10 |
| 5 | Save/Load + Export + Watermark | MVP | 10 |
| 6 | i18n + RTL + Font System | MVP | 10 |
| 7 | MVP Polish + Deploy | MVP | 8 |
| 8 | Facebook Integration | V1 | 10 |
| 9 | Batch Generation | V1 | 10 |
| 10 | User-Created Templates | V1 | 10 |
| 11 | Scheduling + Plan Gating | V1 | 10 |
| 12 | Community Gallery + Moderation | V1 | 10 |
| 13 | Text Effects + Image Adjustments | Growth | 10 |
| 14 | Undo/Redo + UX Polish | Growth | 10 |
| 15 | Analytics + Final Polish | Growth | 8 |

**Total:** ~15 weeks (~4 months part-time)

---

## PHASE 1 — MVP (Sprints 1–7)

Goal: Working editor with templates, multilingual support, save/download — no Facebook yet.

---

### Sprint 1 — Project Setup + Auth (10 SP)

**Goal:** Monorepo scaffolded, DB connected, auth working, basic layout shell.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 1.1 | Init Next.js 15+ project (App Router, TypeScript, Tailwind, shadcn/ui) | 1 | `pnpm dev` runs, base layout renders |
| 1.2 | MongoDB connection setup (Mongoose) + User model | 2 | DB connects, User schema validated |
| 1.3 | NextAuth.js — credentials provider (email/password) | 3 | Register, login, logout, session persists |
| 1.4 | Auth pages — `/login`, `/register` with form validation | 2 | Forms work, error states handled, redirects correct |
| 1.5 | Dashboard layout shell — sidebar, header, empty pages for `/designs`, `/templates`, `/settings` | 2 | Navigation works, active states, responsive sidebar |

**Deliverable:** User can register, log in, and see an empty dashboard.

---

### Sprint 2 — Canvas Editor (Core) (10 SP)

**Goal:** Konva canvas with image upload and a single editable text layer.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 2.1 | Editor page layout — canvas center, left panel (templates placeholder), right panel (properties placeholder), top toolbar | 2 | Responsive layout, panels toggle on/off |
| 2.2 | Install Konva.js + react-konva, create `Canvas.tsx` wrapper | 1 | Empty canvas renders at correct dimensions |
| 2.3 | Canvas size presets (1200×630, 1080×1080, 1080×1920, 820×312) with switcher | 1 | Canvas resizes correctly, maintains aspect ratio |
| 2.4 | Image upload — drag & drop, file picker, paste from clipboard | 3 | Image loads onto canvas, fits/fills correctly, can be replaced |
| 2.5 | Single text layer — click to add, inline edit, drag to move, resize handles | 3 | Text appears on canvas, editable, draggable, resizable |

**Deliverable:** User can upload an image, add text on top, move it around.

---

### Sprint 3 — Multi-Layer Text + Styling (10 SP)

**Goal:** Multiple text layers with full styling controls in the properties panel.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 3.1 | Zustand editor store — layers array, activeLayerId, CRUD operations | 2 | Add/remove/select/update layers, state consistent |
| 3.2 | Multi-layer support — "Add Text" button, each layer independent | 2 | Multiple text blocks on canvas, click to select, each has own state |
| 3.3 | LayerList sidebar — list all layers, reorder (drag), visibility toggle, delete, lock | 2 | Layers reorderable, z-index updates on canvas, lock prevents move |
| 3.4 | PropertiesPanel — font family, size, weight, color, alignment, letter spacing, line height | 3 | All props update active layer in real-time on canvas |
| 3.5 | Text transform (uppercase/lowercase/none) + rotation handle | 1 | Transform applies, rotation handle works |

**Deliverable:** Full multi-layer text editing with styling.

---

### Sprint 4 — Templates Engine (10 SP)

**Goal:** Template model, admin seeding, template browser, apply template to canvas.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 4.1 | Template Mongoose model (with textZones schema) | 1 | Model validates, textZones structured correctly |
| 4.2 | API routes — `GET /api/templates` (list, filter by category) + `GET /api/templates/[id]` | 2 | Pagination, category filter, returns full template data |
| 4.3 | Seed script — create 5 admin templates (1 promo, 1 quote, 1 announcement, 1 minimal, 1 seasonal) with proper textZones | 3 | Templates in DB, each has correct zones and styles |
| 4.4 | TemplatePanel (left sidebar) — browse templates, preview cards, category filter | 2 | Templates load, filter works, previews display |
| 4.5 | Apply template to canvas — click template → canvas loads textZones as layers with default text, position, styling | 2 | All zones render correctly, each zone editable independently |

**Deliverable:** User can browse templates and apply one to the canvas with pre-positioned text zones.

---

### Sprint 5 — Save/Load + Export + Watermark (10 SP)

**Goal:** Designs persist, user can download images with watermark.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 5.1 | Design Mongoose model + API routes (CRUD) | 2 | Create, read, update, delete designs via API |
| 5.2 | Save design — serialize Konva canvas state + text layers to DB | 2 | Save button works, auto-save on changes (debounced) |
| 5.3 | Load design — `/editor/[designId]` restores full canvas state | 1 | All layers, positions, styles, image restored exactly |
| 5.4 | My Designs page — grid of saved designs with thumbnails, duplicate, delete | 2 | Designs list loads, thumbnails render, actions work |
| 5.5 | Export to PNG/JPEG — render canvas, quality slider for JPEG | 1 | Clean export at correct resolution, quality setting works |
| 5.6 | Watermark system — "Made with PostCanvas" semi-transparent overlay on export (free tier only) | 1 | Watermark appears on download, not visible in editor |
| 5.7 | Cloudflare R2 integration — upload images + thumbnails | 1 | Files upload to R2, URLs stored in DB, images load |

**Deliverable:** Full save/load cycle, downloads work with watermark.

---

### Sprint 6 — i18n + RTL + Font System (10 SP)

**Goal:** App works in Arabic, French, and English. Arabic fonts render correctly on canvas.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 6.1 | i18n setup — next-intl or similar, translation files for AR/FR/EN | 3 | All UI strings translated, language switcher in header |
| 6.2 | RTL layout — dashboard, sidebar, panels, dialogs flip when Arabic selected | 2 | Full RTL support, no layout breaks |
| 6.3 | Font loading system — Google Fonts API integration, load Arabic + Latin font families | 2 | Fonts load dynamically, available in font picker |
| 6.4 | Font picker in PropertiesPanel — organized by script (Arabic / Latin sections) | 1 | User sees fonts grouped, preview of each font |
| 6.5 | Arabic text rendering on Konva canvas — RTL text direction, ligatures, shaping | 2 | Arabic text displays correctly, no broken letters, mixed AR/EN works |

**Deliverable:** Full trilingual app with proper Arabic canvas rendering.

---

### Sprint 7 — MVP Polish + Deploy (8 SP)

**Goal:** Bug fixes, edge cases, deploy to production.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 7.1 | Responsive dashboard — mobile-friendly designs list, settings | 1 | Dashboard usable on mobile (editor stays desktop-only) |
| 7.2 | Error handling — API errors, failed uploads, auth edge cases | 2 | User sees friendly errors, no crashes |
| 7.3 | Loading states — skeletons for designs, templates, editor load | 1 | Smooth loading experience everywhere |
| 7.4 | SEO + meta tags — landing page, Open Graph for shared links | 1 | Landing page exists, OG tags work |
| 7.5 | Vercel deployment — env vars, MongoDB Atlas, R2 config, domain | 2 | App runs on production URL, all features work |
| 7.6 | End-to-end smoke test — register → create design → apply template → edit text → save → download | 1 | Full flow works without errors |

**Deliverable:** 🚀 MVP LIVE — editor + templates + save + download + multilingual.

---

## PHASE 2 — Full V1 (Sprints 8–12)

Goal: Facebook publishing, batch generation, user templates, monetization.

---

### Sprint 8 — Facebook Integration (10 SP)

**Goal:** Users connect Facebook and publish designs directly.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 8.1 | Meta Developer Console — create Facebook App, configure OAuth | 1 | App created, test users added, OAuth redirect works |
| 8.2 | NextAuth.js Facebook provider — optional login, link to existing account | 2 | User connects FB from settings, tokens stored encrypted |
| 8.3 | Page selection — fetch user's managed Pages, store page tokens | 2 | Pages list displays, user selects which pages to manage |
| 8.4 | Publish flow — render canvas to image buffer, upload via Graph API, add caption | 3 | Design publishes to personal timeline or selected Page |
| 8.5 | Publish confirmation — success screen with post link, store in publishHistory | 1 | User sees confirmation, can click through to Facebook post |
| 8.6 | FacebookPublish dialog — page selector, caption input, preview | 1 | Clean publish UI, handles "not connected" state gracefully |

**Deliverable:** Users can publish designs to Facebook from the app.

---

### Sprint 9 — Batch Generation (10 SP)

**Goal:** Write text once, generate across multiple templates.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 9.1 | Batch page layout — `/batch` with text input form + template selector + preview area | 1 | Page scaffolded with 3 sections |
| 9.2 | TemplateSelector — multi-select grid with checkboxes, category filter | 2 | User selects multiple templates, count shown |
| 9.3 | TextInputForm — dynamic fields based on union of selected templates' textZones, zone mapping indicator | 3 | Fields appear/disappear as templates selected, shows "Used by" tags |
| 9.4 | Batch render engine — off-screen Konva canvases, inject text into each template, export all as images | 2 | All variations render correctly, text placed in right zones |
| 9.5 | PreviewGrid — display all generated images, select/deselect, open individual in editor | 1 | Grid shows all variations, can fine-tune individual ones |
| 9.6 | BatchActions — download all as ZIP (using JSZip), publish selected to Facebook | 1 | ZIP downloads with named files, batch publish works |

**Deliverable:** Full batch generation workflow.

---

### Sprint 10 — User-Created Templates (10 SP)

**Goal:** Users save designs as templates, manage them, choose visibility.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 10.1 | "Save as Template" dialog — define text zones from existing layers, name zones, set required/locked | 4 | User can pick which layers become zones, name them, set properties |
| 10.2 | API routes — `POST /api/templates` (user-created), `GET /api/templates/mine` | 2 | User templates saved with `source: 'user'`, listed separately |
| 10.3 | Visibility toggle — public/private switch when saving and on My Templates page | 1 | Default private, user can toggle, public sets `moderationStatus: 'pending'` |
| 10.4 | My Templates page — `/templates/mine` showing user's templates, edit, delete, visibility toggle | 2 | CRUD works, private/public badge shown |
| 10.5 | User templates in TemplatePanel — show in editor alongside admin templates with "My Templates" tab | 1 | User's private + public templates appear in editor panel |

**Deliverable:** Users can create, manage, and reuse their own templates.

---

### Sprint 11 — Scheduling + Plan Gating (10 SP)

**Goal:** Schedule Facebook posts, enforce free/pro limits.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 11.1 | ScheduleDialog — date/time picker, timezone display | 2 | User picks future date/time, validates minimum 10min ahead |
| 11.2 | Scheduled publish API — `scheduled_publish_time` + `published=false` in Graph API call | 2 | Post appears as scheduled on Facebook, shows in design history |
| 11.3 | Plan model — add plan enforcement middleware | 2 | Middleware checks plan limits before API actions |
| 11.4 | Free tier limits — 10 designs/month, 3 user templates, 3 batch templates, watermark, no scheduling | 2 | Limits enforced, user sees upgrade prompt when hitting limit |
| 11.5 | Pro upgrade flow — pricing page, Stripe/CMI payment integration (or manual for MVP) | 2 | User can see pricing, upgrade path exists |

**Deliverable:** Scheduling works, free/pro tiers enforced.

---

### Sprint 12 — Community Gallery + Moderation (10 SP)

**Goal:** Public template gallery, admin moderation tools.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 12.1 | Community Gallery page — browse all public templates (admin + approved user), filter by category/language/popularity | 3 | Gallery loads, filters work, sorted by usage count |
| 12.2 | TemplateCard — preview image, author name, usage count, "Use this template" button | 1 | Cards display correctly, clicking loads template in editor |
| 12.3 | Admin moderation queue — `/admin/templates` listing pending public templates, approve/reject actions | 3 | Admin sees pending templates, can approve or reject with reason |
| 12.4 | Report/flag system — users can report inappropriate public templates | 1 | Report button on template cards, reported templates flagged for admin review |
| 12.5 | Usage counter — increment `usageCount` when a template is used in a new design | 1 | Count updates, gallery sorts by popularity correctly |
| 12.6 | Admin role guard — protect `/admin/*` routes, only `role: 'admin'` users can access | 1 | Non-admin users get 403, admin dashboard accessible |

**Deliverable:** 🚀 V1 COMPLETE — Community gallery live, moderation working.

---

## PHASE 3 — Growth (Sprints 13–15)

Goal: Polish, text effects, undo/redo, analytics.

---

### Sprint 13 — Text Effects + Image Adjustments (10 SP)

**Goal:** Pro-level text effects and image filters.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 13.1 | Text shadow — color, blur, offset X/Y controls in PropertiesPanel | 2 | Shadow renders on canvas in real-time |
| 13.2 | Text stroke/outline — color, width controls | 2 | Stroke renders cleanly on all font sizes |
| 13.3 | Text highlight/background — color, padding, border-radius (pill shape) | 2 | Highlight renders behind text, respects multi-line |
| 13.4 | Image brightness, contrast, saturation sliders | 2 | Filters apply to background image, real-time preview |
| 13.5 | Background blur/dim — blur radius + overlay opacity for text readability | 2 | Blur applies, overlay darkens image behind text |

**Deliverable:** Professional text effects and image adjustments.

---

### Sprint 14 — Undo/Redo + UX Polish (10 SP)

**Goal:** Undo/redo system, keyboard shortcuts, UI refinements.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 14.1 | Undo/redo stack in Zustand store — track all canvas mutations | 3 | Ctrl+Z / Ctrl+Y work, stack limits to 50 states |
| 14.2 | Keyboard shortcuts — Delete layer, Ctrl+D duplicate, Ctrl+S save, Ctrl+Shift+E export | 2 | All shortcuts work, cheat sheet in help tooltip |
| 14.3 | Duplicate design — clone a design with all layers and settings | 1 | Duplicate creates new design with "(copy)" suffix |
| 14.4 | Facebook feed preview — show how design will look in a mock Facebook feed card | 2 | Preview modal with realistic FB post UI |
| 14.5 | Onboarding tour — first-time user guided tooltip walkthrough of editor | 2 | Tour triggers on first editor visit, can be skipped/dismissed |

**Deliverable:** Polished editor experience.

---

### Sprint 15 — Analytics + Final Polish (8 SP)

**Goal:** Usage tracking, bug fixes, performance optimization.

| # | Task | SP | Acceptance Criteria |
|---|---|---|---|
| 15.1 | Dashboard analytics — designs created, published, downloaded this month (per user) | 2 | Stats card on dashboard home with counts |
| 15.2 | Admin analytics — total users, designs, publishes, popular templates | 2 | Admin dashboard shows platform-wide stats |
| 15.3 | Performance audit — canvas rendering speed, API response times, image load optimization | 2 | Largest render < 500ms, API < 200ms, images lazy-loaded |
| 15.4 | Bug bash — fix accumulated bugs, edge cases, UI inconsistencies | 2 | All P1/P2 bugs resolved |

**Deliverable:** 🚀 GROWTH PHASE COMPLETE — polished, performant product.

---

## Summary Timeline

```
Month 1  ████████████████████████████  Sprints 1–4   MVP Core (setup, editor, layers, templates)
Month 2  ████████████████████████████  Sprints 5–8   MVP Ship + Facebook
Month 3  ████████████████████████████  Sprints 9–12  Batch, User Templates, Monetization
Month 4  ████████████████████████████  Sprints 13–15 Polish, Effects, Analytics
```

| Milestone | Sprint | What's Live |
|---|---|---|
| **MVP Launch** | End of Sprint 7 | Editor + templates + save + download + AR/FR/EN |
| **V1 Launch** | End of Sprint 12 | + Facebook publish + batch + user templates + free/pro |
| **Growth Complete** | End of Sprint 15 | + effects + undo/redo + analytics + polish |

---

## Sprint Tracking Template

Use this for each sprint standup / retro:

```
### Sprint X — [Theme]
- [ ] Task X.1 — [description]
- [ ] Task X.2 — [description]
...

**Completed:** X/Y SP
**Carried over:** [tasks moved to next sprint]
**Blockers:** [any blockers]
**Notes:** [retrospective notes]
```

---

*Updated alongside PRD-PostCanvas.md v2.0*
