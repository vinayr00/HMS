# Graph Report - HMS  (2026-09-18)

## Corpus Check
- 140 files · ~375,637 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .css 11, (none) 2)

## Summary
- 480 nodes · 931 edges · 25 communities (16 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `028f6baa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.js
- lucide-react
- server/package.json
- package.json
- ReceptionistPortal.jsx
- AdminPortal.jsx
- PharmacyPortal.jsx
- App.jsx
- react
- What You Must Do When Invoked
- 🏥 ProHealth — Hospital Management System (HMS)
- constants.js
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- workflows/graphify.md
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `react` - 76 edges
2. `lucide-react` - 51 edges
3. `writeLog()` - 27 edges
4. `useAuth()` - 23 edges
5. `react-router-dom` - 21 edges
6. `usePharmacy()` - 13 edges
7. `🏥 ProHealth — Hospital Management System (HMS)` - 13 edges
8. `What You Must Do When Invoked` - 12 edges
9. `express` - 11 edges
10. `mongoose` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Sidebar()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/common/Sidebar.jsx → src/hooks/useAuth.js
- `StaffSidebar()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/staff/layout/StaffSidebar.jsx → src/hooks/useAuth.js
- `PharmacyPortal()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/portals/PharmacyPortal.jsx → src/hooks/useAuth.js
- `create()` --calls--> `writeLog()`  [EXTRACTED]
  server/controllers/appointmentController.js → server/utils/auditLogger.js
- `updateStatus()` --calls--> `writeLog()`  [EXTRACTED]
  server/controllers/appointmentController.js → server/utils/auditLogger.js

## Import Cycles
- None detected.

## Communities (25 total, 9 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.07
Nodes (48): express, jsonwebtoken, ref_path, ref_url, connectDB(), create(), getAll(), updateStatus() (+40 more)

### Community 1 - "lucide-react"
Cohesion: 0.08
Nodes (31): lucide-react, react-router-dom, src_assets_hms_logo, src_assets_home, src_assets_loginbg, AdminSidebar(), Button(), Footer() (+23 more)

### Community 2 - "server/package.json"
Cohesion: 0.05
Nodes (38): bcryptjs, cors, dotenv, ref_dotenv_config, express-async-errors, express-validator, helmet, mongoose (+30 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (43): dependencies, jspdf, jspdf-autotable, lucide-react, react, react-dom, react-router-dom, devDependencies (+35 more)

### Community 4 - "ReceptionistPortal.jsx"
Cohesion: 0.09
Nodes (24): jspdf, jspdf-autotable, src_assets_reception, ReceptionAppointments(), ReceptionBilling(), initialUrgentItems, ReceptionDashboard(), ReceptionQueue() (+16 more)

### Community 5 - "AdminPortal.jsx"
Cohesion: 0.18
Nodes (12): src_assets_admin, AddUserModal(), AdminFinance(), AdminLogs(), AdminOverview(), AdminSettings(), AdminUsers(), AdminContext (+4 more)

### Community 6 - "PharmacyPortal.jsx"
Cohesion: 0.23
Nodes (12): src_assets_medicine, PharmacyDashboard(), PharmacyDispense(), PharmacyInventory(), PharmacyOrders(), PharmacyProfile(), PharmacyReports(), PharmacyContext (+4 more)

### Community 7 - "App.jsx"
Cohesion: 0.11
Nodes (14): ref_react_dom_client, App(), router, AuthContext, AuthProvider(), ToastContext, ToastProvider(), authService (+6 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (25): react, src_assets_doctor, src_assets_staff, AddClinicalNoteModal(), LabReportsPanel(), ScheduleFollowUpModal(), DoctorAppointments(), DoctorDashboard() (+17 more)

### Community 11 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 12 - "🏥 ProHealth — Hospital Management System (HMS)"
Cohesion: 0.10
Nodes (19): Building for Production, 🤝 Contributing, 🔑 Demo Credentials, 🌐 Deployment, 🌟 Features Overview, 🚀 Getting Started, GitHub Pages, Installation (+11 more)

### Community 16 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 18 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 19 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 20 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 21 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **142 isolated node(s):** `name`, `private`, `version`, `type`, `homepage` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 193 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `package.json`, `ReceptionistPortal.jsx`, `AdminPortal.jsx`, `PharmacyPortal.jsx`, `App.jsx`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `package.json`, `ReceptionistPortal.jsx`, `AdminPortal.jsx`, `PharmacyPortal.jsx`, `App.jsx`, `react`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _142 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07237871674491393 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.08408953418027829 - nodes in this community are weakly interconnected._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04521276595744681 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04734299516908213 - nodes in this community are weakly interconnected._