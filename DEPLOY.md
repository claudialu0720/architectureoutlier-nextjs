# Deploy Guide

End-to-end deploy instructions for the Architect Career Test on an AWS Ubuntu/Debian instance, served from `https://abc.com/test` behind the same Nginx that already serves your existing Next.js app.

This guide assumes:
- You already have an AWS instance with Nginx + an existing Next.js app on PM2
- The instance has Node ≥ 20 (required by Next 15)
- HTTPS is already terminated for `abc.com`
- You can `ssh` into the box

Throughout, replace these placeholders with your real values:

| Placeholder       | Example                              |
|-------------------|--------------------------------------|
| `<USER>`          | `ubuntu`                             |
| `<APP_DIR>`       | `/home/ubuntu/careertest`            |
| `<DB_DIR>`        | `/var/lib/careertest`                |
| `<DOMAIN>`        | `abc.com`                            |
| `<GIT_REMOTE>`    | `git@github.com:you/careertest.git`  |

---

## 1. Local: prepare credentials

Run these on your **Mac**, in the project root.

### 1a. Generate the admin password hash

Pick a strong admin password and hash it:

```bash
npm run hash-password
# (it'll prompt) — paste the password
# OR pass it as an arg:
npm run hash-password 'YourStrongPasswordHere'
```

It prints something like:
```
ADMIN_PASSWORD_HASH=\$argon2id\$v=19\$m=65536,t=2,p=1\$...\$...
```

Copy the whole line **including every backslash**. The hash itself is safe to share / store — it's a one-way hash.

> **Why every `$` is backslash-escaped:** argon2 hashes use `$` as a field separator. Next.js's `.env` loader (`@next/env` → `dotenv-expand`) treats `$NAME` as a variable reference and expands it — even inside single or double quotes. An unescaped hash gets silently mangled at runtime and login fails with `invalid_credentials`. Backslash escapes (`\$`) are the only form that survives `@next/env`. The `hash-password` script already prints the value pre-escaped — paste it verbatim, no extra quoting needed.

### 1b. Generate the session secret (Optional, already filled in .env.example)

```bash
openssl rand -base64 32
```

Copy the output — this is your `SESSION_SECRET`.

### 1c. Sanity-check locally

Edit `.env.local` with the hash + secret, then:

```bash
npm run db:migrate     # creates ./data/data.db
npm run dev            # http://localhost:3000/test
```

Visit `http://localhost:3000/test/admin/login`, sign in with `admin` + your password, generate a token, open the resulting URL, run through the quiz. If everything works, proceed.

---

## 2. Server: one-time system setup

SSH in and prepare the box. Run **once per server**.

```bash
ssh <USER>@<DOMAIN>
```

### 2a. Install Node 20 (if not present)

If your existing Next app already runs on Node ≥ 20, skip this.

```bash
# NodeSource Node 20 (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
node -v   # should be v20.x or higher
```

`build-essential` is needed because `better-sqlite3` may compile a native binding if no prebuilt binary matches.

### 2b. Install PM2 globally (if not present)

```bash
sudo npm install -g pm2
pm2 --version
```

### 2c. Create the database directory

The SQLite file lives **outside** the deploy directory so deploys can't clobber it.

```bash
sudo mkdir -p /var/lib/careertest
sudo chown $USER:$USER /var/lib/careertest
sudo chmod 750 /var/lib/careertest
```

---

## 3. Server: deploy the code

### Option A — git clone (recommended)

If you've pushed the project to a private repo:

```bash
cd $(dirname <APP_DIR>)
git clone <GIT_REMOTE> $(basename <APP_DIR>)
cd <APP_DIR>
```

### Option B — rsync from your Mac

If you don't want to set up a remote yet, from your **Mac**:

```bash
# from the project root
rsync -av --delete \
  --exclude node_modules --exclude .next \
  --exclude data --exclude .env.local \
  --exclude architect-career-test.html --exclude imgstore \
  ./ <USER>@<DOMAIN>:<APP_DIR>/
```

Then back on the server:

```bash
cd <APP_DIR>
```

### 3a. Install dependencies and build

```bash
#AWS
npm ci (OR npm install if no package-lock.json exists, risk of version drift)
npm run build

(Remove node 20 interpreter line from ecosystem.config.cjs if using latest node i.e. 24)

---

#Aliyun
# Install Node 20 alongside Node 24
nvm install 20

# Pin this project to Node 20
cd ~/careertest-nextjs-main
echo "20" > .nvmrc       # reads .nvmrc, switches to 20

# Pin the OTHER project to Node 24 so future you doesn't get confused
cd /path/to/other-nextjs-app
echo "24" > .nvmrc

# Now back to this project and install
cd ~/careertest-nextjs-main
nvm use
rm -rf node_modules package-lock.json
npm install
npm install -g pm2
npm run build
```

