### **I. Public-Facing Website Pages**  
*(Accessible to **Guests**, Tier 1–3 users; Admin can preview)*  
*All paths under `/` (root)*  

#### **1. Core Navigation & Global Components**  
- **`/` (Home)**  
  - **Components**: Cinematic hero video (FR003), creator statement, CTA buttons ("View Portfolio", "Get JohnGPT"), featured blog posts, lead magnet signup (FR012).  
  - **Dynamic Features**: Theme toggle (FR002) persists via localStorage; auto-respects OS preference.  
  - **Edge Cases**: Mobile-optimized video fallback (GIF/static image if bandwidth low).  

#### **2. Static Content Pages**  
- **`/about`**  
  - **Components**: John’s bio (FR004), timeline of filmmaking/app development/AI work, "Faith & Creativity" philosophy section, embedded portfolio highlights.  
  - **SEO**: Schema.org `Person` markup for rich snippets.  

- **`/portfolio`**  
  - **Components**: Filterable grid (FR005) with categories:  
    - `?category=filmmaking` (video projects)  
    - `?category=apps` (app case studies)  
    - `?category=events` (event coverage)  
    - `?category=ai-tools` (JohnGPT/CGE demos)  
  - **Dynamic Features**: Click filters → URL updates (e.g., `/portfolio?category=apps&year=2023`); lazy-loaded project modals with case study details.  

- **`/services`**  
  - **Components**: Service cards (FR008) for video production, app dev, consulting, event streaming; pricing tiers (basic/premium); calendar booking widget (Calendly/Outlook).  
  - **Edge Case**: "Request Custom Quote" CTA triggers `/contact?service=custom`.  

- **`/blog`**  
  - **Components**: Blog index (FR009) with category filters (`/blog?category=faith`, `/blog?category=ai`), featured posts, newsletter signup (FR012).  
  - **Article Page**: `/blog/[slug]` (e.g., `/blog/ai-for-creators`) – rich media support (videos, code snippets), "Share to JohnGPT" button (FR022).  

- **`/public-vault`**  
  - **Components**: Obsidian-like markdown viewer (FR010) with bidirectional linking (`[[Internal Note]]`), tag clouds (`#ai-tips`, `#scriptwriting`), and graph view toggle.  
  - **Dynamic Features**: Clicking `[[Internal Note]]` → loads `/public-vault/note/[id]`.  

- **`/contact`**  
  - **Components**: Contact form (FR011), WhatsApp link (deep link: `https://wa.me/...`), embedded calendar, office location map.  
  - **Edge Case**: Form validation blocks submissions without email/phone; success redirects to `/thank-you`.  

- **`/lead-magnet`**  
  - **Components**: Dedicated landing page for lead magnets (FR012) – e.g., `/lead-magnet/free-script-template` with email capture, preview of the resource.  
  - **Post-Submit**: Redirects to `/thank-you?resource=script-template` with download link.  

#### **3. Digital Storefront**  
- **`/store`**  
  - **Components**: Product grid (FR006) with filters (`/store?price=under-50`, `/store?type=courses`), "Free Resources" section, featured bundles.  
  - **Product Page**: `/store/[product-slug]` (e.g., `/store/youtube-virality-guide`) – description, preview video, pricing, "Buy Now" button.  

- **`/checkout/[product-id]`**  
  - **Components**: Stripe/Paystack integration (FR007), order summary, email collection, success/failure handlers.  
  - **Post-Purchase**: Redirects to `/access/[product-id]` (gated content).  

- **`/access/[product-id]`**  
  - **Components**: Secure download link (FR007), license key display, "Add to Obsidian Vault" button (FR020).  
  - **Access Control**: Blocks non-purchasers; Tier 3 users see "Download All" option.  

---

### **II. User Account & Authentication Pages**  
*(Tier-specific access; requires login)*  

#### **1. Authentication Flows**  
- **`/login`**  
  - **Components**: Email/password + "Continue with Google" (JWT auth, FR024), "Forgot password?" link.  
  - **Redirect Logic**: Post-login → `/dashboard` (Tier 1–3) or `/admin` (Admin).  

- **`/signup`**  
  - **Components**: Tier selection (Tier 1/2/3), email verification flow, payment setup for paid tiers (Stripe).  
  - **Edge Case**: Guest → Tier 1 signup via `/johngpt?signup=true`.  

- **`/forgot-password`**  
  - **Components**: Email entry, password reset link delivery, new password form.  

#### **2. User Account Management**  
- **`/account`**  
  - **Components**: Tier dashboard (FR018), subscription status, billing history, "Upgrade Tier" CTAs.  
  - **Tier-Specific Views**:  
    - *Tier 1*: JohnGPT usage stats, prompt library (FR019).  
    - *Tier 2*: CGE module access toggles (e.g., "YouTube Virality OS").  
    - *Tier 3*: All tools + private course enrollment.  

