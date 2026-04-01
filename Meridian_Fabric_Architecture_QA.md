# MICROSOFT FABRIC ARCHITECTURE — 20 Architecture Decisions

## Meridian — The Voyager Group
**Fabric Migration & Curated Layer Development | Analytics Platform**

*Context: Meridian operates a portfolio of six travel brands (Luxury Tours, Premium Cruise, Private Villas, Private Jets, Commercial Air, Corporate Travel) generating $35M+ in annual gross sales across six regions and five sales channels. The existing BI environment ran on fragmented SQL Server databases and Power BI Desktop files with no single source of truth, no profit visibility, and no forecasting capability. This document captures the 20 architecture decisions made during the migration to Microsoft Fabric and the build-out of the executive reporting platform.*

*Prepared by Sunday Dada*

---

## Capacity Planning

### Q1. Do you want separate data processing/storage and Power BI report consumption?

**Decision:** Yes. We separated Data Engineering workloads from BI report consumption.

The Data Engineering team owns the Bronze and Silver layers — running Spark notebooks and pipelines for ingestion and cleansing. My role as BI Developer owns the curated Gold layer — building semantic models, Dataflow Gen2 items, and KPI logic for Power BI report consumption.

This separation was critical because Meridian's nightly ETL processes (loading booking transactions, operating expenses, and forecast data from SQL Server) are compute-intensive. If those jobs ran on the same capacity as the interactive executive dashboards, leadership would experience throttled performance during morning report reviews — exactly when they need it most.

We evaluated during discovery: since the Data Engineering team ran heavy Spark jobs during early morning hours that occasionally overlapped with business hours, we recommended separate capacities for ETL and interactive queries.

---

### Q2. What is the planned intensity of your workloads, and how willing are you to wait for completion?

**Decision:** Medium-to-high intensity, with two distinct phases.

**Migration phase (temporary spike):** Bulk data movement of historical booking data, operating expenses, and forecast targets from SQL Server into Lakehouse tables. Rebuilding all semantic models and re-creating Dataflows. This was compute-intensive but time-limited — approximately 4 weeks.

**Steady state (ongoing):** Scheduled Dataflow Gen2 refreshes processing daily booking transactions, weekly operating expense updates, and monthly forecast target loads. Semantic model processing for the executive dashboard serving six brand managers, regional managers, and C-suite executives. Interactive report queries throughout the business day.

**Future consideration:** Meridian's leadership expressed interest in AI-powered anomaly detection on booking patterns and revenue forecasting. Fabric capacity includes AI/ML compute that can be enabled when the organization is ready — no re-architecture needed.

We started with a capacity SKU sized for steady-state workloads and used Fabric's capacity metrics app to monitor CU utilization. The migration spike was managed by scheduling bulk loads during off-hours.

---

## Designing Workspaces

### Q3. Which groups of users need access to which Fabric items?

**Decision:** Four distinct user groups, each with specific access needs.

At Meridian, the analytics consumers fell into clear groups:

1. **Data Engineers (Bronze/Silver layers)** — needed read/write access to Lakehouse notebooks, pipelines, and raw/cleansed tables. They should NOT have write access to the curated Gold layer where our governed KPIs live.

2. **BI Developers — my role (Gold/Curated layer)** — needed read access to Silver layer tables (to build transformations on top), and read/write access to the Gold layer (semantic models, Dataflow Gen2 items, SQL views, KPI logic).

3. **Report consumers (executives, brand managers, operations)** — needed read-only access to published Power BI reports via the Power BI App. No access to underlying Lakehouse tables or workspace items. This included Meridian's CEO, CFO, six brand managers, and regional managers.

4. **Self-service analysts** — needed read access to governed semantic models with Build permission to create their own reports. This allowed Meridian's finance team to build ad-hoc analyses without requesting custom reports from the BI team.

**Workspace structure implemented:**
- `WS-Bronze-DEV / WS-Bronze-PROD` — Raw data landing zone (Data Engineering)
- `WS-Silver-DEV / WS-Silver-PROD` — Cleansed, conformed data (Data Engineering)
- `WS-Gold-Curated-DEV / TEST / PROD` — Curated layer with semantic models and KPI logic (BI Developers)
- `WS-Reporting-PROD` — Published reports and Power BI App (consumers)

