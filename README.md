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

Create `apps/api/.env` and `apps/web/.env` before starting the app.

### API environment variables

Set these values in `apps/api/.env`:

- `NODE_ENV`: `development` or `production`.
- `PORT`: API port, usually `5000`.
- `CLIENT_URL`: Frontend URL allowed for CORS and cookies, usually `http://localhost:5173`.
- `MONGO_URI`: MongoDB connection string.
- `JWT_ACCESS_SECRET`: Strong secret for access tokens.
- `JWT_REFRESH_SECRET`: Strong secret for refresh tokens.
- `ACCESS_TOKEN_TTL`: Access token lifetime, for example `15m`.
- `REFRESH_TOKEN_TTL_DAYS`: Refresh token lifetime in days.
- `COOKIE_DOMAIN`: Optional cookie domain for production deployments.
- `MAIL_FROM`: Sender name and email used for auth emails.
- `GOOGLE_CLIENT_ID`: Google OAuth client ID for Google sign in.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for image uploads.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

### Web environment variables

Set these values in `apps/web/.env`:

- `VITE_API_URL`: API base URL, for example `http://localhost:5000/api/v1`.

### Role based access

The app uses both backend and frontend guards.

- Backend authentication is handled by `authenticate`, which reads the bearer token and loads the current user.
- Backend role checks are handled by `authorize('admin', 'teacher')` style middleware on protected API routes.
- Frontend session bootstrapping happens through `/auth/refresh` and `/auth/me`.
- Frontend route protection is handled by `RequireAuth` for signed-in pages and `RequireRole` for role-specific pages.

Current route access pattern:

- `admin`: Admin console and management surfaces.
- `teacher`: Teacher console plus catalog, question, and test management.
- `student`: Student console and learner-only flows.

To add a new protected page, guard the route in `apps/web/src/routes/index.jsx` with `RequireAuth` or `RequireRole`, and protect the matching API route with `authenticate` plus `authorize`.
