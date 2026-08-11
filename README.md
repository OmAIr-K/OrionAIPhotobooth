# Orion AI Photobooth

**Orion AI Photobooth** is an interactive, event-ready image generation application. A guest captures or uploads a portrait, picks a transformation style (or a custom text prompt), and the system generates a stylized likeness while preserving identity.

The experience was built for campus events at **Manipal Academy of Higher Education – Dubai Campus** (Technovanza), and combines:

- A React frontend (`AIPhotobooth/`) for the guest journey and UI
- A Python inference backend (repo root) powered by **[PuLID](https://github.com/ToTheBeginning/PuLID)** (NeurIPS 2024) with SDXL-Lightning
- Optional **Google Drive** upload for shareable download / QR links

> **Upstream research:** Identity customization is based on *PuLID: Pure and Lightning ID Customization via Contrastive Alignment* ([arXiv:2404.16022](https://arxiv.org/abs/2404.16022)). The original research README, Gradio demos (`app.py`, `app_flux.py`, `app_v1_1.py`), and model docs live under [`docs/`](docs/).

---

## Table of contents

1. [Architecture](#architecture)
2. [How it works](#how-it-works)
3. [Repository layout](#repository-layout)
4. [Prerequisites](#prerequisites)
5. [Setup](#setup)
6. [Google Drive credentials](#google-drive-credentials)
7. [Configuration checklist](#configuration-checklist)
8. [Running the application](#running-the-application)
9. [User journey](#user-journey)
10. [Backend protocol](#backend-protocol)
11. [Styles & prompts](#styles--prompts)
12. [Troubleshooting](#troubleshooting)
13. [Security & GitHub best practices](#security--github-best-practices)
14. [Credits & citation](#credits--citation)
15. [Disclaimer](#disclaimer)

---

## Architecture

Three processes work together. Start them in this order:

```text
┌─────────────────────────┐     HTTP POST /command      ┌──────────────────────┐     TCP JSON      ┌─────────────────────────┐
│  React Frontend         │ ──────────────────────────► │  Flask Proxy         │ ────────────────► │  Inference Server       │
│  AIPhotobooth/          │                             │  proxy_server.py     │                   │  run_inference.py       │
│  http://localhost:3000  │ ◄────────────────────────── │  localhost:9998      │ ◄──────────────── │  localhost:9999        │
└───────────┬─────────────┘     JSON + drive_url        └──────────────────────┘                   └───────────┬─────────────┘
            │                                                                                                  │
            │  guest saves JPG/PNG into                                                                        │ reads latest
            │  repo `inputs/`                                                                                  │ image from `inputs/`
            │                                                                                                  │
            │  results served from                                                                             │ writes result to
            │  AIPhotobooth/outputs (or public)                                                                │ configured outputs path
            └──────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                              │
                                                              ▼
                                                    Google Drive (optional)
                                                    folder: Pulid_outputs
```

| Component | Entry point | Port | Role |
|-----------|-------------|------|------|
| Inference server | `python run_inference.py` | `9999` (TCP) | Loads PuLID, runs generation, uploads to Drive |
| HTTP proxy | `python proxy_server.py` | `9998` | Bridges browser CORS/HTTP to the TCP backend |
| Frontend | `npm start` in `AIPhotobooth/` | `3000` | Guest UI (gender → style → camera → results) |

CLI helper (optional): `python trigger_gen.py` sends the same TCP commands without the UI.

---

## How it works

### End-to-end request flow

1. **Frontend** (`AIPhotobooth`) walks the user through Start → Gender → Style → Camera/Upload → Processing → Results.
2. On confirm, the browser uses the **File System Access API** (`showSaveFilePicker`) so the guest saves the portrait as a JPG/PNG. For generation to succeed, that file must land in the repo-root **`inputs/`** folder (the directory `run_inference.py` watches).
3. **ProcessingPage** calls `backendService.startGeneration(style, customPrompt)` in `AIPhotobooth/src/services/websocketService.js`, which `POST`s JSON to `http://localhost:9998/command`.
4. **proxy_server.py** opens a TCP socket to `localhost:9999` and forwards the payload.
5. **run_inference.py**:
   - Accepts `START_GENERATION` with a `style` key (and optional `custom_prompt`)
   - Resolves the prompt from `STYLE_PROMPTS` (or the custom string)
   - Picks the **most recently modified** image under `inputs/`
   - Extracts an ID embedding via `PuLIDPipeline.get_id_embedding`
   - Runs `pipeline.inference(...)` (default: 768×576, 4 steps, `id_scale=0.7`)
   - Saves the result into the configured React outputs directory
   - Uploads the file to Google Drive (folder `Pulid_outputs`) and returns a public download URL
6. **ResultsPage** displays the image from Drive (preferred) or a local `/outputs/<filename>` path, with download, QR share, and “try another style”.

### Inference stack (backend)

`PuLIDPipeline` (`pulid/pipeline.py`) loads:

- **SDXL base** + **SDXL-Lightning 4-step UNet** (fast sampling)
- **ID encoder** + InsightFace **antelopev2** face analysis
- **EVA-CLIP** and face parsing helpers for identity features

Models are expected under `models/` (see [Setup](#setup)). CUDA GPU strongly recommended.

---

## Repository layout

```text
PuLID/                          # Workspace root (inference + research code)
├── run_inference.py            # ★ Main photobooth inference TCP server
├── proxy_server.py             # ★ Flask HTTP ↔ TCP bridge (port 9998)
├── trigger_gen.py              # Optional CLI client for the TCP server
├── upload_test.py              # Standalone Google Drive upload smoke test
├── app.py / app_flux.py / …    # Upstream PuLID Gradio demos (research)
├── pulid/                      # PuLID pipelines & ID attention
├── eva_clip/                   # CLIP backbone used by PuLID
├── flux/                       # FLUX-related utilities (research demos)
├── models/                     # Local weights (not committed; large files)
├── inputs/                     # Guest input portraits (gitignored)
├── outputs/                    # Alternate local outputs
├── docs/                       # Upstream PuLID / FLUX documentation
├── requirements.txt            # Core Python deps for PuLID
├── AIPhotobooth/               # ★ Orion React frontend
│   ├── credentials.example.json
│   ├── credentials.json        # ★ Local only — never commit
│   ├── package.json
│   ├── public/                 # Static assets; generated images often land here
│   │   └── outputs/
│   ├── outputs/                # Alternate frontend output folder
│   └── src/
│       ├── components/         # Pages, layout, UI
│       ├── data/stylesData.js  # Style catalog for the UI
│       ├── services/           # Backend HTTP client
│       └── utils/fileUtils.js  # Save-dialog helpers
└── README.md                   # This file
```

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **OS** | Windows / Linux / macOS (this project is commonly run on Windows with an NVIDIA GPU) |
| **GPU** | NVIDIA CUDA GPU with enough VRAM for SDXL-Lightning + face models (16GB+ recommended) |
| **Python** | 3.9+ (3.10 recommended) via Conda/Miniconda |
| **Node.js** | 18+ LTS with npm |
| **Git** | For clone / LFS if you store large assets separately |
| **Google Cloud** | Optional but used for Drive sharing / QR downloads |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/OmAIr-K/OrionAIPhotobooth.git
cd OrionAIPhotobooth
```

### 2. Create the Python environment

```bash
conda create --name pulid python=3.10 -y
conda activate pulid

# Core PuLID / photobooth deps
pip install -r requirements.txt

# Photobooth extras (proxy + Drive uploads)
pip install -r requirements_photobooth.txt
```

> If you later use the upstream **PuLID-FLUX** Gradio demo (`app_flux.py`) on consumer GPUs, follow [`docs/pulid_for_flux.md`](docs/pulid_for_flux.md) and `requirements_fp8.txt`. The Orion photobooth path (`run_inference.py`) uses the **SDXL PuLID** pipeline, not FLUX.

### 3. Download model weights

Place (or let the pipeline download) the following under `models/`:

| Asset | Purpose | Source |
|-------|---------|--------|
| `pulid_v1.bin` | PuLID ID adapter | [Hugging Face – guozinan/PuLID](https://huggingface.co/guozinan/PuLID) |
| `antelopev2/` | InsightFace face models | Auto-downloaded by the pipeline (`DIAMONIK7777/antelopev2`) or place manually |
| SDXL / Lightning | Base + 4-step UNet | Pulled via Hugging Face Hub on first run (`stabilityai/stable-diffusion-xl-base-1.0`, `ByteDance/SDXL-Lightning`) |

Optional (for upstream FLUX demos only): `flux1-dev.safetensors`, `ae.safetensors` from [black-forest-labs/FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev).

Ensure `inputs/` and output folders exist:

```bash
mkdir inputs
mkdir AIPhotobooth/outputs
mkdir AIPhotobooth/public/outputs
```

### 4. Install the frontend

```bash
cd AIPhotobooth
npm install
cd ..
```

### 5. Configure Google credentials (recommended)

See the dedicated section below, then continue to [Configuration checklist](#configuration-checklist).

---

## Google Drive credentials

Generated images are uploaded to Drive so guests can download via link / QR code. Auth uses a **Google Cloud service account**.

### Create a service account (one-time)

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (note the **Project ID**).
3. Enable the **Google Drive API** for that project.
4. Go to **IAM & Admin → Service Accounts → Create service account**.
5. Create a **JSON key** and download it.
6. Rename / copy it to:

```text
AIPhotobooth/credentials.json
```

7. **Share a Drive folder** with the service account email (`client_email` inside the JSON), or allow the account to create files in its Drive. The code creates/uses a folder named `Pulid_outputs`.

> **Important:** Service accounts have their own Drive storage. For files to appear in *your* My Drive, share a folder you own with the service account email (Editor), then optionally set a fixed `folder_id` in code later. The current implementation searches/creates `Pulid_outputs` in the service account’s Drive and sets the uploaded file to **Anyone with the link → Viewer**.

### Safe template for GitHub

A placeholder file is provided:

```text
AIPhotobooth/credentials.example.json
```

**Do this on every new machine:**

```bash
cd AIPhotobooth
cp credentials.example.json credentials.json
# Then paste your real service-account values into credentials.json
```

**Never commit `credentials.json`.** It contains a private key. Only `credentials.example.json` (placeholders) should be in the repository.

Example shape (placeholders only):

```json
{
  "type": "service_account",
  "project_id": "YOUR_GCP_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "YOUR_SERVICE_ACCOUNT@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/...",
  "universe_domain": "googleapis.com"
}
```

Smoke-test uploads (after path config):

```bash
python upload_test.py
```

---

## Configuration checklist

Most paths are resolved relative to the repository root (via `Path(__file__)`), so a normal clone works without editing absolute Windows paths.

### 1. Credentials file

Place your real service-account JSON at:

```text
AIPhotobooth/credentials.json
```

`run_inference.py` and `upload_test.py` both read this relative path automatically.

### 2. Outputs directory

Generated images are written to:

```text
AIPhotobooth/outputs/
```

Ensure this folder exists (created automatically on first generation if missing).

### 3. Proxy

`proxy_server.py` defaults:

- Backend: `localhost:9999`
- Listen: `localhost:9998`
- Static outputs: `../outputs` (adjust if you serve files through the proxy)

### 4. Frontend backend URL

`AIPhotobooth/src/services/websocketService.js` posts to:

```text
http://localhost:9998/command
```

Change host/port only if you bind the proxy elsewhere.

### 5. Input image handoff (critical)

The backend does **not** receive the image bytes over the socket. It loads the newest file in `inputs/`.

When the camera/upload UI prompts “Save”, choose a path inside:

```text
<repo-root>/inputs/
```

Use JPG/JPEG/PNG. Filenames like `photo_<style>_<timestamp>.jpg` are generated by the frontend.

---

## Running the application

Open **three terminals** (all with `conda activate pulid` for Python processes).

### Terminal 1 — inference server

```bash
cd <repo-root>
conda activate pulid
python run_inference.py
```

Wait until you see that the pipeline initialized and the server is listening on `localhost:9999`. First launch may download Hugging Face weights.

### Terminal 2 — HTTP proxy

```bash
cd <repo-root>
conda activate pulid
python proxy_server.py
```

Health check: open `http://localhost:9998/health` (expects backend reachable).

### Terminal 3 — frontend

```bash
cd <repo-root>/AIPhotobooth
npm start
```

Browse to [http://localhost:3000](http://localhost:3000).

### Optional — CLI generation

With the inference server running and an image already in `inputs/`:

```bash
python trigger_gen.py
# Choose 1 → pick a style key → wait for image_path
```

### Shutdown

- Prefer stopping the frontend and proxy with `Ctrl+C`.
- Sending `{"command": "EXIT"}` to the inference server (via `trigger_gen.py` option 2, or the proxy) triggers graceful CUDA cleanup.

---

## User journey

| Step | Route | Behavior |
|------|-------|----------|
| Start | `/` | Hero, style carousel, Start / Gallery |
| Gender | `/gender-selection` | Male / Female (filters style catalog) |
| Style | `/style-selection` | Preset styles or **Custom** text prompt |
| Capture | `/camera` | Live webcam (countdown) or file upload; confirm & save to `inputs/` |
| Processing | `/processing` | Calls proxy → inference; may take several minutes |
| Results | `/results` | Preview, before/after, download, QR / email share, try another style |
| Gallery / About / Contact | `/gallery`, `/about`, … | Static event pages |

Progress is shown via `ProgressIndicator` for the main booth flow.

---

## Backend protocol

All commands are JSON over TCP (`9999`) or HTTP POST body to `/command` (`9998`).

### Start generation

```json
{
  "command": "START_GENERATION",
  "style": "iron_man",
  "custom_prompt": null
}
```

For custom styles:

```json
{
  "command": "START_GENERATION",
  "style": "custom",
  "custom_prompt": "cinematic portrait as a cyberpunk detective, neon rain"
}
```

### Success response

```json
{
  "status": "success",
  "message": "Image generated successfully",
  "image_path": "C:\\path\\to\\outputs\\guest_iron_man.jpg",
  "drive_url": "https://drive.google.com/uc?export=download&id=FILE_ID"
}
```

### Exit

```json
{ "command": "EXIT" }
```

### Proxy routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/command` | Forward JSON command to inference server |
| `GET` | `/outputs/<filename>` | Serve a generated file (if configured) |
| `GET` | `/health` | Proxy up + backend reachable |

---

## Styles & prompts

- **UI catalog:** `AIPhotobooth/src/data/stylesData.js` (gender-specific cards, thumbnails, descriptions).
- **Generation prompts:** `STYLE_PROMPTS` in `run_inference.py` (and mirrored partially in `websocketService.js` / `trigger_gen.py`).

The `style` id sent from the UI **must** exist as a key in `run_inference.py`’s `STYLE_PROMPTS`, or the server returns `Unknown style key`.

When adding a new style:

1. Add the prompt key to `STYLE_PROMPTS` in `run_inference.py`
2. Add a matching card in `stylesData.js`
3. Keep ids identical across frontend and backend

Default generation knobs in `run_inference.py` (edit as needed):

| Parameter | Default | Meaning |
|-----------|---------|---------|
| `steps` | `4` | SDXL-Lightning steps |
| `id_scale` | `0.7` | Identity strength |
| `scale` | `1.0` | CFG-related scale |
| `height` × `width` | `768` × `576` | Output resolution |

---

## Troubleshooting

| Symptom | Likely cause | What to try |
|---------|--------------|-------------|
| Frontend: “Backend server is not running” | Proxy or inference down | Start `run_inference.py`, then `proxy_server.py`; check `/health` |
| `No input image found` | Empty or wrong `inputs/` | Save the capture into `<repo>/inputs/` as `.jpg`/`.png` |
| `Unknown style key` | UI id ≠ backend prompt map | Align ids in `stylesData.js` and `STYLE_PROMPTS` |
| Drive upload fails / no `drive_url` | Bad credentials path or API disabled | Fix `GOOGLE_CREDENTIALS_FILE`, enable Drive API, run `upload_test.py` |
| CUDA OOM | Insufficient VRAM | Close other GPU apps; reduce resolution; use a larger GPU |
| Camera permission errors | Browser blocked camera | Allow camera access, or use **Upload** mode |
| Results image blank | Path / Drive ACL | Confirm file exists under outputs; ensure Drive file is public reader; check browser console |
| Proxy timeout | Long generation | Default socket timeout is long (`1200`s); wait or check GPU utilization |
| Hardcoded path errors | Old `F:\…\AI Photobooth\…` paths | Update paths to your clone (folder is now `AIPhotobooth`) |

---

## Security & GitHub best practices

Before pushing this project:

1. **Never commit secrets**
   - Keep `AIPhotobooth/credentials.json` local only
   - Commit `AIPhotobooth/credentials.example.json` instead
   - Ensure `.gitignore` includes `credentials.json`, `.env`, and private keys
2. **Do not commit large binaries**
   - Exclude `models/*.safetensors`, `models/*.bin`, `node_modules/`, `outputs/`, guest `inputs/`
   - Document download links in this README instead
3. **Rotate keys if exposed**
   - If a service-account JSON was ever committed or shared, revoke it in GCP and issue a new key
4. **Public Drive links**
   - Uploads are set to `anyone` with `reader` for kiosk sharing. For private events, change permission logic or use short-lived links
5. **Local-only ports**
   - Services bind to `localhost` by default; do not expose `9998`/`9999` to the public internet without auth

Suggested `.gitignore` entries (already partially present in this repo — verify before push):

```gitignore
# Secrets
**/credentials.json
.env
*.pem

# Runtime / large artifacts
inputs/*
!inputs/.gitkeep
outputs/
AIPhotobooth/outputs/
AIPhotobooth/public/outputs/
models/**/*.safetensors
models/**/*.bin
models/**/*.onnx
node_modules/
AIPhotobooth/node_modules/
```

---

## Credits & citation

### Orion AI Photobooth

Interactive photobooth product and UI for MAHE Dubai / Technovanza events.  
Contact referenced in the app: `orion2024@gmail.com`

### PuLID (research)

```bibtex
@InProceedings{guo2024pulid,
  title={PuLID: Pure and Lightning ID Customization via Contrastive Alignment},
  author={Guo, Zinan and Wu, Yanze and Chen, Zhuowei and Chen, Lang and Zhang, Peng and He, Qian},
  booktitle={Advances in Neural Information Processing Systems},
  year={2024}
}
```

Paper: [arXiv:2404.16022](https://arxiv.org/abs/2404.16022) · Upstream repo: [ToTheBeginning/PuLID](https://github.com/ToTheBeginning/PuLID)

### Frontend stack

React 18, React Router, Framer Motion, Tailwind CSS, Lucide icons, CRACO.

---

## Disclaimer

This project is intended for creative, educational, and event use. Users must comply with local laws and platform policies when generating or sharing images (including likeness rights and copyrighted character styles). The maintainers are not responsible for misuse. Upstream PuLID model licenses and third-party weight terms also apply.