---

### Q4. Do you have requirements for separating DEV, TEST and PRODUCTION?

**Decision:** Yes — DEV → TEST → PROD using Fabric Deployment Pipelines.

This was non-negotiable. Meridian's executive dashboard directly influenced multi-million dollar portfolio decisions. A broken measure or incorrect KPI in production could lead to flawed strategic choices. We implemented:

- **DEV workspace:** Where I built and iterated on semantic models, Dataflow Gen2 items, and DAX measures. Fast iteration, no risk to production.
- **TEST workspace:** Where brand managers and the CFO validated reports and KPIs before production deployment. They compared numbers against known benchmarks to catch discrepancies.
- **PROD workspace:** Production environment serving the executive dashboard, operational reports, and self-service analytics.

We applied this DEV/TEST/PROD pattern to both the Gold-Curated and Reporting workspaces. The Data Engineering team had their own deployment pipeline for Bronze/Silver.

Dataset rebinding rules were configured in the pipeline so that when a report was promoted from DEV to TEST, it automatically reconnected to the TEST semantic model — preventing the dangerous scenario where a production report accidentally queries DEV data.

---

### Q5. Do you have requirements for version controlling Fabric items using Git integration?

**Decision:** Yes. Connected the DEV workspace to a Git repository.

During the migration from SQL Server to Fabric, version control provided a safety net. Every change to a semantic model, Dataflow definition, or DAX measure was tracked with a commit message explaining what changed and why. When a DAX measure produced unexpected results after a change, we could diff the commit and identify the exact modification that caused the issue.

Post-migration, Git integration enabled:
- **Collaborative development:** Multiple team members could work on different features using branches
- **Rollback capability:** If a deployment introduced a regression, we could revert to the last known-good state
- **Audit trail:** Every change to the executive reporting model was documented — critical for Meridian's governance requirements

We connected `WS-Gold-Curated-DEV` to a GitHub repository, using feature branches for new development and merging to main for deployment to TEST/PROD.

**Note:** Dataflow Gen2 does not yet support Git natively. We worked around this with a strict naming convention (e.g., `DF_Gold_Fact_Bookings_v2.1`) and periodically exported definitions to the repository.

---

## Security

### Q6. What are the core groups of users who need access to your solution?

**Decision:** Five Entra ID security groups, mapped to Meridian's organizational structure.

- **SG-Fabric-DataEngineers** → Admin on WS-Bronze, WS-Silver | No access to WS-Gold
- **SG-Fabric-BIDevelopers** → Contributor on WS-Gold-Curated-DEV/TEST/PROD | Viewer on WS-Silver
- **SG-Fabric-ReportConsumers** → Viewer on WS-Reporting-PROD only (executives, brand managers, operations)
- **SG-Fabric-SelfServiceAnalysts** → Viewer on WS-Gold-Curated-PROD with Build permission on semantic models
- **SG-Fabric-Admins** → Full access for platform governance and monitoring

We assigned security groups to workspaces rather than individual users. When Meridian hired a new regional analyst, we added them to `SG-Fabric-SelfServiceAnalysts` once — they immediately inherited access to all governed datasets with Build permission. No tickets, no manual workspace assignments.

---

### Q7. Do you have requirements for Row-Level Security?

**Decision:** Yes. Implemented RLS at the semantic model level.

Meridian's six brand managers each needed to see only their brand's data — Luxury Tours sees Tours numbers only, Premium Cruise sees Cruise only. The CFO and CEO needed the Executive role with full cross-brand visibility.

I implemented RLS using DAX role filters on the `Dim_Brand` dimension table:
- **Brand Manager — Tours:** `[Brand] = "Luxury Tours"`
- **Brand Manager — Cruise:** `[Brand] = "Premium Cruise"`
- **Brand Manager — Villas:** `[Brand] = "Private Villas"`
- **Brand Manager — Jets:** `[Brand] = "Private Jets"`
- **Brand Manager — Air:** `[Brand] = "Commercial Air"`
- **Brand Manager — Corporate:** `[Brand] = "Corporate Travel"`
- **Executive (All Brands):** No filter — sees everything

