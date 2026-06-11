# 🚀 DataSmith

<div align="center">

### AI-Powered Knowledge Workspace

Build, search, analyze, and chat with your knowledge using Agentic AI, RAG, Vector Search, and Conversational Intelligence.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![Qdrant](https://img.shields.io/badge/Qdrant-VectorDB-red)
![UV](https://img.shields.io/badge/Package_Manager-uv-blue)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📖 Overview

DataSmith is a full-stack AI SaaS platform that enables users to upload documents, create knowledge bases, retrieve information using semantic search, and interact with their data through an intelligent conversational interface.

The platform combines:

- 🤖 Agentic AI Workflows
- 📚 Retrieval-Augmented Generation (RAG)
- 🔍 Semantic Vector Search
- 💬 Conversational AI
- 📄 Multi-Document Processing
- 🧠 Long-Term Conversation Memory
- 🔐 JWT Authentication
- ☁️ Cloud-Native Architecture

DataSmith transforms static documents into an intelligent searchable knowledge workspace.

---

# ✨ Features

## 🤖 Agentic AI Workflow

- Intent Detection
- Planning Agent
- Retrieval Agent
- Tool Calling
- Multi-Step Reasoning
- Context-Aware Responses

---

## 📚 Retrieval Augmented Generation (RAG)

- PDF Processing
- DOCX Processing
- TXT Processing
- Intelligent Chunking
- Embedding Generation
- Vector Search
- Context Retrieval

---

## 💬 AI Chat Interface

- Chat with uploaded documents
- Markdown rendering
- Code block support
- File upload support
- Conversation memory
- Context-aware responses

---

## 🧠 Smart Memory System

Instead of sending the entire conversation to the LLM:

### Stored

- Full conversation history
- All messages

### Sent to LLM

- Recent 6 messages
- Conversation summary

Benefits:

✅ Faster responses

✅ Reduced token usage

✅ Lower API costs

✅ Better scalability

---

## 🔍 Search Capabilities

- Semantic Search
- Keyword Extraction
- Context Retrieval
- Query Expansion
- Relevant Chunk Ranking

---

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- HTTPOnly Cookies
- Protected Routes
- Secure Password Hashing

---

# 🏗 Architecture

```text
┌─────────────────────┐
│   React Frontend    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    FastAPI API      │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼

 MongoDB       Qdrant
 (Atlas)      Vector DB

    ▼
Agent Workflow

Intent Detection
       ↓
Planning Agent
       ↓
Retriever
       ↓
Reasoning
       ↓
Final Answer
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Zustand
- Axios
- Tailwind CSS
- Shadcn UI
- Framer Motion
- React Markdown
- Sonner

---

## Backend

- FastAPI
- LangGraph
- LangChain
- Pydantic
- JWT Authentication

---

## Database

- MongoDB Atlas

---

## Vector Database

- Qdrant

---

## AI Models

- Google Gemini LLMs
- Embedding Models

---

## Development Tools

- UV Package Manager
- Git
- GitHub
- VS Code

---

# 📂 Project Structure

```text
DataSmith
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   │
│   ├── app/
│   │   ├── agent/
│   │   ├── rag/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tools/
│   │   ├── dependencies/
│   │   ├── models/
│   │   └── main.py
│   │
│   ├── pyproject.toml
│   └── uv.lock
│
└── README.md
```

---

# 🔐 Authentication Flow

```text
Register
    ↓
MongoDB
    ↓
Login
    ↓
JWT Generation
    ↓
HTTPOnly Cookie
    ↓
Protected Routes
```

---

# 📡 API Endpoints

## Authentication

### Register

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

### Logout

```http
POST /auth/logout
```

---

## Conversations

### Create Conversation

```http
POST /conversation/create
```

### Get Conversation

```http
GET /conversation/{conversation_id}
```

### Get User Conversations

```http
GET /conversation/user/{user_id}
```

### Update Conversation

```http
PUT /conversation/update/{conversation_id}
```

### Delete Conversation

```http
DELETE /conversation/delete/{conversation_id}
```

---

## Chat

```http
POST /chat/{conversation_id}
```

Supports:

- User Query
- File Upload
- RAG Retrieval
- Agent Execution
- Response Generation

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/DataSmith.git

cd DataSmith
```

---

# 🚀 Backend Setup

Navigate to backend:

```bash
cd server
```

Create virtual environment:

```bash
uv venv
```

Activate virtual environment:

### Windows

```bash
.venv\Scripts\activate
```

### Linux / Mac

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
uv sync
```

Create a `.env` file:

```env
TESSERACT_PATH=""

GOOGLE_API_KEY=""

QDRANT_API_KEY=""
QDRANT_URL=""

QDRANT_COLLECTION_NAME=""

EMBEDDINGS_MODEL_DIMENSION=3072

MONGODB_USER_NAME=""
MONGODB_PASSWORD=""
MONGODB_URL=""

SECRET_KEY =""
ALGORITHM = "HS256"


TAVILY_API_KEY=""

CLIENT_URI=""
```

Run backend:

```bash
fastapi dev app/main.py
```

Backend URL:

```text
http://localhost:8000
```

---

# 🎨 Frontend Setup

Navigate to frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

# 📦 Useful UV Commands

Install package:

```bash
uv add package_name
```

Remove package:

```bash
uv remove package_name
```

Sync dependencies:

```bash
uv sync
```

Upgrade dependencies:

```bash
uv sync --upgrade
```

Generate lockfile:

```bash
uv lock
```

# 🚀 Deployment

## Frontend

- Render

## Backend

- Render

## Database

- MongoDB Atlas

## Vector Database

- Qdrant Cloud

---

# 🎯 Future Roadmap

- [ ] Streaming Responses
- [ ] Voice Assistant
- [ ] OCR Support
- [ ] Image Understanding
- [ ] Team Workspaces
- [ ] Shared Knowledge Bases
- [ ] Source Citations
- [ ] Agent Collaboration
- [ ] Docker Deployment

---

# 👨‍💻 Author

## Sejal Sakhare

AI Engineer | Full Stack Developer | Machine Learning Enthusiast

### Skills

- FastAPI
- React
- Generative AI
- RAG Systems
- LangGraph
- Deep Learning
- Computer Vision

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the project

🚀 Share it with others

🤝 Contribute improvements

---

<div align="center">

### Built with ❤️ using FastAPI, React, MongoDB Atlas, Qdrant, and AI

# DataSmith

Your Intelligent Knowledge Workspace

</div>
