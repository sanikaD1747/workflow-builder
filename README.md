# AI Workflow Builder

**Live Application Links:**
- **Frontend App:** [https://workflow-builderfrontend.netlify.app/](https://workflow-builderfrontend.netlify.app/)
- **Backend API:** [https://workflow-builder-backend-8f4y.onrender.com/api](https://workflow-builder-backend-8f4y.onrender.com/api)

A robust, full-stack web application designed for the Full-Stack Engineer Technical Assessment. It allows users to design, execute, and monitor multi-step AI processing pipelines using the Google Gemini LLM.

## 🎯 Implemented Features

- **Workflow Builder & Execution:** Create custom AI pipelines with unique contextual steps (Clean Text, Summarize, Extract Key Points, Tag Category) and process them sequentially with real-time outputs natively rendered.
- **Run History:** View details of the last 5 workflow executions locally isolated per user account.
- **Health Dashboard:** Live monitoring interface detailing the connectivity status of the Backend, MongoDB, and Gemini API. Gracefully handles inner-platform errors.
- **User Authentication (JWT):** Secure registration, login mechanisms, and route isolation ensuring workflows and runs belong to authenticated sessions exclusively.
- **Robust Input Validation (Zod):** End-to-end type safety, validating API schemas for workflow creation, processing execution, and user models.
- **Automated Test Suites (Jest & Vitest):** Verifiable component-level assertions and integration testing metrics ensuring robust reliability across the frontend elements and strict backend controller endpoints.
- **Fault Tolerance & Scale:** Engineered backoff strategies overriding aggressive 15 RPM LLM free-tier constraints natively. Dynamically maps onto a multi-key round-robin logic layer multiplying scale capacity globally and implementing grace-fall mock outputs when entirely saturated.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM 6
- Vitest & React Testing Library

**Backend:**
- Node.js v18+
- Express.js
- Mongoose 8 / MongoDB
- Zod (Validation Middleware)
- Jest & mongodb-memory-server
- Google Gemini (gemini-2.5-flash)

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (running locally or a MongoDB Atlas URI)
- Google Gemini API key(s)

### 1. Backend Setup
```bash
cd backend
yarn install

# Create environment file
cp .env.example .env
```

### 2. Frontend Setup
```bash
cd frontend
yarn install
```

### 3. Running the Application
Open two terminal windows:
```bash
# Terminal 1: Start Backend (Port 8001)
cd backend
yarn dev

# Terminal 2: Start Frontend (Port 3000)
cd frontend
yarn dev
```

## 🔐 Environment Variables

### Backend (`backend/.env`)
Create an `.env` file in the backend directory with these variables:
```env
PORT=8001
MONGO_URL=mongodb://localhost:27017/workflow-builder
# Note: You can provide a single key or a comma-separated list of keys for round-robin load balancing
GEMINI_API_KEY=your_api_key_1,your_api_key_2
CORS_ORIGINS=*
```

### Frontend (`frontend/.env`)
Create an `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8001/api
```

## 🏗️ Architectural Decisions

1. **Separation of Concerns (Frontend/Backend):** Designed as a decoupled system allowing Independent scaling. React + Vite provides a fast, modern SPA experience, while Node/Express handles the heavy workflow processing operations and secure database transactions.
2. **Sequential LLM Processing Matrix:** To ensure step context isn't lost, the workflows are evaluated serially rather than in parallel chunks. The output of Step N naturally becomes the input for Step N+1.
3. **Graceful Fault Tolerance (Round-Robin LLM Keys):** Free-tier AI endpoints restrict load capacity heavily (15 RPM). I introduced a round-robin API key aggregator to evenly load-balance across multiple assigned developer keys. For catastrophic rate limits, requests dynamically degrade with mock-data injections preventing frontend lockups.
4. **Zod Validation Middleware:** Instead of manually writing conditionals, a `validate.js` Express middleware intercepts incoming requests and parses them strictly against Zod schemas, yielding precise array-based error messaging natively.
5. **JWT Authentication & Multi-Tenancy:** By associating a `userId` field to `Workflow` and `Run` MongoDB models, users are isolated from seeing/accessing each other's execution data, effectively turning the application into a multi-tenant SaaS architecture.

*Note: Code is intentionally self-explanatory, strictly typed where applicable, and heavily commented for logic sections.*
