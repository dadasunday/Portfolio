# Portfolio Website Build Guidelines — Sunday Dada

> **Instructions for Claude:** Use these guidelines to build a multi-page React portfolio website (.jsx artifact) for Sunday Dada, a Senior Power BI Developer seeking data roles. The site must feel corporate, polished, and story-driven — designed to convince a hiring manager within minutes that Sunday solves real problems with data. Follow every section precisely.

---

## 1. DESIGN DIRECTION

**Style:** Corporate & polished — enterprise-grade feel. Think McKinsey meets modern data platform marketing. Refined, trustworthy, serious about craft.

**Color Palette (use CSS variables):**
- `--primary-dark`: Deep navy `#0B1D3A` — headers, nav, footer, hero backgrounds
- `--primary-light`: White `#FFFFFF`
- `--accent`: Warm gold/amber `#C9A84C` — CTAs, highlights, stat numbers, active nav states
- `--surface`: Warm off-white `#F7F6F2` — alternating section backgrounds
- `--text-primary`: `#1A1A1A`
- `--text-secondary`: `#5A5A5A`
- `--border`: `#E2E0DA`
- `--card-bg`: `#FFFFFF` with subtle shadow

**Typography (import from Google Fonts):**
- **Headings:** `DM Serif Display` — elegant serif, commands authority
- **Body:** `DM Sans` — clean, modern, pairs perfectly
- Never use Inter, Arial, Roboto, or system fonts

**Motion & Interaction:**
- Fade-in-up animations on scroll using IntersectionObserver (stagger child elements)
- Subtle card hover: lift with shadow deepening (`transform: translateY(-4px)`)
- Smooth page transitions when navigating between pages (fade or slide)
- Nav link underline animation on hover
- Keep all motion elegant and restrained — this is a professional site, not a playground

**Visual Texture:**
- Hero sections: subtle geometric dot grid pattern or fine diagonal lines at low opacity over the navy background
- Section dividers: thin gold accent line or subtle gradient fade
- Cards: clean white with 1px border and soft shadow, not floating in space

---

## 2. SITE ARCHITECTURE (Multi-Page)

Build using React state-based routing (no external router needed). Track `currentPage` in state and render the correct page component. Structure:

```
Home (/) .............. Hero + About Me + Project Cards Grid + Skills + Contact
Project 1 (/project/1) .. Executive Analytics Suite — full case study
Project 2 (/project/2) .. Finance & Sales Reporting Overhaul — full case study
Project 3 (/project/3) .. Enterprise Data Warehouse & ETL Platform — full case study
Project 4 (/project/4) .. AI-Powered Operations Platforms — full case study
```

---

## 3. GLOBAL ELEMENTS (Present on Every Page)

### Navigation Bar (sticky top)
- Left: `SUNDAY DADA` in accent gold, small caps, letterspaced — acts as home link
- Right: `About` | `Projects` | `Skills` | `Contact` — these scroll to sections on the Home page, or navigate to Home first then scroll
- On project pages, add a `← Back to Projects` link on the left or replace nav behavior
- Mobile: hamburger icon that opens a full-screen overlay menu
- Sticky with backdrop blur (`backdrop-filter: blur(12px)`) after scrolling past hero

### Footer (every page)
- Navy background, white text
- Three columns:
  - Left: `SUNDAY DADA` + one-liner tagline
  - Center: Quick links (About, Projects, Skills, Contact)
  - Right: Email (mailto link), Phone, LinkedIn (icon links)
- Bottom bar: `© 2026 Sunday Dada`

---

## 4. HOME PAGE

### 4A. Hero Section
- **Background:** Deep navy (`--primary-dark`) with subtle geometric pattern overlay
- **Layout:** Left-aligned text with right-side decorative element (abstract data visualization SVG — think minimal bar chart or node graph in gold/white lines)
- **Content:**
  - Small caps label: `SENIOR POWER BI DEVELOPER & BI CONSULTANT`
  - Large heading (h1): `I turn messy enterprise data into dashboards leaders actually trust.`
  - Supporting paragraph (2 sentences max): `7+ years building production BI environments across healthcare, finance, and government. From semantic modeling to AI automation — I own the full lifecycle.`
  - Two buttons: `View My Projects` (accent gold, solid) | `Get In Touch` (white outline)
