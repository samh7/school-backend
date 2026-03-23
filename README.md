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
- [API Modules](#api-modules)
- [Contributing](#contributing)

---

## About

School Backend is a NestJS-based REST API that handles the core data and business logic for a school management system. It covers everything from school setup and academic structure to student enrollment, staff management, and subject assignments — all secured behind JWT authentication and role-based access control.

---

## Features

- **JWT Authentication** — login, logout, change password, token blocklisting via Redis
- **Role-Based Access Control** — `system_admin`, `school_admin`, `teacher`
- **Academic Structure** — schools, academic years, terms, grade levels, streams, subjects
- **Student Management** — registration, enrollment, subject assignments
- **Staff Management** — staff records, class teacher and subject teacher assignments
- **Security Hardening** — Helmet, HPP, geo-blocking (Kenya only in production), IP blocklist, honeypot traps
- **Rate Limiting** — Redis-backed throttling with short/medium/long windows
- **Swagger Docs** — auto-generated at `/swagger` in development
- **Validation** — strict DTO validation with `class-validator`, unknown fields rejected

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

**.env variables:**

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `3000`) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | Path to SQLite file (e.g. `./SCHOOL_DATABASE.db`) |
| `JWT_ACCESS_TOKEN_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `30d`) |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password |
| `REDIS_DB` | Redis DB index |
| `FRONTEND_URL` | Allowed CORS origin |

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

---

## API Modules

| Module | Base Route | Description |
|---|---|---|
| Auth | `/auth` | Register, login, logout, change password |
| Schools | `/schools` | School CRUD |
| Academic Years | `/academic-years` | Manage academic years per school |
| Terms | `/terms` | Terms within an academic year |
| Grade Levels | `/grade-levels` | Grade/class levels |
| Streams | `/streams` | Streams within a grade level |
| Subjects | `/subjects` | Subject catalogue |
| Grade Subjects | `/grade-subjects` | Assign subjects to grade levels |
| Students | `/students` | Student records |
| Student Enrollment | `/student-enrollments` | Enroll students into streams/terms |
| Student Subject Assignment | `/student-subject-assignments` | Assign subjects to students |
| Staff | `/staff` | Staff records |
| Class Teachers | `/class-teachers` | Assign teachers to classes |
| Subject Teachers | `/subject-teachers` | Assign teachers to subjects |
| User Accounts | `/user-accounts` | Manage system user accounts |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Please follow the existing code style (Prettier + ESLint configs are included). Run `pnpm lint` before submitting.
