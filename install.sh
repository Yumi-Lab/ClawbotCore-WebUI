#!/usr/bin/env bash
#### ClawbotCore WebUI — Install script for Debian/Armbian
#### Installs the dashboard + nginx config.
#### Run as root:
####   curl -fsSL https://raw.githubusercontent.com/Yumi-Lab/ClawbotCore-WebUI/main/install.sh | bash
#### Or: bash install.sh after git clone

set -euo pipefail

REPO="https://github.com/Yumi-Lab/ClawbotCore-WebUI.git"
INSTALL_DIR="/home/pi/clawbot-dashboard"
SERVICE_USER="pi"

echo "==> Installing ClawbotCore WebUI..."

# ── 1. System packages ──────────────────────────────────────────────────────
apt-get update -q
apt-get install -y --no-install-recommends \
    nginx curl git

# ── 2. Clone / update repo ──────────────────────────────────────────────────
if [[ -d "${INSTALL_DIR}/.git" ]]; then
    echo "==> Updating existing install..."
    git -C "${INSTALL_DIR}" pull --ff-only
else
    git clone --depth=1 "${REPO}" "${INSTALL_DIR}"
fi

chown -R "${SERVICE_USER}:${SERVICE_USER}" "${INSTALL_DIR}"

# ── 3. nginx configuration ──────────────────────────────────────────────────
cat > /etc/nginx/sites-available/clawbot << 'EOF'
server {
    listen 80 default_server;
    server_name _;

    # Dashboard (static)
    root /home/pi/clawbot-dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # ClawbotCore API proxy
    location /api/core/ {
        proxy_pass         http://127.0.0.1:8090/;
        proxy_http_version 1.1;
        proxy_set_header   Host            $host;
        proxy_set_header   X-Real-IP       $remote_addr;
        proxy_set_header   Connection      '';
        proxy_read_timeout 300s;
        proxy_buffering    off;
        chunked_transfer_encoding on;
    }

    # System Status API proxy
    location /api/system/ {
        proxy_pass         http://127.0.0.1:8089/;
        proxy_http_version 1.1;
        proxy_set_header   Host            $host;
        proxy_set_header   X-Real-IP       $remote_addr;
        proxy_read_timeout 30s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/clawbot /etc/nginx/sites-enabled/clawbot
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "==> ClawbotCore WebUI installed!"
echo ""
echo "  Dashboard:  http://$(hostname -I | awk '{print $1}')"
echo "  Files:      ${INSTALL_DIR}/"
echo ""
echo "  No build step needed — the dashboard is a single index.html file."