- **Text color:** White on navy. Accent gold for the label.

### 4B. About Me Section
- **Heading:** `About Me`
- **Layout:** Two columns on desktop. Left = text bio. Right = professional headshot placeholder (circular or rounded rectangle, gray placeholder with label "Your Photo Here").
- **Bio copy (write in first person, ~150 words, warm and confident):**

  Cover these points naturally in paragraph form — do NOT use bullet points:
  - 7+ years in BI, currently a BI Consultant at Colaberry leading analytics delivery
  - Deep expertise in Power BI semantic modeling, advanced DAX, and performance optimization
  - Has built dashboards serving 300+ users including C-suite with sub-2-second response times
  - Also builds enterprise Power Apps and AI-powered automations
  - Experience spans healthcare, financial services, government, and education
  - Holds three Microsoft certifications (Fabric Analytics, Power BI, Power Platform)
  - Background in Physics (B.Tech) — brings analytical rigor to every project
  - Based in Canada, open to remote and hybrid opportunities

- **Stats bar** below the bio (horizontal row of 4 metric cards on a slightly elevated surface):
  - `7+` Years of Experience
  - `300+` Dashboard Users Served
  - `$8M+` Business Decisions Impacted
  - `50%` Avg. Performance Improvement
  - Use large accent-gold numbers with small gray labels beneath

### 4C. Featured Projects Grid
- **Heading:** `Featured Projects`
- **Subheading:** `Each project tells a story — click through to see the problem, my process, and the results.`
- **Layout:** 2×2 grid on desktop, single column on mobile
- **Each card contains:**
  - Screenshot placeholder (aspect ratio ~16:10, gray background with "Dashboard Screenshot" label)
  - Industry badge/tag (small pill in accent color)
  - Project title (h3, linked — clicking goes to the full project page)
  - One-sentence hook (the problem statement, intriguing)
  - 2–3 impact metrics as small bold items (e.g., `50% faster queries · 300+ users · $8M+ decisions`)
  - `Read Case Study →` link in accent gold
- **Card hover:** Lift + shadow deepen + screenshot placeholder slightly scales up

**The 4 project cards:**

1. **Executive Analytics Suite**
   - Industry: `Cross-Industry`
   - Hook: `How I built a BI environment that 300+ users — including C-suite — actually trust.`
   - Metrics: `Sub-2s queries · 50% faster · $8M+ impact`

2. **Finance & Sales Reporting Overhaul**
   - Industry: `Financial Services`
   - Hook: `Reporting took 3–5 days. I got it down to same-day.`
   - Metrics: `40% faster · $20K saved/yr · 30% less DB load`

3. **Enterprise Data Warehouse & ETL Platform**
   - Industry: `IT Services`
   - Hook: `The nightly batch job ran for 6 hours. Teams couldn't start their day with fresh data.`
   - Metrics: `25% faster ETL · 35% faster reports · 40% fewer errors`

4. **AI-Powered Operations Platforms**
   - Industry: `Education & Public Sector`
   - Hook: `Two organizations needed to replace paper and spreadsheets with real operational systems.`
   - Metrics: `55% less manual entry · 33% fewer tickets`

### 4D. Skills & Certifications Section
- **Heading:** `Skills & Certifications`
- **Layout:** Two-column. Left = skill groups. Right = certification cards.

**Skills (display as pill/badge tags grouped under category headings):**

- **BI & Data Modeling:** Power BI (Desktop & Service), DAX (Advanced), Power Query (M), Semantic Modeling (Star & Snowflake), SSRS, SSAS Tabular, Row-Level Security
- **Data Engineering:** SQL Server, T-SQL, SSIS, ETL Pipeline Design, Data Warehouse Architecture, Microsoft Fabric
- **Applications & Automation:** Power Apps (Canvas & Model-Driven), Power Automate, Dataverse, AI Builder, Copilot Studio
- **Integrations:** Microsoft 365, Salesforce, DocuSign, Azure AD

Category headings in accent gold. Skill pills: white background, subtle border, small text.

**Certifications (3 cards, each with a certificate icon):**
- Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)
- Microsoft Certified: Power BI Data Analyst Associate (PL-300)
- Microsoft Certified: Power Platform Functional Consultant Associate (PL-200)

