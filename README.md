# School Backend API

A secure, production-ready REST API for managing school operations — built with NestJS, TypeORM, and SQLite.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Docker](#docker)
- [API Modules](#api-modules)
- [System Setup Flow](#system-setup-flow)
- [ERD](#erd)
- [Contributing](#contributing)
- [License](#license)

---

## About

School Backend is a NestJS REST API that handles the core data and business logic for a school management system. It covers school setup, academic structure, student enrollment, staff management, and subject assignments — all secured behind JWT authentication and role-based access control.

---

## Features

- **JWT Authentication** — login, logout, change password, token blocklisting via Redis
- **Role-Based Access Control** — `system_admin`, `school_admin`, `teacher`
- **Academic Structure** — schools, academic years, terms, grade levels, streams, subjects
- **Student Management** — registration, enrollment, subject assignments, bulk rollover
- **Staff Management** — staff records, auto-created user accounts, class/subject teacher assignments
- **Security** — Helmet, HPP, geo-blocking (Kenya only in production), IP blocklist, honeypot traps
- **Rate Limiting** — Redis-backed throttling (short: 100/4s, medium: 500/30s, long: 2000/80s)
- **Swagger Docs** — auto-generated at `/swagger` in development
- **Strict Validation** — `class-validator` DTOs, unknown fields rejected, responses shaped via `plainToInstance`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS](https://nestjs.com/) v11 |
| Language | TypeScript |
| Database | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| ORM | [TypeORM](https://typeorm.io/) |
| Cache / Rate Limit Store | [Redis](https://redis.io/) (ioredis) |
| Auth | JWT + Passport |
| Validation | class-validator / class-transformer |
| API Docs | Swagger (OpenAPI) |
| Security | Helmet, HPP, geoip-lite, custom middleware |
| Package Manager | [pnpm](https://pnpm.io/) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **Redis** instance (local or remote)

### Installation

```bash
# 1. Clone the repo
git clone <repo-url>
cd school-backend

# 2. Approve native build dependencies (required for better-sqlite3)
pnpm approve-builds

# 3. Install dependencies
pnpm install

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your values
```

See [`.env.example`](.env.example) for all required environment variables.

---

## Usage

```bash
# Development (with watch mode)
pnpm start:dev

# Production build
pnpm build
pnpm start:prod

# Run tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

- API base: `http://localhost:3000`
- Swagger UI (dev only): `http://localhost:3000/swagger`

### Docker

```bash
# Build the image
docker build -t school-backend .

# Run the container (maps localhost:3001 → container:3000)
docker run -p 3001:3000 --env-file .env school-backend
```

- API base: `http://localhost:3001`
- Make sure your `.env` is populated before running — see [`.env.example`](.env.example) for all required variables

---

## API Modules

| Module | Base Route | Role Required | Description |
|---|---|---|---|
| Auth | `/auth` | Public / Any | Register, login, logout, change password, `GET /auth/me` |
| Schools | `/schools` | `system_admin` | Create school + initial admin staff in one request |
| Academic Years | `/academic-years` | `school_admin` | Manage academic years, set current |
| Terms | `/terms` | `school_admin` | Terms within an academic year, set current |
| Grade Levels | `/grade-levels` | `school_admin` | Grade/class levels with sort order |
| Streams | `/streams` | `school_admin` | Streams within a grade level, count enrollments |
| Subjects | `/subjects` | `school_admin` | Subject catalogue per school |
| Grade Subjects | `/grade-subjects` | `school_admin` | Assign subjects to grade levels |
| Staff | `/staff` | `school_admin` | Staff CRUD, auto-creates user account with temp password |
| Class Teachers | `/class-teachers` | `school_admin` | View class teacher assignments (assigned via `/staff`) |
| Subject Teachers | `/subject-teachers` | `school_admin` | View subject teacher assignments (assigned via `/staff`) |
| Students | `/students` | `school_admin` | Student records, lookup by admission number or stream |
| Student Enrollment | `/student-enrollments` | `school_admin` | Enroll students, bulk rollover, complete term |
| Subject Assignments | `/subject-assignments` | `school_admin` | Assign subjects to enrolled students, bulk assign |
| User Accounts | `/user-accounts` | `school_admin`, `system_admin` | Manage accounts, reset passwords, toggle active |

---

## System Setup Flow

The system has a strict dependency order. Each step requires the previous ones to exist.

```
1. SYSTEM SETUP (system_admin)
   └── POST /schools/create
         ├── Creates the School
         └── Creates the first School Admin staff member
               └── Auto-creates a UserAccount with a TempPassword

2. ACADEMIC STRUCTURE (school_admin)
   └── POST /academic-years/create        ← requires: school
         └── POST /terms/create/:schoolId ← requires: academic year

   └── POST /grade-levels/create          ← requires: school
         └── POST /streams/create         ← requires: grade level

   └── POST /subjects/create              ← requires: school
         └── POST /grade-subjects/create  ← requires: grade level + subject

3. STAFF (school_admin)
   └── POST /staff/create
         ├── Creates Staff record
         └── Auto-creates UserAccount (role: school_admin | teacher)
               └── POST /staff/assign-class-teacher   ← requires: staff + stream + academic year
               └── POST /staff/assign-subject-teacher ← requires: staff + grade subject + stream + academic year

4. STUDENTS (school_admin)
   └── POST /students/create              ← requires: school
         └── POST /student-enrollments/enroll
               ├── requires: student + stream + academic year + term
               └── POST /subject-assignments/bulk
                     └── requires: enrollment + student + grade level
```

**Key rules:**
- A school must exist before anything else can be created
- Academic years and grade levels are independent of each other but both require a school
- Terms require an academic year; streams require a grade level
- Grade subjects link a grade level to a subject — both must exist first
- Staff creation automatically creates a user account — no separate step needed
- Students must be enrolled before subjects can be assigned to them
- `bulk rollover` (`POST /student-enrollments/bulk-rollover`) copies all completed enrollments from one term to another

---

## ERD

The core entity-relationship diagram is available at [`erds/cbc_school_erd_core.html`](erds/cbc_school_erd_core.html) — open it in a browser.

> **Note:** The ERD includes some entities that are not yet implemented in the codebase and there are no plans to implement them. Assessment (`Grades` / `Results`) and Finance (`Fees` / `Payments`) features are out of scope for this project.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Run `pnpm lint` before submitting. Prettier + ESLint configs are included.

---

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) — © 2026 Sylvester Mwinzi.