`npm ci` installs from `package-lock.json` for reproducible installs. The build produces `.next/`.

---

## 4. Server: configure environment

Create the production env file. **Do not commit it.**

```bash
cd <APP_DIR>
cp env.example env.local
nano .env.local
```
Add ADMIN_PASSWORD_HASH value in .env.local, if not present.

Lock it down:

```bash
chmod 600 .env.local
```

> Leave `RESEND_API_KEY` blank for now. The app will log emails to PM2 logs instead of sending. See [§ 10](#10-email-resend-setup-when-ready) when you're ready.

---

## 5. Server: initialize the database

```bash
cd <APP_DIR>
npm run db:migrate
```

You should see:
```
Migrations applied to /var/lib/careertest/data.db
```

If you re-run this later it's a no-op for already-applied migrations.

Verify perms:
```bash
ls -l /var/lib/careertest
# data.db should be owned by <USER>
```

---

## 6. Server: start under PM2

The repo includes [ecosystem.config.cjs](ecosystem.config.cjs). It pins:
- name: `careertest`
- port: `3000`
- DB path: `<DB_DIR>/data.db`

If your `<DB_DIR>` differs from `/var/lib/careertest`, edit the file before starting.

> **Important**: PM2 reads env from the ecosystem file, not from `.env.local` — Next.js itself reads `.env.local` at runtime, so the rest of the env vars (admin hash, session secret, etc.) are picked up automatically. The ecosystem file only needs to set `NODE_ENV`, `PORT`, and `DATABASE_PATH`.

Start it:

```bash
cd <APP_DIR>
pm2 start ecosystem.config.cjs
pm2 save                          # persist current process list
pm2 startup                       # outputs a sudo command — run it once
# (run the sudo command pm2 printed)
pm2 save
```

Check it's running:

```bash
pm2 status
pm2 logs careertest --lines 50
curl -I http://127.0.0.1:3000/test
# expect: 200 OK
```

---

## 7. Server: configure Nginx

You're adding a `location ~ ^/test(/|$)` block to the existing server block for `<DOMAIN>`. Find the file:

```bash
ls /etc/nginx/sites-enabled/
# or
ls /etc/nginx/conf.d/
# or
sudo nginx -T | grep -E 'server_name|location' | less
```

Open the relevant config (typically `/etc/nginx/sites-available/<DOMAIN>` or similar):

```bash
sudo nano /etc/nginx/sites-available/<DOMAIN>
```

If you just use `location /test/` then you will have a redirect loop:

- Browser hits /test/ -> Nginx routes to port 3000 -> Next.js says "I prefer no trailing slash" -> 308 to /test
- Browser follows to /test → Nginx's location /test/ block doesn't match (no trailing slash) → falls through, and Nginx itself returns 301 back to /test/
- Goto step 1.

Inside the existing `server { ... }` block for HTTPS (port 443), add this **before** any catch-all `location /` for the existing app:

```nginx
    location ~ ^/test(/|$) {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_buffering off;
    }
```

Critical detail: **do not strip the path** from the proxied request. The same app now serves `/`, `/about`, `/test`, and `/test/admin`.

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. Verify the deploy

From your **Mac**:

```bash
# landing (no token) — should show invitation-only page
curl -I https://<DOMAIN>/test/

# admin login page — should be 200
curl -I https://<DOMAIN>/test/admin/login

# /admin without cookie — should redirect to /admin/login
curl -I https://<DOMAIN>/test/admin
```

In a browser:

1. Go to `https://<DOMAIN>/test/admin/login`
2. Sign in (`admin` + your password)
3. Generate a single token
4. Copy the URL, open it in incognito, run through the quiz
5. Submit — you should see the result with the radar chart and image
6. Reload the same URL — it should show the stored result (one-shot enforced)
7. Back in admin, the token should now show state `completed` with the archetype

If any step fails, see [§ 12 Troubleshooting](#12-troubleshooting).

---

## 9. Updating (subsequent deploys)

For a code change:

```bash
ssh <USER>@<DOMAIN>
cd <APP_DIR>
git pull                          # or rsync from Mac
nvm use 20
npm ci                            # if dependencies changed
npm run build
npm run db:migrate                # if you added a migration
pm2 reload careertest             # zero-downtime reload
pm2 logs careertest --lines 100   # sanity check
```

`pm2 reload` (vs `restart`) keeps the process up while spawning the new one — no dropped requests.

---

## 10. Email (Resend) setup when ready

The code is already wired. To turn on real email delivery:

### 10a. Create a Resend account

1. Sign up at https://resend.com
2. Add `<DOMAIN>` as a sending domain
3. Resend will give you DNS records (SPF, DKIM) — add them to your DNS provider
4. Wait for verification (minutes to a few hours)
5. Generate an API key (starts with `re_...`)

### 10b. Update env on the server

```bash
ssh <USER>@<DOMAIN>
cd <APP_DIR>
nano .env.local
# set: RESEND_API_KEY=re_xxxxxxxxxxxx
pm2 reload careertest
```

### 10c. Turn the toggle on

In the admin dashboard, flip "Email results to users" to ON. The email field will start appearing on result pages, and submissions will trigger real sends.

You can verify a test send by completing a token quiz with your own email. Check `pm2 logs careertest` for any send failures.

---

## 11. Backups

The SQLite file at `<DB_DIR>/data.db` is your only state. Set up a daily backup.

### 11a. Local rotating backups (minimum)

Create `/usr/local/bin/careertest-backup.sh`:

```bash
sudo nano /usr/local/bin/careertest-backup.sh
```

```bash
#!/bin/bash
set -euo pipefail
DB=<DB_DIR>/data.db
DEST=<DB_DIR>/backups
mkdir -p "$DEST"
TS=$(date +%Y%m%d-%H%M%S)
sqlite3 "$DB" ".backup '$DEST/data-$TS.db'"
# keep last 14 days
find "$DEST" -name 'data-*.db' -mtime +14 -delete
```

```bash
sudo chmod +x /usr/local/bin/careertest-backup.sh
sudo chown <USER>:<USER> /usr/local/bin/careertest-backup.sh
```

Add to user crontab (`crontab -e`):

```
0 3 * * * /usr/local/bin/careertest-backup.sh >> /tmp/careertest-backup.log 2>&1
```

### 11b. Off-box backup (recommended)

Pipe backups to S3:

```bash
# in the script, after the .backup line:
aws s3 cp "$DEST/data-$TS.db" s3://<your-bucket>/careertest/
```

Requires `aws-cli` and an IAM role / credentials with write access to the bucket.

---

## 12. Troubleshooting

### `502 Bad Gateway` from `/test/...`

PM2 process isn't running or isn't on port 3000.
```bash
pm2 status
pm2 logs careertest --lines 100
ss -tlnp | grep 3000
```

### `404` on `/test/_next/static/...` (broken styles)

You stripped the path in Nginx. Make sure `proxy_pass http://127.0.0.1:3000;` has **no trailing slash**.

### Login fails with `admin_not_configured`

`ADMIN_USERNAME` or `ADMIN_PASSWORD_HASH` isn't being read. Confirm `.env.local` is in `<APP_DIR>` and `pm2 reload careertest` was run after editing.

### `better-sqlite3` install failed with native build error

```bash
sudo apt-get install -y build-essential python3
cd <APP_DIR>
rm -rf node_modules
npm ci
```

### Quiz submit returns `404` for `not_found`

Token doesn't exist (DB path mismatch). Check the PM2 process actually points at `<DB_DIR>/data.db`:
```bash
pm2 env careertest | grep DATABASE_PATH
```

### Cookie not setting / admin loops back to login

`SESSION_SECRET` is missing or you're not on HTTPS. Cookies are `Secure` in production, so plain HTTP won't work — confirm `https://` is used and Nginx forwards `X-Forwarded-Proto`.

### Need to change the admin password

```bash
# on Mac
npm run hash-password 'NewPasswordHere'
# copy the hash
ssh <USER>@<DOMAIN>
cd <APP_DIR>
nano .env.local                   # replace ADMIN_PASSWORD_HASH=
pm2 reload careertest
```

### Need to change the session secret (logs all admins out)

Same as password — replace `SESSION_SECRET` in `.env.local` and `pm2 reload careertest`.

---

## 13. Quick reference

```bash
# logs
pm2 logs careertest

# restart
pm2 reload careertest

# stop / start
pm2 stop careertest
pm2 start careertest

# manual backup (immediate)
sqlite3 <DB_DIR>/data.db ".backup '<DB_DIR>/backups/manual-$(date +%s).db'"

# inspect DB
sqlite3 <DB_DIR>/data.db
sqlite> .tables
sqlite> SELECT id, state, archetype, completed_at FROM tokens ORDER BY created_at DESC LIMIT 20;
sqlite> .exit

# tail nginx access log for /test
sudo tail -f /var/log/nginx/access.log | grep ' /test'
```