### 4E. Contact Section
- **Background:** Deep navy (`--primary-dark`)
- **Heading (white):** `Let's Connect`
- **Subtext:** `I'm actively looking for my next opportunity. Whether you have a role in mind or just want to talk data — I'd love to hear from you.`
- **Two columns:**
  - Left: Contact details — Email (mailto link), Phone, LinkedIn (icon + URL). Use white text with gold icons.
  - Right: Simple contact form — Name, Email, Message (textarea), Submit button (gold). Mark as visual-only with a small note: "Form can be connected to Formspree or EmailJS."
- **Submit button:** Solid gold with navy text, hover darkens slightly.

---

## 5. PROJECT DETAIL PAGES (Template — Apply to All 4 Projects)

Each project page follows the same 5-section storytelling structure. When the user clicks "Read Case Study →" on a project card, render the corresponding project page. Include a `← Back to Projects` button at the top.

### Section 1: Overview (Hero-style header)
- **Background:** Navy with subtle texture (same as home hero)
- **Industry badge** at top
- **Project title** (large h1, white)
- **One paragraph** explaining the purpose and problem being solved. Written as a relatable story — put the reader in the shoes of the stakeholders who were struggling. What was broken? Why did it matter?
- **Key metrics bar:** 3–4 gold stat boxes summarizing the headline results

### Section 2: Data & Tools
- **Heading:** `Data & Tools`
- **Two parts:**
  - **Tools used:** Display as visual icon-style tags or a clean horizontal list with the tool names. Mention any advanced features or techniques (e.g., "DAX with CALCULATE, time intelligence, and iterator functions" or "Star schema with bridge tables for many-to-many relationships").
  - **Data context:** Brief paragraph about the data environment — what sources, how messy, what volume, what cadence. Keep it real and specific.

### Section 3: Challenges
- **Heading:** `Challenges & How I Solved Them`
- **Format:** 2–3 challenge blocks. Each block has:
  - A challenge title (bold)
  - What the problem was (1–2 sentences)
  - How Sunday solved it (1–2 sentences)
  - What he learned or how he adapted (1 sentence)
- Use a subtle left-border accent (gold) on each challenge block for visual structure.
- These should feel honest and real — not "everything was hard but I'm amazing." Show genuine problem-solving thinking.

### Section 4: Walkthrough
- **Heading:** `Process Walkthrough`
- **Format:** Step-by-step vertical timeline or numbered sequence. Each step has:
  - Step number or label (e.g., "Step 1: Data Profiling & Requirements")
  - 2–3 sentences explaining what was done
  - A screenshot placeholder (gray rectangle labeled "Screenshot: [description]" — user will add real screenshots later)
- This should read like someone walking through their process in an interview. Clear, logical, methodical.
- Aim for 4–6 steps per project.

### Section 5: Key Takeaways
- **Heading:** `Key Takeaways`
- **Format:** 3–4 takeaway cards in a grid or stacked layout. Each has:
  - A short title (e.g., "Model design is everything")
  - 2–3 sentences reflecting on the result, the learning, or what Sunday would do differently
- End with a link: `View on Power BI Service →` (placeholder URL — user will add real links)
- Below takeaways: a `← Back to All Projects` button and a `Next Project →` link to navigate between case studies

---

## 6. PROJECT-SPECIFIC CONTENT

### Project 1: Executive Analytics Suite

**Overview:** Colaberry needed a unified BI environment that could serve everyone from analysts to C-suite — with trusted data, fast dashboards, and self-service capability. The existing setup was fragmented: teams ran their own reports, numbers didn't match, and executives waited weeks for updates. Sunday was brought in to design and deliver the end-to-end solution.

**Data & Tools:**
- Tools: Power BI (Desktop & Service), DAX (Advanced — CALCULATE, time intelligence, iterator functions), Power Query (M), Row-Level Security, Star & Snowflake Schema Design
- Data: Multiple source systems across 4 business units. Mix of SQL Server databases, Excel files, and Salesforce exports. Required heavy transformation and standardization before modeling.
- Advanced techniques: Composite models, incremental refresh, dynamic RLS based on organizational hierarchy, drill-through pages for executive-to-detail navigation

