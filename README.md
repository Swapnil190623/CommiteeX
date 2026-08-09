CampusHub 🎓

A modern college community and event management platform built for students, communities, faculty, and administrators.

CampusHub brings college communities, events, registrations, announcements, attendance, results, certificates, and notifications into one unified platform.

Built as an MVP for college use, the project focuses on a clean user experience, practical workflows, and a maintainable architecture.

✨ Overview

Managing college communities and events often involves disconnected tools, spreadsheets, forms, messaging groups, and manual attendance.

CampusHub aims to bring these workflows together.

With CampusHub, students can discover and register for events, communities can manage their activities, faculty can monitor participation, and administrators can manage the overall platform.

Students
   │
   ├── Discover Events
   ├── Register
   ├── Track My Events
   ├── Join Communities
   ├── View Announcements
   └── Access Certificates
            │
            ▼
        CampusHub
            │
     ┌──────┼──────┐
     ▼      ▼      ▼
Community Faculty Admin
🚀 Core Features
👨‍🎓 Student
Personalized dashboard
Browse upcoming events
View event details
Register for events
View registered events
Event attendance
Certificates
Community discovery
Announcements
Notifications
Profile management
🏫 Community Management
Community profiles
Community members
Community leadership
Event management
Event organizers
Announcements
Registration management
Attendance management
Event results
👨‍🏫 Faculty
View communities
Monitor events
View registrations
Monitor participation
Access relevant announcements
🛠️ Administration
Platform overview
User management
Community management
Event management
Announcements
Platform-level monitoring
🎨 Design System

CampusHub follows a clean, modern, premium college-tech aesthetic.

The UI is based on the project's Design.md specification and the existing Bolt/Lovable MVP prototype.

Design principles
Clean layouts
Royal-blue primary accent
Soft surfaces
Rounded cards
Subtle shadows
Clear typography hierarchy
Minimal visual noise
Responsive layouts
Accessible interactions
Subtle animations
Typography
Headings → Plus Jakarta Sans
Body/UI  → Inter
UI philosophy

Simple enough for students. Powerful enough for communities.

The design prioritizes clarity over unnecessary visual complexity.

🧑‍💻 Technology Stack
Frontend
Technology	Purpose
React	UI development
Vite	Development/build tooling
Tailwind CSS	Styling
Framer Motion	Animations & transitions
React Router DOM	Routing
Axios	API requests
TanStack Query	Server state & caching
Zustand	Lightweight client state
React Hook Form	Form handling
Zod	Validation
Lucide React	Icons
Sonner	Toast notifications
date-fns	Date/time utilities
Backend
Technology	Purpose
Supabase	Backend platform
PostgreSQL	Database
Supabase Auth	Authentication
Supabase Storage	File storage
Row Level Security	Data access control
🏗️ Architecture

CampusHub intentionally follows a simple frontend architecture.

We don't want unnecessary layers or over-engineering.

src/
│
├── components/
│   └── Reusable UI components
│
├── pages/
│   └── Application pages/screens
│
├── services/
│   └── API/backend services
│
├── App.jsx
│   └── Application routing
│
├── main.jsx
│   └── Application entry point
│
└── index.css
    └── Global styles & design tokens
Responsibility
components/
    ↓
Reusable UI

pages/
    ↓
Screens

services/
    ↓
Backend/API communication

App.jsx
    ↓
Routing
🔄 Data Flow

For server-side data, the application follows:

┌──────────────┐
│     Page     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ TanStack Query   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│    Services      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│      Axios       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Supabase REST API│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   PostgreSQL     │
└──────────────────┘

Authentication and storage use Supabase's dedicated client capabilities:

Supabase Auth
     ↓
auth.users
     ↓
public.users
🗄️ Database

CampusHub uses PostgreSQL through Supabase.

Main tables
users
communities
community_members

events
event_organizers
registrations
attendance
event_results

announcements
notifications

certificates
User roles

The application currently supports:

student
community_head
faculty
admin

The role determines the appropriate navigation, permissions, and application experience.

🔐 Security

CampusHub uses Supabase Row Level Security (RLS) to control access to application data.

The database is not treated as an open API.

