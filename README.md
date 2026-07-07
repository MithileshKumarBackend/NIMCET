# NIMCET Online Examination Platform

Production-oriented MERN monorepo for a role-based online examination platform.

## Phase 1 architecture

The first phase establishes the long-lived architecture rather than a throwaway demo:

- `apps/api`: Express API using layered modules: routes → controllers → services → repositories → Mongoose models.
- `apps/web`: React/Vite client using routes, reusable components, Redux Toolkit, TanStack Query, Axios, and Tailwind CSS.
- Cross-cutting API concerns are centralized in middleware for security, validation, authentication, RBAC, upload handling, and errors.
- Business logic lives in services. Controllers only translate HTTP input/output.

## Phase 1 scope

- Scalable folder architecture for API and React app.
- MongoDB schemas for users, refresh tokens, verification/reset tokens, audit logs, exams, subjects, topics, subtopics, questions, tests, sections, attempts, and notifications.
- JWT access tokens, refresh-token rotation with reuse-family revocation, secure cookies, email verification, Google login, forgot/reset password, logout current device, and logout all devices.
- RBAC middleware for Admin, Teacher, and Student protected routes.
- Cloudinary image upload foundation for question, option, and explanation images.

## Scripts

```bash
npm install
npm run dev:api
npm run dev:web
npm run test
```

## Environment

Copy `apps/api/.env.example` to `apps/api/.env` and provide strong secrets before running the API.
