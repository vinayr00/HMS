# Graph Report - HMS  (2026-09-19)

## Corpus Check
- 146 files · ~380,020 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .css 11, (none) 2, .example 1)

## Summary
- 552 nodes · 1047 edges · 59 communities (33 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `09f535d3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- patients.js
- middleware/auth.js
- server/package.json
- client/package.json
- src_assets_doctor
- src_assets_admin
- src_assets_medicine
- prescriptions.js
- src_assets_staff
- seed.js
- AdminPortal.jsx
- What You Must Do When Invoked
- 🏥 ProHealth — Hospital Management System (HMS)
- lucide-react
- StaffPortal.jsx
- ReceptionistPortal.jsx
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
- react
- index.js
- writeLog
- express
- invoices.js
- medicines.js
- vercel.json
- devDependencies
- appointments.js
- App.jsx
- dependencies
- scripts
- eslint.config.js
- optionalDependencies

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
- `DoctorDashboard()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/doctor/pages/DoctorDashboard.jsx → client/src/hooks/useAuth.js
- `ReceptionDashboard()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/receptionist/pages/ReceptionDashboard.jsx → client/src/hooks/useAuth.js
- `StaffSidebar()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/staff/layout/StaffSidebar.jsx → client/src/hooks/useAuth.js
- `PharmacyProvider()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/context/PharmacyContext.jsx → client/src/hooks/useAuth.js

## Import Cycles
- None detected.

## Communities (59 total, 26 thin omitted)

### Community 0 - "patients.js"
Cohesion: 0.31
Nodes (5): create(), getAll(), getOne(), auditLogSchema, router

### Community 1 - "middleware/auth.js"
Cohesion: 0.31
Nodes (6): bcryptjs, jsonwebtoken, login(), me(), verifyToken(), userSchema

### Community 2 - "server/package.json"
Cohesion: 0.07
Nodes (27): cors, dotenv, express-async-errors, express-rate-limit, express-validator, helmet, loginLimiter, dependencies (+19 more)

### Community 3 - "client/package.json"
Cohesion: 0.12
Nodes (15): homepage, @rollup/rollup-linux-x64-gnu, @rollup/rollup-linux-x64-musl, @rollup/rollup-win32-x64-msvc, name, private, type, version (+7 more)

### Community 7 - "prescriptions.js"
Cohesion: 0.48
Nodes (5): create(), dispense(), getAll(), reject(), router

### Community 9 - "seed.js"
Cohesion: 0.12
Nodes (13): ref_dotenv_config, mongoose, connectDB(), appointmentSchema, invoiceItemSchema, invoiceSchema, medicineSchema, patientSchema (+5 more)

### Community 10 - "AdminPortal.jsx"
Cohesion: 0.09
Nodes (25): client_src_assets_admin, client_src_assets_doctor, AddUserModal(), AdminFinance(), AdminLogs(), AdminOverview(), AdminSettings(), AdminUsers() (+17 more)

### Community 11 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 12 - "🏥 ProHealth — Hospital Management System (HMS)"
Cohesion: 0.10
Nodes (19): Building for Production, 🤝 Contributing, 🔑 Demo Credentials, 🌐 Deployment, 🌟 Features Overview, 🚀 Getting Started, GitHub Pages, Installation (+11 more)

### Community 13 - "lucide-react"
Cohesion: 0.15
Nodes (17): client_src_assets_medicine, AddClinicalNoteModal(), LabReportsPanel(), ScheduleFollowUpModal(), DoctorPatients(), PharmacyDashboard(), PharmacyDispense(), PharmacyInventory() (+9 more)

### Community 14 - "StaffPortal.jsx"
Cohesion: 0.19
Nodes (13): client_src_assets_staff, StaffSidebar(), ChangePasswordModal(), StaffDashboard(), StaffProfile(), StaffSchedule(), StaffTasks(), INITIAL_SCHEDULE (+5 more)

### Community 15 - "ReceptionistPortal.jsx"
Cohesion: 0.15
Nodes (15): client_src_assets_reception, ReceptionAppointments(), ReceptionBilling(), ReceptionDashboard(), ReceptionQueue(), ReceptionRegistration(), ReceptionContext, ReceptionProvider() (+7 more)

### Community 16 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 17 - "scripts"
Cohesion: 0.07
Nodes (26): devDependencies, concurrently, @rollup/rollup-linux-x64-gnu, @rollup/rollup-linux-x64-musl, @rollup/rollup-win32-x64-msvc, name, optionalDependencies, @rollup/rollup-linux-x64-gnu (+18 more)

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

### Community 30 - "client/vercel.json"
Cohesion: 0.50
Nodes (3): framework, rewrites, $schema

### Community 45 - "react"
Cohesion: 0.06
Nodes (31): client_src_assets_hms_logo, client_src_assets_home, client_src_assets_loginbg, AdminSidebar(), Button(), Footer(), Navbar(), ProtectedRoute() (+23 more)

### Community 46 - "index.js"
Cohesion: 0.14
Nodes (11): ref_path, ref_url, bookAppointment(), allowedOrigins, app, corsOptions, __dirname, rawOrigins (+3 more)

### Community 47 - "writeLog"
Cohesion: 0.50
Nodes (7): create(), getAll(), getPublicDoctors(), remove(), toggleStatus(), update(), writeLog()

### Community 48 - "express"
Cohesion: 0.26
Nodes (7): express, getLogs(), getMine(), updateStatus(), requireRole(), router, router

### Community 49 - "invoices.js"
Cohesion: 0.48
Nodes (5): create(), getAll(), markPaid(), refund(), router

### Community 50 - "medicines.js"
Cohesion: 0.48
Nodes (5): create(), getAll(), remove(), update(), router

### Community 51 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, outputDirectory, rewrites, $schema

### Community 52 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, gh-pages, globals, @types/react (+3 more)

### Community 53 - "appointments.js"
Cohesion: 0.53
Nodes (4): create(), getAll(), updateStatus(), router

### Community 55 - "App.jsx"
Cohesion: 0.11
Nodes (14): App(), router, AuthContext, AuthProvider(), ToastContext, ToastProvider(), authService, client_src_styles_components (+6 more)

### Community 57 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, jspdf, jspdf-autotable, lucide-react, react, react-dom, react-router-dom

### Community 58 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy, dev, lint, predeploy, preview

### Community 60 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): ref_eslint_config, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals

### Community 61 - "optionalDependencies"
Cohesion: 0.50
Nodes (4): optionalDependencies, @rollup/rollup-linux-x64-gnu, @rollup/rollup-linux-x64-musl, @rollup/rollup-win32-x64-msvc

## Knowledge Gaps
- **177 isolated node(s):** `name`, `private`, `version`, `type`, `homepage` (+172 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 248 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `client/package.json`, `AdminPortal.jsx`, `lucide-react`, `StaffPortal.jsx`, `ReceptionistPortal.jsx`, `App.jsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `client/package.json`, `AdminPortal.jsx`, `react`, `StaffPortal.jsx`, `ReceptionistPortal.jsx`, `App.jsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `client/package.json`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _177 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `seed.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11688311688311688 - nodes in this community are weakly interconnected._