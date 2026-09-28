# 🛡️ SovereignForge AI — On-Premise Industrial Agentic AI Workbench

[![Sovereign Air-Gapped](https://img.shields.io/badge/Architecture-100%25%20Air--Gapped-emerald.svg)](https://sovereignforge-ai.vercel.app)
[![Zero Cloud Egress](https://img.shields.io/badge/Security-0%20Outbound%20Egress-blue.svg)](https://sovereignforge-ai.vercel.app)
[![Hardware HSM Verified](https://img.shields.io/badge/Ledger-SHA--256%20Attested-purple.svg)](https://sovereignforge-ai.vercel.app)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-success.svg)](https://sovereignforge-ai.vercel.app)

**SovereignForge AI** is an on-premise, enterprise-grade Agentic AI Workbench engineered for heavy engineering complexes, refineries, petrochemical plants, and critical infrastructure. It runs 100% air-gapped on local GPU clusters with zero external cloud calls, tamper-evident cryptographic provenance, and automated statutory SOP compliance audits.

🌐 **Live Production Prototype:** [https://sovereignforge-ai.vercel.app](https://sovereignforge-ai.vercel.app)

---

## ⚡ Key Capabilities

### 1. 🤖 7-Step Autonomous Industrial Agent Pipeline
- **Step 1: Document OCR & Layout Table Parsing** (`PaddleOCR` + `Tesseract Engine`) — Ingests scanned NDT thickness survey reports, equipment schedules, and grid tables.
- **Step 2: P&ID Engineering Drawing Computer Vision** (`Qwen2.5-VL-72B-Vision`) — Locates equipment tags (e.g., Heat Exchanger `HX-204`, Line `6"-CS-1501`, Valve `GV-1501`).
- **Step 3: Dense SOP RAG Retrieval & Vector Search** (`BAAI BGE-M3`) — Queries local Qdrant vector index for plant SOPs (e.g., `SOP-4.2.1 §7.1`) and OISD / ASME / API 510 standards.
- **Step 4: API 510 Mathematical Formula Verification** (`Isolated Python SymPy Sandbox`) — Computes corrosion rates (`CR = (t_init - t_act) / Y`) and remaining statutory life.
- **Step 5: Statutory SOP Non-Conformance Audit** (`DeepSeek-R1-Distill-70B`) — Flags operational deviations (e.g., +6 month turnaround overrun exceeding sour crude limits).
- **Step 6: Formal Technical Approval Note Synthesis** (`Qwen-2.5-72B-Instruct`) — Produces a formal 3-point sign-off draft with strict sentence-level provenance.
- **Step 7: Hardware SHA-256 Ledger Attestation** (`Hardware HSM Root of Trust`) — Cryptographically seals the deliverable into an immutable audit chain.

### 2. 🧠 Dynamic Local Model Router
Automatically classifies incoming prompt intent and dispatches tasks to specialized local neural weights with zero cloud telemetry:
- **Reasoning & Compliance Audits:** `DeepSeek-R1-Distill-70B`
- **General Synthesis & Note Drafting:** `Qwen-2.5-72B-Instruct`
- **P&ID & Multimodal Vision Inspection:** `Qwen2.5-VL-72B-Vision`
- **API 510 Code & Mathematical Sandbox:** `Qwen2.5-Coder-32B`
- **Fast SOP / Document Retrieval:** `Qwen-2.5-14B`

### 3. 📄 Retractable Deliverable Studio
- Generates publication-ready artifacts: **Microsoft Word (.docx)**, **Signed PDF**, **Excel (.xlsx)**, and **Python Scripts (.py)**.
- Full inline direct editor with real-time word count, paragraph tracking, and cryptographic signature stamps.

### 4. 💻 Python Sandbox & Code Agent
- Isolated execution environment for thickness decay models, API 510 retirement thickness calculations, and automated safety margin validations.

### 5. 🔒 Enterprise Governance & CISO Security Dashboard
- **Role-Based Access Control (RBAC):** Distinct roles for Plant Operators, Reliability Engineers, Chief Inspectors, and CISOs.
- **AI Capability Firewall:** Real-time token budget limits, model gating, and prompt safety guardrails.
- **Forensic Audit Ledger:** Full tamper-evident logs tracking every query, model dispatch, and token generation.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
- **Build System:** Vite
- **Deployment:** Vercel (Client-Side Single Page Application)
- **Local AI Framework Mockup:** PaddleOCR, Qdrant Local, SymPy Sandbox, DeepSeek-R1, Qwen 2.5 Suite

---

## 🚀 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/pateldev2006/SovereignForge-AI.git

# Navigate to directory
cd SovereignForge-AI

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the workbench locally.

---

## 📜 License & Provenance

Proprietary Industrial Architecture — Designed for Sovereign, Air-Gapped High-Reliability Operations.
