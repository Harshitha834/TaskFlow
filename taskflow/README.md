# TaskFlow

TaskFlow is a full-stack Project & Task Management System. Authenticated users
can create projects, break them into tasks, track priorities and due dates,
and monitor progress from a live dashboard.

Built entirely with free, open-source technologies — no paid services or
API keys required to run it locally.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

---

## Project Overview

TaskFlow follows a classic ownership hierarchy:

```
User
 └── Projects
        └── Tasks
```

Every project belongs to a user, and every task belongs to a project. All API
endpoints are scoped so a user can only ever see and modify their own data.

## Features

**Authentication**
- Register / Login with JWT access tokens
- Passwords hashed with bcrypt
- Protected routes on both frontend and backend
- Current-user (`/me`) and profile update (`/profile`) endpoints

**Projects**
- Create, view, update, delete
- Search by title
- Cascading delete (deleting a project deletes its tasks)

**Tasks**
- Create, view, update, delete, mark complete
- Priority (High / Medium / Low) and status (Pending / In Progress / Completed) badges
- Due dates, with automatic overdue detection
- Search, filter (status/priority/project), and sort (newest / due date / priority)

**Dashboard**
- Total projects, total tasks, pending, completed, and overdue counts
- Recent tasks and upcoming deadlines widgets

**UI/UX**
- Responsive, modern layout with sidebar navigation
- Toast notifications for every action
- Confirmation dialogs before destructive actions
- Empty states, loading spinners, and inline form validation

## Tech Stack

**Frontend:** React 18, Vite, React Router DOM, Redux Toolkit, Axios,
React Hook Form, Tailwind CSS, React Icons, React Hot Toast, Vitest + React
Testing Library

**Backend:** Python 3.12, FastAPI, SQLAlchemy, Pydantic v2, Alembic,
Passlib (bcrypt), python-jose (JWT), Uvicorn, Pytest

**Database:** SQLite by default for local development; PostgreSQL supported
via `DATABASE_URL` for production.

## Folder Structure

```
taskflow/
├── backend/
│   ├── alembic/                # DB migration environment
│   ├── app/
│   │   ├── auth/               # password hashing + JWT helpers
│   │   ├── core/                # settings/config
│   │   ├── database/            # SQLAlchemy engine/session
│   │   ├── models/               # ORM models (User, Project, Task)
│   │   ├── routers/             # auth, users, projects, tasks, dashboard
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   ├── utils/                # get_current_user dependency
│   │   └── main.py               # FastAPI app entry point
│   ├── tests/                   # Pytest test suite
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, forms, cards, etc.
│   │   ├── pages/                # one file per route
│   │   ├── store/                # Redux Toolkit slices
│   │   ├── services/api.js       # Axios instance + interceptors
│   │   └── tests/                # Vitest + RTL tests
│   ├── package.json
│   └── .env.example
└── README.md
```

## Installation

Prerequisites: **Node.js 18+**, **Python 3.12+**, and `pip`.

### Backend

```bash
cd taskflow/backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit values as needed
```

> **Windows / Python 3.13 note:** if `pip install` tries to compile
> `pydantic-core` or `psycopg2-binary` from source (you'll see `Building
> wheel for ... error` with Rust/Cargo output), it means pip found no
> prebuilt wheel for your Python version. The versions pinned in
> `requirements.txt` already have Python 3.13 wheels — make sure you're
> installing from a fresh virtual environment and that `pip` itself is
> up to date first: `python -m pip install --upgrade pip`. If it still
> tries to build from source, the simplest fix is to use Python 3.12 for
> the virtual environment instead of 3.13.

### Frontend

```bash
cd taskflow/frontend
npm install
cp .env.example .env
```

## Environment Variables

**backend/.env**

```
DATABASE_URL=sqlite:///./taskflow.db
# DATABASE_URL=postgresql://taskflow_user:taskflow_pass@localhost:5432/taskflow_db

SECRET_KEY=change_this_to_a_long_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

BACKEND_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**frontend/.env**

```
VITE_API_BASE_URL=http://localhost:8000
```

## Running the App

**Backend** (from `taskflow/backend`, with the virtualenv active):

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs are available at
`http://localhost:8000/docs`. Tables are created automatically on startup for
local development; to use Alembic migrations instead, run:

```bash
alembic revision --autogenerate -m "init"
alembic upgrade head
```

**Frontend** (from `taskflow/frontend`):

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint          | Description                     | Auth |
|--------|-------------------|----------------------------------|------|
| POST   | `/register`       | Create a new account             | No   |
| POST   | `/login`          | Log in, returns JWT              | No   |
| GET    | `/me`             | Get current user                 | Yes  |
| PUT    | `/profile`        | Update current user's profile    | Yes  |
| GET    | `/projects`       | List projects (supports `?search=`) | Yes |
| GET    | `/projects/{id}`  | Get one project (with tasks)      | Yes  |
| POST   | `/projects`       | Create a project                 | Yes  |
| PUT    | `/projects/{id}`  | Update a project                 | Yes  |
| DELETE | `/projects/{id}`  | Delete a project (cascades tasks)| Yes  |
| GET    | `/tasks`          | List tasks (search/status/priority/project_id/sort_by) | Yes |
| GET    | `/tasks/{id}`     | Get one task                     | Yes  |
| POST   | `/tasks`          | Create a task                    | Yes  |
| PUT    | `/tasks/{id}`     | Update a task                    | Yes  |
| DELETE | `/tasks/{id}`     | Delete a task                    | Yes  |
| GET    | `/dashboard`      | Aggregate stats + recent/upcoming | Yes |

All authenticated endpoints expect `Authorization: Bearer <token>`.

## Testing

**Backend:**

```bash
cd taskflow/backend
pytest -v
```

Covers registration, login (success/failure), and project CRUD, all against
an isolated in-memory SQLite database.

**Frontend:**

```bash
cd taskflow/frontend
npm run test
```

Covers the login form's field rendering/validation and the dashboard's
data-loading behavior.

## Future Improvements

- Role-based access control for shared/team projects
- Task comments and file attachments
- Email notifications for approaching deadlines
- Drag-and-drop Kanban board view
- Pagination and infinite scroll for large project/task lists
- Refresh tokens and token rotation
- Dark mode
