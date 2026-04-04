import React, { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────────
   Sunday Dada — Portfolio Website
   Single-file React component with Tailwind CSS
   ───────────────────────────────────────────── */

// ── Google Fonts injection ──
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display&display=swap');
    :root {
      --primary-dark: #0B1D3A;
      --primary-light: #FFFFFF;
      --accent: #C9A84C;
      --surface: #F7F6F2;
      --text-primary: #1A1A1A;
      --text-secondary: #5A5A5A;
      --border: #E2E0DA;
      --card-bg: #FFFFFF;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; color: var(--text-primary); }
    h1, h2, h3, h4, h5, h6 { font-family: 'DM Serif Display', serif; }
    .fade-in-up { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .fade-in-up.visible { opacity: 1; transform: translateY(0); }
    .fade-in-up.delay-1 { transition-delay: 0.1s; }
    .fade-in-up.delay-2 { transition-delay: 0.2s; }
    .fade-in-up.delay-3 { transition-delay: 0.3s; }
    .fade-in-up.delay-4 { transition-delay: 0.4s; }
    .hero-pattern {
      background-image: radial-gradient(circle, rgba(201,168,76,0.12) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent);
      transition: width 0.3s ease;
    }
    .nav-link:hover::after { width: 100%; }
    .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
    .card-hover:hover .card-img { transform: scale(1.03); }
    .card-img { transition: transform 0.4s ease; }
    .page-enter { animation: pageIn 0.4s ease forwards; }
    @keyframes pageIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

// ── Intersection Observer Hook ──
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ className = "", delay = 0, children }) {
  const ref = useReveal();
  return <div ref={ref} className={`fade-in-up ${delay ? `delay-${delay}` : ""} ${className}`}>{children}</div>;
}

// ── Icons (inline SVGs) ──
const Icons = {
  mail: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  ),
  arrowLeft: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  ),
  arrowRight: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 5 7 7-7 7"/><path d="M5 12h14"/></svg>
  ),
  menu: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  cert: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  ),
};