Access is controlled through:

Authentication
      ↓
User identity
      ↓
Application role
      ↓
RLS policies
      ↓
Authorized data

Storage buckets are also protected using appropriate storage policies.

📦 Storage

Supabase Storage is used for application assets such as:

Community images
Event posters
Event banners
Certificates
Other uploaded assets

The MVP keeps storage intentionally simple and avoids unnecessary bucket complexity.

🧭 Application Roles
Student
Dashboard
Events
My Events
Communities
Announcements
Notifications
Certificates
Profile
Community Head
Dashboard
Events
Registrations
Attendance
Team
Communities
Announcements
Results
Faculty
Dashboard
Events
Communities
Registrations
Announcements
Admin
Overview
Users
Communities
Events
Announcements
📁 Frontend Development Philosophy

CampusHub follows a few simple rules.

1. Pages are screens
pages/

contains actual application screens.

2. Components are reusable
components/

contains reusable UI.

3. Services handle backend communication
services/

contains API/database operations.

4. App.jsx handles routing

All application routes are maintained in:

App.jsx
5. Keep it simple

We intentionally avoid unnecessary architectural layers.

No unnecessary:

repositories/
factories/
adapters/
domain/
use-cases/

unless the project genuinely requires them.

🎨 UI Development

The UI is based on two primary references:

Design System
Design.md

Defines:

Colors
Typography
Spacing
Components
Layout
Motion
Accessibility
Responsive behavior
MVP Prototype

The existing Bolt/Lovable prototype provides:

Page layouts
UI components
Interaction patterns
Navigation
Dashboard designs
Event interfaces
Community interfaces

The prototype is used as a visual and UX reference, while the actual application connects to our real Supabase backend.

📱 Responsive Design

CampusHub is designed for:

Mobile
   ↓
Tablet
   ↓
Desktop
   ↓
Large Desktop

The desktop experience uses a sidebar-based application shell.

On smaller screens, the sidebar transitions into a mobile navigation/drawer.

⚡ Installation

Clone the repository:

git clone <repository-url>

Navigate into the project:

cd campushub

Install dependencies:

npm install

Start the development server:

npm run dev
🔑 Environment Variables

Create a .env file in the project root.

Example:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Never commit private keys, service-role keys, or other secrets to Git.

🧪 Development Workflow

The project is developed incrementally.

Design
  ↓
Component
  ↓
Page
  ↓
Service
  ↓
API
  ↓
Supabase
  ↓
Real Data

We first reproduce the approved UI and then connect it to the actual backend.

🛣️ MVP Roadmap
Phase 1 — Foundation
 Database schema
 Database constraints
 RLS
 Storage
 Seed data
 Frontend setup
 Routing
 API layer
 Authentication
Phase 2 — Student Experience
 Dashboard
 Events
 Event details
 Registration
 My Events
 Communities
 Announcements
 Notifications
 Certificates
Phase 3 — Community Management
 Community dashboard
 Create/manage events
 Registration management
 Attendance
 QR attendance
 Event results
 Announcements
 Community members
Phase 4 — Faculty & Administration
 Faculty dashboard
 Admin dashboard
 User management
 Community management
 Event management
 Platform monitoring
Phase 5 — Polish
 Responsive refinement
 Accessibility
 Loading states
 Empty states
 Error handling
 Performance optimization
 Final UI polish
🧩 Development Principles
Keep the database as the source of truth

Don't invent frontend fields that don't exist in the database.

Reuse components

If the same UI appears twice, make it reusable.

Don't over-engineer

Prefer:

simple + readable

over:

complex + "enterprise"
Don't blindly copy the prototype

Use the Bolt/Lovable project for its UI and UX, but adapt it to our actual architecture and backend.

Build real features

Mock data should gradually be replaced with real Supabase data through Axios and TanStack Query.

🎯 Project Goal

CampusHub is being developed as an MVP for college communities and events.

The goal isn't to build an unnecessarily complicated enterprise platform.

The goal is to create a platform that is:

Simple. Useful. Modern. Maintainable.

A single place where students can discover opportunities, communities can organize activities, faculty can participate, and administrators can manage the campus ecosystem.