**Important caveat for Direct Lake:** Direct Lake mode supports RLS but does NOT support Object-Level Security (OLS) or Dynamic Data Masking. Since Meridian only required brand-level row filtering, Direct Lake was fully compatible. If OLS or DDM had been required, we would have needed Import mode or a Data Warehouse for those specific models.

---

## Data Ingestion

### Q8. Is your data stored in SQL Server? How should it be migrated to Fabric?

**Decision:** Multi-phase migration using Data Pipeline CopyData for bulk loads and Dataflow Gen2 for ongoing incremental loads.

Meridian's data lived in on-premises SQL Server databases containing booking transactions, operating expense records, and forecast targets. The migration approach:

**Phase 1 — Bulk historical migration:** Used a Fabric Data Pipeline (`PL_InitialLoad_SQLServer`) with CopyData activities to load each source table from SQL Server into Bronze Lakehouse tables via an On-Premises Data Gateway. This moved the full historical dataset in one pass.

**Phase 2 — Ongoing incremental loads:** Set up Dataflow Gen2 items to connect to SQL Server via the gateway, apply transformations (data type standardization, calculated columns, business rules), and write to Silver and Gold Lakehouse tables. Dataflow Gen2 was chosen because it provides a visual, Power Query-based ETL experience that BI developers can maintain without writing Spark code.

**Phase 3 — Decommission SQL Server:** Once all consumers (executive dashboards, operational reports, self-service analysts) were migrated to Fabric, we planned the decommission of the SQL Server source to eliminate dual maintenance.

---

### Q9. Do you have pre-existing Power BI dataflows that could be ported to Dataflow Gen2?

**Decision:** Assessed during discovery — no Gen1 dataflows existed. Built new Dataflow Gen2 items from scratch.

Meridian's existing BI environment was entirely Power BI Desktop .pbix files with Import mode, connected directly to SQL Server. No Gen1 dataflows had been created. This actually simplified the migration — we built Dataflow Gen2 items from scratch as part of the curated layer, designed correctly from the start rather than carrying forward legacy patterns.

If Gen1 dataflows had existed, the migration would have been straightforward since both use Power Query (M) as the transformation language. The critical advantage of Gen2 is that it outputs directly to Lakehouse tables — essential for the medallion architecture.

---

### Q10. What is the current skill level of the people creating ETL items?

**Decision:** Split tooling based on team skills — Data Engineers use Spark notebooks, BI Developers use Dataflow Gen2 and SQL.

At Meridian, the team split was clear:

- **Data Engineers (Bronze/Silver):** Comfortable with PySpark and Fabric Notebooks. They handled raw ingestion from SQL Server, deduplication, null handling, data type standardization, and key conformance in the Silver layer.

- **BI Developers — my role (Gold/Curated):** Stronger in SQL, Power Query (M), and DAX. I used Dataflow Gen2 for Gold layer transformations (joining fact data with dimension keys, calculating derived columns like Net Revenue, applying business rules like excluding cancelled orders from revenue calculations) and the Lakehouse SQL analytics endpoint for creating business-ready views and KPI logic.

This meant I never needed to write Spark code — that was the Data Engineering team's domain. My tools were Dataflow Gen2, SQL, and DAX, which are the natural tools for a BI Developer building curated semantic models.

---

### Q11. Do you want your ETL jobs to be version controlled?

**Decision:** Yes. All ETL items in the curated layer are version controlled.

