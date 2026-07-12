---
name: infrastructure
description: VPS provisioning (Debian/Ubuntu), Node.js/Python/Docker/Nginx setup, pm2/systemd/screen/tmux process management, SSL certbot, firewall (ufw), backup strategy, and production deployment sequences.
license: MIT
metadata:
  source: superagent-m2
---

## Bootstrap (Ubuntu 22.04/24.04)
```
apt update && apt upgrade -y
apt install -y curl wget git unzip nano htop ufw fail2ban build-essential
ufw default deny incoming && ufw default allow outgoing
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp
ufw --force enable
timedatectl set-timezone Asia/Jakarta
```

## Runtime Provisioning
- Node.js v20 LTS: `curl -fsSL https://deb.nodesource.com/setup_20.x | bash -`
- Python 3.11: `add-apt-repository -y ppa:deadsnakes/ppa`
- Docker: `curl -fsSL https://get.docker.com | bash`
- Nginx + Certbot: `apt install -y nginx certbot python3-certbot-nginx`

## Process Managers
- **pm2**: simplest, `pm2 start app.js --name "myapp" && pm2 save`
- **systemd**: most durable, service file template available
- **screen**: `screen -S myapp`, detach Ctrl-A D, reattach `screen -r myapp`
- **tmux**: `tmux new -s myapp`, detach Ctrl-B D, `tmux attach -t myapp`

## Deployment Sequences
1. `cd /opt && git clone <repo> myapp && cd myapp`
2. `cp .env.example .env && nano .env`
3. `npm ci --production` or `python3 -m venv venv && pip install -r requirements.txt`
4. `pm2 start ... && pm2 save`

## Security Checklist
- SSH: disable password auth, key-only
- ufw: deny-all default
- fail2ban: enabled with SSH jail
- unattended-upgrades for security patches
- Secrets: .env mode 600
- Database: bind to localhost only