// ── Project Data ──
const projects = [
  {
    id: 1,
    title: "Executive Analytics Suite",
    thumbnail: "wireframe-executive-summary.svg",
    industry: "Cross-Industry",
    hook: "How I built a BI environment that 300+ users — including C-suite — actually trust.",
    metrics: "Sub-2s queries · 50% faster · $8M+ impact",
    disclaimer: "Built under NDA — wireframes shown in place of live dashboards to protect client data.",
    overview: `A mid-size enterprise client needed a unified BI environment that could serve everyone from analysts to C-suite — with trusted data, fast dashboards, and self-service capability. The existing setup was fragmented: teams ran their own reports, numbers didn't match across departments, and executives waited weeks for updates that were often contradictory. Leadership was making multi-million dollar decisions based on spreadsheets that nobody could verify. I was brought in to design and deliver the end-to-end solution — from data modeling to dashboard deployment — that would become the single source of truth for the entire organization.`,
    tools: ["Power BI (Desktop & Service)", "DAX (Advanced — CALCULATE, time intelligence, iterator functions)", "Power Query (M)", "Row-Level Security", "Star & Snowflake Schema Design"],
    dataContext: "Multiple source systems across 4 business units. Mix of SQL Server databases, Excel files, and Salesforce exports. Required heavy transformation and standardization before modeling. Advanced techniques included composite models, incremental refresh, dynamic RLS based on organizational hierarchy, and drill-through pages for executive-to-detail navigation.",
    challenges: [
      {
        title: "Fragmented data across 4 business units",
        problem: "Every team had their own spreadsheets and definitions. The same KPI could mean three different things depending on which department you asked.",
        solution: "I built a unified semantic model with a shared business logic layer, standardizing KPIs across all units so leadership could compare apples to apples.",
        learning: "Getting stakeholders to agree on definitions upfront saved weeks of rework downstream."
      },
      {
        title: "Dashboard took 10 seconds to load — leadership stopped using it",
        problem: "A critical dashboard was taking 10 seconds to load. Leadership abandoned it entirely, and an $8M pipeline started being managed on gut feeling instead of data. The root cause wasn't the data or the visuals — it was a single DAX measure doing a full table scan on 2 million rows every refresh, using FILTER() + EARLIER() which forced row-by-row evaluation on the slow, single-threaded Formula Engine instead of the fast, parallel Storage Engine.",
        solution: "I used DAX Studio + Performance Analyzer to pinpoint the bottleneck, then ran VertiPaq Analyzer and found a Notes column with 500K unique values eating 200MB of memory — removed it. Replaced iterators with aggregators (SUMX loops to simple SUM where row context wasn't needed). Used VAR caching to eliminate a measure calculating the same value 4 times. Reduced cardinality by rounding a datetime column from 1.4M unique timestamps to 365 date-only values, improving compression by 80%. Finally, cleaned the model — removed bidirectional relationships, collapsed snowflake to star schema, and hid 30+ unused columns. Result: 10 seconds down to sub-2 seconds — over 50% faster.",
        learning: "Anyone can build a dashboard, but if it takes more than 3 seconds to load, nobody will use it. Performance isn't a nice-to-have — it's the difference between a dashboard that drives decisions and one that collects dust. The key insight: understand which DAX engine your measures run on. The moment you force everything into the Formula Engine, you've lost."
      },
      {
        title: "Self-service adoption was low",
        problem: "People didn't trust the old reports, so they built their own — creating a vicious cycle of inconsistency.",
        solution: "I created intuitive drill-through paths, added visual-level filters, and documented everything — reducing ad-hoc requests to IT significantly.",
        learning: "Trust isn't a feature you ship — it's earned through consistency, transparency, and making the right path the easy path."
      }
    ],
    walkthrough: [
      { step: "Requirements & Data Profiling", desc: "Interviewed stakeholders across all 4 business units to understand what decisions they needed to make, then profiled every data source for quality, completeness, and join-ability.", screenshot: "Stakeholder Requirements Matrix", image: "wireframe-requirements-profiling.svg" },
      { step: "Semantic Model Design", desc: "Designed a star schema with clearly defined fact and dimension tables. Built a shared date table, standardized naming conventions, and created a business logic layer in DAX.", screenshot: "Star Schema Diagram", image: "wireframe-star-schema.svg" },
      { step: "DAX Development & Optimization", desc: "Wrote measures for all core KPIs using best practices (variables, CALCULATE patterns, avoiding nested iterators). Tested with DAX Studio and Performance Analyzer.", screenshot: "DAX Measures in Power BI", image: "wireframe-dax-measures.svg" },
      { step: "Row-Level Security & Governance", desc: "Implemented dynamic RLS tied to organizational hierarchy so each user sees only their scope. Set up deployment pipelines and workspace governance.", screenshot: "RLS Configuration", image: "wireframe-rls-governance.svg" },
      { step: "Dashboard Design & User Enablement", desc: "Built executive summary pages with drill-through to departmental detail. Created reusable templates and documentation to enable self-service.", screenshot: "Executive Dashboard", image: "wireframe-executive-summary.svg" },
      { step: "Performance Tuning & Deployment", desc: "Used DAX Studio, Performance Analyzer, and VertiPaq Analyzer to diagnose a 10-second load time. Removed high-cardinality columns, replaced iterators with aggregators, applied VAR caching, reduced datetime cardinality by 99.97%, collapsed snowflake to star schema, and achieved sub-2-second response times — over 50% faster.", screenshot: "Performance Analyzer Results", image: "wireframe-performance-optimization.svg" }
    ],
    takeaways: [
      { title: "Know which engine your DAX runs on", desc: "The biggest win came from understanding that DAX runs on two engines — the fast, parallel Storage Engine and the slow, single-threaded Formula Engine. One FILTER() + EARLIER() pattern forced 2 million rows through the slow engine. Replacing it, combined with cardinality reduction and model cleanup, took load times from 10 seconds to sub-2 seconds — over 50% faster." },
      { title: "Governance enables trust", desc: "RLS and consistent definitions gave leadership the confidence to act on the data. When executives know the numbers are real, decisions happen faster — and that's the whole point of BI." },
      { title: "Self-service requires design, not just access", desc: "Intuitive navigation and documentation mattered more than raw features. The teams that adopted self-service fastest were the ones with the clearest drill-through paths and the best tooltips." }
    ],
    metricBoxes: [
      { value: "Sub-2s", label: "Query Response Time" },
      { value: "50%", label: "Faster Performance" },
      { value: "300+", label: "Users Served" },
      { value: "$8M+", label: "Decisions Impacted" }
    ]
  },
  {
    id: 2,
    title: "Meridian Executive Reporting & Fabric Migration",
    thumbnail: "Dashboard Screenshot.png",
    industry: "Travel & Hospitality",
    hook: "Leadership had top-line numbers but no profit visibility, no forecasting, and no drill-down by brand.",
    metrics: "$61M revenue tracked · 6 brands unified · 95% profit growth · Direct Lake",
    overview: `Meridian — The Voyager Group operates a portfolio of six travel brands spanning luxury tours, private cruises, villas, jets, and corporate travel. Leadership had basic revenue dashboards, but no way to see profitability, no forecasting capability, and no ability to drill down by brand or compare performance across the portfolio. The existing BI environment ran on fragmented Power BI Desktop files connected directly to SQL Server — no single semantic model, no governance, and no scalability. I was brought in to do two things: first, redesign the executive reporting experience with a consolidated semantic model, 35+ DAX measures covering profitability and forecasting, and a 4-page drill-through dashboard. Second, migrate the entire data platform from SQL Server to Microsoft Fabric — standing up a Bronze/Silver/Gold medallion Lakehouse architecture with Dataflow Gen2, Direct Lake semantic models, deployment pipelines, and full governance. The result was an enterprise-grade analytics environment that gave leadership real-time profit visibility across all six brands for the first time.`,
    tools: ["Power BI (Desktop & Service)", "Microsoft Fabric", "Lakehouse (Bronze/Silver/Gold)", "Dataflow Gen2", "Direct Lake", "DAX (Advanced)", "Star Schema Design", "Row-Level Security", "Tabular Editor", "Deployment Pipelines", "SQL Server", "T-SQL"],
    dataContext: "Nine datasets across three fact tables (Bookings, Operating Expenses, and Forecast Targets), a Financial Assumptions reference table, four dimension tables (Date, Brand, Region, Sales Channel), and a KPI Definitions reference table. Data originated from SQL Server databases and Excel workbooks maintained by the finance team. The migration path ran SQL Server → Fabric Lakehouse (Bronze for raw landing, Silver for cleansed/conformed data, Gold for business-ready tables) → Direct Lake semantic models → Power BI reports.",
    challenges: [
      {
        title: "No profit visibility across the portfolio",
        problem: "The existing dashboards showed gross sales and margins, but leadership had no way to see operating profit, OpEx breakdown by category, or how each brand actually performed after costs. Every profitability question required a manual spreadsheet exercise.",
        solution: "I built a comprehensive DAX measure library — 35+ measures organized into folders for Core KPIs, Profitability, Time Intelligence, Forecasting, and Financial Assumptions. Operating Profit, Operating Margin %, and OpEx breakdowns by Staff, Marketing, and Technology gave leadership brand-level P&L visibility for the first time.",
        learning: "The measures themselves weren't complex individually, but organizing them into a coherent, maintainable library was the real challenge. Display folders and a dedicated _Measures table made all the difference."
      },
      {
        title: "Migrating from SQL Server to Fabric without disrupting reporting",
        problem: "The existing BI environment had reports pointing directly at SQL Server with no staging layer, no governance, and no version control. Migrating to Fabric meant rebuilding the entire data pipeline while keeping existing reports functional during the transition.",
        solution: "I designed a 7-phase migration plan: Discovery & Audit, Fabric Environment Setup (6 workspaces with security groups), Data Ingestion to Lakehouse (Bronze/Silver/Gold medallion), Curated Layer Development with Dataflow Gen2, Semantic Model Development with Direct Lake, Report Development, and Governance. The phased approach meant reports could be migrated incrementally with validation at each checkpoint.",
        learning: "The biggest risk in any migration is doing it all at once. The phased approach with explicit checkpoints meant we could validate at each stage and roll back if needed — which gave leadership confidence to greenlight the project."
      },
      {
        title: "Building a forward-looking executive experience",
        problem: "Leadership wanted more than historical reporting — they needed dynamic forecasting that blended actuals with projections and integrated financial assumptions from the finance team's Excel models.",
        solution: "I implemented Month-End Forecast measures that calculated a daily run rate from actuals-to-date and projected the remainder of the month dynamically. A What-If parameter let executives adjust growth rate assumptions (5% to 25%) and instantly see the impact on projected revenue and profit. Financial assumptions from Excel (margin targets, growth targets, marketing budgets) were integrated directly into the semantic model.",
        learning: "The What-If parameter was the feature that got the most executive engagement — it turned the dashboard from a reporting tool into a decision-making tool."
      }
    ],
    walkthrough: [
      { step: "Discovery & Data Audit", desc: "Audited the existing SQL Server environment and Power BI Desktop files. Cataloged every database, table, and .pbix file — documenting row counts, data sizes, refresh schedules, and downstream consumers. Built a migration inventory spreadsheet that prioritized every object by business criticality and assigned migration methods.", screenshot: "Migration Inventory", image: "Migration Inventory.png" },
      { step: "Star Schema & Semantic Model Design", desc: "Designed a consolidated 9-table star schema with three fact tables (Bookings, Operating Expenses, Forecast Targets), four dimension tables (Date, Brand, Region, Sales Channel), a Financial Assumptions table, and a KPI Definitions reference table. Established relationships with single-direction cross-filtering and implemented an inactive relationship for Travel Date analysis using USERELATIONSHIP.", screenshot: "Star Schema Diagram", image: "Star Schema Diagram.png" },
      { step: "Fabric Architecture Decisions (20 Q&A)", desc: "Documented 20 critical architecture decisions covering capacity planning, workspace design, security groups, data ingestion strategy, medallion architecture, Direct Lake vs. Import mode, Row-Level Security, and data quality monitoring. Each decision was mapped to Meridian's specific requirements — from separating ETL and reporting capacities to choosing Dataflow Gen2 over Spark notebooks for the curated layer.", screenshot: "Fabric Architecture Document", image: "Fabric Architecture Document.png", download: { file: "Meridian_Fabric_Architecture_QA.docx", label: "Download Architecture Document" } },
      { step: "Fabric Environment & Lakehouse Architecture", desc: "Provisioned Microsoft Fabric capacity and created a 6-workspace structure: Bronze-DEV/PROD, Silver-DEV/PROD, Gold-Curated (DEV/TEST/PROD), and Reporting-PROD. Set up Entra ID security groups for Data Engineers, BI Developers, Report Consumers, and Self-Service Analysts. Connected DEV workspace to Git for version control and configured deployment pipelines for DEV → TEST → PROD promotion.", screenshot: "Fabric Workspace Structure", image: "Fabric Workspace Structure.png" },
      { step: "DAX Measure Development (35+ Measures)", desc: "Built 35+ DAX measures organized into display folders: Core KPIs (Gross Sales, Margins, Commission, Net Revenue), Profitability (Operating Profit, OpEx breakdowns by category), Time Intelligence (YoY Growth, YTD/MTD/QTD), Forecasting (Forecast vs. Actual, Month-End Projection, Variance %), and Financial Assumptions (Target Margin, Revenue Growth Target). Used Tabular Editor for efficient bulk measure creation with IntelliSense and Best Practice Analyzer.", screenshot: "DAX Measures in Tabular Editor", image: "DAX Measures in Tabular Editor.png" },
      { step: "Executive Dashboard Design (4 Pages)", desc: "Built a 4-page dashboard: Executive Summary (KPI cards, brand comparison chart, monthly trend with forecast overlay), Brand Deep Dive (drill-through P&L waterfall, OpEx breakdown, regional performance), Forecast & Assumptions (actual vs. forecast matrix, What-If scenario parameter, assumptions panel), and Sales & Operations (channel mix donut, booking funnel, destination heatmap). Applied synced slicers across pages, bookmark toggles for Revenue/Profit views, and custom tooltip pages.", screenshot: "Executive Summary Dashboard", image: "Executive Summary Dashboard.png" },
      { step: "RLS, Governance & Deployment", desc: "Implemented Row-Level Security with 7 roles — one per brand manager (filtered by Dim_Brand) plus an Executive role with full access. Configured deployment pipeline dataset rebinding rules so reports auto-connected to the correct semantic model in each environment. Established BI development standards covering naming conventions, Git workflow, DAX standards, and refresh monitoring. Created a Data Quality Dashboard connected to validation logs.", screenshot: "Deployment Pipeline", image: "Deployment Pipeline.png" }
    ],
    takeaways: [
      { title: "Migration is a governance project, not just a technical one", desc: "Standing up Fabric workspaces with proper security groups, deployment pipelines, and Git integration before migrating a single table meant the new environment was production-ready from day one. The medallion architecture (Bronze → Silver → Gold) ensured every layer had clear ownership and validation gates." },
      { title: "Direct Lake changes the semantic model game", desc: "Connecting semantic models to Gold Lakehouse tables via Direct Lake eliminated the need for scheduled dataset refreshes and Import mode bottlenecks. The data was always current, the model was always fast, and the architecture was inherently scalable — a fundamentally different operating model than Import or DirectQuery." },
      { title: "The dashboard that executives actually use is the one with a What-If slider", desc: "Historical reporting tells you what happened. Forecasting tells you what might happen. But a What-If parameter that lets leadership adjust growth assumptions and instantly see the profit impact — that's what turns a dashboard into a tool they open every morning." }
    ],
    metricBoxes: [
      { value: "$61M", label: "Revenue Tracked" },
      { value: "6", label: "Brands Unified" },
      { value: "95%", label: "Profit Growth Surfaced" },
      { value: "35+", label: "DAX Measures" },
      { value: "Direct Lake", label: "Semantic Model" }
    ]
  },
  {
    id: 3,
    title: "Hospital Length of Stay — Performance Analytics & ROI Modeling",
    thumbnail: "LOS Performance Dashboard.gif",
    industry: "Healthcare",
    hook: "Average LOS rose 7.8% over three years with no organic efficiency gains — leadership needed data to act.",
    metrics: "$9.59M billing · 1,000 admissions · 16-day avg LOS · $1.11M projected savings",
    overview: `A hospital system was struggling with rising patient Length of Stay (LOS) and no analytical framework to understand what was driving it or where to intervene. Average LOS had climbed from 14.9 days in 2021 to 16.0 days by 2023 — a 7.8% increase — while total bed-days grew 6.6% against only a 6.2% rise in admissions, meaning the hospital was consuming more capacity per patient over time with no organic efficiency improvement. Leadership had basic operational dashboards but no way to analyze LOS by medical condition, gender, treatment type, or cost drivers — and no framework for quantifying the financial impact of potential interventions. I was brought in to build the full analytics layer: a multi-page interactive Power BI dashboard with year/quarter slicers, QoQ trend analysis across 5 KPIs, condition-gender breakdowns, treatment cost distribution, and two fully modeled ROI business cases for executive presentation — one for hospital-wide predictive discharge planning ($1.11M annual benefit, 146% ROI) and one for condition-gender pathway standardization ($523K annual benefit, 109% ROI).`,
    tools: ["Power BI (Desktop & Service)", "DAX (Advanced — time intelligence, QoQ calculations, iterator functions)", "Power Query (M)", "Star Schema Design", "Python (data profiling)", "Excel (ROI modeling)"],
    dataContext: "Single CSV dataset of 1,000 patient records spanning July 2021 to July 2024, containing Patient ID, demographics (DOB, Gender), Medical Condition (29 unique conditions), Treatment type (35 unique treatments), Admit/Discharge dates, and Bill Amount. Required calculated columns for LOS (date difference), Year-Quarter extraction, and Avg Bill per LOS Day. Analysis revealed high-cost treatments (Chemotherapy, Radiation Therapy, Surgery, Dialysis, Antiviral Drugs, Ventilation) representing just 11.7% of admissions yet generating 38.6% of total billing at $1,932/bed-day — 215.4% higher than the $612 hospital-wide average.",
    challenges: [
      {
        title: "No analytical framework for LOS optimization",
        problem: "The hospital had basic admission and discharge tracking but no way to segment LOS by condition, gender, treatment, or cost — and no framework for identifying where excess bed-days were being consumed.",
        solution: "I built a multi-dimensional analytical model with calculated measures for Avg LOS, Total Bill, Avg Bill/LOS Day, Total Admissions, and Total Bed-Days — each with QoQ trend calculations. A year slicer (2021–2024) enabled period-over-period comparison across all dimensions.",
        learning: "The most impactful insight came from the simplest calculation: Avg Bill per LOS Day revealed that 11.7% of admissions generated 38.6% of billing, immediately identifying the highest-value intervention targets."
      },
      {
        title: "Gender-based LOS disparities hidden in aggregate numbers",
        problem: "Hospital-wide Avg LOS masked significant variation at the condition-gender level. Aggregate metrics showed a stable 16-day average, but drilling down revealed male Fracture patients staying 37.9% longer than females (21.6 vs 15.6 days) and male Skin Infection patients staying 34.5% longer (19.3 vs 15.1 days).",
        solution: "I built a condition-by-gender bar chart with dual-axis overlay showing both Avg LOS bars and QoQ percentage trend lines for each sub-KPI. This visualization immediately surfaced the 14 condition-gender combinations where disparity exceeded 2 days.",
        learning: "Aggregation hides the story. The hospital-wide average was stable and unremarkable — the condition-gender drill-down revealed actionable disparities that nobody had seen before."
      },
      {
        title: "Translating analytics into executive-ready ROI cases",
        problem: "Leadership needed more than charts — they needed financially modeled business cases with implementation costs, projected savings, and ROI percentages to justify investment in discharge planning and clinical pathway standardization.",
        solution: "I developed two fully modeled ROI cases: Case 1 (Predictive Discharge Planning) projected freeing 610 bed-days/year through a 2-day hospital-wide LOS reduction, yielding $1.11M annual benefit against $450K implementation cost (146% ROI). Case 2 (Condition-Gender Pathway Standardization) targeted 292 freed bed-days from the top disparity conditions, yielding $523K against $250K implementation (109% ROI).",
        learning: "The ROI model was more persuasive than any dashboard page. Executives don't fund insights — they fund projected returns with clear payback timelines."
      }
    ],
    walkthrough: [
      { step: "Data Profiling & Preparation", desc: "Profiled the 1,000-record patient dataset for completeness, outliers, and distribution patterns. Calculated LOS as the date difference between Admit and Discharge dates, extracted Year-Quarter from admission dates, and computed Avg Bill per LOS Day. Identified 29 unique medical conditions and 35 treatment types across the 3-year study period.", screenshot: "Data Profiling Summary", image: "Data Profiling Summary.png" },
      { step: "Semantic Model & DAX Development", desc: "Built a star schema with a patient fact table and date dimension. Developed DAX measures for all 5 KPIs (Avg LOS, Total Bill, Avg Bill/LOS Day, Total Admissions, Total Bed-Days) plus QoQ percentage change calculations for each. Created conditional formatting rules to show green/red arrows based on QoQ direction.", screenshot: "DAX Measure Library", image: "DAX Measure Library.png" },
      { step: "Interactive Dashboard Design", desc: "Designed a single-page dashboard with 6 visual zones: KPI header row with QoQ indicators, Avg Bill and Avg LOS Over Time (bar-line combo chart by Year-Quarter), Avg LOS vs Medical Condition By Gender (clustered bar with QoQ trend overlay), LOS Distribution (scatter plot of Avg LOS vs Avg Bill/LOS Day by treatment), QoQ % Breakdown by Sub KPIs (stacked bar), and a Year slicer (2021–2024) for dynamic filtering.", screenshot: "LOS Performance Dashboard", image: "LOS Performance Dashboard.gif" },
      { step: "Treatment Cost Analysis", desc: "Segmented all 35 treatment types by Avg LOS and Avg Bill per LOS Day in a scatter plot. Identified that high-cost treatments (Chemotherapy at $6K/day, Radiation Therapy at $4K/day, Dialysis, Surgery, Ventilation, Antiviral Drugs) clustered in the upper-right quadrant — representing 11.7% of volume but 38.6% of total billing.", screenshot: "LOS Distribution Analysis", image: "LOS Distribution Analysis.png" },
      { step: "Condition-Gender Disparity Analysis", desc: "Built a condition-by-gender matrix comparing Avg LOS for male vs female patients across all 29 conditions. Identified 14 condition-gender combinations where disparity exceeded 2 days, with the top 5 highest-LOS conditions (Fracture, Skin Infection, Influenza, Depression, Alzheimer's) averaging 17.5 days — 11.9% above the hospital mean.", screenshot: "Gender Disparity Analysis", image: "Gender Disparity Analysis.png" },
      { step: "ROI Business Case Development", desc: "Developed two financially modeled business cases using dashboard-derived metrics. Case 1: Hospital-wide predictive discharge planning targeting a 2-day LOS reduction across all 305 annual admissions — $1.11M annual benefit, $450K implementation, 146% ROI. Case 2: Condition-gender pathway standardization recovering 292 excess bed-days — $523K annual benefit, $250K implementation, 109% ROI. Both cases included implementation cost breakdowns and payback period analysis.", screenshot: "ROI Comparison Chart", image: "ROI Comparison Chart.png" }
    ],
    takeaways: [
      { title: "Aggregation hides the story — always drill down", desc: "The hospital-wide 16-day average LOS looked stable and unremarkable. But drilling into condition-gender combinations revealed that male Fracture patients stayed 37.9% longer than females and the top 5 conditions consumed 22% of total bed-days. The actionable insights were two levels below the headline number." },
      { title: "Cost per bed-day is the metric that moves executives", desc: "Avg Bill per LOS Day ($612 hospital-wide vs $1,932 for high-cost treatments) was the single metric that shifted the conversation from 'we have a length of stay problem' to 'we have a $373K cost avoidance opportunity.' Translating clinical metrics into financial language is what gets projects funded." },
      { title: "Two business cases are stronger than one", desc: "Presenting both a high-investment/high-return option (Case 1: $1.11M, 146% ROI) and a lower-cost entry point (Case 2: $523K, 109% ROI) gave leadership flexibility. They could start with Case 2 to build confidence, then scale to Case 1 — rather than facing an all-or-nothing decision." }
    ],
    metricBoxes: [
      { value: "$9.59M", label: "Total Billing Analyzed" },
      { value: "1,000", label: "Patient Admissions" },
      { value: "16 days", label: "Avg Length of Stay" },
      { value: "$1.11M", label: "Projected Annual Savings" },
      { value: "146%", label: "ROI (Case 1)" }
    ],
    powerBiEmbed: "https://app.fabric.microsoft.com/view?r=eyJrIjoiMGJjNGZmOTEtMGY4MS00MzA2LWI5MmQtMDMzODkzOTkzNTI2IiwidCI6IjRkMTYxZjExLTQ2MzAtNDE1Zi1iMWI0LTg5YWM3MmNlYzk5NyJ9"
  },
  {
    id: 4,
    title: "Parking Management System",
    thumbnail: "Canvas-App Home Page.png",
    industry: "Education",
    hook: "A high school's parking lot was chaos — no one knew who had permission to park and who didn't.",
    metrics: "1,299 inspections · 88% compliance · 15 spaces managed",
    overview: `Belson School had a growing parking problem. Teachers complained about unavailable spaces, visitors parked without authorization, and the leadership team had no way to understand who was actually using the lot. Complaints were mounting, but there was no data — just frustration. The school needed a system that would let staff and visitors request parking daily, allow inspectors to verify compliance on the ground, and give administrators a clear picture of parking usage and unauthorized access. I designed and delivered a complete Power Platform solution: a model-driven app for administrative review and parking requests, a tablet-ready canvas app for field inspections, automated email confirmations via Power Automate, and a Power BI report that revealed an 88% compliance rate — meaning nearly 12% of parked vehicles had no valid request on file.`,
    tools: ["Power Apps (Canvas & Model-Driven)", "Power Automate", "Dataverse", "Power BI", "DAX"],
    dataContext: "Three Dataverse tables — Vehicles, Parking Requests, and Parking Inspections — formed the data backbone. Vehicle records included make, model, and owner email. Parking requests tracked which vehicle requested access on which date. Inspections logged every vehicle found in the lot during the daily 5 PM sweep. The key analytical challenge was joining inspections to requests to determine which parked vehicles actually had permission — requiring a calculated column and careful relationship management through 36-character GUIDs across tables.",
    challenges: [
      {
        title: "Joining tables via 36-character GUIDs in Power BI",
        problem: "The Vehicle table connected to Parking Inspections through a unique identifier — a 36-character GUID that Dataverse generates automatically. Getting this relationship to work correctly in Power BI's data model was one of the trickiest parts of the build.",
        solution: "I carefully mapped the relationships in Power BI using the record unique identifiers, establishing a many-to-one cardinality between Parking Inspections and Vehicles. This enabled cross-table filtering so the report could show inspection details alongside vehicle information.",
        learning: "Working with Dataverse GUIDs in Power BI is a skill that pays dividends — it comes up constantly when building reports on top of Power Platform data."
      },
      {
        title: "Determining valid vs. unauthorized parking",
        problem: "An inspection record alone doesn't tell you whether a vehicle had permission to park. That required cross-referencing each inspection against the Parking Requests table to see if a matching request existed for that date.",
        solution: "I built a calculated column (isRequested) in the Parking Inspections table that flagged whether each inspection had a corresponding valid parking request. This became the foundation for the compliance metrics — 88.07% of inspections had valid requests, meaning 155 out of 1,299 were unauthorized.",
        learning: "The business value of the entire report hinged on one calculated column. Getting the logic right was essential — a wrong join condition would have made the compliance numbers meaningless."
      },
      {
        title: "Building a field-ready canvas app for inspectors",
        problem: "The parking inspector needed to walk the lot with a tablet, log every vehicle present, and move quickly — the app had to be fast, intuitive, and default to the right values to minimize tapping.",
        solution: "I built a 4-screen canvas app with smart defaults: the inspection date auto-set to today, the hour and minute defaulted to now, and a 'Create New Vehicle' flow was accessible directly from the inspection form for unrecognized vehicles. The review screen filtered to today's inspections only.",
        learning: "Field apps live or die by their defaults. Every tap you save the user is a tap they won't get wrong."
      }
    ],
    walkthrough: [
      { step: "Dataverse Table Design", desc: "Created three tables in Dataverse — Vehicles (with make, model, owner email, and vehicle image), Parking Requests (with request name, vehicle lookup, and request datetime), and Parking Inspections (with inspection name, vehicle lookup, parking request lookup, and inspection datetime). Configured forms, views, and subgrids to link related records.", screenshot: "Dataverse Table Structure", image: "Dataverse Table Structure.png" },
      { step: "Model-Driven App Development", desc: "Built an administrative model-driven app with site map navigation across all three tables. Admins could review vehicle registrations, create parking requests on behalf of staff and visitors, and monitor inspection records — all from a single unified interface.", screenshot: "Model-Driven App Interface", image: "Model-Driven App Interface.png" },
      { step: "Canvas App for Field Inspections", desc: "Developed a tablet-optimized canvas app with four screens: Home (navigation hub), Review (today's inspections gallery with vehicle details and invalid-parking indicators), New Inspection (form with smart datetime defaults), and New Vehicle (for registering unrecognized vehicles on the spot).", screenshot: "Canvas App Inspection Screen", image: "Canvas App Inspection Screen.png" },
      { step: "Power Automate Cloud Flow", desc: "Created a cloud flow triggered whenever a new Parking Request was created. The flow automatically sent a confirmation email to the vehicle owner with the request ID and vehicle name, using the school's branded email template.", screenshot: "Power Automate Flow", image: "Power Automate Flow.png" },
      { step: "Power BI Data Model & DAX", desc: "Connected Power BI to Dataverse, established relationships via GUIDs, and built a calculated date dimension using DAX (CALENDARAUTO with school year logic). Created measures for Total Inspections, Total Valid Requests, and % Valid Requests. Added a calculated isRequested column to identify unauthorized parking.", screenshot: "Power BI Data Model", image: "PowerBI Data Model.png" },
      { step: "Power BI Report & Dashboards", desc: "Built a 3-page report: a navigation home page, a filters page (Vehicle Make/Model, Calendar, Day of Week), and the main Parking Review dashboard with KPI cards (1,299 inspections, 88.07% compliance, 155 unauthorized), a matrix table by vehicle, a bar chart of authorized vs. unauthorized inspections over time, and a detail table with drill-through links back to the model-driven app.", screenshot: "Parking Review Dashboard", image: "Parking Review Dashboard.png" },
      { step: "Drill-Through for Vehicle Detail", desc: "Added a drill-through page that activates when a user clicks on a specific vehicle in the matrix. The drill-through displays the vehicle's total inspections, valid request percentage, a full history of every inspection record with timestamps, and a direct link back to the model-driven app record — giving administrators complete visibility into any vehicle's parking compliance at a glance.", screenshot: "Parking Drillthrough", image: "Parking Drillthrough.png" }
    ],
    takeaways: [
      { title: "One calculated column can unlock the entire story", desc: "The isRequested flag was a simple piece of logic, but it transformed raw inspection data into an actionable compliance metric. Without it, the report would have been a list of vehicles — with it, leadership could see exactly where enforcement was failing." },
      { title: "The Power Platform is greater than the sum of its parts", desc: "This project used Dataverse, Power Apps (both canvas and model-driven), Power Automate, and Power BI as a unified solution. Each component handled what it does best — and the integration between them was seamless because they share the same data layer." },
      { title: "Design for the person holding the tablet", desc: "The canvas app's success came from smart defaults and minimal required input. The inspector could log a vehicle in seconds because the date, hour, and minute were pre-filled. Reducing friction in field apps directly improves data quality." }
    ],
    metricBoxes: [
      { value: "1,299", label: "Total Inspections" },
      { value: "88%", label: "Compliance Rate" },
      { value: "155", label: "Unauthorized Vehicles" },
      { value: "15", label: "Parking Spaces Managed" }
    ],
    powerBiEmbed: "https://app.powerbi.com/view?r=eyJrIjoiMDZjMzc1ODctNzcyMS00ZTQ3LWFhM2ItN2Q2MTRmYmQ0NjA2IiwidCI6IjRkMTYxZjExLTQ2MzAtNDE1Zi1iMWI0LTg5YWM3MmNlYzk5NyJ9"
  }
];

