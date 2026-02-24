# Workflow Builder

**Live Deployments:**
- **Frontend:** https://workflow-builderfrontend.netlify.app/
- **Backend API:** https://workflow-builder-backend-8f4y.onrender.com/api

A production-ready full-stack web application for designing and executing multi-step AI processing pipelines using Google Gemini LLM.

## 🎯 Features

- **Workflow Builder** - Create custom AI pipelines with 2-4 unique processing steps
- **Workflow Execution** - Run workflows sequentially with real-time intermediate outputs
- **Run History** - View the last 5 workflow executions with full details
- **Health Dashboard** - Monitor system status (Backend, MongoDB, LLM)
- **User Authentication** - Secure JWT-based login, registration, and isolated user data
- **Robust Validation** - End-to-end type safety and request validation with Zod
- **Automated Testing** - Backend API and frontend component test suites using Jest & Vitest
- **Fault Tolerance** - Exponential backoff and graceful LLM fallbacks for API rate limits

## 🛠️ Tech Stack

### Backend
- Node.js v18+
- Express 4
- Mongoose 8
- MongoDB
- Google Gemini (gemini-2.5-flash)

### Frontend
- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM 6
- Axios

## 📦 Project Structure

```
/
├── backend/              # Node.js + Express backend
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js        # Entry point
│
└── frontend/            # React + Vite frontend
    ├── src/
    │   ├── pages/       # Page components
    │   ├── services/    # API client
    │   └── App.jsx      # Main app
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd workflow-builder
```

2. **Backend Setup**
```bash
cd backend
yarn install

# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY to .env
```

3. **Frontend Setup**
```bash
cd ../frontend
yarn install
```

4. **Start MongoDB**
```bash
mongod --dbpath /data/db
```

5. **Run the application**

Backend:
```bash
cd backend
yarn start
```

Frontend:
```bash
cd frontend
yarn dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions to:
- Railway (Recommended)
- Render
- Vercel + Railway

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8001
MONGO_URL=mongodb://localhost:27017/workflow-builder
GEMINI_API_KEY=your_api_key_here
CORS_ORIGINS=*
```

### Frontend (.env)
```env
VITE_API_URL=/api
```

## 📡 API Endpoints

### Workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get workflow by ID
- `DELETE /api/workflows/:id` - Delete workflow

### Runs
- `POST /api/runs` - Execute workflow
- `GET /api/runs` - Get last 5 runs
- `GET /api/runs/:id` - Get run by ID

### Health
- `GET /api/health` - System health check

## 🎨 Available Processing Steps

1. **Clean Text** - Removes extra whitespace and fixes basic grammar
2. **Summarize** - Condenses input into ~5 lines
3. **Extract Key Points** - Returns bullet-point insights
4. **Tag Category** - Classifies as Technology/Finance/Health/Education/Other

## 🧪 Testing

### Backend
```bash
# Health check
curl http://localhost:8001/api/health

# Create workflow
curl -X POST http://localhost:8001/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Pipeline","steps":["clean","summarize"]}'
```

### Frontend
Open http://localhost:3000 and test:
- Create a workflow
- Execute a workflow
- View run history
- Check health dashboard

## 🔒 Security

- API keys stored in `.env` (excluded from Git)
- CORS configured for production
- Environment-based configuration
- No hardcoded credentials

## 📄 License

MIT

## 👤 Author

Created for Full-Stack Engineer Technical Assessment

## 🙏 Acknowledgments

- Google Gemini API for LLM capabilities
- MongoDB for database
- React and Node.js communities
