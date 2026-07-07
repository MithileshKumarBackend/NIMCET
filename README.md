# NIMCET Online Examination Platform

Production-oriented MERN monorepo for a role-based online examination platform.

## Phase 1 scope
- Scalable folder architecture for API and React app.
- MongoDB schemas for users, refresh tokens, verification/reset tokens, audit logs, exams, subjects, topics, subtopics, questions, tests, sections, attempts, and notifications.
- JWT access tokens, refresh-token rotation, secure cookies, email verification, forgot/reset password, logout current/all devices.
- RBAC middleware for Admin, Teacher, and Student protected routes.

## Scripts
```bash
npm install
npm run dev -w apps/api
npm run dev -w apps/web
npm run test -w apps/api
```