**Challenges:**
1. **Fragmented data across 4 business units** — Every team had their own spreadsheets and definitions. Sunday built a unified semantic model with a shared business logic layer, standardizing KPIs across all units so leadership could compare apples to apples.
2. **Query performance at scale** — Initial models had 8–10 second load times. By refactoring from snowflake to optimized star schemas, removing unnecessary columns, and implementing aggregation tables, Sunday brought response times under 2 seconds for 300+ concurrent users.
3. **Self-service adoption was low** — People didn't trust the old reports, so they built their own. Sunday created intuitive drill-through paths, added visual-level filters, and documented everything — reducing ad-hoc requests to IT significantly.

**Walkthrough Steps:**
1. **Requirements & Data Profiling** — Interviewed stakeholders across all 4 business units to understand what decisions they needed to make, then profiled every data source for quality, completeness, and join-ability.
2. **Semantic Model Design** — Designed a star schema with clearly defined fact and dimension tables. Built a shared date table, standardized naming conventions, and created a business logic layer in DAX.
3. **DAX Development & Optimization** — Wrote measures for all core KPIs using best practices (variables, CALCULATE patterns, avoiding nested iterators). Tested with DAX Studio and Performance Analyzer.
4. **Row-Level Security & Governance** — Implemented dynamic RLS tied to organizational hierarchy so each user sees only their scope. Set up deployment pipelines and workspace governance.
5. **Dashboard Design & User Enablement** — Built executive summary pages with drill-through to departmental detail. Created reusable templates and documentation to enable self-service.
6. **Performance Tuning & Deployment** — Used Performance Analyzer and DAX Studio to identify bottlenecks. Implemented incremental refresh, reduced model size by 40%, and achieved sub-2-second response times.

**Key Takeaways:**
- "Model design is everything" — 80% of the performance gains came from getting the schema right, not from fancy DAX.
- "Governance enables trust" — RLS and consistent definitions gave leadership the confidence to act on the data.
- "Self-service requires design, not just access" — Intuitive navigation and documentation mattered more than raw features.

---

### Project 2: Finance & Sales Reporting Overhaul

**Overview:** The Finance and Sales teams at Colaberry were stuck in a painful reporting cycle — every month-end took 3–5 days of manual data pulls, validation, and formatting before leadership could see the numbers. By the time reports landed, decisions were already delayed. Sunday embedded with both teams to rebuild the entire reporting workflow from the database up.

**Data & Tools:**
- Tools: Power BI, SQL Server, T-SQL, Stored Procedures, SQL Views, SQL Server Agent
- Data: Transactional data from ERP and CRM systems. Finance data required multi-currency support and fiscal calendar alignment. Sales pipeline data needed deduplication and stage-mapping logic.
- Advanced techniques: Indexed views for pre-aggregation, parameterized stored procedures, automated data quality triggers

**Challenges:**
1. **Slow, unoptimized queries** — The existing 35+ reporting queries were written ad-hoc over years. Sunday rewrote them with proper indexing, CTEs, and set-based logic — reducing DB resource consumption by 30%.
2. **Data quality issues eroding trust** — Finance and Sales had different numbers for the same metrics. Sunday built validation triggers and automated checks directly in the database layer, catching errors at the source.
3. **Leadership wouldn't act on the data** — Even with dashboards, leaders second-guessed the numbers. The data cleansing initiative improved accuracy by 20%, which was the tipping point for adoption.

**Walkthrough Steps:**
1. **Audit & Baseline** — Cataloged all 35+ production queries, documented execution plans, and identified the worst performers.
2. **SQL Optimization** — Rewrote queries using CTEs, proper indexing, and set-based patterns. Created reusable views and stored procedures.
3. **Data Quality Framework** — Built SQL triggers and constraints to enforce business rules at the database level. Automated validation checks via SQL Server Agent jobs.
4. **Dashboard Rebuild** — Designed Power BI dashboards connected to the optimized views. Focused on Finance month-end and Sales pipeline reporting.
5. **Validation & Handoff** — Ran parallel reports (old vs. new) for one full cycle to validate accuracy, then trained both teams on the new workflow.

