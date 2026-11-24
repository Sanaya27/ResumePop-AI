# ResumePop AI ⚡

> **Turn resumes into structured talent data.**

A full-stack, AI-powered recruitment intelligence platform built on Python, spaCy NLP, PDFMiner, SQLite, and a React + TypeScript frontend adhering strictly to the **One Stop Notes** design system.

---

## 🎨 One Stop Notes Design System

ResumePop AI strictly implements the **One Stop Notes** design language:
- **Primary Color:** `#ffdb00` (Sunflower Yellow — cheerful accents & highlights)
- **Secondary Color:** `#ff4bb3` (Hot Pink — primary brand personality & CTAs)
- **Tertiary Color:** `#6ee7b7` (Mint Green — live indicators & verification badges)
- **Background / Canvas:** `#fef2fb` (Soft Pink Blush)
- **Surface:** `#fffdfe` (Sticker card backgrounds)
- **Text:** `#110d17` (High-contrast near-black)
- **Borders & Shadows:** Solid `2.5px solid #0f0b15` borders with hard-edged offset drop shadows (`shadow-[4px_4px_0px_#0f0b15]`), zero blurry drop shadows or glassmorphism.
- **Typography:** **Space Grotesk** for headlines and body text; **Space Mono** for technical badges, tags, and ticker labels.

---

## 🛠️ Tech Stack & Architecture

```text
ResumePop-AI/
│
├── backend/                       # Python Flask REST API
│   ├── app.py                     # App factory & route registrations
│   ├── database/
│   │   ├── db.py                  # SQLite schema, queries, cascades, seed
│   │   └── resumepop.db           # Persistent SQLite database
│   ├── services/
│   │   └── parser_service.py      # spaCy NLP & PDFMiner integration
│   ├── routes/
│   │   ├── health_routes.py       # GET /api/health
│   │   ├── dashboard_routes.py    # GET /api/dashboard/stats
│   │   ├── resume_routes.py       # Upload, list, get, reprocess, delete
│   │   ├── candidate_routes.py    # Search, filter, list, detail
│   │   ├── analytics_routes.py    # Talent skill & education distribution
│   │   └── export_routes.py       # UTF-8 BOM CSV export for Excel
│   └── requirements.txt
│
├── frontend/                      # React + Vite + TypeScript SPA
│   ├── src/
│   │   ├── components/            # Navbar, Marquee, StatCard, CandidateCard, CandidateModal, Dropzone
│   │   ├── pages/                 # Dashboard, Upload, Candidates, Resumes, Analytics
│   │   ├── services/              # API client methods
│   │   ├── types.ts               # Strict TypeScript definitions
│   │   └── index.css              # Tailwind CSS & One Stop Notes utility tokens
│   ├── package.json
│   └── vite.config.ts
│
├── ResumeParser-master/           # Upstream extraction modules & example PDFs
│   ├── bin/                       # Enhanced lib.py, field_extraction.py, pdf2text.py
│   ├── confs/config.yaml          # Rich skill dictionary & aliases
│   └── data/input/example_resumes # 5 sample PDF resumes
│
├── uploads/                       # Staged uploaded PDF resumes
├── run_backend.bat                # 1-click backend start script
├── run_frontend.bat               # 1-click frontend start script
├── start_app.bat                  # 1-click launcher for both servers
└── README.md
```

---

## 🐛 Bug Fixes & Extraction Pipeline Improvements

### 1. Root Cause of `ERROR:root:Error occurred during regex search`
- **Issue:** The original `lib.py` passed unescaped strings directly to `re.compile(term, re.IGNORECASE)`. In `config.yaml`, terms such as `C++`, `C#`, and `.NET` contain regex special quantifier characters (`+`, `.`). Specifically, compiling `"C++"` raises `re.error: multiple repeat at position 2`, causing `ERROR:root:Error occurred during regex search` on every single resume!
- **Fix:** Implemented safe boundary-aware regex compilation in `lib.py`:
  - `re.escape(term)` to prevent regex character collisions.
  - Word boundaries (`(?<![a-zA-Z0-9])` and `(?![a-zA-Z0-9+#])`) so that single letters (e.g., `C`, `R`) do not match inside words like `cat` or `developer`, and `java` does not match `javascript`.
  - Escaped `.NET` so it only matches the framework, not random characters preceding `net`.

### 2. Tuple Formatting in Phone Extraction
- **Issue:** `PHONE_REGEX` used multiple capturing groups, causing `re.findall()` to return tuples such as `('415', '582', '7457')`. In Python, converting this to string resulted in `"('415', '582', '7457')"` or missed numbers entirely.
- **Fix:** Switched to `re.search()` matching and formatted output as clean standard telephone strings `+1 (415) 582-7457` or `(614) 555-5555`. Added support for middle-dot separators (`·`) found in modern PDF resumes.

