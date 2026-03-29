import React, { useState, useEffect, useRef, useCallback } from "react";

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
    industry: "Cross-Industry",
    hook: "How I built a BI environment that 300+ users — including C-suite — actually trust.",
    metrics: "Sub-2s queries · 50% faster · $8M+ impact",
    overview: `Colaberry needed a unified BI environment that could serve everyone from analysts to C-suite — with trusted data, fast dashboards, and self-service capability. The existing setup was fragmented: teams ran their own reports, numbers didn't match across departments, and executives waited weeks for updates that were often contradictory. Leadership was making multi-million dollar decisions based on spreadsheets that nobody could verify. Sunday was brought in to design and deliver the end-to-end solution — from data modeling to dashboard deployment — that would become the single source of truth for the entire organization.`,
    tools: ["Power BI (Desktop & Service)", "DAX (Advanced — CALCULATE, time intelligence, iterator functions)", "Power Query (M)", "Row-Level Security", "Star & Snowflake Schema Design"],
    dataContext: "Multiple source systems across 4 business units. Mix of SQL Server databases, Excel files, and Salesforce exports. Required heavy transformation and standardization before modeling. Advanced techniques included composite models, incremental refresh, dynamic RLS based on organizational hierarchy, and drill-through pages for executive-to-detail navigation.",
    challenges: [
      {
        title: "Fragmented data across 4 business units",
        problem: "Every team had their own spreadsheets and definitions. The same KPI could mean three different things depending on which department you asked.",
        solution: "Sunday built a unified semantic model with a shared business logic layer, standardizing KPIs across all units so leadership could compare apples to apples.",
        learning: "Getting stakeholders to agree on definitions upfront saved weeks of rework downstream."
      },
      {
        title: "Query performance at scale",
        problem: "Initial models had 8–10 second load times, making dashboards unusable for the 300+ users who needed them daily.",
        solution: "By refactoring from snowflake to optimized star schemas, removing unnecessary columns, and implementing aggregation tables, Sunday brought response times under 2 seconds for 300+ concurrent users.",
        learning: "The biggest performance gains came from model architecture changes, not DAX optimization."
      },
      {
        title: "Self-service adoption was low",
        problem: "People didn't trust the old reports, so they built their own — creating a vicious cycle of inconsistency.",
        solution: "Sunday created intuitive drill-through paths, added visual-level filters, and documented everything — reducing ad-hoc requests to IT significantly.",
        learning: "Trust isn't a feature you ship — it's earned through consistency, transparency, and making the right path the easy path."
      }
    ],
    walkthrough: [
      { step: "Requirements & Data Profiling", desc: "Interviewed stakeholders across all 4 business units to understand what decisions they needed to make, then profiled every data source for quality, completeness, and join-ability.", screenshot: "Stakeholder Requirements Matrix" },
      { step: "Semantic Model Design", desc: "Designed a star schema with clearly defined fact and dimension tables. Built a shared date table, standardized naming conventions, and created a business logic layer in DAX.", screenshot: "Star Schema Diagram" },
      { step: "DAX Development & Optimization", desc: "Wrote measures for all core KPIs using best practices (variables, CALCULATE patterns, avoiding nested iterators). Tested with DAX Studio and Performance Analyzer.", screenshot: "DAX Measures in Power BI" },
      { step: "Row-Level Security & Governance", desc: "Implemented dynamic RLS tied to organizational hierarchy so each user sees only their scope. Set up deployment pipelines and workspace governance.", screenshot: "RLS Configuration" },
      { step: "Dashboard Design & User Enablement", desc: "Built executive summary pages with drill-through to departmental detail. Created reusable templates and documentation to enable self-service.", screenshot: "Executive Dashboard" },
      { step: "Performance Tuning & Deployment", desc: "Used Performance Analyzer and DAX Studio to identify bottlenecks. Implemented incremental refresh, reduced model size by 40%, and achieved sub-2-second response times.", screenshot: "Performance Analyzer Results" }
    ],
    takeaways: [
      { title: "Model design is everything", desc: "80% of the performance gains came from getting the schema right, not from fancy DAX. Investing an extra week in model design saved months of optimization work and delivered a system that scaled effortlessly." },
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
    title: "Finance & Sales Reporting Overhaul",
    industry: "Financial Services",
    hook: "Reporting took 3–5 days. I got it down to same-day.",
    metrics: "40% faster · $20K saved/yr · 30% less DB load",
    overview: `The Finance and Sales teams at Colaberry were stuck in a painful reporting cycle — every month-end took 3–5 days of manual data pulls, validation, and formatting before leadership could see the numbers. By the time reports landed, decisions were already delayed. The finance team was working weekends just to hit deadlines, and the sales team couldn't tell whether they were on track until it was too late to course-correct. Sunday embedded with both teams to rebuild the entire reporting workflow from the database up.`,
    tools: ["Power BI", "SQL Server", "T-SQL", "Stored Procedures", "SQL Views", "SQL Server Agent"],
    dataContext: "Transactional data from ERP and CRM systems. Finance data required multi-currency support and fiscal calendar alignment. Sales pipeline data needed deduplication and stage-mapping logic. Advanced techniques included indexed views for pre-aggregation, parameterized stored procedures, and automated data quality triggers.",
    challenges: [
      {
        title: "Slow, unoptimized queries",
        problem: "The existing 35+ reporting queries were written ad-hoc over years, with no indexing strategy and redundant joins that consumed excessive database resources.",
        solution: "Sunday rewrote them with proper indexing, CTEs, and set-based logic — reducing DB resource consumption by 30%.",
        learning: "A systematic audit of execution plans revealed that 80% of the slowness came from just 5 queries."
      },
      {
        title: "Data quality issues eroding trust",
        problem: "Finance and Sales had different numbers for the same metrics. Leadership couldn't tell which team's report was correct.",
        solution: "Sunday built validation triggers and automated checks directly in the database layer, catching errors at the source before they propagated to reports.",
        learning: "Fixing data quality at the source layer is always more effective than trying to clean it in the presentation layer."
      },
      {
        title: "Leadership wouldn't act on the data",
        problem: "Even with dashboards, leaders second-guessed the numbers because they'd been burned by inaccurate reports too many times.",
        solution: "The data cleansing initiative improved accuracy by 20%, which was the tipping point for adoption — leadership started using the dashboards in weekly meetings.",
        learning: "Trust in data is fragile: it takes months to build and one bad number to destroy."
      }
    ],
    walkthrough: [
      { step: "Audit & Baseline", desc: "Cataloged all 35+ production queries, documented execution plans, and identified the worst performers. Created a priority matrix based on frequency of use and resource consumption.", screenshot: "Query Audit Spreadsheet" },
      { step: "SQL Optimization", desc: "Rewrote queries using CTEs, proper indexing, and set-based patterns. Created reusable views and stored procedures that standardized data access patterns across both teams.", screenshot: "Optimized Query Plans" },
      { step: "Data Quality Framework", desc: "Built SQL triggers and constraints to enforce business rules at the database level. Automated validation checks via SQL Server Agent jobs that ran before every reporting cycle.", screenshot: "Data Quality Dashboard" },
      { step: "Dashboard Rebuild", desc: "Designed Power BI dashboards connected to the optimized views. Focused on Finance month-end and Sales pipeline reporting with drill-through to transaction-level detail.", screenshot: "Finance Dashboard" },
      { step: "Validation & Handoff", desc: "Ran parallel reports (old vs. new) for one full cycle to validate accuracy, then trained both teams on the new workflow. Documented everything for maintainability.", screenshot: "Parallel Validation Results" }
    ],
    takeaways: [
      { title: "Fix the query before you fix the dashboard", desc: "Most reporting slowness was a database problem, not a BI problem. The 40% speed improvement came entirely from SQL optimization — the Power BI layer was already fast enough." },
      { title: "Automated validation beats manual checking every time", desc: "SQL triggers caught issues the team had been missing for months. Once the data quality framework was in place, the team spent zero time on manual reconciliation." },
      { title: "Trust is earned through accuracy, not aesthetics", desc: "The 20% accuracy improvement changed leadership behavior more than any visual redesign. A plain table with correct numbers beats a beautiful chart with wrong ones." }
    ],
    metricBoxes: [
      { value: "40%", label: "Faster Reporting" },
      { value: "$20K", label: "Saved Per Year" },
      { value: "30%", label: "Less DB Load" },
      { value: "20%", label: "Accuracy Improvement" }
    ]
  },
  {
    id: 3,
    title: "Enterprise Data Warehouse & ETL Platform",
    industry: "IT Services",
    hook: "The nightly batch job ran for 6 hours. Teams couldn't start their day with fresh data.",
    metrics: "25% faster ETL · 35% faster reports · 40% fewer errors",
    overview: `Fastwire Tech's reporting ran on a patchwork of direct queries, flat files, and manually maintained spreadsheets. No single source of truth existed — and when two department heads showed up to the same meeting with different revenue numbers, it was clear something had to change. Sunday was tasked with designing the data warehouse architecture and ETL infrastructure that every department would rely on — from scratch. The goal was simple: give every team in the organization one place to get their numbers, and make sure those numbers were always fresh and always right.`,
    tools: ["SSIS", "SSAS (Tabular)", "SSRS", "SQL Server", "T-SQL"],
    dataContext: "Operational databases across IT service management, HR, and finance. Mix of structured SQL data and semi-structured exports. Required SCD Type 2 handling for slowly changing dimensions. Advanced techniques included SSIS package orchestration with SQL Server Agent, SSAS tabular cubes with partitioned processing, and SSRS parameterized reports with subscription delivery.",
    challenges: [
      {
        title: "No existing warehouse architecture",
        problem: "There was no dimensional model, no staging area, and no ETL process — just direct queries hitting production databases during business hours.",
        solution: "Sunday designed the star schema from scratch — fact tables for service tickets, revenue, and HR metrics with shared dimension tables for time, geography, and department.",
        learning: "Starting from zero is actually easier than migrating a bad architecture — you can make the right choices without legacy constraints."
      },
      {
        title: "6-hour nightly batch processing",
        problem: "The initial ETL ran sequentially, processing each source one at a time. Teams couldn't start their day with fresh data because the job was still running.",
        solution: "Sunday restructured it with parallel execution paths and incremental loads, cutting it to 4.5 hours so teams had fresh data by start of business.",
        learning: "Parallelism and incremental loading delivered bigger gains than any code-level optimization ever could."
      },
      {
        title: "Inconsistent reporting across departments",
        problem: "Each team pulled from different sources with different logic, leading to contradictory numbers and endless debate about whose data was correct.",
        solution: "The SSAS cubes and SSRS reports gave everyone a single version of the truth with consistent calculations and definitions.",
        learning: "The hardest part wasn't building the warehouse — it was getting four departments to agree on what 'revenue' means."
      }
    ],
    walkthrough: [
      { step: "Requirements & Source Analysis", desc: "Mapped all departmental reporting needs and profiled source systems for data quality and structure. Built a data dictionary documenting every field, transformation, and business rule.", screenshot: "Source System Map" },
      { step: "Warehouse Schema Design", desc: "Designed a dimensional model with clearly separated fact and dimension tables. Implemented SCD Type 2 for historical tracking of slowly changing dimensions like employee roles and department structures.", screenshot: "Dimensional Model Diagram" },
      { step: "ETL Pipeline Development", desc: "Built SSIS packages for extraction, transformation, and loading. Used SQL Server Agent for orchestration with error handling, logging, and automatic retry logic for transient failures.", screenshot: "SSIS Package Flow" },
      { step: "SSAS Cube Development", desc: "Created tabular models with calculated measures, hierarchies, and KPIs. Partitioned processing for performance so that only changed data gets reprocessed each night.", screenshot: "SSAS Tabular Model" },
      { step: "SSRS Reporting Layer", desc: "Designed parameterized reports with scheduled subscriptions for automated delivery to department leads. Reports rendered in under 3 seconds thanks to the pre-aggregated cube layer.", screenshot: "SSRS Report Gallery" }
    ],
    takeaways: [
      { title: "Build the warehouse right the first time", desc: "Investing extra time in schema design saved months of rework later. The dimensional model has been extended twice since launch without requiring a redesign — because the foundation was solid." },
      { title: "ETL performance is an architecture problem", desc: "Parallel execution and incremental loading were the biggest wins, not code-level optimization. Restructuring the job flow cut processing time by 25% with minimal code changes." },
      { title: "A single source of truth changes the conversation", desc: "Once departments stopped arguing about whose numbers were right, they started talking about what to do about them. That shift — from 'is this data correct?' to 'what should we do?' — was the real win." }
    ],
    metricBoxes: [
      { value: "25%", label: "Faster ETL" },
      { value: "35%", label: "Faster Reports" },
      { value: "40%", label: "Fewer Errors" },
      { value: "4.5h", label: "Batch Runtime" }
    ]
  },
  {
    id: 4,
    title: "AI-Powered Operations Platforms",
    industry: "Education & Public Sector",
    hook: "Two organizations needed to replace paper and spreadsheets with real operational systems.",
    metrics: "55% less manual entry · 33% fewer tickets",
    overview: `Two organizations — one in education and one managing an animal shelter — were running critical operations on paper forms, spreadsheets, and email chains. In education, parking permit management was a nightmare of lost forms and manual data entry. At the animal shelter, intake records were handwritten and support requests overwhelmed a small team. Both needed a real system: something their staff could use on a tablet in the field, with automated workflows, document generation, and eventually AI-assisted data entry. Sunday designed and delivered both as enterprise Power Apps integrated with the Microsoft ecosystem.`,
    tools: ["Power Apps (Canvas & Model-Driven)", "Power Automate", "Dataverse", "AI Builder", "Copilot Studio", "Microsoft 365", "Salesforce", "DocuSign"],
    dataContext: "Operational records (parking permits, animal intake forms, inspection records), document attachments, and integration data from Salesforce and DocuSign. Advanced techniques included AI Builder for intelligent document processing (form extraction), Copilot Studio for conversational AI agents, Dataverse role-based security, and Power Automate approval flows with conditional branching.",
    challenges: [
      {
        title: "Replacing deeply embedded manual processes",
        problem: "Staff had been using paper and email for years. Previous attempts to introduce digital tools failed because they forced completely new workflows.",
        solution: "Sunday designed the apps around their existing workflows first, then gradually introduced automation — rather than forcing a completely new process on day one.",
        learning: "The best technology adoption strategy is to make the new way feel like the old way, but faster."
      },
      {
        title: "Document processing bottleneck",
        problem: "One organization had staff manually re-typing data from scanned forms into spreadsheets — a process that was slow, error-prone, and deeply frustrating.",
        solution: "Sunday implemented AI Builder's form processing model, cutting manual data entry by 55% and dramatically reducing transcription errors.",
        learning: "AI doesn't need to be perfect to be transformative — even 80% accuracy saves hours of manual work."
      },
      {
        title: "High support ticket volume",
        problem: "Staff had questions about processes, policies, and the new system. The small support team was overwhelmed with repetitive queries.",
        solution: "A Copilot Studio conversational agent handled common queries automatically, reducing support tickets by roughly a third.",
        learning: "Most support questions are the same 20 questions asked 100 different ways — a well-trained bot handles that perfectly."
      }
    ],
    walkthrough: [
      { step: "Process Mapping", desc: "Shadowed staff to understand existing paper-based workflows, pain points, and decision logic. Documented every form, approval chain, and exception case before writing a single line of code.", screenshot: "Process Flow Diagram" },
      { step: "App Architecture", desc: "Designed the data model in Dataverse with proper relationships, security roles, and business rules. Built a schema that could support both organizations' needs with shared components.", screenshot: "Dataverse Schema" },
      { step: "Canvas App Development", desc: "Built mobile-first Canvas Apps for field staff (parking inspectors, shelter workers) with offline capability and barcode scanning. Optimized for tablet use with large touch targets.", screenshot: "Canvas App Interface" },
      { step: "Workflow Automation", desc: "Created Power Automate flows for approvals, document generation (DocuSign), notifications, and data sync with Salesforce. Built conditional branching for different approval paths.", screenshot: "Power Automate Flows" },
      { step: "AI Integration", desc: "Trained AI Builder models on historical forms for automated extraction. Deployed Copilot Studio agents for self-service support with escalation paths for complex queries.", screenshot: "AI Builder Model Results" },
      { step: "Rollout & Adoption", desc: "Ran pilot programs with small teams, incorporated feedback, then rolled out organization-wide. Both apps are now the primary operational systems used daily by all staff.", screenshot: "Adoption Metrics" }
    ],
    takeaways: [
      { title: "Adopt workflows first, then automate", desc: "The apps succeeded because they mirrored how people already worked, not because they forced a new process. Change management is 80% psychology and 20% technology." },
      { title: "AI doesn't need to be perfect to be valuable", desc: "The form processing model wasn't 100% accurate, but it still cut manual entry by more than half. Waiting for perfection would have meant waiting forever — and the staff needed relief now." },
      { title: "Build for the person in the field, not the person in the office", desc: "Mobile-first design with offline support was non-negotiable for these use cases. The best features in the world don't matter if the app doesn't work where the work actually happens." }
    ],
    metricBoxes: [
      { value: "55%", label: "Less Manual Entry" },
      { value: "33%", label: "Fewer Tickets" },
      { value: "2", label: "Organizations Served" },
      { value: "80%+", label: "AI Accuracy" }
    ]
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
  "Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)",
  "Microsoft Certified: Power BI Data Analyst Associate (PL-300)",
  "Microsoft Certified: Power Platform Functional Consultant Associate (PL-200)"
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
            <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <span style={{ color: "var(--accent)" }}>{Icons.phone}</span> +1 (234) 567-890
            </a>
            <a href="https://linkedin.com/in/sundaydada" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <span style={{ color: "var(--accent)" }}>{Icons.linkedin}</span> LinkedIn Profile
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
              7+ years building production BI environments across healthcare, finance, and government. From semantic modeling to AI automation — I own the full lifecycle.
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
                I'm a BI Consultant at Colaberry with over seven years of experience building analytics solutions that people actually use. My specialty is Power BI — from semantic modeling with star and snowflake schemas to advanced DAX and performance optimization that keeps dashboards snappy at scale. I've built environments serving 300+ users, including C-suite executives, with sub-2-second response times on complex reports.
              </p>
              <p className="leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
                Beyond dashboards, I design enterprise Power Apps and AI-powered automations that replace manual processes with intelligent workflows. My experience spans various industries, including healthcare, financial services, government, and education — industries where getting the data right isn't optional. I hold three Microsoft certifications across Fabric, Power BI, and Power Platform, and my background in Physics (B.Tech) gives me the analytical rigor to approach every problem systematically. Based in Canada, I'm open to remote and hybrid opportunities where I can make enterprise data work harder.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <div className="flex justify-center">
                <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl bg-gray-200 flex items-center justify-center" role="img" aria-label="Professional headshot of Sunday Dada">
                  <span className="text-gray-500 text-sm text-center px-4">Your Photo Here</span>
                </div>
              </div>
            </Reveal>
          </div>
          {/* Stats */}
          <Reveal delay={3}>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 bg-white rounded-xl shadow-md divide-x divide-y md:divide-y-0" style={{ borderColor: "var(--border)" }}>
              <StatCard value="7+" label="Years of Experience" />
              <StatCard value="300+" label="Dashboard Users Served" />
              <StatCard value="$8M+" label="Business Decisions Impacted" />
              <StatCard value="50%" label="Avg. Performance Improvement" />
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
                  <Placeholder label="Dashboard Screenshot" aspect="16/10" />
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
                  <div key={c} className="flex items-start gap-4 p-4 rounded-lg bg-white border" style={{ borderColor: "var(--border)" }}>
                    <div className="flex-shrink-0 mt-0.5">{Icons.cert}</div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c}</p>
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
              I'm actively looking for my next opportunity. Whether you have a role in mind or just want to talk data — I'd love to hear from you.
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
                <a href="tel:+1234567890" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <span style={{ color: "var(--accent)" }}>{Icons.phone}</span>
                  <span>+1 (234) 567-890</span>
                </a>
                <a href="https://linkedin.com/in/sundaydada" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <span style={{ color: "var(--accent)" }}>{Icons.linkedin}</span>
                  <span>linkedin.com/in/sundaydada</span>
                </a>
              </div>
            </Reveal>
            {/* Form */}
            <Reveal delay={2}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
                  className="w-full py-3 rounded font-semibold text-sm transition-all hover:brightness-90"
                  style={{ background: "var(--accent)", color: "var(--primary-dark)" }}
                >
                  Send Message
                </button>
                <p className="text-white/30 text-xs text-center">Form can be connected to Formspree or EmailJS.</p>
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
          </Reveal>
          <Reveal delay={3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
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
                  </div>
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    <Placeholder label={`Screenshot: ${w.screenshot}`} aspect="16/10" />
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
          <Reveal delay={4}>
            <div className="mt-10 text-center">
              <a href="#" className="text-sm font-semibold inline-flex items-center gap-1 hover:underline" style={{ color: "var(--accent)" }}>
                View on Power BI Service {Icons.arrowRight}
              </a>
            </div>
          </Reveal>
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