**Key Takeaways:**
- "Fix the query before you fix the dashboard" — Most reporting slowness was a database problem, not a BI problem.
- "Automated validation beats manual checking every time" — SQL triggers caught issues the team had been missing for months.
- "Trust is earned through accuracy, not aesthetics" — The 20% accuracy improvement changed leadership behavior more than any visual redesign.

---

### Project 3: Enterprise Data Warehouse & ETL Platform

**Overview:** Fastwire Tech's reporting ran on a patchwork of direct queries, flat files, and manually maintained spreadsheets. No single source of truth existed. Sunday was tasked with designing the data warehouse architecture and ETL infrastructure that every department would rely on — from scratch.

**Data & Tools:**
- Tools: SSIS, SSAS (Tabular), SSRS, SQL Server, T-SQL
- Data: Operational databases across IT service management, HR, and finance. Mix of structured SQL data and semi-structured exports. Required SCD Type 2 handling for slowly changing dimensions.
- Advanced techniques: SSIS package orchestration with SQL Server Agent, SSAS tabular cubes with partitioned processing, SSRS parameterized reports with subscription delivery

**Challenges:**
1. **No existing warehouse architecture** — Sunday designed the star schema from scratch — fact tables for service tickets, revenue, and HR metrics with shared dimension tables for time, geography, and department.
2. **6-hour nightly batch processing** — The initial ETL ran sequentially. Sunday restructured it with parallel execution paths and incremental loads, cutting it to 4.5 hours so teams had fresh data by start of business.
3. **Inconsistent reporting across departments** — Each team pulled from different sources with different logic. The SSAS cubes and SSRS reports gave everyone a single version of the truth.

**Walkthrough Steps:**
1. **Requirements & Source Analysis** — Mapped all departmental reporting needs and profiled source systems for data quality and structure.
2. **Warehouse Schema Design** — Designed a dimensional model with clearly separated fact and dimension tables. Implemented SCD Type 2 for historical tracking.
3. **ETL Pipeline Development** — Built SSIS packages for extraction, transformation, and loading. Used SQL Server Agent for orchestration with error handling and logging.
4. **SSAS Cube Development** — Created tabular models with calculated measures, hierarchies, and KPIs. Partitioned processing for performance.
5. **SSRS Reporting Layer** — Designed parameterized reports with scheduled subscriptions for automated delivery to department leads.

**Key Takeaways:**
- "Build the warehouse right the first time" — Investing extra time in schema design saved months of rework later.
- "ETL performance is an architecture problem" — Parallel execution and incremental loading were the biggest wins, not code-level optimization.
- "A single source of truth changes the conversation" — Once departments stopped arguing about whose numbers were right, they started talking about what to do about them.

---

### Project 4: AI-Powered Operations Platforms

**Overview:** Two organizations — one in education and one managing an animal shelter — were running critical operations on paper forms, spreadsheets, and email chains. Both needed a real system: something their staff could use on a tablet in the field, with automated workflows, document generation, and eventually AI-assisted data entry. Sunday designed and delivered both as enterprise Power Apps integrated with the Microsoft ecosystem.

**Data & Tools:**
- Tools: Power Apps (Canvas & Model-Driven), Power Automate, Dataverse, AI Builder, Copilot Studio, Microsoft 365, Salesforce, DocuSign
- Data: Operational records (parking permits, animal intake forms, inspection records), document attachments, and integration data from Salesforce and DocuSign.
- Advanced techniques: AI Builder for intelligent document processing (form extraction), Copilot Studio for conversational AI agents, Dataverse role-based security, Power Automate approval flows with conditional branching

**Challenges:**
1. **Replacing deeply embedded manual processes** — Staff had been using paper and email for years. Sunday designed the apps around their existing workflows first, then gradually introduced automation — rather than forcing a completely new process.
2. **Document processing bottleneck** — One org had staff manually re-typing data from scanned forms. Sunday implemented AI Builder's form processing model, cutting manual data entry by 55%.
3. **High support ticket volume** — Staff had questions about processes, policies, and the new system. A Copilot Studio conversational agent handled common queries, reducing support tickets by roughly a third.