// ── Skills Data ──
const skillGroups = [
  { category: "BI & Data Modeling", skills: ["Power BI (Desktop & Service)", "DAX (Advanced)", "Power Query (M)", "Semantic Modeling (Star & Snowflake)", "SSRS", "SSAS Tabular", "Row-Level Security"] },
  { category: "Data Engineering", skills: ["SQL Server", "T-SQL", "SSIS", "ETL Pipeline Design", "Data Warehouse Architecture", "Microsoft Fabric"] },
  { category: "Applications & Automation", skills: ["Power Apps (Canvas & Model-Driven)", "Power Automate", "Dataverse", "AI Builder", "Copilot Studio"] },
  { category: "Integrations", skills: ["Microsoft 365", "Salesforce", "DocuSign", "Azure AD"] }
];

const certifications = [
  { name: "Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)", badge: "Microsoft Certified Associate.png" },
  { name: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)", badge: "Microsoft Certified Associate.png" },
  { name: "Microsoft Certified: Power Platform Functional Consultant Associate (PL-200)", badge: "Microsoft Certified Associate.png" },
  { name: "Microsoft Applied Skills: Implement a Data Warehouse in Microsoft Fabric", badge: "Microsoft Applied Skills-Implement a data warehouse in Microsoft Fabric.png" }
];

