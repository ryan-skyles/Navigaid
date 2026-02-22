# GovAid Assistance

## App Summary
GovAid Assistance is a full-stack web application prototype designed to help individuals locate and understand government aid programs, particularly housing-related assistance. The primary user is an applicant who may feel overwhelmed by complex eligibility requirements and unclear processes. The application provides a guided, chat-style experience to make navigating available resources more intuitive and approachable.
This iteration introduces a backend service and persistent data layer, transforming the application from a static frontend into a data-driven system. A PostgreSQL database stores system data using the schema defined in /db/schema.sql, with realistic sample records provided in /db/seed.sql. The implemented vertical slice enables persistent chat messaging: when a user sends a message in the Search Results view, it is saved to the database through the Express API and immediately rendered in the UI. Refreshing the page confirms the message persists.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, React Query
- **Backend:** Node.js, Express, CORS, dotenv
- **Database:** PostgreSQL (`pg` driver)
- **Authentication:** Not implemented yet (planned future work)
- **External APIs/Services:** None required for the vertical slice in this iteration

## Architecture Diagram
```mermaid
flowchart LR
    U[User] -->|Clicks Send, types message| FE[Frontend React App\n(Vite on :5173)]
    FE -->|HTTP GET/POST /api/sessions/:id/messages| BE[Backend Express API\n(Node on :3001)]
    BE -->|SQL queries| DB[(PostgreSQL aiddb)]
    DB -->|Rows returned| BE
    BE -->|JSON response| FE
    FE -->|Updated thread shown| U
```

## Prerequisites
Install the following tools:

1. **Node.js (LTS)** + npm  
   Install: https://nodejs.org/
2. **PostgreSQL** (server + `psql` client)  
   Install: https://www.postgresql.org/download/
3. **Git**  
   Install: https://git-scm.com/downloads

Verify installations:

```bash
node -v
npm -v
psql --version
git --version
```

## Installation and Setup

1. **Clone the repository**
```bash
git clone <https://github.com/ryan-skyles/GovAidAssistance.git>
cd GovAidAssistance
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```
3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Create database** (example using default user)
```bash
createdb aiddb
```

5. **Run schema and seed scripts**
```bash
psql -d aiddb -f db/schema.sql
psql -d aiddb -f db/seed.sql
```

6. **Configure backend environment variables**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` as needed for your local PostgreSQL credentials.

6. **(Optional) Configure frontend API base URL**  
If your backend runs somewhere other than `http://localhost:3001`, create `frontend/.env`:
```bash
VITE_API_BASE_URL=http://localhost:3001
```

## Running the Application

Start backend (Terminal 1):
```bash
npm run dev:backend
```

Start frontend (Terminal 2):
```bash
npm run dev:frontend
```

Open in browser:
- Frontend: `http://localhost:8080`
- Backend health check: `http://localhost:3001/health`

## Verifying the Vertical Slice (Persistent Chat Message)

### Feature behavior
The **Send** button on the Search Results page now performs a full stack flow:
1. Frontend sends `POST /api/sessions/1/messages`
2. Backend inserts into `chat_message`
3. Backend returns inserted message JSON
4. Frontend appends/render the message immediately
5. Refresh still shows the message because it reloads from DB (`GET /api/sessions/1/messages`)

### Manual verification steps
1. Start backend + frontend.
2. Navigate to **Search Results** (`/results`).
3. Type a message and click the **Send** button.
4. Confirm the message appears in the chat thread.
5. Refresh the browser page.
6. Confirm the same message is still visible.

### Database verification (SQL)
Run this query to verify persisted messages for the demo session:

```bash
psql -d aiddb -c "SELECT message_id, session_id, sender_type, message_text, timestamp FROM chat_message WHERE session_id = 1 ORDER BY message_id DESC LIMIT 10;"
```