**Walkthrough Steps:**
1. **Process Mapping** — Shadowed staff to understand existing paper-based workflows, pain points, and decision logic.
2. **App Architecture** — Designed the data model in Dataverse with proper relationships, security roles, and business rules.
3. **Canvas App Development** — Built mobile-first Canvas Apps for field staff (parking inspectors, shelter workers) with offline capability and barcode scanning.
4. **Workflow Automation** — Created Power Automate flows for approvals, document generation (DocuSign), notifications, and data sync with Salesforce.
5. **AI Integration** — Trained AI Builder models on historical forms for automated extraction. Deployed Copilot Studio agents for self-service support.
6. **Rollout & Adoption** — Ran pilot programs with small teams, incorporated feedback, then rolled out organization-wide. Both apps are now primary operational systems.

**Key Takeaways:**
- "Adopt workflows first, then automate" — The apps succeeded because they mirrored how people already worked, not because they forced a new process.
- "AI doesn't need to be perfect to be valuable" — The form processing model wasn't 100% accurate, but it still cut manual entry by more than half.
- "Build for the person in the field, not the person in the office" — Mobile-first design with offline support was non-negotiable for these use cases.

---

## 7. RESPONSIVE DESIGN REQUIREMENTS

- **Desktop (1024px+):** Full layouts, 2-column grids, sticky nav, side-by-side content
- **Tablet (768px–1023px):** Single-column project grid, reduce hero font sizes, stack About Me columns
- **Mobile (<768px):** Hamburger nav menu, single-column everything, stack stats vertically, larger touch targets (min 44px), full-width buttons
- All images and placeholders should be responsive (`max-width: 100%`)

---

## 8. TECHNICAL REQUIREMENTS

- Build as a **single React (.jsx) artifact** using only Tailwind CSS utility classes
- Use `useState` for: page routing (currentPage), mobile menu toggle, form fields, active nav state
- Use `useEffect` + `IntersectionObserver` for scroll-triggered fade-in animations
- Smooth scroll for anchor navigation on the home page
- When navigating to a project page, scroll to top
- All images = placeholder `<div>`s with gray backgrounds and descriptive labels (user will add screenshots later)
- Import Google Fonts (`DM Serif Display`, `DM Sans`) via `@import` in a `<style>` tag
- Single file, single default export

---

## 9. TONE & COPY GUIDELINES

- **Voice:** Confident, specific, human. First-person in the About section. Third-person-ish (narrative) in project case studies.
- **Storytelling approach:** Each project overview should open with the *problem felt by real people* — not with "I built a dashboard." Put the reader in the room where things were broken, then show how Sunday fixed it.
- **Avoid:** Buzzwords (synergy, leverage, guru, passionate). Let numbers and outcomes do the talking.
- **Use:** Specific metrics, concrete outcomes, honest reflections in takeaways. Sunday's resume is rich with numbers — feature them prominently.
- **CTA language:** Direct and warm — "View My Projects," "Get In Touch," "Read Case Study," "Let's Connect"

---

## 10. SEO & ACCESSIBILITY

- Semantic HTML: h1 for page titles, h2 for sections, h3 for project titles and subsections
- Alt text on all image placeholders
- Color contrast meets WCAG AA (white on navy, dark text on light backgrounds)
- Focus-visible styles on all interactive elements
- Meta description concept: "Sunday Dada — Senior Power BI Developer with 7+ years building production dashboards, data pipelines, and AI-powered automation for enterprise teams."

---

## 11. WHAT THE USER WILL ADD LATER

These are placeholders — user will swap in real assets after build:
- Dashboard screenshots for project cards and walkthrough steps
- Professional headshot
- Real LinkedIn URL
- Live Power BI report links
- Form backend integration (Formspree / Netlify Forms / EmailJS)
- Custom domain

---

## 12. PROMPT TO GIVE CLAUDE

Copy everything above into a new Claude conversation, then add:

> **"Build this entire portfolio website as a single React (.jsx) artifact. Follow the guidelines exactly — all pages, all project case studies, all copy, all animations. Use Tailwind CSS only. Make it polished, corporate, and visually impressive. Include placeholder images where noted. Ensure page navigation works between Home and all 4 project detail pages."**

If uploading dashboard screenshots at build time, add:

> **"Use the attached screenshots as the project images. Assign them to the appropriate project cards and walkthrough steps in the order listed."**

If the output is too long for one generation, add:

> **"If you can't fit everything in one artifact, build the Home page and Project 1 first. I'll ask for the rest in follow-up messages."**