- **`/account/johngpt-history`**  
  - **Components**: Searchable chat history (FR018), date filters, conversation export to Obsidian (FR020).  
  - **Dynamic Features**: Click history item → loads `/johngpt?conversation=[id]`.  

- **`/account/leads`** (Tier 2+)  
  - **Components**: Saved leads from CGE Client Magnet (FR037), outreach status tracking.  

---

### **III. JohnGPT Assistant Interfaces**  
*(Dynamic UIs with tier-based access)*  

#### **1. Core Chat Interface**  
- **`/johngpt`**  
  - **Components**:  
    - *Guest*: Limited to 3 messages; prompts guide to `/store` (FR022).  
    - *Tier 1+*: Full chat with history, persona selector (FR017), "Split-View" toggle (FR021).  
  - **Dynamic Features**:  
    - Floating button (site-wide) → expands modal on public pages; full-page on `/johngpt`.  
    - Code blocks render with syntax highlighting (FR015); markdown support.  

- **`/johngpt/agent-slot-machine`** (Admin-only)  
  - **Components**: Multi-model comparison (FR023) – input prompt → side-by-side outputs from Gemini/GPT-4o/Llama3.  

#### **2. Prompt Management**  
- **`/johngpt/prompts`**  
  - **Components**: Prompt library (FR019) – create/edit prompts, categorize ("Scripting", "Faith Guidance"), one-click apply in chat.  
  - **Access Control**: Admin sees all prompts; Tier 1+ see only their saved prompts.  

---

### **IV. Admin Dashboard & CMS**  
*(Protected at `/admin`; Admin-only access)*  

#### **1. Core Dashboard**  
- **`/admin`**  
  - **Components**: Modular dashboard (FR025) – analytics cards (traffic, sales), quick-access to tools, system status (local AI model health).  

#### **2. User Management**  
- **`/admin/users`**  
  - **Components**: User table (FR026) with filters (`?tier=admin`, `?status=active`), role/tier assignment dropdowns, bulk actions.  
  - **Edge Case**: Deactivate user → revokes access to gated content immediately.  

#### **3. Content Management (CMS)**  
- **`/admin/cms/pages`**  
  - **Components**: Edit static pages (FR032) – drag-and-drop blocks for About/Services/Contact; live preview.  
  - **Dynamic Paths**: `/admin/cms/pages/about`, `/admin/cms/pages/services`.  

- **`/admin/cms/blog`**  
  - **Components**: Blog editor (FR031) – rich text + markdown, category/tags manager, scheduling.  
  - **Article Editor**: `/admin/cms/blog/new` or `/admin/cms/blog/edit/[id]`.  

- **`/admin/cms/products`**  
  - **Components**: Digital product manager (FR033) – upload files, set pricing, configure Stripe/Paystack.  
  - **Product Editor**: `/admin/cms/products/new`, `/admin/cms/products/edit/[id]`.  

#### **4. JohnGPT Configuration**  
- **`/admin/johngpt/settings`**  
  - **Components**: AI backend selector (FR014) – Ollama/LM Studio/API keys; system prompt editor (FR016); persona manager (FR017).  
  - **Advanced**: `/admin/johngpt/settings/brand-voice` (fine-tune voice with sample inputs).  

#### **5. Analytics**  
- **`/admin/analytics`**  
  - **Components**: Traffic sources (FR029), conversion funnels, product sales heatmaps, JohnGPT usage metrics.  
  - **Export**: CSV/PDF reports via `/admin/analytics/export?date=2024-06`.  

---

### **V. Creator Growth Engine (CGE) Tools**  
*(Admin-only by default; Tier 2–3 access via `/cge`)*  

#### **1. YouTube Virality OS**  
- **`/cge/virality-os`**  
  - **Components**: Input form (FR034) – channel URL/niche keyword; "Analyze" button.  
- **`/cge/virality-os/report/[id]`**  
  - **Components**: Virality report (FR035) with:  
    - Tiered score breakdown (Title/Thumbnail/Synergy)  
    - Trending topic recommendations (YouTube/Reddit)  
    - Thumbnail generator (FR036) – upload base image → AI suggests color/text placement.  
  - **Export**: "Save as Obsidian Note" (FR020) → markdown with tags.  

#### **2. Client Magnet**  
- **`/cge/client-magnet`**  
  - **Components**: Lead generator (FR037) – industry/location filters, "Find Leads" button.  
- **`/cge/client-magnet/leads`**  
  - **Components**: Lead table with contact info; "Generate Outreach" button (FR038) → drafts personalized emails using offer templates.  
  - **Dynamic Feature**: Click lead → `/cge/client-magnet/leads/[id]` to view/edit outreach.  

#### **3. Systems Launcher**  
- **`/cge/systems-launcher`**  
  - **Components**: Role selector (FR039) – YouTuber/Podcaster/Consultant; "Generate Kit" button.  
