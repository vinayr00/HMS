# 🏥 ProHealth — Hospital Management System (HMS)

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.13.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge)]()

> **ProHealth HMS** is a comprehensive, enterprise-grade Hospital Management System built with **React 19**, **Vite**, and **React Router v7**. It streamlines healthcare operations across patient onboarding, clinical consultations, reception queues, pharmacy inventory, nursing staff workflows, and administrative governance.

---

## 📑 Table of Contents

- [Features Overview](#-features-overview)
- [Role-Based Portals](#-role-based-portals)
- [Demo Credentials](#-demo-credentials)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [Deployment](#-deployment)
  - [Vercel](#vercel)
  - [GitHub Pages](#github-pages)
- [State Management & Security](#-state-management--security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features Overview

- 🔒 **Multi-Role Authentication & RBAC**: Strict route protection guaranteeing access control for 6 distinct roles.
- 🩺 **Doctor Workstation**: Digital consultation room, vitals logging, diagnosis records, and electronic prescriptions.
- 📋 **Reception & Patient Triage**: Rapid patient registration, queue management, doctor schedule tracking, and instant PDF invoice generation.
- 💊 **Smart Pharmacy Management**: Real-time drug inventory tracking, low-stock notifications, prescription dispensing, and expenditure analytics.
- 🧹 **Hospital Staff & Duty Rostering**: Duty shifts, ward tasks board, equipment status tracking, and shift handovers.
- 📊 **Executive Admin Dashboard**: Financial analytics, revenue streams, audit trail logs, user permissions, and hospital configurations.
- 📄 **Dynamic PDF Billing**: Automated invoice generation powered by `jspdf` and `jspdf-autotable`.
- ⚡ **Ultra-Fast Performance**: Built on top of Vite 7 with blazing-fast HMR and optimized asset bundling.

---

## 🏛️ Role-Based Portals

| Portal | Role | Primary Responsibilities |
| :--- | :--- | :--- |
| **Public & Patient** | `Guest / Patient` | Browse medical departments, check doctor availability, review OPD hours, and submit appointment requests. |
| **Doctor Portal** | `doctor` | View appointment queues, examine clinical histories, input consultation notes & diagnosis, and prescribe medicines. |
| **Reception Portal** | `receptionist` | Register new walk-in or booked patients, organize daily token queues, assign doctor visits, and generate PDF billing statements. |
| **Pharmacy Portal** | `pharmacy` | Manage pharmaceutical stock, monitor expiry dates, process incoming doctor prescriptions, and log dispensed medications. |
| **Staff Portal** | `staff` | Oversee daily cleaning/ward tasks, track duty rosters and schedules, manage facility maintenance, and update shift logs. |
| **Admin Portal** | `admin` | Full system audit logs, user management & credential controls, financial revenue tracking, and global settings. |

---

## 🔑 Demo Credentials

Use the following pre-configured credentials to explore different roles and workflows in the application:

| Role | User ID | Password | Access Portal Route |
| :--- | :--- | :--- | :--- |
| **Doctor** | `DOC001` | `doc@123` | `/portal/doctor` |
| **Receptionist** | `REC001` | `rec@123` | `/portal/receptionist` |
| **Pharmacy** | `PHA001` | `pha@123` | `/portal/pharmacy` |
| **Staff** | `STF001` | `stf@123` | `/portal/staff` |
| **Admin** | `ADM001` | `admin@123` | `/portal/admin` |

> ℹ️ **Note**: Walk-in patients can self-register or request appointments without authentication via the **Patient Portal** at `/patient` or `/patient/form`.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/)
- **Build Tool & Bundler**: [Vite 7](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (Data router with `createBrowserRouter`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document & Export Engine**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Styling**: Custom CSS Architecture with modular design tokens, CSS variables, glassmorphic UI, and responsive grids.
- **Code Quality**: [ESLint 9](https://eslint.org/)

---

## 📂 Project Architecture

```plaintext
HMS/
├── client/                     # Frontend Application (React 19 + Vite 7)
│   ├── public/                 # Static assets and favicon
│   ├── src/
│   │   ├── app/                # Root configuration & routing (App.jsx, router.jsx)
│   │   ├── assets/             # Images, portal backgrounds & logos
│   │   ├── components/         # Modular UI & role portal components (admin, doctor, etc.)
│   │   ├── context/            # React Contexts (Auth, Pharmacy, Reception, Admin, Staff)
│   │   ├── hooks/              # Custom React hooks (useAuth, etc.)
│   │   ├── layouts/            # Base layouts (PublicLayout, AuthLayout)
│   │   ├── pages/              # Page-level route views & role portals
│   │   ├── services/           # API services & HTTP client
│   │   ├── styles/             # Global styles, variables, component CSS
│   │   └── utils/              # Utility helpers & formatters
│   ├── .env                    # Frontend environment variables (VITE_API_URL)
│   ├── index.html              # HTML entry point
│   ├── package.json            # Client dependencies and npm scripts
│   ├── vercel.json             # Client SPA rewrite rules
│   └── vite.config.js          # Vite config with backend dev proxy
│
├── server/                     # Backend Application (Express + MongoDB)
│   ├── config/                 # Database connection & configurations
│   ├── controllers/            # Route controllers for business logic
│   ├── data/                   # Default seeds & test data
│   ├── middleware/             # Auth, RBAC, error handling & validation
│   ├── models/                 # Mongoose schemas (User, Patient, Appointment, etc.)
│   ├── routes/                 # Express API endpoints (/api/v1/...)
│   ├── utils/                  # Audit logger & helper utilities
│   ├── .env                    # Server secrets, MongoDB URI & JWT keys
│   ├── index.js                # Server entry point
│   ├── package.json            # Backend dependencies & npm scripts
│   └── seed.js                 # Database seeding script
│
├── package.json                # Root workspace orchestrator with dev scripts
├── .gitignore                  # Project-wide gitignore rules
└── README.md                   # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: `v18.0.0` or higher (LTS recommended)
- **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)
- **MongoDB**: A running MongoDB instance (or MongoDB Atlas connection string)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vinayr00/HMS.git
   cd HMS
   ```

2. **Install all dependencies** (client and server):
   ```bash
   npm run install:all
   ```
   *(Or individually inside `client/` and `server/` via `npm install`)*

3. **Configure Environment Variables**:
   - `client/.env`:
     ```env
     VITE_API_URL=http://localhost:5000/api/v1
     ```
   - `server/.env`:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

4. **Seed the Database** (Optional):
   ```bash
   npm run seed
   ```

### Running the Development Servers

You can run both client and server together or individually:

- **Run Client & Server Concurrently**:
  ```bash
  npm run dev:all
  ```

- **Run Client Only** (Vite on http://localhost:5173):
  ```bash
  npm run dev:client
  # or: cd client && npm run dev
  ```

- **Run Server Only** (Express API on http://localhost:5000):
  ```bash
  npm run dev:server
  # or: cd server && npm run dev
  ```

### Building for Production

To build the client for production:
```bash
npm run build
# or: cd client && npm run build
```

Preview the production build locally:
```bash
npm run preview
# or: cd client && npm run preview
```

---

## 🌐 Deployment

### Vercel
The project contains a pre-configured [`vercel.json`](file:///v:/HMS/vercel.json) to handle Single Page Application (SPA) client-side route rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```
Deploy instantly by linking your GitHub repository to [Vercel](https://vercel.com/).

### GitHub Pages
To deploy via `gh-pages`:
```bash
npm run deploy
```

---

## 🔐 State Management & Security

- **Client-Side RBAC**: Routes under `/portal/*` are wrapped by `<ProtectedRoute />` components that validate both session authentication and required role privileges.
- **Context Segregation**: Each domain (`Pharmacy`, `Reception`, `Staff`, `Admin`, `Auth`) is powered by its own dedicated React Context provider to minimize unnecessary re-renders.
- **Data Persistence**: Key portal actions persist to browser storage or context stores to simulate a functional clinical ecosystem.

---

## 🗺️ Roadmap

- [ ] **Backend Integration**: Replace mock services with Node.js / Express or Go REST API.
- [ ] **Database Connection**: PostgreSQL / MongoDB for persistent electronic medical records (EMR).
- [ ] **Real-time Queue Updates**: WebSockets / Socket.io for live patient queue status across displays.
- [ ] **Telemedicine**: Integrated video consultations via WebRTC.
- [ ] **Multi-language Support**: i18n localization for diverse patient populations.

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Developed with ❤️ for modern healthcare facilities.</sub>
</div>
