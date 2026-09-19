# Graph Report - HMS  (2026-09-19)

## Corpus Check
- 146 files · ~379,557 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .css 11, (none) 2)

## Summary
- 525 nodes · 1014 edges · 54 communities (26 shown, 28 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d155988`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- patients.js
- lucide-react
- server/package.json
- client/package.json
- src_assets_doctor
- src_assets_admin
- src_assets_medicine
- App.jsx
- src_assets_staff
- seed.js
- react
- What You Must Do When Invoked
- 🏥 ProHealth — Hospital Management System (HMS)
- AdminPortal.jsx
- StaffPortal.jsx
- PharmacyPortal.jsx
- graphify reference: extra exports and benchmark
- scripts
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
- constants.js
- client/vercel.json
- src_assets_hms_logo
- src_assets_home
- src_assets_loginbg
- src_assets_reception
- src_styles_components
- src_styles_dashboard
- src_styles_doctor_portal
- src_styles_global
- src_styles_layout
- src_styles_main
- src_styles_pages
- src_styles_pharmacy_portal
- src_styles_receptionist_portal
- src_utils_hospital
- middleware/auth.js
- index.js
- writeLog
- auditLogger.js
- invoices.js
- medicines.js
- vercel.json
- prescriptions.js
- appointments.js

## God Nodes (most connected - your core abstractions)
1. `react` - 76 edges
2. `lucide-react` - 51 edges
3. `useAuth()` - 31 edges
4. `writeLog()` - 29 edges
5. `react-router-dom` - 21 edges
6. `usePharmacy()` - 13 edges
7. `🏥 ProHealth — Hospital Management System (HMS)` - 13 edges
8. `scripts` - 12 edges
9. `express` - 12 edges
10. `What You Must Do When Invoked` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Sidebar()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/common/Sidebar.jsx → client/src/hooks/useAuth.js
- `DoctorProfile()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/doctor/pages/DoctorProfile.jsx → client/src/hooks/useAuth.js
- `ReceptionDashboard()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/receptionist/pages/ReceptionDashboard.jsx → client/src/hooks/useAuth.js
- `StaffSidebar()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/staff/layout/StaffSidebar.jsx → client/src/hooks/useAuth.js
- `PharmacyProvider()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/context/PharmacyContext.jsx → client/src/hooks/useAuth.js

## Import Cycles
- None detected.

## Communities (54 total, 28 thin omitted)

### Community 0 - "patients.js"
Cohesion: 0.26
Nodes (7): getLogs(), create(), getAll(), getOne(), requireRole(), router, router

### Community 1 - "lucide-react"
Cohesion: 0.09
Nodes (29): client_src_assets_hms_logo, client_src_assets_home, client_src_assets_loginbg, AdminSidebar(), Button(), Footer(), Navbar(), ProtectedRoute() (+21 more)

### Community 2 - "server/package.json"
Cohesion: 0.07
Nodes (27): cors, dotenv, express-async-errors, express-rate-limit, express-validator, helmet, loginLimiter, dependencies (+19 more)

### Community 3 - "client/package.json"
Cohesion: 0.05
Nodes (44): dependencies, jspdf, jspdf-autotable, lucide-react, react, react-dom, react-router-dom, devDependencies (+36 more)

### Community 7 - "App.jsx"
Cohesion: 0.14
Nodes (12): App(), router, AuthProvider(), ToastContext, ToastProvider(), client_src_styles_components, client_src_styles_dashboard, client_src_styles_global (+4 more)

### Community 9 - "seed.js"
Cohesion: 0.12
Nodes (13): ref_dotenv_config, mongoose, connectDB(), appointmentSchema, invoiceItemSchema, invoiceSchema, medicineSchema, patientSchema (+5 more)

### Community 10 - "react"
Cohesion: 0.06
Nodes (22): client_src_assets_doctor, client_src_assets_reception, AddClinicalNoteModal(), ChangePasswordModal(), LabReportsPanel(), ScheduleFollowUpModal(), DoctorAppointments(), DoctorPatients() (+14 more)

### Community 11 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 12 - "🏥 ProHealth — Hospital Management System (HMS)"
Cohesion: 0.10
Nodes (19): Building for Production, 🤝 Contributing, 🔑 Demo Credentials, 🌐 Deployment, 🌟 Features Overview, 🚀 Getting Started, GitHub Pages, Installation (+11 more)

### Community 13 - "AdminPortal.jsx"
Cohesion: 0.10
Nodes (21): client_src_assets_admin, AddUserModal(), AdminFinance(), AdminLogs(), AdminOverview(), AdminSettings(), AdminUsers(), AdminContext (+13 more)

### Community 14 - "StaffPortal.jsx"
Cohesion: 0.18
Nodes (14): client_src_assets_staff, StaffSidebar(), ChangePasswordModal(), StaffDashboard(), StaffProfile(), StaffSchedule(), StaffTasks(), INITIAL_SCHEDULE (+6 more)

### Community 15 - "PharmacyPortal.jsx"
Cohesion: 0.18
Nodes (14): client_src_assets_medicine, DoctorMedicalRecords(), PharmacyDashboard(), PharmacyDispense(), PharmacyInventory(), PharmacyOrders(), PharmacyProfile(), PharmacyReports() (+6 more)

### Community 16 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 17 - "scripts"
Cohesion: 0.10
Nodes (19): devDependencies, concurrently, name, private, scripts, build, dev, dev:all (+11 more)

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

### Community 45 - "middleware/auth.js"
Cohesion: 0.27
Nodes (7): bcryptjs, jsonwebtoken, login(), me(), verifyToken(), userSchema, router

### Community 46 - "index.js"
Cohesion: 0.24
Nodes (8): express, ref_path, ref_url, bookAppointment(), app, __dirname, router, router

### Community 47 - "writeLog"
Cohesion: 0.50
Nodes (7): create(), getAll(), getPublicDoctors(), remove(), toggleStatus(), update(), writeLog()

### Community 48 - "auditLogger.js"
Cohesion: 0.32
Nodes (4): getMine(), updateStatus(), auditLogSchema, router

### Community 49 - "invoices.js"
Cohesion: 0.48
Nodes (5): create(), getAll(), markPaid(), refund(), router

### Community 50 - "medicines.js"
Cohesion: 0.48
Nodes (5): create(), getAll(), remove(), update(), router

### Community 52 - "prescriptions.js"
Cohesion: 0.48
Nodes (5): create(), dispense(), getAll(), reject(), router

### Community 53 - "appointments.js"
Cohesion: 0.53
Nodes (4): create(), getAll(), updateStatus(), router

## Knowledge Gaps
- **155 isolated node(s):** `name`, `private`, `version`, `type`, `homepage` (+150 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 225 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `client/package.json`, `App.jsx`, `AdminPortal.jsx`, `StaffPortal.jsx`, `PharmacyPortal.jsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `client/package.json`, `App.jsx`, `react`, `AdminPortal.jsx`, `StaffPortal.jsx`, `PharmacyPortal.jsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _155 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.08766233766233766 - nodes in this community are weakly interconnected._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04625346901017576 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._