- **`/cge/systems-launcher/kit/[role]`**  
  - **Components**: Starter kit dashboard – Notion templates, script frameworks, asset packs (LUTs/SFX); "Download All" (ZIP).  

#### **4. Course Builder**  
- **`/cge/course-builder`**  
  - **Components**: Micro-course planner (FR040) – add lessons, set pricing, generate landing page preview.  
- **`/cge/course-builder/landing/[id]`**  
  - **Components**: Editable landing page builder (drag-and-drop), payment integration test mode.  

#### **5. Scripting Studio**  
- **`/cge/scripting-studio`**  
  - **Components**: Obsidian-like editor (FR041) with sections:  
    - Thumbnail Concepts (image upload + AI suggestions)  
    - Hooks/Body/CTAs (with JohnGPT integration button)  
    - Export to markdown/vault (FR020).  

---

### **VI. System & Utility Pages**  
*(Critical for infrastructure)*  

#### **1. Authentication & Security**  
- **`/api/auth/login`** (Backend)  
  - JWT token generation; rate-limited.  
- **`/api/auth/verify-email`**  
  - Token-based email confirmation.  

#### **2. Payment & Webhooks**  
- **`/api/webhooks/stripe`**  
  - Handles Stripe events (e.g., `checkout.session.completed` → grants product access).  
- **`/api/webhooks/paystack`**  
  - Paystack equivalent.  

#### **3. Error & Maintenance**  
- **`/404`**  
  - Custom page with "Ask JohnGPT for Help" chat widget (FR022).  
- **`/500`**  
  - Fallback during local model crashes (NFR001); "Restart AI" button.  
- **`/maintenance`**  
  - Shown during cloud migration (NFR005); ETA countdown.  

#### **4. API Endpoints**  
*(Not pages but critical for functionality)*  
- **`/api/johngpt/chat`**  
  - Handles chat requests; routes to Ollama/Gemini (FR014).  
- **`/api/cge/virality-analyze`**  
  - YouTube/Reddit API calls (FR034); rate-limited to 5 req/min.  
- **`/api/obsidian/export`**  
  - Converts chat snippets to markdown (FR020); requires local vault path config.  

---

### **Access Tier Summary by Page**  
| **Page Type**               | **Guest** | **Tier 1** | **Tier 2** | **Tier 3** | **Admin** |  
|-----------------------------|-----------|------------|------------|------------|-----------|  
| Public Website (e.g., `/`, `/portfolio`) | ✅        | ✅         | ✅         | ✅         | ✅        |  
| JohnGPT Chat (`/johngpt`)   | ⚠️ (Limited) | ✅         | ✅         | ✅         | ✅        |  
| CGE Tools (`/cge/virality-os`) | ❌        | ❌         | ✅         | ✅         | ✅        |  
| CMS (`/admin/cms`)          | ❌        | ❌         | ❌         | ❌         | ✅        |  
| User Management (`/admin/users`) | ❌      | ❌         | ❌         | ❌         | ✅        |  
| Account Dashboard (`/account`) | ❌       | ✅         | ✅         | ✅         | ✅        |  

---

### **Key Technical Notes**  
1. **Local-First Execution (NFR001)**:  
   - All `/cge/*` and `/johngpt` pages work offline via local SQLite/Prisma; syncs when cloud-connected.  
   - AI model paths configured in `/admin/johngpt/settings` (e.g., `C:\ollama\models\llama3`).  

2. **Theme Persistence (FR002)**:  
   - Theme state stored in localStorage; overridden by OS preference via `prefers-color-scheme`.  

3. **Obsidian Integration (NFR007)**:  
   - `/api/obsidian/export` requires vault path config in `/admin/johngpt/settings`.  
   - Markdown exports include YAML frontmatter (e.g., `tags: [johngpt, virality]`).  

4. **Scalability (NFR004)**:  
   - `/cge/*` tools are isolated modules; new tools added via `/cge/[new-tool]` without refactoring.  
   - Cloud migration (NFR005): Swap SQLite → Supabase via Prisma `datasource` config.  

5. **Security (NFR006)**:  
   - All `/admin/*` and `/cge/*` routes have middleware checks for:  
     ```ts  
     if (user.tier < requiredTier) redirect('/login?next=' + currentPath);  
     ```  
   - API keys encrypted at rest (AES-256).  

This structure delivers **100% coverage of all FRs** while anticipating real-world edge cases (e.g., payment failures, model crashes). The modular design ensures new features (e.g., `/cge/ai-voice-cloner`) can be added without disrupting core flows. For implementation, prioritize:  
1. Public pages (`/`, `/portfolio`, `/store`) → revenue drivers.  
2. JohnGPT core (`/johngpt`, `/admin/johngpt/settings`) → flagship feature.  
3. CGE tools → monetization hooks for Tier 2–3.