- **Data Pipelines:** Git integration enabled (now available in preview)
- **Dataflow Gen2:** Does not support Git natively yet. Workaround: strict naming convention (`DF_Gold_Fact_Bookings`) and periodic export of dataflow definitions to the repository
- **Fabric Notebooks:** Fully supported with Git integration (Data Engineering team's responsibility)

As Dataflow Gen2 Git support is added, we'll migrate to full version control. In the meantime, the naming convention and periodic exports provide adequate auditability for Meridian's governance requirements.

---

## Selecting Data Stores

### Q12. Is your data structured, semi-structured, or unstructured?

**Decision:** Primarily structured. Lakehouse is the right choice.

Meridian's data is relational — booking transactions, operating expenses, forecast targets, and dimension tables (Date, Brand, Region, Sales Channel). All originated from SQL Server.

The Lakehouse was chosen because:
- **Lakehouse Tables (Delta format)** store structured data with ACID transactions, schema enforcement, and time travel
- **The Files area** accommodated semi-structured files (CSVs from the finance team's Excel exports) as a staging area during migration
- **Two interfaces:** Spark engine for Data Engineers and SQL analytics endpoint for BI developers — both teams work on the same data through their preferred tool

The SQL analytics endpoint is how I created business-ready views and connected semantic models — directly matching the requirement to design business-ready views and metrics within the curated layer.

---

### Q13. What are the skillsets of your team and how does that affect data store choice?

**Decision:** Use Lakehouse for all three medallion layers. Both teams work through their preferred interface.

- **Data Engineers (Bronze/Silver):** Python/PySpark → interact with Lakehouse through the Spark engine
- **BI Developers — my role (Gold/Curated):** SQL, Power Query, DAX → interact with Lakehouse through the SQL analytics endpoint

I queried Silver layer tables via SQL, created Gold layer views and materialized tables, and built semantic models on top — all without writing a single line of Spark code. The Lakehouse's dual-interface design made this seamless.

---

### Q14. Do you want to version control your data store and related code?

**Decision:** Yes. Single repository for all curated layer code and definitions.

- **Lakehouse metadata and associated notebooks:** Connected to Git via Fabric's built-in integration
- **SQL views and stored procedures:** Definition files tracked in the same repository
- **Semantic model definitions:** Used Fabric's Git integration to track TMDL (Tabular Model Definition Language) files

This created a single source of truth for all curated layer artifacts. When I made a change to a DAX measure or SQL view, the commit message documented the business reason — not just the code change.

---

## Combining Data Stores (Medallion Architecture)

### Q15. Are you planning on following a medallion-like architecture?

**Decision:** Yes. This was the core architecture for Meridian's analytics platform.

- **Bronze (Raw):** Lakehouse containing raw data ingested from SQL Server. Owned by Data Engineering. Data lands as-is for auditability — every record from the source system is preserved.

- **Silver (Cleansed/Conformed):** Lakehouse with cleaned, deduplicated, and conformed data. Owned by Data Engineering. Standardized booking IDs, consistent date formats, resolved currency discrepancies across Meridian's six brands.

- **Gold (Curated/Business-Ready):** My primary deliverable. Contains materialized business-ready tables, KPI logic, governed semantic models. Booking data enriched with brand, region, and channel dimensions. Operating expenses categorized and allocated. Forecast targets aligned with actuals for variance analysis. Consumers never touch Bronze or Silver.

The data flow:
- **Bronze → Silver:** Data Engineering team's responsibility (Spark notebooks, pipelines)
- **Silver → Gold:** My responsibility (Dataflow Gen2, SQL views materialized as tables, semantic models)
- **Gold → Consumers:** Power BI App with executive dashboard, self-service datasets, operational dashboards

---

### Q16. Do you have requirements for Row-Level Security, Object-Level Security or Dynamic Data Masking in the serving layer?

**Decision:** RLS only. Implemented in the semantic model using DAX role filters.

- **Bronze/Silver:** Security enforced at the workspace level — only Data Engineers have access. No row-level security needed here.
- **Gold/Curated:** RLS implemented in the semantic model. Each brand manager sees only their brand's bookings, revenue, expenses, and forecasts. Executives see the full $35.3M portfolio.

Since Meridian only required brand-level row filtering (not column-level or data masking), Direct Lake mode was fully compatible. We kept the simpler Lakehouse + semantic model RLS approach rather than introducing a Data Warehouse Gold layer.

---

## Selecting a Connection Mode

### Q17. What connection mode should the semantic models use?

**Decision:** Direct Lake as the default for all new semantic models.

Direct Lake connects directly to Delta tables in the Gold Lakehouse. No data import, no scheduled refresh — data is available as soon as the Lakehouse is updated. For Meridian, this meant the executive dashboard always reflected the latest booking data without waiting for a scheduled dataset refresh.

**Critical design implication we discovered:** Direct Lake reads from Lakehouse tables, NOT from SQL views. When I initially created business-ready SQL views in the analytics endpoint, the semantic model silently fell back to DirectQuery — slower performance. The fix was to materialize those views as physical Gold tables using Dataflow Gen2, which Direct Lake could read directly.

This single architectural decision — materializing views as tables — was the difference between sub-second dashboard performance and 5-8 second query times.

---

### Q18. Can existing Import mode reports be migrated? Should we keep Import mode?

**Decision:** Phased migration from Import to Direct Lake.

Meridian's existing Power BI Desktop reports all used Import mode connected directly to SQL Server. We migrated in phases:

**Phase 1 (Quick wins):** Republished existing reports to the Fabric workspace, reconnected to Gold layer tables. Kept Import mode initially to minimize disruption while stakeholders validated data accuracy.

**Phase 2 (Optimization):** Migrated the executive reporting semantic model from Import to Direct Lake. This eliminated scheduled refreshes (previously running twice daily), reduced dataset memory footprint, and provided near-real-time data freshness.

**Import mode retained for:** One legacy report that used DAX calculated tables for a specific commission allocation model not yet supported by Direct Lake. This was flagged for future refactoring.

The end state: the primary executive reporting model on Direct Lake, with Import mode as the documented exception.

---

## Building Data Quality Systems

### Q19. What are the most important datasets, and how should they be validated?

**Decision:** Validate at the Gold layer boundary with five types of checks.

The Gold layer is where "trusted" is earned. For Meridian's executive dashboard tracking $35.3M in revenue across six brands, a single null in a revenue column or an orphaned foreign key could silently skew P&L numbers and mislead leadership.

Validation rules implemented:

1. **Completeness:** No null values in Gross_Sales, Gross_Margin, Commission, Net_Revenue, or Operating_Profit columns. A null in a SUM measure silently skews totals.

2. **Consistency:** KPI definitions match across all semantic models. "Gross Margin %" is always `DIVIDE([Gross Margin], [Gross Sales], 0)` — never calculated differently in two reports.

3. **Freshness:** Gold layer data is no older than 24 hours. If the Dataflow last ran 48 hours ago, the executive dashboard is misleading.

4. **Referential integrity:** All Brand keys in Fact_Bookings resolve to valid Dim_Brand records. Orphaned keys mean missing data in the brand slicer — a brand manager would see incomplete numbers.

5. **Range checks:** No negative Gross_Sales, no future dates in historical booking columns, all percentages between 0 and 100.

These checks run as SQL validation queries against the Lakehouse SQL analytics endpoint after each Gold refresh, with results logged to a `dq_validation_log` table.

---

### Q20. Do you want to monitor data quality across all datasets in your organization?

**Decision:** Yes. Built a Data Quality Dashboard as part of the operational reporting suite.

This was implemented from day one, not as an afterthought:

- **`dq_validation_log` table in the Gold Lakehouse:** Logs every validation run — timestamp, dataset name, rule name, pass/fail, record count, error details
- **Data Quality Dashboard in Power BI:** Tracks validation results over time, highlights failing rules, and shows data freshness for each Gold table. This is itself one of the "operational dashboards" in the platform
- **Automated alerts via Power Automate:** Email notification to the BI team when a critical validation fails (e.g., Fact_Bookings has null revenue records)
- **Dataset metadata records:** Each governed semantic model has a documented record listing its validation rules, refresh schedule, owner, last-validated timestamp, and KPI definitions

When Meridian's CFO asks "can I trust these numbers?" — the answer is backed by automated validation, not a verbal assurance.

---

*End of Document*
