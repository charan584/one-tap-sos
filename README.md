# 🚨 CampusSOS – One Tap Intelligent Emergency Response System

> **"One Tap Can Save a Life."**
> A production-ready, full-stack real-time campus emergency platform designed to empower university students to trigger an emergency alert with a single tap, instantly broadcasting their pre-registered identity, medical vitals, and live 5-second GPS telemetry to campus administrators and responders with zero extra forms or cognitive friction.

---

## 🌟 Key Capabilities & Highlights

1. **Zero-Latency Emergency Trigger**:
   - Single tap on the massive central SOS beacon.
   - **3-second radial cancel ring**: the only visible action is "Cancel SOS (False Alarm)" to prevent inadvertent triggers.
   - Zero questions, zero category dropdowns, zero confirmation dialogues.

2. **Automated Identity & Medical Dossier Transmission**:
   - As soon as the 3 seconds elapse, the system automatically pulls the pre-authenticated student record:
     - **Full Name & Student ID**
     - **Blood Group** (e.g. O+, A+, B-)
     - **Known Medical Conditions & Severe Allergies** (e.g., Penicillin allergy, Asthma, Diabetes)
     - **Emergency Kin Contact & Direct Dial**
     - **Department, Cohort Year, and Hostel Block**
     - **Profile Photo**

3. **5-Second Continuous Live GPS Loop**:
   - Captures precision coordinates and matches them to campus landmark geofences (e.g., *Green Library 2nd Floor, Gates CS Labs, Hostel Block C*).
   - Dynamically streams GPS telemetry updates every 5 seconds over WebSockets (`POST /api/location/update` + Socket.IO ping).

4. **Tri-Tier Intelligent Auto-Routing Engine**:
   - Multi-tier triage matrix that instantly auto-assigns:
     - **Tier 1: Nearest Campus Security Patrol** (Haversine proximity calculation)
     - **Tier 2: Rapid Medical Response EMTs** (prioritized on medical alert flags)
     - **Tier 3: EOC Campus Dispatch Commander**

5. **Apple / Linear / Notion Inspired Aesthetics**:
   - Deep obsidian glassmorphism (`backdrop-blur-xl`, frosted borders, glowing neon radar pulses).
   - Custom Web Audio API synthesizer for audible countdown ticks, continuous dual-tone emergency horns, dispatch chimes, and SLA alerts.

6. **Synchronized Split-Screen Hackathon Demo Mode**:
   - Dedicated `/split-demo` view rendering both the Student mobile screen on the left and the Admin Dispatch Command Center on the right side-by-side in real-time.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Client** | React 19, Vite, Tailwind CSS, Lucide React, Leaflet, Canvas Confetti |
| **Charts & Analytics** | Recharts (AreaCharts, BarCharts, SLA compliance widgets) |
| **Real-Time Mesh** | Socket.IO Client & Server (Rooms: `admin_room`, `student_{id}`) |
| **Audio Engine** | Web Audio API (Multi-oscillator synthesized horn & countdown ticks) |
| **Backend API** | Node.js, Express.js, CORS, Morgan, Dotenv |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt password hashing, RBAC middleware |
| **Data Layer** | MongoDB & Mongoose schemas with seamless In-Memory resilient fallback |

---

## 📂 Project Structure

```
SOS/
├── package.json               # Root scripts (dev:server, dev:client, build:client)
├── server/                    # Node.js + Express + Socket.IO Backend
│   ├── .env.example           # Environment variables template
│   ├── src/
│   │   ├── config/            # DB connection & MongoDB fallback (db.js)
│   │   ├── models/            # Mongoose Schemas (Student, Admin, Emergency, Log, Responder, Location, Notification)
│   │   ├── controllers/       # Auth, Emergency, Location, Dashboard, Responder controllers
│   │   ├── middleware/        # JWT verify & requireAdmin middleware
│   │   ├── routes/            # REST API route handlers
│   │   ├── services/          # Store (Memory/Mongo) & Tri-Tier Intelligent Routing Engine
│   │   ├── socket/            # Socket.IO event handler & broadcasting
│   │   └── server.js          # Main Express server entrypoint (Port 5000)
├── client/                    # React + Vite + Tailwind Frontend
│   ├── index.html             # Google Fonts (Inter, Outfit, JetBrains Mono) & Leaflet CSS
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── components/
│       │   ├── common/        # Navbar, GlassCard, EmergencyBadge, ToastNotificationContainer
│       │   ├── landing/       # HeroSection, WorkflowDiagram, FeaturesSection, SystemArchitecture, FutureRoadmapSection, Footer
│       │   ├── student/       # OneTapSOSButton, CountdownRing, LiveTelemetryBar, MedicalSheetCard, ActiveEmergencyRadar
│       │   └── admin/         # MetricCards, LiveEmergencyTable, InteractiveLiveMap, EmergencyDetailModal, AnalyticsCharts, ResponderFleetManager
│       ├── context/           # AuthContext, SocketContext, SoundContext, ThemeContext
│       ├── pages/             # LandingPage, StudentDashboard, AdminDashboard, SplitDemoPage, LoginPage, RegisterPage, AdminLoginPage, FutureEnhancementsPage
│       ├── services/          # Axios API client & Socket.IO client instance
│       └── utils/             # Campus coordinates presets & Haversine distance calculator
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 1. Install & Launch Backend
```bash
cd server
npm install
npm start
```
*Backend will start on `http://localhost:5000`.*

### 2. Install & Launch Frontend
```bash
cd client
npm install
npm run dev
```
*Frontend will launch on `http://localhost:5173`.*

---

## 🔑 Pre-Seeded Hackathon Demo Credentials

Use the **"Demo Login"** dropdown in the navigation bar for 1-click instant login without typing:

| Persona | Email | Password | Role / Details |
| :--- | :--- | :--- | :--- |
| **Student** | `alex.rivera@campus.edu` | `password123` | CS 3rd Year • Blood O+ • Asthma/Penicillin Alert |
| **Student (Alt)** | `samantha.chen@campus.edu` | `password123` | Biomedical Eng 4th Year • Blood A+ • Type 1 Diabetes |
| **Admin Dispatcher** | `admin@campussos.edu` | `admin123` | Chief Sarah Jenkins • Campus Safety Commander |

---

## 🗺️ API Endpoints Summary

- `POST /api/auth/register` – Register new student with complete emergency profile
- `POST /api/auth/login` – Student login & JWT issuance
- `POST /api/auth/admin-login` – Campus safety administrator login
- `GET /api/auth/profile` – Retrieve authenticated student emergency dossier
- `POST /api/emergency` – Trigger zero-form SOS (captures GPS & student snapshot)
- `GET /api/emergencies` – List all campus emergencies (Pending, Accepted, On Route, Arrived, Resolved)
- `GET /api/emergency/:id` – Detailed emergency dossier with audit history
- `PUT /api/emergency/:id/accept` – Accept case & assign duty officer
- `PUT /api/emergency/:id/status` – Advance status (`On Route`, `Arrived`)
- `PUT /api/emergency/:id/resolve` – Resolve emergency with incident report
- `POST /api/location/update` – Ingest 5-second continuous GPS stream
- `GET /api/dashboard/stats` – Real-time KPI cards & charts data
- `GET /api/responders` – List active patrol fleet & EMT units
- `POST /api/responders/simulate-movement` – Step responder closer to student on map
- `POST /api/seed` – Reset and reseed fresh demo dataset
