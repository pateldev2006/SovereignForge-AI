# 🛡️ SovereignForge AI — On-Premise Industrial Agentic AI Workbench

[![Sovereign Air-Gapped](https://img.shields.io/badge/Architecture-100%25%20Air--Gapped-emerald.svg)](https://sovereignforge-ai.vercel.app)
[![Zero Cloud Egress](https://img.shields.io/badge/Security-0%20Outbound%20Egress-blue.svg)](https://sovereignforge-ai.vercel.app)
[![Hardware HSM Verified](https://img.shields.io/badge/Ledger-SHA--256%20Attested-purple.svg)](https://sovereignforge-ai.vercel.app)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-success.svg)](https://sovereignforge-ai.vercel.app)

**SovereignForge AI** is an enterprise-grade, on-premise Agentic AI Workbench purpose-built for heavy engineering complexes, refineries, petrochemical plants, and critical infrastructure. It operates 100% air-gapped on local GPU clusters with **zero external cloud egress**, tamper-evident cryptographic provenance, and automated statutory SOP compliance audits.

🌐 **Live Production Prototype:** [https://sovereignforge-ai.vercel.app](https://sovereignforge-ai.vercel.app)

---

## ⚡ Key Capabilities

### 1. 🤖 7-Step Autonomous Industrial Agent Pipeline
- **Step 1: Document OCR & Layout Table Parsing** (`PaddleOCR` + `Tesseract Engine`) — Ingests scanned NDT thickness survey reports, equipment schedules, and ultrasonic grid tables.
- **Step 2: P&ID Engineering Drawing Computer Vision** (`Qwen2.5-VL-72B-Vision`) — Locates equipment tags (e.g., Heat Exchanger `HX-204`, Line `6"-CS-1501`, Valve `GV-1501`).
- **Step 3: Dense SOP RAG Retrieval & Vector Search** (`BAAI BGE-M3` + `Qdrant Local`) — Queries on-premise vector index for plant SOPs (e.g., `SOP-4.2.1 §7.1`) and OISD / ASME / API 510 standards.
- **Step 4: API 510 Mathematical Formula Verification** (`Isolated Python SymPy Sandbox`) — Computes corrosion rates ($CR = \frac{t_{initial} - t_{actual}}{\text{years}}$) and remaining statutory life ($RL = \frac{t_{actual} - t_{required}}{CR}$).
- **Step 5: Statutory SOP Non-Conformance Audit** (`DeepSeek-R1-Distill-70B`) — Audits proposed overhaul timelines and automatically flags compliance variances (e.g., +6 month turnaround overrun exceeding sour crude limits).
- **Step 6: Formal Technical Approval Note Synthesis** (`Qwen-2.5-72B-Instruct`) — Synthesizes a formal 3-point sign-off draft with strict sentence-level verifiable provenance.
- **Step 7: Hardware SHA-256 Ledger Attestation** (`Hardware HSM Root of Trust`) — Cryptographically seals the deliverable into an immutable audit ledger.

### 2. 🧠 Dynamic Local Model Router
Automatically classifies incoming prompt intent and dispatches tasks to specialized local neural weights with zero cloud telemetry:
- **Reasoning & Compliance Audits:** `DeepSeek-R1-Distill-70B`
- **General Synthesis & Note Drafting:** `Qwen-2.5-72B-Instruct`
- **P&ID & Multimodal Vision Inspection:** `Qwen2.5-VL-72B-Vision` (up to 2400x1800 resolution)
- **API 510 Code & Mathematical Sandbox:** `Qwen2.5-Coder-32B`
- **Fast SOP / Document Retrieval:** `Qwen-2.5-14B`

### 3. 📄 Retractable Deliverable Studio
- Generates publication-ready artifacts: **Microsoft Word (.docx)**, **Signed PDF**, **Excel (.xlsx)**, and **Python Scripts (.py)**.
- Full inline direct editor with real-time word count, paragraph tracking, and cryptographic signature stamps.

### 4. 💻 Python Sandbox & Code Agent
- Isolated execution environment for thickness decay models, API 510 retirement thickness calculations, and automated safety margin validations.

### 5. 🔒 Enterprise Governance & CISO Security Dashboard
- **Role-Based Access Control (RBAC):** Distinct roles for Plant Engineers, QA Officers, Approving Authorities, IT Engineers, and CISOs.
- **AI Capability Firewall:** Real-time token budget limits, model gating, and prompt safety guardrails.
- **Forensic Audit Ledger:** Full tamper-evident logs tracking every query, model dispatch, and token generation.

---

## 🔒 Security Architecture & Invariants

```
┌───────────────────────────────────────────────────────────────────────────┐
│                      ON-PREMISE AIR-GAPPED BOUNDARY                       │
│                                                                           │
│  ┌───────────────────────┐   Zero Egress    ┌──────────────────────────┐  │
│  │ Local Client / Tablet │ ───────────────> │  Local AI Engine Cluster │  │
│  │   (HTTPS / Loopback)  │ <─────────────── │ (4x NVIDIA H100 SXM5)    │  │
│  └───────────────────────┘  0 Outbound Pack └──────────────────────────┘  │
│             │                                            │                │
│             ▼                                            ▼                │
│  ┌───────────────────────┐                  ┌──────────────────────────┐  │
│  │ 5-Tier RBAC Guardrail │                  │  Hardware HSM Ledger     │  │
│  │   (Clearance L1-L5)   │                  │ (SHA-256 Tamper Evident) │  │
│  └───────────────────────┘                  └──────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

### 1. 🛡️ Air-Gap Invariant & Zero External Egress
- **Physical & Network Isolation:** All inference engines, vector databases, and document parsers execute strictly within the plant's on-premise local area network (LAN).
- **Zero Cloud Calls:** No telemetry, weights, prompts, or proprietary engineering schematics ever leave the local boundary.
- **Firewall Enforcement:** Real-time egress monitor continuously asserts 0 external packets (`0 bytes sent to public IP ranges`).

### 2. 🎯 Deterministic Provenance & Anti-Hallucination
- **Sentence-Level Citations:** Every assertion in generated approval notes is explicitly anchored to source documents (e.g., `[1] sample_inspection_report.pdf (Page 4, Grid C4)`, `[2] SOP-4.2.1 §7.1`).
- **Spatial OCR Grounding:** OCR bounding boxes and P&ID tag coordinates (X/Y pixels) are retained to verify tag locations with confidence percentages (e.g., 98.4% OCR confidence).
- **Strict Citation Policy:** If a fact cannot be retrieved from indexed on-premise SOPs or inspection data, generation is halted rather than hallucinated.

### 3. 🔐 Cryptographic Forensic Audit Ledger (FIPS 140-3 HSM)
- Every agent pipeline execution generates a deterministic SHA-256 cryptographic seal (e.g., `0x7F8A9B2C3D4E...`).
- Immutable audit records bind: `Timestamp` ➔ `User Identity` ➔ `Clearance Level` ➔ `Input File Hashes` ➔ `Active Neural Weights` ➔ `Generated Artifact Hash`.
- Tamper-evident ledger prevents unauthorized alteration of past inspection decisions or approval notes.

### 4. 🧱 AI Capability Firewall & Guardrails
- **Per-Role Token Quotas:** Configurable daily and per-request token allowances to prevent compute starvation.
- **Model Gating:** Restricts code-execution sandbox to authorized IT/Automation engineers and blocks sensitive document indexing for unprivileged accounts.
- **System Operating Modes:** Supports 4 runtime security states:
  - `FULL`: All on-premise neural models & vector pipelines operational.
  - `DEGRADED`: Vision OCR degraded; text reasoning remains active.
  - `SAFE`: Read-only mode; automated code execution locked.
  - `OFFLINE`: AI generation offline; static documents accessible.

### 5. 👥 5-Tier Role-Based Access Control (RBAC)

| Role | Clearance Level | Permissions |
| :--- | :--- | :--- |
| **Plant / Process Engineer** | `L1 - Process Operations` | Create tasks, upload NDT reports, trigger agent pipeline, draft notes |
| **IT / Automation Engineer** | `L2 - Engineering & SCADA` | Code Sandbox, model registry verification, sandbox execution |
| **Design / QA Officer** | `L3 - Quality & Compliance` | P&ID drawing inspection, SOP deviation review, review queue |
| **Approving Authority** | `L4 - Executive Approval` | Final digital sign-off, approval queue management, note endorsement |
| **CISO / Security Admin** | `L5 - CISO Security Clearance` | Firewall rules, system operating modes, global forensic audit ledger |

---

## ⚙️ Implementation & Engineering Architecture

```
                               ┌─────────────────────────┐
                               │     Incoming Prompt     │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │  Dynamic Model Router   │
                               │   (Intent Classifier)   │
                               └────────────┬────────────┘
         ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
         │                  │                               │                  │
         ▼                  ▼                               ▼                  ▼
┌─────────────────┐ ┌───────────────┐               ┌───────────────┐ ┌─────────────────┐
│ DeepSeek-R1-70B │ │ Qwen-VL-72B   │               │ Qwen-Coder-32B│ │ Qwen-2.5-14B    │
│ (SOP Reasoning) │ │ (P&ID Vision) │               │ (API 510 Math)│ │ (Fast RAG)      │
└────────┬────────┘ └───────┬───────┘               └───────┬───────┘ └────────┬────────┘
         │                  │                               │                  │
         └──────────────────┴───────────────┬───────────────┴──────────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   Deliverable Studio    │
                               │  (.docx, .pdf, .xlsx)   │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   Hardware HSM Seal     │
                               │  (SHA-256 Ledger Entry) │
                               └─────────────────────────┘
```

### 1. 🖥️ Local Neural Inference Cluster
- **Compute Sizing:** 4x NVIDIA H100 SXM5 80GB (320 GB aggregate VRAM) or equivalent on-premise GPU clusters.
- **Inference Server:** Local high-throughput inference backends (vLLM / TensorRT-LLM) exposing OpenAI-compatible local endpoints on `localhost:8000`.
- **Quantization:** AWQ / FP8 weights for optimal throughput and sub-500ms latency without loss of mathematical precision.

### 2. 🔍 Vector Search & Knowledge Base Pipeline
- **Embedding Model:** BAAI `bge-m3` running locally to generate 1024-dimensional dense semantic vectors.
- **Vector Database:** Local Qdrant instance storing chunked statutory standards, plant operating manuals, and historical inspection callouts.
- **Hybrid Retrieval:** Dense cosine similarity combined with sparse BM25 keyword matching for exact tag and standard code lookups (e.g., `SOP-4.2.1 §7.1`, `OISD-STD-129`).

### 3. 🐍 Isolated Mathematical Code Sandbox
- **Engine:** Sandboxed Python runtime with `SymPy`, `NumPy`, and `Pandas`.
- **Statutory Formula Implementation (API 510 §7.1.1):**
  $$\text{Corrosion Rate (CR)} = \frac{t_{\text{initial}} - t_{\text{actual}}}{\text{Time Elapsed (years)}}$$
  $$\text{Remaining Life (RL)} = \frac{t_{\text{actual}} - t_{\text{required}}}{\text{CR}}$$
- **Safety Variance Flagging:** If $RL < \text{Next Scheduled Turnaround Interval}$, an automatic statutory non-conformance flag (`+6M Overhaul Variance`) is injected into the draft deliverable.

### 4. 📑 Deliverable Studio Artifact Synthesis
- Pure client-side binary blob generators:
  - **Microsoft Word (`.docx`):** Fully formatted technical memo with executive summary, deviation breakdown, and statutory citations.
  - **Signed PDF:** Formatted printable document with cryptographic digital signature stamp and timestamp.
  - **Excel (`.xlsx`):** Multi-tab workbook containing raw ultrasonic grid measurements, corrosion decay curves, and CML retirement flags.
  - **Python Script (`.py`):** Standalone reproducible calculation script for statutory auditing.

### 5. 📜 Statutory Engineering Standards Supported
- **`OISD-STD-129`:** Inspection of pressure vessels and safety valves in sour service.
- **`API 510`:** Pressure Vessel Inspection Code: In-service Inspection, Rating, Repair, and Alteration.
- **`ASME Section VIII Div 1 & 2`:** Rules for Construction of Pressure Vessels.
- **`ISO 14224`:** Petroleum, petrochemical and natural gas industries — Collection and exchange of reliability and maintenance data.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
- **Build System:** Vite
- **Deployment:** Vercel (Client-Side Single Page Application) / On-Premise Docker
- **Local AI Framework:** PaddleOCR, Qdrant Local, SymPy Sandbox, DeepSeek-R1, Qwen 2.5 Suite

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/pateldev2006/SovereignForge-AI.git

# 2. Navigate into directory
cd SovereignForge-AI

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the workbench locally.

---

## 📜 License & Provenance

Proprietary Industrial Architecture — Designed for Sovereign, Air-Gapped High-Reliability Operations.
