# ClawbotCore WebUI

> Ultra-lightweight web dashboard for [ClawbotCore](https://github.com/Yumi-Lab/clawbot-core) AI orchestrator — part of the [ClawbotOS](https://github.com/Yumi-Lab/ClawBot-OS) project by [Yumi Lab](https://yumi-lab.com).

![Version](https://img.shields.io/github/v/release/Yumi-Lab/ClawbotCore-WebUI?label=version&color=00ffe0)
![License](https://img.shields.io/badge/license-BUSL--1.1-orange)
![Size](https://img.shields.io/badge/size-%3C350KB-green)

---

## What is this?

**ClawbotCore WebUI** is the web interface served by **ClawbotOS** on Yumi Lab Smart Pi One and SmartPad boards. It connects to the ClawbotCore AI orchestrator (port 8090) and provides a full-featured management dashboard — with no Node.js, no React, no build step. Just one `index.html`.

Think of it as **Mainsail for AI** — a clean, fast, browser-based interface to control your AI assistant running on low-resource ARM hardware.

---

## Features

| Panel | Description |
|-------|-------------|
| **Setup** | Onboarding wizard — configure Kimi, Anthropic, Qwen, DeepSeek, OpenAI, Ollama in one click |
| **Chat** | Streaming chat via SSE — 3 modes (Core, Agent, Core-Agent) with tool traces |
| **Files** | Edit config files directly in the browser (no SSH needed) |
| **Workspace** | File manager for the AI workspace |
| **Agents** | Agent mode with extended tool access and autonomous operation |
| **Skills** | Manage AI skills and capabilities |
| **Tasks** | Scheduled tasks (cron-like) — once, daily, weekly, hourly |
| **Logs** | Live service logs via journalctl |
| **Monitor** | Real-time CPU, RAM, disk, temperature gauges |
| **Services** | Start/stop/restart systemd services |
| **WhatsApp** | WhatsApp inbox — conversation list, thread view, send messages |
| **Settings** | LLM config, search engine, Telegram, vault, WhatsApp channel config |

---

## Supported AI Providers

| Provider | Default Model | Badge |
|----------|--------------|-------|
| **Moonshot (Kimi)** | `kimi-for-coding` | Default |
| **Alibaba (Qwen)** | `qwen3.5-flash` | Budget |
| **Anthropic (Claude)** | `claude-sonnet-4-6` | Premium |
| **DeepSeek** | `deepseek-chat` | Budget |
| **OpenAI** | `gpt-4o` | Optional |
| **OpenRouter** | any | Optional |
| **Ollama** | `llama3`, `mistral`... | Optional |
| **Custom** | any OpenAI-compatible | Advanced |

---

## Design

- Dark theme with cyan accent (`#00ffe0`)
- Fonts: Outfit (UI) + JetBrains Mono (code)
- Responsive layout (breakpoint 768px)
- Collapsible sidebar with icon-only mode
- Tool execution traces: dots (call/ok/err) + expandable args/results
- Thinking animation: star + 8 rotating status texts
- Prompt history: ArrowUp/Down navigation with draft save

---

## How it works

```
Browser → nginx (port 80) → /              → index.html  (this repo)
                          → /api/core/     → ClawbotCore :8090
                          → /api/system/   → clawbot-status-api :8089
```

The dashboard is a single HTML file served as a static asset by nginx. All API calls are proxied through nginx — the browser never connects directly to backend ports.

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
curl -fsSL https://github.com/Yumi-Lab/ClawbotCore-WebUI/releases/latest/download/index.html \
  -o /home/pi/clawbot-dashboard/index.html
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

## Related Repositories

| Repo | Description |
|------|-------------|
| [Yumi-Lab/ClawBot-OS](https://github.com/Yumi-Lab/ClawBot-OS) | ClawbotOS — full OS image build |
| [Yumi-Lab/clawbot-core](https://github.com/Yumi-Lab/clawbot-core) | ClawbotCore — AI orchestrator |
| [Yumi-Lab/clawbot-cloud](https://github.com/Yumi-Lab/clawbot-cloud) | Cloud API — LLM proxy, device management |

---

## License

BUSL-1.1 — See [LICENSE](LICENSE)
Change date 2036-03-02 → Apache 2.0
