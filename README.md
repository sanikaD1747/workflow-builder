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
