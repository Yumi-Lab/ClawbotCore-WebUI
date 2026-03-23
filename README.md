# ClawbotCore WebUI

> Ultra-lightweight web dashboard for [ClawbotCore](https://github.com/Yumi-Lab/clawbot-core) AI orchestrator — part of the [ClawbotOS](https://github.com/Yumi-Lab/ClawBot-OS) project by [Yumi Lab](https://yumi-lab.com).

![Version](https://img.shields.io/github/v/release/Yumi-Lab/ClawbotCore-WebUI?label=version&color=00ffe0)
![License](https://img.shields.io/badge/license-BUSL--1.1-orange)
![Size](https://img.shields.io/badge/size-%3C100KB-green)

---

## What is this?

`**ClawbotCore WebUI** is the web interface served by **ClawbotOS** on Yumi Lab Smart Pi One and SmartPad boards. It connects to the ClawbotCore AI orchestrator (port 8090) and provides a full-featured management dashboard — with no Node.js, no React, no build step. Just one `index.html`.

Think of it as **Mainsail for AI** — a clean, fast, browser-based interface to control your AI assistant running on low-resource ARM hardware.

---

## Features

| Panel | Description |
|-------|-------------|
| **Setup** | Step-by-step onboarding wizard — configure Anthropic, OpenAI, DeepSeek or Telegram in one click |
| **Chat** | Streaming chat via SSE — real-time responses from ClawbotCore |
| **Files** | Edit config files directly in the browser (no SSH needed) |
| **Logs** | Live service logs via journalctl |
| **System** | Real-time CPU, RAM, disk, temperature gauges |
| **Services** | Start/stop/restart systemd services |
| **Settings** | LLM provider, model, API key, Telegram bot config |

---

## Supported AI providers

| Provider | Recommended model |
|----------|------------------|
| **Anthropic Claude** ⭐ | `claude-sonnet-4-6` |
| OpenAI | `gpt-4o` |
| DeepSeek | `deepseek-chat` |
| OpenRouter | `anthropic/claude-sonnet-4-6` |
| Ollama | `llama3`, `mistral`, `phi3`… |
| Custom OpenAI-compatible | any |

---

## How it works

```
Browser → nginx (port 80) → /              → index.html  (this repo)
                          → /api/core/     → ClawbotCore :8090
                          → /api/system/   → clawbot-status-api :8089
```

The dashboard is a single HTML file served as a static asset by nginx. All API calls are proxied through nginx — the browser never connects directly to the AI agent ports.

---

## OTA Updates

The dashboard can be updated **without reflashing the OS**:

1. Open `http://clawbot.local` → Setup panel → "Dashboard Update"
2. Click **"Check"** — compares local version with latest GitHub release
3. Click **"Update now"** — downloads and reloads automatically

Or via SSH:
```bash
sudo clawbot-update-dashboard
```

---

## Installation

This interface is pre-installed on **ClawbotOS** images. Flash an image and open `http://clawbot.local` in your browser.

To manually install on any Armbian/Debian device running ClawbotCore + nginx:

```bash
# Download latest dashboard
curl -fsSL https://github.com/Yumi-Lab/ClawbotCore-WebUI/releases/latest/download/index.html \
  -o /home/pi/clawbot-dashboard/index.html

# Configure nginx to serve it (see ClawbotOS for nginx config)
```

---

## Development

The entire interface is a single `index.html` file — edit it directly, no build required.

```bash
git clone https://github.com/Yumi-Lab/ClawbotCore-WebUI.git
cd ClawbotCore-WebUI

# Edit index.html
# Bump VERSION
# Push to main → GitHub Actions creates a release automatically
```

### Release process

Pushing to `main` triggers `.github/workflows/release.yml` which:
1. Reads `VERSION`
2. Injects the version into `index.html`
3. Creates a GitHub Release with `index.html` and `VERSION` as assets

Devices running ClawbotOS can then pick up the update via the dashboard UI or `clawbot-update-dashboard`.

---

## Hardware

Designed for Yumi Lab boards:

| Board | RAM | Display |
|-------|-----|---------|
| **Smart Pi One** | 1GB | Headless |
| **SmartPad** | 1GB | Touchscreen |

Works on any Armbian/Debian device running nginx + ClawbotCore.

---

## Related repositories

| Repo | Description |
|------|-------------|
| [Yumi-Lab/ClawBot-OS](https://github.com/Yumi-Lab/ClawBot-OS) | ClawbotOS — the full OS build (CustomPiOS) |
| [Yumi-Lab/clawbot-core](https://github.com/Yumi-Lab/clawbot-core) | ClawbotCore — AI orchestrator & module registry |

---

## License

BUSL-1.1 — Non-commercial use free. Commercial use requires a license from Yumi Lab. See [LICENSE](LICENSE)

© Yumi Lab