### 3. Email Extraction Cleanup
- **Issue:** Extracted emails occasionally contained trailing punctuation or line-break artifacts from PDF stream line wrapping.
- **Fix:** Preprocessed text to strip CID font artifacts (`(cid:5)`), normalized whitespace, and trimmed punctuation.

### 4. Candidate Name Accuracy
- **Issue:** Raw spaCy NER occasionally extracted organization names or lower-body text references instead of the candidate's actual name.
- **Fix:** Header-priority candidate name detection with blacklist filtering (ignores headers like `RESUME`, `CURRICULUM VITAE`, emails, phone numbers, addresses) combined with spaCy PERSON entity confirmation and Title Case normalization.

### 5. University & Education Detection
- **Issue:** Original `config.yaml` only listed 4 Dutch universities + MIT, leaving American and international universities unparsed.
- **Fix:** Added regex pattern extractors for `University of ...`, `... University`, `... College`, and `... Institute of Technology`, plus top global universities in `config.yaml`.

### 6. Clean Field Representations
- **Issue:** CSV and API outputs previously returned string representations of Python sets like `set()` or `{'MySQL', 'SQL'}`.
- **Fix:** Formatted all lists into clean comma-separated strings or `"Not detected"`.

---

## 🚀 Running the Application

### Option A: 1-Click Launch (Recommended)
Double-click:
```bat
start_app.bat
```
This automatically launches both the Flask backend server and Vite frontend server in separate command windows.

---

### Option B: Manual Command-Line Startup

#### 1. Start Backend (Terminal 1)
```powershell
cd C:\Users\sanay\Downloads\AI-Resume-Parser-main\backend
..\ResumeParser-master\venv\Scripts\python.exe app.py
```
- Backend starts at: `http://127.0.0.1:5000`
- Initial launch automatically seeds the 5 example resumes into SQLite!

#### 2. Start Frontend (Terminal 2)
```powershell
cd C:\Users\sanay\Downloads\AI-Resume-Parser-main\frontend
npm run dev
```
- Frontend starts at: `http://localhost:5173`

---

## 🌐 URLs & Endpoints

| Resource | URL |
| :--- | :--- |
| **Frontend Application** | `http://localhost:5173` |
| **Backend Health Check** | `http://127.0.0.1:5000/api/health` |
| **Dashboard Statistics** | `http://127.0.0.1:5000/api/dashboard/stats` |
| **Candidates API** | `http://127.0.0.1:5000/api/candidates` |
| **Resumes API** | `http://127.0.0.1:5000/api/resumes` |
| **Talent Analytics API** | `http://127.0.0.1:5000/api/analytics` |
| **Excel CSV Export** | `http://127.0.0.1:5000/api/export/csv` |

---

## 📋 Features Overview

1. **Dashboard:**
   - Real-time pipeline metrics (Total Resumes, 100% Extraction Rate, Candidates, Skills).
   - Instant dropzone for rapid ingestion.
   - Live activity stream linking directly to parsed candidate profiles.

2. **Multi-Document Resume Upload:**
   - Drag & drop PDF files with real-time file size & removal affordances.
   - Real spaCy + PDFMiner parsing pipeline with zero mock data.
   - Comprehensive feedback on successful and invalid uploads.

3. **Candidate Directory:**
   - Full-text search by name, contact, university, or skill.
   - Category filters (Programming, Databases, ML, University, Role).
   - Sorting by Name, Date, or Number of Skills.
   - Clean result cards with verified pill tags.

4. **Detailed Candidate Profile:**
   - Contact cards with click-to-email and click-to-call.
   - Skills categorized into Programming, Databases, ML, and Platforms.
   - Raw PDF text viewer for verification.
   - One-click resume reprocessing action.

5. **Resume Management:**
   - Persistent audit log in SQLite.
   - Status indicators (`PROCESSED` / `ERROR`).
   - Reprocess action and cascade delete with confirmation dialog.

6. **Talent Analytics:**
   - Real extracted skill distributions (Programming Languages, Databases, ML, Universities, Job Roles).
   - Custom styled visual bar charts in the One Stop Notes color palette.

7. **Excel-Compatible CSV Export:**
   - One-click export with UTF-8 BOM (`\ufeff`) so international accents (e.g., `Sébastien Genty`) open cleanly in Microsoft Excel.
   - Filter-aware export downloads exactly the filtered candidates matching current search parameters.