// ── Stat Card ──
function StatCard({ value, label }) {
  return (
    <div className="text-center px-6 py-4">
      <div className="text-3xl md:text-4xl font-bold" style={{ color: "var(--accent)", fontFamily: "'DM Serif Display', serif" }}>{value}</div>
      <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{label}</div>
    </div>
  );
}

// ── Placeholder Image ──
function Placeholder({ label, aspect = "16/10", className = "" }) {
  return (
    <div
      className={`bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden card-img ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={label}
    >
      <span className="text-gray-500 text-sm text-center px-4">{label}</span>
    </div>
  );
}

// ── Section Divider ──
function Divider() {
  return <div className="w-16 h-0.5 mx-auto my-2" style={{ background: "var(--accent)" }} />;
}

// ══════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════
function Navbar({ currentPage, navigate, scrollToSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navAction = (section) => {
    setMenuOpen(false);
    if (currentPage !== "home") {
      navigate("home", section);
    } else {
      scrollToSection(section);
    }
  };

  const isProject = currentPage.startsWith("project");

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(11,29,58,0.92)" : "rgba(11,29,58,1)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            {isProject && (
              <button
                onClick={() => navigate("home", "projects")}
                className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
                aria-label="Back to Projects"
              >
                {Icons.arrowLeft}
                <span className="hidden sm:inline">Back to Projects</span>
              </button>
            )}
            <button
              onClick={() => navigate("home")}
              className="text-sm font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              Sunday Dada
            </button>
          </div>
          {/* Right — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {["About", "Projects", "Skills", "Contact"].map((s) => (
              <button
                key={s}
                onClick={() => navAction(s.toLowerCase())}
                className="nav-link relative text-sm text-white/80 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          {/* Hamburger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            {Icons.menu}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8" style={{ background: "var(--primary-dark)" }}>
          <button className="absolute top-5 right-6 text-white" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            {Icons.close}
          </button>
          {["About", "Projects", "Skills", "Contact"].map((s) => (
            <button
              key={s}
              onClick={() => navAction(s.toLowerCase())}
              className="text-2xl text-white hover:text-[var(--accent)] transition-colors"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════
function Footer({ navigate, scrollToSection, currentPage }) {
  const navAction = (section) => {
    if (currentPage !== "home") {
      navigate("home", section);
    } else {
      scrollToSection(section);
    }
  };

  return (
    <footer style={{ background: "var(--primary-dark)" }} className="text-white">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        {/* Left */}
        <div>
          <div className="text-sm font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--accent)" }}>Sunday Dada</div>
          <p className="text-white/60 text-sm">Senior Power BI Developer & BI Consultant — turning messy enterprise data into dashboards leaders trust.</p>
        </div>
        {/* Center */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-white/40 uppercase tracking-wider">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["About", "Projects", "Skills", "Contact"].map((s) => (
              <button key={s} onClick={() => navAction(s.toLowerCase())} className="text-sm text-white/70 hover:text-white text-left transition-colors">{s}</button>
            ))}
          </div>
        </div>
        {/* Right */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-white/40 uppercase tracking-wider">Get In Touch</h4>
          <div className="flex flex-col gap-3">
            <a href="mailto:sundaydadag@gmail.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <span style={{ color: "var(--accent)" }}>{Icons.mail}</span> sundaydadag@gmail.com
            </a>
            <a href="tel:+14698385748" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <span style={{ color: "var(--accent)" }}>{Icons.phone}</span> +1 (469) 838-5748
            </a>
            <a href="https://linkedin.com/in/sundaydada" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <span style={{ color: "var(--accent)" }}>{Icons.linkedin}</span> LinkedIn Profile
            </a>
            <a href="https://github.com/dadasunday" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <span style={{ color: "var(--accent)" }}>{Icons.github}</span> GitHub Profile
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-white/40 text-xs">
        &copy; 2026 Sunday Dada
      </div>
    </footer>
  );
}

// ══════════════════════════════════════
//  HOME PAGE
// ══════════════════════════════════════
function HomePage({ navigate, scrollToSection, sectionRefs }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus("sending");
    emailjs.send("service_u06m3uh", "template_ips86yc", {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    }, "DcnhAc28U43BoVUHo")
      .then(() => {
        setFormStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setFormStatus("error");
      });
  };

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <section className="hero-pattern relative min-h-[92vh] flex items-center" style={{ background: "var(--primary-dark)" }}>
        {/* Decorative SVG */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block" aria-hidden="true">
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="300" width="40" height="80" rx="4" stroke="#C9A84C" strokeWidth="1.5"/>
            <rect x="120" y="240" width="40" height="140" rx="4" stroke="#C9A84C" strokeWidth="1.5"/>
            <rect x="180" y="180" width="40" height="200" rx="4" stroke="#C9A84C" strokeWidth="1.5"/>
            <rect x="240" y="260" width="40" height="120" rx="4" stroke="#C9A84C" strokeWidth="1.5"/>
            <rect x="300" y="200" width="40" height="180" rx="4" stroke="#C9A84C" strokeWidth="1.5"/>
            <circle cx="80" cy="140" r="5" fill="#C9A84C" opacity="0.5"/>
            <circle cx="200" cy="100" r="5" fill="#C9A84C" opacity="0.5"/>
            <circle cx="320" cy="130" r="5" fill="#C9A84C" opacity="0.5"/>
            <line x1="80" y1="140" x2="200" y2="100" stroke="#C9A84C" strokeWidth="1" opacity="0.3"/>
            <line x1="200" y1="100" x2="320" y2="130" stroke="#C9A84C" strokeWidth="1" opacity="0.3"/>
            <circle cx="140" cy="80" r="3" fill="#FFFFFF" opacity="0.3"/>
            <circle cx="260" cy="60" r="3" fill="#FFFFFF" opacity="0.3"/>
            <line x1="140" y1="80" x2="260" y2="60" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.2"/>
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: "var(--accent)" }}>
              Senior Power BI Developer & BI Consultant
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight max-w-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
              I turn messy enterprise data into dashboards leaders actually trust.
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-white/70 mt-6 max-w-2xl text-lg leading-relaxed">
              7+ years building production BI environments across healthcare, finance, government, travel & hospitality, real estate, and education. From semantic modeling to AI automation — I own the full lifecycle.
            </p>
            <p className="text-white/50 mt-2 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Canada — Open to remote, hybrid & relocation opportunities
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => scrollToSection("projects")}
                className="px-7 py-3 rounded font-semibold text-sm transition-all hover:brightness-110"
                style={{ background: "var(--accent)", color: "var(--primary-dark)" }}
              >
                View My Projects
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-7 py-3 rounded font-semibold text-sm border-2 border-white/30 text-white hover:border-white transition-colors"
              >
                Get In Touch
              </button>
              <a
                href={`${import.meta.env.BASE_URL}Sunday_Dada_Resume.pdf`}
                download
                className="px-7 py-3 rounded font-semibold text-sm border-2 transition-colors inline-flex items-center gap-2"
                style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resume
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About Me ── */}
      <section ref={sectionRefs.about} id="about" className="py-20 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-center mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>About Me</h2>
            <Divider />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 mt-12 items-center">
            <Reveal delay={1}>
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                I'm a Senior BI Consultant based in Canada with over seven years of experience building analytics solutions that people actually use. My career spans ETL development, data warehousing, and enterprise BI — from Fastwire Tech in Lagos to Colaberry where I now partner with C-suite leadership across multiple industries. My specialty is Power BI — from semantic modeling with star and snowflake schemas to advanced DAX and performance optimization that keeps dashboards snappy at scale. I've built environments serving 300+ users with sub-2-second response times on complex reports.
              </p>
              <p className="leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
                Beyond dashboards, I design enterprise Power Apps and AI-powered automations that replace manual processes with intelligent workflows. My experience spans various industries, including healthcare, financial services, government, travel & hospitality, real estate, and education — industries where getting the data right isn't optional. I hold three Microsoft certifications and a Microsoft Applied Skills credential across Fabric, Power BI, and Power Platform, and my background in Physics (B.Tech, Federal University of Technology Akure) gives me the analytical rigor to approach every problem systematically.              </p>
            </Reveal>
            <Reveal delay={2}>
              <div className="flex justify-center">
                <img
                  src={`${import.meta.env.BASE_URL}headshot.jpg`}
                  alt="Professional headshot of Sunday Dada"
                  className="w-64 h-64 md:w-72 md:h-72 rounded-2xl object-cover shadow-lg"
                />
              </div>
            </Reveal>
          </div>
          {/* Stats */}
          <Reveal delay={3}>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 bg-white rounded-xl shadow-md divide-x divide-y md:divide-y-0" style={{ borderColor: "var(--border)" }}>
              <StatCard value="7+" label="Years of Experience" />
              <StatCard value="6+" label="Industries Served" />
              <StatCard value="$70M+" label="Data Modeled & Analyzed" />
              <StatCard value="300+" label="Dashboard Users Served" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section ref={sectionRefs.projects} id="projects" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-center mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Featured Projects</h2>
            <Divider />
            <p className="text-center mt-4 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Each project tells a story — click through to see the problem, my process, and the results.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i + 1}>
                <div
                  className="card-hover rounded-xl overflow-hidden border cursor-pointer"
                  style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
                  onClick={() => navigate(`project/${p.id}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`project/${p.id}`)}
                  aria-label={`Read case study: ${p.title}`}
                >
                  {p.thumbnail ? (
                    p.thumbnail.endsWith('.svg') ? (
                      <object data={`${import.meta.env.BASE_URL}${p.thumbnail}`} type="image/svg+xml" className="w-full card-img" style={{ aspectRatio: "16/10", pointerEvents: "none" }} aria-label={`${p.title} screenshot`} />
                    ) : (
                      <img src={`${import.meta.env.BASE_URL}${p.thumbnail}`} alt={`${p.title} screenshot`} className="w-full card-img" style={{ aspectRatio: "16/10", objectFit: "cover" }} />
                    )
                  ) : (
                    <Placeholder label="Dashboard Screenshot" aspect="16/10" />
                  )}
                  <div className="p-6">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3" style={{ background: "rgba(201,168,76,0.15)", color: "var(--accent)" }}>
                      {p.industry}
                    </span>
                    <h3 className="text-xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{p.title}</h3>
                    <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{p.hook}</p>
                    <p className="text-xs font-semibold mb-4" style={{ color: "var(--text-primary)" }}>{p.metrics}</p>
                    <span className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                      Read Case Study {Icons.arrowRight}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills & Certifications ── */}
      <section ref={sectionRefs.skills} id="skills" className="py-20 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-center mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Skills & Certifications</h2>
            <Divider />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {/* Skills */}
            <Reveal delay={1}>
              <div className="space-y-6">
                {skillGroups.map((g) => (
                  <div key={g.category}>
                    <h4 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>{g.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {g.skills.map((s) => (
                        <span key={s} className="text-xs px-3 py-1.5 rounded-full border bg-white" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            {/* Certifications */}
            <Reveal delay={2}>
              <div className="space-y-4">
                {certifications.map((c) => (
                  <div key={c.name} className="flex items-center gap-4 p-4 rounded-lg bg-white border" style={{ borderColor: "var(--border)" }}>
                    <img src={`${import.meta.env.BASE_URL}${c.badge}`} alt={c.name} className="flex-shrink-0 w-12 h-12 object-contain" />
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section ref={sectionRefs.contact} id="contact" className="py-20 px-6" style={{ background: "var(--primary-dark)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-center text-white mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Let's Connect</h2>
            <div className="w-16 h-0.5 mx-auto my-2" style={{ background: "var(--accent)" }} />
            <p className="text-center text-white/60 mt-4 max-w-xl mx-auto">
              Whether you have a role in mind or just want to talk data — I'd love to hear from you.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {/* Contact Info */}
            <Reveal delay={1}>
              <div className="space-y-6">
                <a href="mailto:sundaydadag@gmail.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <span style={{ color: "var(--accent)" }}>{Icons.mail}</span>
                  <span>sundaydadag@gmail.com</span>
                </a>
                <a href="tel:+14698385748" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <span style={{ color: "var(--accent)" }}>{Icons.phone}</span>
                  <span>+1 (469) 838-5748</span>
                </a>
                <a href="https://linkedin.com/in/sundaydada" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <span style={{ color: "var(--accent)" }}>{Icons.linkedin}</span>
                  <span>linkedin.com/in/sundaydada</span>
                </a>
                <a href="https://github.com/dadasunday" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <span style={{ color: "var(--accent)" }}>{Icons.github}</span>
                  <span>github.com/dadasunday</span>
                </a>
              </div>
            </Reveal>
            {/* Form */}
            <Reveal delay={2}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="w-full py-3 rounded font-semibold text-sm transition-all hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "var(--accent)", color: "var(--primary-dark)" }}
                >
                  {formStatus === "sending" ? "Sending..." : "Send Message"}
                </button>
                {formStatus === "sent" && <p className="text-green-400 text-sm text-center">Message sent successfully!</p>}
                {formStatus === "error" && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════
//  PROJECT DETAIL PAGE
// ══════════════════════════════════════
function ProjectPage({ project, navigate }) {
  const currentIdx = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIdx + 1) % projects.length];

  return (
    <div className="page-enter">
      {/* ── Overview Hero ── */}
      <section className="hero-pattern min-h-[60vh] flex items-center" style={{ background: "var(--primary-dark)" }}>
        <div className="max-w-4xl mx-auto px-6 py-28">
          <Reveal>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "rgba(201,168,76,0.2)", color: "var(--accent)" }}>
              {project.industry}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="text-3xl md:text-5xl text-white leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-white/70 mt-6 text-lg leading-relaxed max-w-3xl">{project.overview}</p>
            {project.disclaimer && (
              <p className="mt-3 text-sm italic px-4 py-2 rounded-lg inline-block" style={{ background: "rgba(201,168,76,0.1)", color: "var(--accent)", border: "1px solid rgba(201,168,76,0.25)" }}>
                {project.disclaimer}
              </p>
            )}
          </Reveal>
          <Reveal delay={3}>
            <div className={`grid grid-cols-2 gap-4 mt-10 ${project.metricBoxes.length === 5 ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
              {project.metricBoxes.map((m) => (
                <div key={m.label} className="text-center p-4 rounded-lg" style={{ background: "rgba(201,168,76,0.12)" }}>
                  <div className="text-2xl md:text-3xl font-bold" style={{ color: "var(--accent)", fontFamily: "'DM Serif Display', serif" }}>{m.value}</div>
                  <div className="text-white/60 text-xs mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Data & Tools ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Data & Tools</h2>
            <Divider />
          </Reveal>
          <Reveal delay={1}>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>Tools Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((t) => (
                  <span key={t} className="text-xs px-3 py-1.5 rounded-full border bg-white" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>Data Context</h3>
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{project.dataContext}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Challenges ── */}
      <section className="py-16 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Challenges & How I Solved Them</h2>
            <Divider />
          </Reveal>
          <div className="mt-10 space-y-8">
            {project.challenges.map((c, i) => (
              <Reveal key={i} delay={i + 1}>
                <div className="pl-5 border-l-2" style={{ borderColor: "var(--accent)" }}>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{c.title}</h3>
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}><strong className="text-[var(--text-primary)]">The problem:</strong> {c.problem}</p>
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}><strong className="text-[var(--text-primary)]">The solution:</strong> {c.solution}</p>
                  <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>{c.learning}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Walkthrough ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Process Walkthrough</h2>
            <Divider />
          </Reveal>
          <div className="mt-10 space-y-12">
            {project.walkthrough.map((w, i) => (
              <Reveal key={i} delay={(i % 3) + 1}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "var(--accent)", color: "var(--primary-dark)" }}>
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{w.step}</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{w.desc}</p>
                    {w.download && (
                      <a
                        href={`${import.meta.env.BASE_URL}${w.download.file}`}
                        download
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded text-sm font-semibold transition-all hover:brightness-110"
                        style={{ background: "var(--accent)", color: "var(--primary-dark)" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        {w.download.label}
                      </a>
                    )}
                  </div>
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    {w.image ? (
                      w.image.endsWith('.svg') ? (
                        <object data={`${import.meta.env.BASE_URL}${w.image}`} type="image/svg+xml" className="rounded-lg shadow-md w-full" style={{ minHeight: "400px" }} aria-label={w.screenshot} />
                      ) : (
                        <img src={`${import.meta.env.BASE_URL}${w.image}`} alt={w.screenshot} className="rounded-lg shadow-md w-full" style={{ aspectRatio: "16/10", objectFit: "cover" }} />
                      )
                    ) : (
                      <Placeholder label={`Screenshot: ${w.screenshot}`} aspect="16/10" />
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Takeaways ── */}
      <section className="py-16 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Key Takeaways</h2>
            <Divider />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {project.takeaways.map((t, i) => (
              <Reveal key={i} delay={i + 1}>
                <div className="p-6 bg-white rounded-lg border h-full" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--accent)" }}>"{t.title}"</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {project.powerBiEmbed && (
            <Reveal delay={4}>
              <div className="mt-10">
                <h3 className="text-lg font-bold mb-4 text-center" style={{ fontFamily: "'DM Serif Display', serif" }}>Live Report</h3>
                <div className="rounded-lg overflow-hidden shadow-md border" style={{ borderColor: "var(--border)" }}>
                  <iframe
                    title="Power BI Report"
                    src={project.powerBiEmbed}
                    width="100%"
                    height="500"
                    className="border-0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </Reveal>
          )}
          <Reveal delay={4}>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => navigate("home", "projects")}
                className="flex items-center gap-2 text-sm font-semibold hover:underline"
                style={{ color: "var(--text-primary)" }}
              >
                {Icons.arrowLeft} Back to All Projects
              </button>
              <button
                onClick={() => navigate(`project/${nextProject.id}`)}
                className="flex items-center gap-2 text-sm font-semibold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Next: {nextProject.title} {Icons.arrowRight}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════
export default function SundayDadaPortfolio() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pendingScroll, setPendingScroll] = useState(null);

  const sectionRefs = {
    about: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  const scrollToSection = useCallback((section) => {
    const ref = sectionRefs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const navigate = useCallback((page, scrollTo = null) => {
    setCurrentPage(page);
    if (scrollTo) {
      setPendingScroll(scrollTo);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Handle pending scroll after page change
  useEffect(() => {
    if (pendingScroll && currentPage === "home") {
      const timer = setTimeout(() => {
        scrollToSection(pendingScroll);
        setPendingScroll(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPage, pendingScroll, scrollToSection]);

  // Determine which project to show
  let activeProject = null;
  if (currentPage.startsWith("project/")) {
    const id = parseInt(currentPage.split("/")[1], 10);
    activeProject = projects.find((p) => p.id === id);
  }

  return (
    <>
      <FontStyle />
      <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar currentPage={currentPage} navigate={navigate} scrollToSection={scrollToSection} />
        <main className="pt-16">
          {currentPage === "home" && (
            <HomePage navigate={navigate} scrollToSection={scrollToSection} sectionRefs={sectionRefs} />
          )}
          {activeProject && (
            <ProjectPage project={activeProject} navigate={navigate} />
          )}
        </main>
        <Footer navigate={navigate} scrollToSection={scrollToSection} currentPage={currentPage} />
      </div>
    </>
  );
}
